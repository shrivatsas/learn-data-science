// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeCoinFlip();
    initializeMedicalTest();
    initializeABTesting();
});

function initializeTabs() {
    console.log('Initializing tabs...');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found tab buttons:', tabBtns.length);
    console.log('Found tab contents:', tabContents.length);

    tabBtns.forEach((btn, index) => {
        console.log(`Tab ${index}:`, btn.dataset.tab);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = btn.dataset.tab;
            console.log('Clicked tab:', targetTab);
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            const targetElement = document.getElementById(targetTab);
            console.log('Target element found:', targetElement);
            if (targetElement) {
                targetElement.classList.add('active');
                console.log('Successfully activated tab:', targetTab);
            } else {
                console.error('Target element not found for tab:', targetTab);
            }
        });
    });
}

// Coin Flip Experiment
function initializeCoinFlip() {
    const flipsSlider = document.getElementById('coin-flips');
    const headsSlider = document.getElementById('coin-heads');
    const flipsValue = document.getElementById('coin-flips-value');
    const headsValue = document.getElementById('coin-heads-value');
    const priorSelect = document.getElementById('prior-belief');
    const simulateBtn = document.getElementById('simulate-flips');

    let coinChart = null;

    flipsSlider.addEventListener('input', () => {
        const flips = parseInt(flipsSlider.value);
        flipsValue.textContent = flips;
        headsSlider.max = flips;
        if (parseInt(headsSlider.value) > flips) {
            headsSlider.value = flips;
            headsValue.textContent = flips;
        }
        updateCoinAnalysis();
    });

    headsSlider.addEventListener('input', () => {
        headsValue.textContent = headsSlider.value;
        updateCoinAnalysis();
    });

    priorSelect.addEventListener('change', updateCoinAnalysis);
    simulateBtn.addEventListener('click', simulateRandomFlips);

    function simulateRandomFlips() {
        const flips = parseInt(flipsSlider.value);
        const heads = Math.floor(Math.random() * (flips + 1));
        headsSlider.value = heads;
        headsValue.textContent = heads;
        updateCoinAnalysis();
    }

    function updateCoinAnalysis() {
        const n = parseInt(flipsSlider.value);
        const heads = parseInt(headsSlider.value);
        const tails = n - heads;
        const p_hat = heads / n;

        // Frequentist Analysis
        const se = Math.sqrt(p_hat * (1 - p_hat) / n);
        const z_score = 1.96; // 95% confidence
        const ci_lower = Math.max(0, p_hat - z_score * se);
        const ci_upper = Math.min(1, p_hat + z_score * se);

        document.getElementById('freq-estimate').textContent = p_hat.toFixed(3);
        document.getElementById('freq-ci').textContent = `[${ci_lower.toFixed(3)}, ${ci_upper.toFixed(3)}]`;

        // Bayesian Analysis
        const priorType = priorSelect.value;
        let alpha_prior, beta_prior;

        switch(priorType) {
            case 'uniform':
                alpha_prior = 1; beta_prior = 1;
                break;
            case 'fair':
                alpha_prior = 50; beta_prior = 50;
                break;
            case 'biased-heads':
                alpha_prior = 70; beta_prior = 30;
                break;
            case 'biased-tails':
                alpha_prior = 30; beta_prior = 70;
                break;
        }

        const alpha_post = alpha_prior + heads;
        const beta_post = beta_prior + tails;
        const bayes_mean = alpha_post / (alpha_post + beta_post);

        // Beta distribution 95% credible interval (approximation)
        const bayes_var = (alpha_post * beta_post) / ((alpha_post + beta_post) ** 2 * (alpha_post + beta_post + 1));
        const bayes_se = Math.sqrt(bayes_var);
        const bayes_ci_lower = Math.max(0, bayes_mean - 1.96 * bayes_se);
        const bayes_ci_upper = Math.min(1, bayes_mean + 1.96 * bayes_se);

        document.getElementById('bayes-estimate').textContent = bayes_mean.toFixed(3);
        document.getElementById('bayes-ci').textContent = `[${bayes_ci_lower.toFixed(3)}, ${bayes_ci_upper.toFixed(3)}]`;

        // Update chart
        updateCoinChart(alpha_post, beta_post, p_hat, ci_lower, ci_upper);
    }

    function updateCoinChart(alpha, beta, freq_estimate, freq_ci_lower, freq_ci_upper) {
        const ctx = document.getElementById('coin-chart').getContext('2d');
        
        if (coinChart) {
            coinChart.destroy();
        }

        // Generate beta distribution points
        const x_values = [];
        const y_values = [];
        for (let i = 0; i <= 100; i++) {
            const x = i / 100;
            x_values.push(x);
            y_values.push(betaPDF(x, alpha, beta));
        }

        coinChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x_values.map(x => x.toFixed(2)),
                datasets: [{
                    label: 'Bayesian Posterior',
                    data: y_values,
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Frequentist Estimate',
                    data: x_values.map(x => x === parseFloat(freq_estimate.toFixed(2)) ? Math.max(...y_values) : null),
                    borderColor: '#ff6b6b',
                    backgroundColor: '#ff6b6b',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Probability Distribution Comparison'
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Probability of Heads'
                        },
                        min: 0,
                        max: 1
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Density'
                        }
                    }
                }
            }
        });
    }

    // Initialize with default values
    updateCoinAnalysis();
}

// Medical Test
function initializeMedicalTest() {
    const prevalenceSlider = document.getElementById('disease-prevalence');
    const sensitivitySlider = document.getElementById('test-sensitivity');
    const specificitySlider = document.getElementById('test-specificity');
    
    const prevalenceValue = document.getElementById('disease-prevalence-value');
    const sensitivityValue = document.getElementById('test-sensitivity-value');
    const specificityValue = document.getElementById('test-specificity-value');

    prevalenceSlider.addEventListener('input', () => {
        prevalenceValue.textContent = `${parseFloat(prevalenceSlider.value).toFixed(1)}%`;
        updateMedicalAnalysis();
    });

    sensitivitySlider.addEventListener('input', () => {
        sensitivityValue.textContent = `${parseFloat(sensitivitySlider.value).toFixed(1)}%`;
        updateMedicalAnalysis();
    });

    specificitySlider.addEventListener('input', () => {
        specificityValue.textContent = `${parseFloat(specificitySlider.value).toFixed(1)}%`;
        updateMedicalAnalysis();
    });

    function updateMedicalAnalysis() {
        const prevalence = parseFloat(prevalenceSlider.value) / 100;
        const sensitivity = parseFloat(sensitivitySlider.value) / 100;
        const specificity = parseFloat(specificitySlider.value) / 100;

        // Bayesian calculation: P(Disease|Positive Test)
        const p_positive_given_disease = sensitivity;
        const p_positive_given_no_disease = 1 - specificity;
        const p_positive = (p_positive_given_disease * prevalence) + (p_positive_given_no_disease * (1 - prevalence));
        const p_disease_given_positive = (p_positive_given_disease * prevalence) / p_positive;

        document.getElementById('disease-probability').textContent = `${(p_disease_given_positive * 100).toFixed(1)}%`;

        // Update interpretation
        const interpretation = p_disease_given_positive < 0.5 
            ? "Even with a positive test, the probability of actually having the disease is relatively low due to the low base rate."
            : "The positive test result significantly increases the probability of having the disease.";
        
        document.getElementById('bayesian-medical-interpretation').textContent = interpretation;

        // Update probability tree
        updateProbabilityTree(prevalence, sensitivity, specificity, p_disease_given_positive);
    }

    function updateProbabilityTree(prevalence, sensitivity, specificity, posterior) {
        const treeContainer = document.getElementById('probability-tree');
        
        const p_disease = prevalence;
        const p_no_disease = 1 - prevalence;
        const p_pos_disease = sensitivity;
        const p_neg_disease = 1 - sensitivity;
        const p_pos_no_disease = 1 - specificity;
        const p_neg_no_disease = specificity;

        treeContainer.innerHTML = `
            <div class="tree-level">
                <div class="tree-node">Population</div>
            </div>
            <div class="tree-level">
                <div class="tree-branch">
                    <div class="branch-probability">${(p_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">Has Disease</div>
                </div>
                <div class="tree-branch">
                    <div class="branch-probability">${(p_no_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">No Disease</div>
                </div>
            </div>
            <div class="tree-level">
                <div class="tree-branch">
                    <div class="branch-probability">${(p_pos_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">Test +</div>
                </div>
                <div class="tree-branch">
                    <div class="branch-probability">${(p_neg_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">Test -</div>
                </div>
                <div class="tree-branch">
                    <div class="branch-probability">${(p_pos_no_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">Test +</div>
                </div>
                <div class="tree-branch">
                    <div class="branch-probability">${(p_neg_no_disease * 100).toFixed(1)}%</div>
                    <div class="tree-node">Test -</div>
                </div>
            </div>
            <div class="tree-level">
                <div class="tree-branch">
                    <div class="tree-node final-probability">
                        P(Disease|+) = ${(posterior * 100).toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize with default values
    updateMedicalAnalysis();
}

// A/B Testing
function initializeABTesting() {
    const calculateBtn = document.getElementById('calculate-ab');
    
    calculateBtn.addEventListener('click', updateABAnalysis);

    function updateABAnalysis() {
        const visitorsA = parseInt(document.getElementById('group-a-visitors').value);
        const conversionsA = parseInt(document.getElementById('group-a-conversions').value);
        const visitorsB = parseInt(document.getElementById('group-b-visitors').value);
        const conversionsB = parseInt(document.getElementById('group-b-conversions').value);

        // Ensure conversions don't exceed visitors
        document.getElementById('group-a-conversions').max = visitorsA;
        document.getElementById('group-b-conversions').max = visitorsB;

        const rateA = conversionsA / visitorsA;
        const rateB = conversionsB / visitorsB;

        // Frequentist Analysis (Two-proportion z-test)
        const pooled_p = (conversionsA + conversionsB) / (visitorsA + visitorsB);
        const se_pooled = Math.sqrt(pooled_p * (1 - pooled_p) * (1/visitorsA + 1/visitorsB));
        const z_score = (rateB - rateA) / se_pooled;
        const p_value = 2 * (1 - normalCDF(Math.abs(z_score)));

        document.getElementById('freq-rate-a').textContent = `${(rateA * 100).toFixed(1)}%`;
        document.getElementById('freq-rate-b').textContent = `${(rateB * 100).toFixed(1)}%`;
        document.getElementById('z-score').textContent = z_score.toFixed(3);
        document.getElementById('p-value').textContent = p_value.toFixed(4);

        const isSignificant = p_value < 0.05;
        const freqConclusion = document.getElementById('freq-conclusion');
        freqConclusion.textContent = isSignificant 
            ? 'Statistically significant at α = 0.05' 
            : 'Not statistically significant at α = 0.05';
        freqConclusion.className = isSignificant ? 'conclusion significant' : 'conclusion not-significant';

        // Bayesian Analysis (Beta-Binomial model)
        // Using uniform priors Beta(1,1) for simplicity
        const alphaA = 1 + conversionsA;
        const betaA = 1 + visitorsA - conversionsA;
        const alphaB = 1 + conversionsB;
        const betaB = 1 + visitorsB - conversionsB;

        // Monte Carlo simulation to estimate P(B > A)
        const samples = 10000;
        let bBetterCount = 0;
        const lifts = [];

        for (let i = 0; i < samples; i++) {
            const sampleA = betaRandom(alphaA, betaA);
            const sampleB = betaRandom(alphaB, betaB);
            if (sampleB > sampleA) bBetterCount++;
            lifts.push(sampleB - sampleA);
        }

        const probBBetter = bBetterCount / samples;
        const expectedLift = lifts.reduce((a, b) => a + b, 0) / samples;
        lifts.sort((a, b) => a - b);
        const liftCI_lower = lifts[Math.floor(samples * 0.025)];
        const liftCI_upper = lifts[Math.floor(samples * 0.975)];

        document.getElementById('prob-b-better').textContent = `${(probBBetter * 100).toFixed(1)}%`;
        document.getElementById('expected-lift').textContent = `${(expectedLift * 100 >= 0 ? '+' : '')}${(expectedLift * 100).toFixed(1)}%`;
        document.getElementById('lift-ci').textContent = `[${(liftCI_lower * 100).toFixed(1)}%, ${(liftCI_upper * 100).toFixed(1)}%]`;

        const bayesConclusion = document.getElementById('bayes-ab-conclusion');
        if (probBBetter > 0.95) {
            bayesConclusion.textContent = `Very strong evidence that B is better than A (${(probBBetter * 100).toFixed(1)}% probability).`;
            bayesConclusion.className = 'bayesian-conclusion significant';
        } else if (probBBetter > 0.8) {
            bayesConclusion.textContent = `Good evidence that B is better than A (${(probBBetter * 100).toFixed(1)}% probability).`;
            bayesConclusion.className = 'bayesian-conclusion borderline';
        } else if (probBBetter < 0.2) {
            bayesConclusion.textContent = `Good evidence that A is better than B (${((1-probBBetter) * 100).toFixed(1)}% probability).`;
            bayesConclusion.className = 'bayesian-conclusion borderline';
        } else {
            bayesConclusion.textContent = `Inconclusive evidence (${(probBBetter * 100).toFixed(1)}% probability B is better).`;
            bayesConclusion.className = 'bayesian-conclusion not-significant';
        }

        // Update A/B chart
        updateABChart(alphaA, betaA, alphaB, betaB, rateA, rateB);
    }

    function updateABChart(alphaA, betaA, alphaB, betaB, rateA, rateB) {
        const ctx = document.getElementById('ab-chart').getContext('2d');
        
        if (window.abChart) {
            window.abChart.destroy();
        }

        // Generate beta distribution points
        const x_values = [];
        const yA_values = [];
        const yB_values = [];
        
        for (let i = 0; i <= 100; i++) {
            const x = i / 100;
            x_values.push(x);
            yA_values.push(betaPDF(x, alphaA, betaA));
            yB_values.push(betaPDF(x, alphaB, betaB));
        }

        window.abChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x_values.map(x => x.toFixed(2)),
                datasets: [{
                    label: 'Group A Posterior',
                    data: yA_values,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Group B Posterior',
                    data: yB_values,
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Frequentist A',
                    data: x_values.map(x => Math.abs(x - rateA) < 0.01 ? Math.max(...yA_values, ...yB_values) : null),
                    borderColor: '#ff6b6b',
                    backgroundColor: '#ff6b6b',
                    pointRadius: 6,
                    showLine: false
                }, {
                    label: 'Frequentist B',
                    data: x_values.map(x => Math.abs(x - rateB) < 0.01 ? Math.max(...yA_values, ...yB_values) : null),
                    borderColor: '#4ecdc4',
                    backgroundColor: '#4ecdc4',
                    pointRadius: 6,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Conversion Rate Distributions'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Conversion Rate'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Density'
                        }
                    }
                }
            }
        });
    }

    // Initialize with default values
    updateABAnalysis();
}

// Utility Functions
function betaPDF(x, alpha, beta) {
    if (x <= 0 || x >= 1) return 0;
    
    // Simplified beta PDF calculation
    const logPDF = (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x);
    return Math.exp(logPDF) * gamma(alpha + beta) / (gamma(alpha) * gamma(beta));
}

function gamma(z) {
    // Stirling's approximation for gamma function
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
              771.32342877765313, -176.61502916214059, 12.507343278686905,
              -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
        x += C[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function betaRandom(alpha, beta) {
    // Generate beta random variable using gamma random variables
    const x = gammaRandom(alpha, 1);
    const y = gammaRandom(beta, 1);
    return x / (x + y);
}

function gammaRandom(shape, scale) {
    // Marsaglia and Tsang's method for gamma random variables
    if (shape < 1) {
        return gammaRandom(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
        let x, v;
        do {
            x = normalRandom();
            v = 1 + c * x;
        } while (v <= 0);
        
        v = v * v * v;
        const u = Math.random();
        
        if (u < 1 - 0.0331 * x * x * x * x) {
            return d * v * scale;
        }
        
        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v * scale;
        }
    }
}

function normalRandom() {
    // Box-Muller transformation
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function normalCDF(x) {
    // Approximation of the standard normal CDF
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
}
