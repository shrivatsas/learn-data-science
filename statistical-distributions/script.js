class StatisticalDistributions {
    constructor() {
        this.charts = {};
        this.distributions = ['normal', 'uniform', 'exponential', 'beta', 'binomial', 'poisson', 'gamma'];
        this.defaultParams = {
            normal: { mean: 0, std: 1 },
            uniform: { min: 0, max: 1 },
            exponential: { rate: 1 },
            beta: { alpha: 2, beta: 2 },
            binomial: { n: 10, p: 0.5 },
            poisson: { lambda: 3 },
            gamma: { shape: 2, scale: 1 }
        };
        
        this.initializeCharts();
        this.setupEventListeners();
        this.updateAllVisualizations();
    }

    initializeCharts() {
        this.distributions.forEach(distribution => {
            const ctx = document.getElementById(`${distribution}Chart`).getContext('2d');
            
            this.charts[distribution] = new Chart(ctx, {
                type: distribution === 'binomial' || distribution === 'poisson' ? 'bar' : 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: this.getDistributionLabel(distribution),
                        data: [],
                        borderColor: this.getDistributionColor(distribution),
                        backgroundColor: this.getDistributionColor(distribution, 0.1),
                        fill: distribution !== 'binomial' && distribution !== 'poisson',
                        tension: 0.1,
                        pointRadius: distribution === 'binomial' || distribution === 'poisson' ? 0 : 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 8,
                                font: {
                                    size: 10
                                }
                            }
                        },
                        y: {
                            title: {
                                display: false
                            },
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 10
                                }
                            }
                        }
                    }
                }
            });
        });
    }

    getDistributionColor(distribution, alpha = 1) {
        const colors = {
            normal: `rgba(52, 152, 219, ${alpha})`,      // Blue
            uniform: `rgba(46, 204, 113, ${alpha})`,     // Green
            exponential: `rgba(231, 76, 60, ${alpha})`,  // Red
            beta: `rgba(155, 89, 182, ${alpha})`,        // Purple
            binomial: `rgba(243, 156, 18, ${alpha})`,    // Orange
            poisson: `rgba(26, 188, 156, ${alpha})`,     // Teal
            gamma: `rgba(230, 126, 34, ${alpha})`        // Dark Orange
        };
        return colors[distribution] || `rgba(52, 152, 219, ${alpha})`;
    }

    setupEventListeners() {
        const parameterPairs = [
            ['normalMean', 'normalMeanValue'],
            ['normalStd', 'normalStdValue'],
            ['uniformMin', 'uniformMinValue'],
            ['uniformMax', 'uniformMaxValue'],
            ['exponentialRate', 'exponentialRateValue'],
            ['binomialN', 'binomialNValue'],
            ['binomialP', 'binomialPValue'],
            ['poissonLambda', 'poissonLambdaValue'],
            ['betaAlpha', 'betaAlphaValue'],
            ['betaBeta', 'betaBetaValue'],
            ['gammaShape', 'gammaShapeValue'],
            ['gammaScale', 'gammaScaleValue']
        ];

        parameterPairs.forEach(([sliderId, inputId]) => {
            const slider = document.getElementById(sliderId);
            const input = document.getElementById(inputId);
            
            if (slider && input) {
                slider.addEventListener('input', (e) => {
                    input.value = e.target.value;
                    this.updateAllVisualizations();
                });
                
                input.addEventListener('input', (e) => {
                    slider.value = e.target.value;
                    this.updateAllVisualizations();
                });
            }
        });
    }

    updateAllVisualizations() {
        this.distributions.forEach(distribution => {
            this.updateVisualization(distribution);
            this.updateStatsDisplay(distribution);
        });
    }

    updateVisualization(distribution) {
        const distributionData = this.calculateDistribution(distribution);
        
        this.charts[distribution].data.labels = distributionData.x;
        this.charts[distribution].data.datasets[0].data = distributionData.y;
        
        this.charts[distribution].update('none');
    }

    updateStatsDisplay(distribution) {
        const statsElement = document.getElementById(`${distribution}Stats`);
        if (!statsElement) return;
        
        let statsText = '';
        
        switch (distribution) {
            case 'normal':
                const mean = parseFloat(document.getElementById('normalMeanValue').value);
                const std = parseFloat(document.getElementById('normalStdValue').value);
                statsText = `μ=${mean.toFixed(2)}, σ=${std.toFixed(2)}`;
                break;
            case 'uniform':
                const min = parseFloat(document.getElementById('uniformMinValue').value);
                const max = parseFloat(document.getElementById('uniformMaxValue').value);
                statsText = `a=${min.toFixed(2)}, b=${max.toFixed(2)}`;
                break;
            case 'exponential':
                const rate = parseFloat(document.getElementById('exponentialRateValue').value);
                statsText = `λ=${rate.toFixed(2)}`;
                break;
            case 'beta':
                const alpha = parseFloat(document.getElementById('betaAlphaValue').value);
                const beta = parseFloat(document.getElementById('betaBetaValue').value);
                statsText = `α=${alpha.toFixed(2)}, β=${beta.toFixed(2)}`;
                break;
            case 'binomial':
                const n = parseInt(document.getElementById('binomialNValue').value);
                const p = parseFloat(document.getElementById('binomialPValue').value);
                statsText = `n=${n}, p=${p.toFixed(2)}`;
                break;
            case 'poisson':
                const lambda = parseFloat(document.getElementById('poissonLambdaValue').value);
                statsText = `λ=${lambda.toFixed(2)}`;
                break;
            case 'gamma':
                const shape = parseFloat(document.getElementById('gammaShapeValue').value);
                const scale = parseFloat(document.getElementById('gammaScaleValue').value);
                statsText = `k=${shape.toFixed(2)}, θ=${scale.toFixed(2)}`;
                break;
        }
        
        statsElement.querySelector('span').textContent = statsText;
    }

    calculateDistribution(distribution) {
        switch (distribution) {
            case 'normal':
                return this.calculateNormal();
            case 'uniform':
                return this.calculateUniform();
            case 'exponential':
                return this.calculateExponential();
            case 'binomial':
                return this.calculateBinomial();
            case 'poisson':
                return this.calculatePoisson();
            case 'beta':
                return this.calculateBeta();
            case 'gamma':
                return this.calculateGamma();
            default:
                return { x: [], y: [] };
        }
    }

    calculateNormal() {
        const mean = parseFloat(document.getElementById('normalMeanValue').value);
        const std = parseFloat(document.getElementById('normalStdValue').value);
        
        const x = [];
        const y = [];
        const start = mean - 4 * std;
        const end = mean + 4 * std;
        const steps = 100;
        const stepSize = (end - start) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const xVal = start + i * stepSize;
            const yVal = this.normalPDF(xVal, mean, std);
            x.push(xVal.toFixed(2));
            y.push(yVal);
        }
        
        return { x, y };
    }

    calculateUniform() {
        const min = parseFloat(document.getElementById('uniformMinValue').value);
        const max = parseFloat(document.getElementById('uniformMaxValue').value);
        
        const x = [];
        const y = [];
        const range = max - min;
        const height = range > 0 ? 1 / range : 0;
        
        const padding = Math.max(range * 0.2, 1);
        const start = min - padding;
        const end = max + padding;
        const steps = 100;
        const stepSize = (end - start) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const xVal = start + i * stepSize;
            const yVal = (xVal >= min && xVal <= max) ? height : 0;
            x.push(xVal.toFixed(2));
            y.push(yVal);
        }
        
        return { x, y };
    }

    calculateExponential() {
        const rate = parseFloat(document.getElementById('exponentialRateValue').value);
        
        const x = [];
        const y = [];
        const start = 0;
        const end = 5 / rate;
        const steps = 100;
        const stepSize = end / steps;
        
        for (let i = 0; i <= steps; i++) {
            const xVal = start + i * stepSize;
            const yVal = rate * Math.exp(-rate * xVal);
            x.push(xVal.toFixed(2));
            y.push(yVal);
        }
        
        return { x, y };
    }

    calculateBinomial() {
        const n = parseInt(document.getElementById('binomialNValue').value);
        const p = parseFloat(document.getElementById('binomialPValue').value);
        
        const x = [];
        const y = [];
        
        for (let k = 0; k <= n; k++) {
            const prob = this.binomialPMF(k, n, p);
            x.push(k.toString());
            y.push(prob);
        }
        
        return { x, y };
    }

    calculatePoisson() {
        const lambda = parseFloat(document.getElementById('poissonLambdaValue').value);
        
        const x = [];
        const y = [];
        const maxK = Math.min(25, Math.max(15, lambda * 3));
        
        for (let k = 0; k <= maxK; k++) {
            const prob = this.poissonPMF(k, lambda);
            x.push(k.toString());
            y.push(prob);
        }
        
        return { x, y };
    }

    calculateBeta() {
        const alpha = parseFloat(document.getElementById('betaAlphaValue').value);
        const beta = parseFloat(document.getElementById('betaBetaValue').value);
        
        const x = [];
        const y = [];
        const steps = 100;
        
        for (let i = 1; i < steps; i++) {
            const xVal = i / steps;
            const yVal = this.betaPDF(xVal, alpha, beta);
            x.push(xVal.toFixed(3));
            y.push(yVal);
        }
        
        return { x, y };
    }

    calculateGamma() {
        const shape = parseFloat(document.getElementById('gammaShapeValue').value);
        const scale = parseFloat(document.getElementById('gammaScaleValue').value);
        
        const x = [];
        const y = [];
        const start = 0.01;
        const end = shape * scale * 4;
        const steps = 100;
        const stepSize = (end - start) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const xVal = start + i * stepSize;
            const yVal = this.gammaPDF(xVal, shape, scale);
            x.push(xVal.toFixed(2));
            y.push(yVal);
        }
        
        return { x, y };
    }

    normalPDF(x, mean, std) {
        const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / std, 2);
        return coefficient * Math.exp(exponent);
    }

    binomialPMF(k, n, p) {
        return this.binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    poissonPMF(k, lambda) {
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
    }

    betaPDF(x, alpha, beta) {
        if (x <= 0 || x >= 1) return 0;
        const betaFunction = this.gammaFunction(alpha) * this.gammaFunction(beta) / this.gammaFunction(alpha + beta);
        return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / betaFunction;
    }

    gammaPDF(x, shape, scale) {
        if (x <= 0) return 0;
        const coefficient = 1 / (this.gammaFunction(shape) * Math.pow(scale, shape));
        return coefficient * Math.pow(x, shape - 1) * Math.exp(-x / scale);
    }

    binomialCoefficient(n, k) {
        if (k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result = result * (n - i + 1) / i;
        }
        return result;
    }

    factorial(n) {
        if (n <= 1) return 1;
        if (n > 20) return this.stirlingApproximation(n);
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    stirlingApproximation(n) {
        return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    }

    gammaFunction(z) {
        if (z === 1) return 1;
        if (z === 0.5) return Math.sqrt(Math.PI);
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * this.gammaFunction(1 - z));
        
        if (z < 1) return this.gammaFunction(z + 1) / z;
        if (z === Math.floor(z)) return this.factorial(z - 1);
        
        return (z - 1) * this.gammaFunction(z - 1);
    }

    getDistributionLabel(distribution) {
        const labels = {
            'normal': 'Normal Distribution',
            'uniform': 'Uniform Distribution',
            'exponential': 'Exponential Distribution',
            'binomial': 'Binomial Distribution',
            'poisson': 'Poisson Distribution',
            'beta': 'Beta Distribution',
            'gamma': 'Gamma Distribution'
        };
        return labels[distribution] || 'Distribution';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StatisticalDistributions();
});