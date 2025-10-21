// DOM references
const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const datasetSelect = document.getElementById('dataset-select');
const startCitySelect = document.getElementById('start-city');
const shuffleButton = document.getElementById('shuffle-layout');
const algorithmButtons = document.querySelectorAll('.primary-button[data-action]');
const compareButton = document.getElementById('compare-all');

const activeAlgorithmEl = document.getElementById('active-algorithm');
const tourLengthEl = document.getElementById('tour-length');
const runtimeEl = document.getElementById('runtime');
const tourDescriptionEl = document.getElementById('tour-description');
const routeOrderEl = document.getElementById('route-order');
const comparisonBodyEl = document.getElementById('comparison-body');

// Utility for timestamps
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

// Dataset definitions -------------------------------------------------------
const EUROPEAN_CITIES = [
    { name: 'London', x: 18, y: 32 },
    { name: 'Paris', x: 28, y: 40 },
    { name: 'Brussels', x: 32, y: 38 },
    { name: 'Amsterdam', x: 36, y: 33 },
    { name: 'Berlin', x: 50, y: 30 },
    { name: 'Prague', x: 60, y: 38 },
    { name: 'Vienna', x: 66, y: 45 },
    { name: 'Rome', x: 58, y: 70 },
    { name: 'Madrid', x: 20, y: 68 },
    { name: 'Lisbon', x: 10, y: 72 },
    { name: 'Zurich', x: 48, y: 54 }
];

const US_CITIES = [
    { name: 'San Francisco', x: 12, y: 44 },
    { name: 'Los Angeles', x: 18, y: 60 },
    { name: 'San Diego', x: 20, y: 70 },
    { name: 'Las Vegas', x: 30, y: 55 },
    { name: 'Phoenix', x: 36, y: 66 },
    { name: 'Denver', x: 48, y: 50 },
    { name: 'Dallas', x: 64, y: 66 },
    { name: 'Austin', x: 66, y: 70 },
    { name: 'Chicago', x: 74, y: 36 },
    { name: 'New York', x: 90, y: 34 },
    { name: 'Boston', x: 92, y: 28 },
    { name: 'Atlanta', x: 76, y: 58 }
];

const DATASETS = {
    european: {
        label: 'European Capitals (11)',
        description: 'Normalized coordinates of major European capitals. Great for comparing heuristics on a compact tour.',
        size: EUROPEAN_CITIES.length,
        generator: () => duplicateCities(EUROPEAN_CITIES),
        shuffleable: false
    },
    usCoast: {
        label: 'US Tech Corridor (12)',
        description: 'Handpicked US cities spanning both coasts. Expect longer optimal routes and higher variance.',
        size: US_CITIES.length,
        generator: () => duplicateCities(US_CITIES),
        shuffleable: false
    },
    clusters: {
        label: 'Clustered Random (11)',
        description: 'Synthetic data with three clusters and slight noise. Each shuffle regenerates a new seeded layout.',
        size: 11,
        generator: seed => generateClusteredCities(11, seed),
        shuffleable: true
    }
};

// Global state --------------------------------------------------------------
let currentDatasetKey = 'european';
let currentCities = [];
let distanceMatrix = [];
let shuffleSeed = 42;

const algorithmLabels = {
    nearest: 'Nearest Neighbor',
    genetic: 'Genetic Algorithm',
    simulated: 'Simulated Annealing',
    concorde: 'Concorde (Branch & Bound)'
};

// Initialization ------------------------------------------------------------
function init() {
    populateDatasetOptions();
    datasetSelect.addEventListener('change', handleDatasetChange);
    startCitySelect.addEventListener('change', handleStartCityChange);
    shuffleButton.addEventListener('click', handleShuffle);

    algorithmButtons.forEach(button => {
        button.addEventListener('click', () => runAlgorithm(button.dataset.action));
    });

    compareButton.addEventListener('click', compareAllMethods);

    loadDataset(currentDatasetKey);
}

function populateDatasetOptions() {
    const options = Object.entries(DATASETS).map(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.label;
        return option;
    });

    options.forEach(option => datasetSelect.appendChild(option));
    datasetSelect.value = currentDatasetKey;
}

function handleDatasetChange() {
    const selectedKey = datasetSelect.value;
    currentDatasetKey = selectedKey;
    loadDataset(selectedKey);
}

function handleStartCityChange() {
    renderTour(null);
    resetMetricsForStartCity();
}

function handleShuffle() {
    shuffleSeed += 37;
    loadDataset(currentDatasetKey, true);
}

function loadDataset(datasetKey, forceShuffle = false) {
    const config = DATASETS[datasetKey];
    const seed = shuffleSeed;

    if (config.shuffleable || forceShuffle) {
        currentCities = config.generator(seed);
    } else {
        currentCities = config.generator();
    }

    distanceMatrix = computeDistanceMatrix(currentCities);
    populateStartCityOptions();
    renderTour(null);
    resetMetrics(datasetKey);
    resetComparisonTable();

    shuffleButton.disabled = !config.shuffleable;
    shuffleButton.classList.toggle('disabled', shuffleButton.disabled);
    shuffleButton.textContent = config.shuffleable ? 'Shuffle Layout' : 'Shuffle Locked';
}

function populateStartCityOptions() {
    startCitySelect.innerHTML = '';
    currentCities.forEach((city, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = city.name;
        startCitySelect.appendChild(option);
    });
    startCitySelect.value = '0';
}

function resetMetrics(datasetKey) {
    const { description } = DATASETS[datasetKey];
    activeAlgorithmEl.textContent = '—';
    tourLengthEl.textContent = '—';
    runtimeEl.textContent = '—';
    tourDescriptionEl.textContent = description;
    routeOrderEl.innerHTML = '';
}

function resetMetricsForStartCity() {
    activeAlgorithmEl.textContent = '—';
    tourLengthEl.textContent = '—';
    runtimeEl.textContent = '—';
    tourDescriptionEl.textContent = 'Start city changed. Run an algorithm to recalculate the tour.';
    routeOrderEl.innerHTML = '';
    resetComparisonTable();
}

// Rendering ----------------------------------------------------------------
function renderTour(path) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentCities.length) {
        return;
    }

    const bounds = computeBounds(currentCities);
    const padding = 40;
    const scaleX = (canvas.width - padding * 2) / Math.max(bounds.maxX - bounds.minX, 1);
    const scaleY = (canvas.height - padding * 2) / Math.max(bounds.maxY - bounds.minY, 1);
    const points = currentCities.map(city => ({
        x: padding + (city.x - bounds.minX) * scaleX,
        y: canvas.height - (padding + (city.y - bounds.minY) * scaleY)
    }));

    if (Array.isArray(path) && path.length > 1) {
        ctx.strokeStyle = '#4b6edc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const [first, ...rest] = path;
        ctx.moveTo(points[first].x, points[first].y);
        rest.forEach(idx => {
            ctx.lineTo(points[idx].x, points[idx].y);
        });
        ctx.stroke();

        // Draw direction arrows
        ctx.strokeStyle = 'rgba(255, 112, 102, 0.65)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < path.length - 1; i += 1) {
            const current = points[path[i]];
            const next = points[path[i + 1]];
            drawArrow(current, next);
        }
    }

    // Draw cities on top
    points.forEach((point, index) => {
        const isStart = Number(startCitySelect.value) === index;
        ctx.fillStyle = isStart ? '#ff705f' : '#ffffff';
        ctx.strokeStyle = isStart ? '#ff705f' : '#4b6edc';
        ctx.lineWidth = isStart ? 3 : 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, isStart ? 10 : 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1f2f4f';
        ctx.font = isStart ? 'bold 13px Arial' : '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentCities[index].name, point.x, point.y - (isStart ? 16 : 14));
    });

    if (Array.isArray(path) && path.length > 1) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        for (let i = 0; i < path.length - 1; i += 1) {
            const idx = path[i];
            const point = points[idx];
            ctx.fillText(i + 1, point.x, point.y + 22);
        }
        const endPoint = points[path[path.length - 1]];
        ctx.fillText('return', endPoint.x, endPoint.y + 22);
    }
}

function drawArrow(startPoint, endPoint) {
    const headLength = 10;
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx);
    const mx = endPoint.x - Math.cos(angle) * 12;
    const my = endPoint.y - Math.sin(angle) * 12;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(mx, my);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx - headLength * Math.cos(angle - Math.PI / 6), my - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(mx - headLength * Math.cos(angle + Math.PI / 6), my - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 112, 102, 0.65)';
    ctx.fill();
}

function computeBounds(cities) {
    return cities.reduce(
        (acc, city) => ({
            minX: Math.min(acc.minX, city.x),
            maxX: Math.max(acc.maxX, city.x),
            minY: Math.min(acc.minY, city.y),
            maxY: Math.max(acc.maxY, city.y)
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
}

// Algorithm orchestration ---------------------------------------------------
function runAlgorithm(key) {
    const startIndex = Number(startCitySelect.value);
    const label = algorithmLabels[key];

    if (!currentCities.length) {
        return;
    }

    const handlers = {
        nearest: runNearestNeighbor,
        genetic: runGeneticAlgorithm,
        simulated: runSimulatedAnnealing,
        concorde: runConcordeSolver
    };

    const handler = handlers[key];
    if (!handler) {
        console.warn(`No handler registered for ${key}`);
        return;
    }

    const startTime = now();
    const result = handler(distanceMatrix, startIndex);
    const elapsed = (result.runtime ?? (now() - startTime));

    if (!result || !Array.isArray(result.path)) {
        tourDescriptionEl.textContent = `${label} did not return a valid tour.`;
        return;
    }

    renderTour(result.path);

    activeAlgorithmEl.textContent = label;
    tourLengthEl.textContent = formatDistance(result.distance);
    runtimeEl.textContent = formatRuntime(elapsed);
    tourDescriptionEl.textContent = result.description ?? defaultDescription(label);

    populateRouteList(result.path);
}

function compareAllMethods() {
    const algorithms = ['nearest', 'genetic', 'simulated', 'concorde'];
    const results = [];

    algorithms.forEach(key => {
        const startTime = now();
        const result = runAlgorithmInternal(key);
        const elapsed = result ? (result.runtime ?? (now() - startTime)) : null;
        if (result) {
            results.push({
                method: algorithmLabels[key],
                distance: result.distance,
                runtime: elapsed,
                path: result.path,
                description: result.description
            });
        }
    });

    if (!results.length) {
        comparisonBodyEl.innerHTML = `<tr><td colspan="3">Unable to compute tours for the current setup.</td></tr>`;
        return;
    }

    results.sort((a, b) => a.distance - b.distance);
    const best = results[0];
    renderTour(best.path);

    activeAlgorithmEl.textContent = best.method + ' (best of comparison)';
    tourLengthEl.textContent = formatDistance(best.distance);
    runtimeEl.textContent = formatRuntime(best.runtime);
    tourDescriptionEl.textContent = best.description ?? defaultDescription(best.method);
    populateRouteList(best.path);

    comparisonBodyEl.innerHTML = results
        .map(
            (item, index) => `
            <tr class="${index === 0 ? 'best-row' : ''}">
                <td>${item.method}</td>
                <td>${formatDistance(item.distance)}</td>
                <td>${formatRuntime(item.runtime)}</td>
            </tr>`
        )
        .join('');
}

function runAlgorithmInternal(key) {
    const startIndex = Number(startCitySelect.value);
    const handlers = {
        nearest: runNearestNeighbor,
        genetic: runGeneticAlgorithm,
        simulated: runSimulatedAnnealing,
        concorde: runConcordeSolver
    };
    const handler = handlers[key];
    if (!handler) {
        return null;
    }
    return handler(distanceMatrix, startIndex);
}

function populateRouteList(path) {
    routeOrderEl.innerHTML = '';
    if (!Array.isArray(path)) {
        return;
    }
    path.forEach((index, order) => {
        const li = document.createElement('li');
        const cityName = currentCities[index].name;
        li.textContent = order === path.length - 1 ? `${cityName} (return)` : cityName;
        routeOrderEl.appendChild(li);
    });
}

function resetComparisonTable() {
    comparisonBodyEl.innerHTML = `<tr><td colspan="3">Click “Compare All Methods” to populate.</td></tr>`;
}

// Algorithms ---------------------------------------------------------------
function runNearestNeighbor(matrix, startIndex) {
    const n = matrix.length;
    const unvisited = new Set(Array.from({ length: n }, (_, idx) => idx));
    const path = [startIndex];
    let current = startIndex;
    unvisited.delete(startIndex);
    let totalDistance = 0;

    while (unvisited.size) {
        let bestCity = null;
        let bestDistance = Infinity;
        unvisited.forEach(city => {
            const distance = matrix[current][city];
            if (distance < bestDistance) {
                bestDistance = distance;
                bestCity = city;
            }
        });
        if (bestCity === null) {
            break;
        }
        path.push(bestCity);
        unvisited.delete(bestCity);
        totalDistance += bestDistance;
        current = bestCity;
    }

    totalDistance += matrix[current][startIndex];
    path.push(startIndex);

    return {
        path,
        distance: totalDistance,
        description: 'Greedy tour built by always visiting the nearest unvisited neighbor. Simple, fast, and a great baseline.'
    };
}

function runGeneticAlgorithm(matrix, startIndex) {
    const populationSize = clampNumber(Number(document.getElementById('population-size').value), 10, 500);
    const generations = clampNumber(Number(document.getElementById('generations').value), 20, 2000);
    const mutationRate = clampNumber(Number(document.getElementById('mutation-rate').value) / 100, 0.01, 0.6);

    const n = matrix.length;
    const nodes = [];
    for (let i = 0; i < n; i += 1) {
        if (i !== startIndex) {
            nodes.push(i);
        }
    }

    if (nodes.length < 2) {
        return null;
    }

    let population = Array.from({ length: populationSize }, () => shuffleArray([...nodes]));
    let bestIndividual = null;
    let bestDistance = Infinity;
    const history = [];

    for (let generation = 0; generation < generations; generation += 1) {
        population.sort((a, b) => routeDistance(a, startIndex, matrix) - routeDistance(b, startIndex, matrix));

        const currentBest = population[0];
        const currentDistance = routeDistance(currentBest, startIndex, matrix);
        if (currentDistance < bestDistance) {
            bestDistance = currentDistance;
            bestIndividual = [...currentBest];
        }
        history.push(currentDistance);

        const elites = Math.max(1, Math.floor(populationSize * 0.1));
        const nextGeneration = population.slice(0, elites);

        while (nextGeneration.length < populationSize) {
            const parentA = tournamentSelection(population, matrix, startIndex);
            const parentB = tournamentSelection(population, matrix, startIndex);
            let child = orderCrossover(parentA, parentB);
            if (Math.random() < mutationRate) {
                child = mutateSwap(child);
            }
            nextGeneration.push(child);
        }
        population = nextGeneration;
    }

    const path = [startIndex, ...bestIndividual, startIndex];
    const totalDistance = routeDistance(bestIndividual, startIndex, matrix);

    return {
        path,
        distance: totalDistance,
        description: `Evolutionary search over ${generations} generations. Population best distances trended to ${formatDistance(totalDistance)}.`
    };
}

function runSimulatedAnnealing(matrix, startIndex) {
    const startTemperature = clampNumber(Number(document.getElementById('start-temperature').value), 10, 500);
    const coolingRate = clampNumber(Number(document.getElementById('cooling-rate').value), 0.8, 0.99);
    const iterationsPerTemp = clampNumber(Number(document.getElementById('iterations-per-temp').value), 10, 2000);

    const n = matrix.length;
    const nodes = [];
    for (let i = 0; i < n; i += 1) {
        if (i !== startIndex) {
            nodes.push(i);
        }
    }

    if (nodes.length < 2) {
        return null;
    }

    let currentSolution = shuffleArray([...nodes]);
    let currentDistance = routeDistance(currentSolution, startIndex, matrix);
    let bestSolution = [...currentSolution];
    let bestDistance = currentDistance;

    let temperature = startTemperature;
    let sweeps = 0;

    while (temperature > 1) {
        for (let i = 0; i < iterationsPerTemp; i += 1) {
            const candidate = [...currentSolution];
            const [idx1, idx2] = randomPair(candidate.length);
            [candidate[idx1], candidate[idx2]] = [candidate[idx2], candidate[idx1]];

            const candidateDistance = routeDistance(candidate, startIndex, matrix);
            const delta = candidateDistance - currentDistance;

            if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
                currentSolution = candidate;
                currentDistance = candidateDistance;
            }

            if (currentDistance < bestDistance) {
                bestDistance = currentDistance;
                bestSolution = [...currentSolution];
            }
        }

        temperature *= coolingRate;
        sweeps += 1;
    }

    const path = [startIndex, ...bestSolution, startIndex];
    return {
        path,
        distance: bestDistance,
        description: `Annealed over ${sweeps} cooling steps with final temperature ${temperature.toFixed(2)}. Best tour locked at ${formatDistance(bestDistance)}.`
    };
}

function runConcordeSolver(matrix, startIndex) {
    if (matrix.length > 15) {
        console.warn('Branch-and-bound solver capped at 15 cities to keep runtime reasonable.');
    }
    const result = heldKarp(matrix, startIndex);
    return {
        path: result.path,
        distance: result.distance,
        description: 'Exact tour via Held-Karp dynamic programming, echoing Concorde’s branch-and-bound guarantees.'
    };
}

// Genetic algorithm helpers
function tournamentSelection(population, matrix, startIndex, k = 3) {
    let best = null;
    let bestDistance = Infinity;
    for (let i = 0; i < k; i += 1) {
        const candidate = population[Math.floor(Math.random() * population.length)];
        const distance = routeDistance(candidate, startIndex, matrix);
        if (distance < bestDistance) {
            best = candidate;
            bestDistance = distance;
        }
    }
    return best ? [...best] : [...population[0]];
}

function orderCrossover(parentA, parentB) {
    const length = parentA.length;
    const [start, end] = randomOrderedPair(length);
    const child = new Array(length).fill(null);

    for (let i = start; i <= end; i += 1) {
        child[i] = parentA[i];
    }

    let currentIndex = (end + 1) % length;
    for (let i = 0; i < length; i += 1) {
        const gene = parentB[(end + 1 + i) % length];
        if (!child.includes(gene)) {
            child[currentIndex] = gene;
            currentIndex = (currentIndex + 1) % length;
        }
    }

    return child;
}

function mutateSwap(individual) {
    const mutant = [...individual];
    const [idx1, idx2] = randomPair(mutant.length);
    [mutant[idx1], mutant[idx2]] = [mutant[idx2], mutant[idx1]];
    return mutant;
}

function routeDistance(order, startIndex, matrix) {
    let distance = 0;
    let current = startIndex;
    order.forEach(city => {
        distance += matrix[current][city];
        current = city;
    });
    distance += matrix[current][startIndex];
    return distance;
}

// Held-Karp exact solver ---------------------------------------------------
function heldKarp(matrix, startIndex) {
    const n = matrix.length;
    const order = [startIndex];
    for (let i = 0; i < n; i += 1) {
        if (i !== startIndex) {
            order.push(i);
        }
    }

    const reindexedMatrix = order.map(i => order.map(j => matrix[i][j]));
    const size = 1 << n;
    const dp = Array.from({ length: size }, () => Array(n).fill(Infinity));
    const parent = Array.from({ length: size }, () => Array(n).fill(-1));

    dp[1][0] = 0;

    for (let mask = 1; mask < size; mask += 1) {
        if (!(mask & 1)) continue;
        for (let last = 1; last < n; last += 1) {
            if (!(mask & (1 << last))) continue;
            const prevMask = mask ^ (1 << last);
            for (let prev = 0; prev < n; prev += 1) {
                if (!(prevMask & (1 << prev))) continue;
                const candidate = dp[prevMask][prev] + reindexedMatrix[prev][last];
                if (candidate < dp[mask][last]) {
                    dp[mask][last] = candidate;
                    parent[mask][last] = prev;
                }
            }
        }
    }

    let bestDistance = Infinity;
    let bestLast = -1;
    const fullMask = size - 1;
    for (let last = 1; last < n; last += 1) {
        const candidate = dp[fullMask][last] + reindexedMatrix[last][0];
        if (candidate < bestDistance) {
            bestDistance = candidate;
            bestLast = last;
        }
    }

    const route = [];
    let mask = fullMask;
    let current = bestLast;
    while (current !== -1) {
        route.push(current);
        const prev = parent[mask][current];
        mask ^= 1 << current;
        current = prev;
    }
    route.push(0);
    route.reverse();

    const mappedRoute = route.map(idx => order[idx]);
    mappedRoute.push(mappedRoute[0]);

    return {
        path: mappedRoute,
        distance: bestDistance
    };
}

// Utilities ----------------------------------------------------------------
function duplicateCities(cities) {
    return cities.map(city => ({ ...city }));
}

function computeDistanceMatrix(cities) {
    const n = cities.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
            const dx = cities[i].x - cities[j].x;
            const dy = cities[i].y - cities[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            matrix[i][j] = distance;
            matrix[j][i] = distance;
        }
    }
    return matrix;
}

function generateClusteredCities(count, seed = Date.now()) {
    const rng = createRandomGenerator(seed);
    const clusters = [
        { cx: 20, cy: 25 },
        { cx: 70, cy: 30 },
        { cx: 45, cy: 70 }
    ];

    const cities = [];
    for (let i = 0; i < count; i += 1) {
        const cluster = clusters[i % clusters.length];
        const jitterRadius = 10 + rng() * 6;
        const angle = rng() * Math.PI * 2;
        const x = cluster.cx + Math.cos(angle) * jitterRadius;
        const y = cluster.cy + Math.sin(angle) * jitterRadius;
        cities.push({
            name: `Node ${i + 1}`,
            x: clampNumber(x, 4, 96),
            y: clampNumber(y, 4, 96)
        });
    }
    return cities;
}

function createRandomGenerator(seed) {
    let value = seed >>> 0;
    return () => {
        value += 0x6d2b79f5;
        let t = Math.imul(value ^ (value >>> 15), 1 | value);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function randomPair(length) {
    const idx1 = Math.floor(Math.random() * length);
    let idx2 = Math.floor(Math.random() * length);
    while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * length);
    }
    return idx1 < idx2 ? [idx1, idx2] : [idx2, idx1];
}

function randomOrderedPair(length) {
    const [a, b] = randomPair(length);
    return [a, b];
}

function clampNumber(value, min, max) {
    if (Number.isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
}

function formatDistance(distance) {
    return `${distance.toFixed(2)} units`;
}

function formatRuntime(milliseconds) {
    if (!milliseconds && milliseconds !== 0) {
        return '—';
    }
    if (milliseconds < 1) {
        return `${(milliseconds * 1000).toFixed(1)} µs`;
    }
    if (milliseconds < 1000) {
        return `${milliseconds.toFixed(2)} ms`;
    }
    return `${(milliseconds / 1000).toFixed(2)} s`;
}

function defaultDescription(label) {
    return `${label} completed successfully.`;
}

// Kick-off -----------------------------------------------------------------
init();
