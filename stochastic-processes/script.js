// Stochastic Processes Multi-Chart Visualization
class StochasticProcesses {
    constructor() {
        this.charts = {};
        this.animationFrames = {};
        this.isAnimating = false;
        this.animationData = {};
        this.animationIndices = {};
        
        this.initializeCharts();
        this.setupEventListeners();
        this.generateAllProcesses();
    }

    initializeCharts() {
        const processes = ['random-walk', 'brownian-motion', 'markov-chain', 'poisson-process', 'levy-process', 'gaussian-process'];
        
        processes.forEach(process => {
            const ctx = document.getElementById(`${process}-chart`).getContext('2d');
            this.charts[process] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    animation: {
                        duration: 0
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }
                }
            });
        });
    }

    setupEventListeners() {
        // Global controls
        document.getElementById('global-steps').addEventListener('input', (e) => {
            document.getElementById('global-steps-value').textContent = e.target.value;
            this.generateAllProcesses();
        });

        document.getElementById('global-paths').addEventListener('input', (e) => {
            document.getElementById('global-paths-value').textContent = e.target.value;
            this.generateAllProcesses();
        });

        // Process-specific controls
        document.getElementById('prob-up').addEventListener('input', (e) => {
            document.getElementById('prob-up-value').textContent = e.target.value;
            this.generateRandomWalk();
        });

        document.getElementById('drift').addEventListener('input', (e) => {
            document.getElementById('drift-value').textContent = e.target.value;
            this.generateBrownianMotion();
        });

        document.getElementById('volatility').addEventListener('input', (e) => {
            document.getElementById('volatility-value').textContent = e.target.value;
            this.generateBrownianMotion();
        });

        document.getElementById('rate').addEventListener('input', (e) => {
            document.getElementById('rate-value').textContent = e.target.value;
            this.generatePoissonProcess();
        });

        document.getElementById('alpha').addEventListener('input', (e) => {
            document.getElementById('alpha-value').textContent = e.target.value;
            this.generateLevyProcess();
        });

        document.getElementById('beta').addEventListener('input', (e) => {
            document.getElementById('beta-value').textContent = e.target.value;
            this.generateLevyProcess();
        });

        document.getElementById('scale').addEventListener('input', (e) => {
            document.getElementById('scale-value').textContent = e.target.value;
            this.generateLevyProcess();
        });

        document.getElementById('length-scale').addEventListener('input', (e) => {
            document.getElementById('length-scale-value').textContent = e.target.value;
            this.generateGaussianProcess();
        });

        document.getElementById('variance').addEventListener('input', (e) => {
            document.getElementById('variance-value').textContent = e.target.value;
            this.generateGaussianProcess();
        });

        document.getElementById('noise').addEventListener('input', (e) => {
            document.getElementById('noise-value').textContent = e.target.value;
            this.generateGaussianProcess();
        });

        // Global buttons
        document.getElementById('global-generate-btn').addEventListener('click', () => {
            this.generateAllProcesses();
        });

        document.getElementById('global-animate-btn').addEventListener('click', () => {
            if (this.isAnimating) {
                this.stopAllAnimations();
            } else {
                this.startAllAnimations();
            }
        });
    }

    generateAllProcesses() {
        this.stopAllAnimations();
        this.generateRandomWalk();
        this.generateBrownianMotion();
        this.generateMarkovChain();
        this.generatePoissonProcess();
        this.generateLevyProcess();
        this.generateGaussianProcess();
    }

    generateRandomWalk() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        const probUp = parseFloat(document.getElementById('prob-up').value);
        
        const datasets = this.createRandomWalk(steps, numPaths, probUp);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('random-walk', labels, datasets);
        this.animationData['random-walk'] = datasets.map(dataset => [...dataset.data]);
    }

    generateBrownianMotion() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        const drift = parseFloat(document.getElementById('drift').value);
        const volatility = parseFloat(document.getElementById('volatility').value);
        
        const datasets = this.createBrownianMotion(steps, numPaths, drift, volatility);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('brownian-motion', labels, datasets);
        this.animationData['brownian-motion'] = datasets.map(dataset => [...dataset.data]);
    }

    generateMarkovChain() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        
        const datasets = this.createMarkovChain(steps, numPaths);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('markov-chain', labels, datasets);
        this.animationData['markov-chain'] = datasets.map(dataset => [...dataset.data]);
        
        // Update Markov chain display
        const states = ['Sunny', 'Cloudy', 'Rainy'];
        const transitionMatrix = [
            [0.7, 0.2, 0.1],
            [0.3, 0.4, 0.3],
            [0.2, 0.3, 0.5]
        ];
        this.updateMarkovDisplay(states, transitionMatrix);
    }

    generatePoissonProcess() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        const rate = parseFloat(document.getElementById('rate').value);
        
        const datasets = this.createPoissonProcess(steps, numPaths, rate);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('poisson-process', labels, datasets);
        this.animationData['poisson-process'] = datasets.map(dataset => [...dataset.data]);
    }

    generateLevyProcess() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        const alpha = parseFloat(document.getElementById('alpha').value);
        const beta = parseFloat(document.getElementById('beta').value);
        const scale = parseFloat(document.getElementById('scale').value);
        
        const datasets = this.createLevyProcess(steps, numPaths, alpha, beta, scale);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('levy-process', labels, datasets);
        this.animationData['levy-process'] = datasets.map(dataset => [...dataset.data]);
    }

    generateGaussianProcess() {
        const steps = parseInt(document.getElementById('global-steps').value);
        const numPaths = parseInt(document.getElementById('global-paths').value);
        const lengthScale = parseFloat(document.getElementById('length-scale').value);
        const variance = parseFloat(document.getElementById('variance').value);
        const noise = parseFloat(document.getElementById('noise').value);
        
        const datasets = this.createGaussianProcess(steps, numPaths, lengthScale, variance, noise);
        const labels = Array.from({length: steps + 1}, (_, i) => i);
        
        this.updateChart('gaussian-process', labels, datasets);
        this.animationData['gaussian-process'] = datasets.map(dataset => [...dataset.data]);
    }

    updateChart(processName, labels, datasets) {
        this.charts[processName].data.labels = labels;
        this.charts[processName].data.datasets = datasets;
        this.charts[processName].update('none');
    }

    createRandomWalk(steps, numPaths, probUp) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        const datasets = [];
        
        for (let path = 0; path < numPaths; path++) {
            const data = [0];
            let value = 0;
            
            for (let i = 1; i <= steps; i++) {
                value += Math.random() < probUp ? 1 : -1;
                data.push(value);
            }
            
            datasets.push({
                label: `Path ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                tension: 0
            });
        }
        
        return datasets;
    }

    createBrownianMotion(steps, numPaths, drift, volatility) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        const datasets = [];
        const dt = 1 / steps;
        
        for (let path = 0; path < numPaths; path++) {
            const data = [0];
            let value = 0;
            
            for (let i = 1; i <= steps; i++) {
                const dW = this.gaussianRandom() * Math.sqrt(dt);
                value += drift * dt + volatility * dW;
                data.push(value);
            }
            
            datasets.push({
                label: `Path ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                tension: 0.1
            });
        }
        
        return datasets;
    }

    createMarkovChain(steps, numPaths) {
        const states = ['Sunny', 'Cloudy', 'Rainy'];
        const transitionMatrix = [
            [0.7, 0.2, 0.1],
            [0.3, 0.4, 0.3],
            [0.2, 0.3, 0.5]
        ];
        
        const colors = ['#f39c12', '#95a5a6', '#3498db'];
        const datasets = [];
        
        for (let path = 0; path < numPaths; path++) {
            const data = [];
            let currentState = Math.floor(Math.random() * 3);
            data.push(currentState);
            
            for (let i = 1; i <= steps; i++) {
                const rand = Math.random();
                let cumProb = 0;
                for (let j = 0; j < 3; j++) {
                    cumProb += transitionMatrix[currentState][j];
                    if (rand < cumProb) {
                        currentState = j;
                        break;
                    }
                }
                data.push(currentState);
            }
            
            datasets.push({
                label: `Chain ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                stepped: true
            });
        }
        
        // Update chart to show state names
        this.charts['markov-chain'].options.scales.y.ticks = {
            callback: function(value) {
                return states[Math.round(value)] || '';
            }
        };
        this.charts['markov-chain'].options.scales.y.min = -0.5;
        this.charts['markov-chain'].options.scales.y.max = 2.5;
        
        return datasets;
    }

    createPoissonProcess(steps, numPaths, rate) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        const datasets = [];
        const timeStep = 1 / steps;
        
        for (let path = 0; path < numPaths; path++) {
            const data = [0];
            let count = 0;
            
            for (let i = 1; i <= steps; i++) {
                const prob = rate * timeStep;
                if (Math.random() < prob) {
                    count++;
                }
                data.push(count);
            }
            
            datasets.push({
                label: `Process ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                stepped: true
            });
        }
        
        return datasets;
    }

    createLevyProcess(steps, numPaths, alpha, beta, scale) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        const datasets = [];
        
        for (let path = 0; path < numPaths; path++) {
            const data = [0];
            let value = 0;
            
            for (let i = 1; i <= steps; i++) {
                // Approximate Levy stable distribution using Chambers method
                const increment = this.levyStable(alpha, beta, scale);
                value += increment;
                data.push(value);
            }
            
            datasets.push({
                label: `Path ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                tension: 0
            });
        }
        
        return datasets;
    }

    createGaussianProcess(steps, numPaths, lengthScale, variance, noise) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        const datasets = [];
        
        // Generate time points
        const timePoints = Array.from({length: steps + 1}, (_, i) => i);
        
        for (let path = 0; path < numPaths; path++) {
            // Generate covariance matrix
            const K = this.squaredExponentialKernel(timePoints, lengthScale, variance, noise);
            
            // Sample from multivariate normal distribution
            const data = this.multivariateNormal(K);
            
            datasets.push({
                label: `Function ${path + 1}`,
                data: data,
                borderColor: colors[path % colors.length],
                backgroundColor: colors[path % colors.length] + '20',
                fill: false,
                tension: 0.3
            });
        }
        
        return datasets;
    }

    updateMarkovDisplay(states, transitionMatrix) {
        const stateGrid = document.getElementById('state-grid');
        const matrixDiv = document.getElementById('transition-matrix');
        
        // Clear previous content
        stateGrid.innerHTML = '';
        matrixDiv.innerHTML = '';
        
        // Create state nodes
        const stateColors = ['#f39c12', '#95a5a6', '#3498db'];
        states.forEach((state, index) => {
            const node = document.createElement('div');
            node.className = 'state-node';
            node.style.backgroundColor = stateColors[index];
            node.textContent = state[0];
            node.title = state;
            stateGrid.appendChild(node);
        });
        
        // Create transition matrix display
        matrixDiv.style.gridTemplateColumns = `repeat(${states.length + 1}, 1fr)`;
        
        // Header row
        const emptyCell = document.createElement('div');
        emptyCell.className = 'matrix-cell header';
        matrixDiv.appendChild(emptyCell);
        
        states.forEach(state => {
            const headerCell = document.createElement('div');
            headerCell.className = 'matrix-cell header';
            headerCell.textContent = state[0];
            matrixDiv.appendChild(headerCell);
        });
        
        // Matrix rows
        states.forEach((fromState, i) => {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'matrix-cell header';
            rowHeader.textContent = fromState[0];
            matrixDiv.appendChild(rowHeader);
            
            transitionMatrix[i].forEach(prob => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = prob.toFixed(1);
                matrixDiv.appendChild(cell);
            });
        });
    }

    startAllAnimations() {
        const processes = ['random-walk', 'brownian-motion', 'markov-chain', 'poisson-process', 'levy-process', 'gaussian-process'];
        
        if (Object.keys(this.animationData).length === 0) return;
        
        this.isAnimating = true;
        document.getElementById('global-animate-btn').textContent = 'Stop All';
        
        // Initialize animation indices
        processes.forEach(process => {
            this.animationIndices[process] = 0;
            // Clear charts and start from beginning
            this.charts[process].data.datasets.forEach(dataset => {
                dataset.data = [dataset.data[0]];
            });
            this.charts[process].update('none');
        });
        
        this.animateAll();
    }

    animateAll() {
        if (!this.isAnimating) {
            this.stopAllAnimations();
            return;
        }
        
        const processes = ['random-walk', 'brownian-motion', 'markov-chain', 'poisson-process', 'levy-process', 'gaussian-process'];
        let allComplete = true;
        
        processes.forEach(process => {
            if (this.animationData[process] && this.animationIndices[process] < this.animationData[process][0].length) {
                allComplete = false;
                
                // Add next point to each dataset
                this.charts[process].data.datasets.forEach((dataset, pathIndex) => {
                    if (this.animationIndices[process] < this.animationData[process][pathIndex].length) {
                        dataset.data.push(this.animationData[process][pathIndex][this.animationIndices[process]]);
                    }
                });
                
                this.charts[process].update('none');
                this.animationIndices[process]++;
            }
        });
        
        if (allComplete) {
            this.stopAllAnimations();
            return;
        }
        
        this.animationFrames.global = setTimeout(() => this.animateAll(), 50);
    }

    stopAllAnimations() {
        this.isAnimating = false;
        document.getElementById('global-animate-btn').textContent = 'Animate All';
        
        Object.values(this.animationFrames).forEach(frame => {
            if (frame) clearTimeout(frame);
        });
        this.animationFrames = {};
        
        // Restore full data
        Object.keys(this.animationData).forEach(process => {
            if (this.animationData[process].length > 0) {
                this.charts[process].data.datasets.forEach((dataset, pathIndex) => {
                    dataset.data = [...this.animationData[process][pathIndex]];
                });
                this.charts[process].update('none');
            }
        });
    }

    gaussianRandom() {
        // Box-Muller transform
        if (this.spare !== undefined) {
            const temp = this.spare;
            delete this.spare;
            return temp;
        }
        
        const u = Math.random();
        const v = Math.random();
        const mag = Math.sqrt(-2 * Math.log(u));
        this.spare = mag * Math.cos(2 * Math.PI * v);
        return mag * Math.sin(2 * Math.PI * v);
    }

    levyStable(alpha, beta, scale) {
        // Chambers, Mallows, and Stuck method for generating Levy stable random variables
        const U = Math.PI * (Math.random() - 0.5);
        const W = -Math.log(Math.random());
        
        if (Math.abs(alpha - 1) < 1e-7) {
            // Special case for alpha = 1 (Cauchy distribution when beta = 0)
            const S = Math.tan(U);
            return scale * S + (2 / Math.PI) * beta * scale * Math.log(scale);
        } else {
            const B = Math.atan(beta * Math.tan(Math.PI * alpha / 2)) / alpha;
            const S = Math.pow(1 + beta * beta * Math.pow(Math.tan(Math.PI * alpha / 2), 2), 1 / (2 * alpha));
            
            const term1 = Math.sin(alpha * (U + B)) / Math.pow(Math.cos(U), 1 / alpha);
            const term2 = Math.pow(Math.cos(U - alpha * (U + B)) / W, (1 - alpha) / alpha);
            
            return scale * S * term1 * term2;
        }
    }

    squaredExponentialKernel(x, lengthScale, variance, noise) {
        const n = x.length;
        const K = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const dist = Math.abs(x[i] - x[j]);
                K[i][j] = variance * Math.exp(-0.5 * Math.pow(dist / lengthScale, 2));
                if (i === j) {
                    K[i][j] += noise * noise; // Add noise to diagonal
                }
            }
        }
        
        return K;
    }

    multivariateNormal(covariance) {
        const n = covariance.length;
        const L = this.choleskyDecomposition(covariance);
        
        // Generate independent standard normal samples
        const z = Array(n).fill().map(() => this.gaussianRandom());
        
        // Transform using Cholesky factor
        const x = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                x[i] += L[i][j] * z[j];
            }
        }
        
        return x;
    }

    choleskyDecomposition(A) {
        const n = A.length;
        const L = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                if (i === j) {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[j][k] * L[j][k];
                    }
                    L[j][j] = Math.sqrt(Math.max(A[j][j] - sum, 1e-10)); // Ensure positive
                } else {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * L[j][k];
                    }
                    L[i][j] = (A[i][j] - sum) / L[j][j];
                }
            }
        }
        
        return L;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StochasticProcesses();
});
