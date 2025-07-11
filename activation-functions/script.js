// DOM Elements
const activationGraph = document.getElementById('activation-graph');
const xInputSlider = document.getElementById('x-input-slider');
const xInput = document.getElementById('x-input');
const xMin = document.getElementById('x-min');
const xMax = document.getElementById('x-max');
const alphaSlider = document.getElementById('alpha-slider');
const alphaDisplay = document.getElementById('alpha-display');
const outputValue = document.getElementById('output-value');
const z1Input = document.getElementById('z1');
const z2Input = document.getElementById('z2');
const z3Input = document.getElementById('z3');

// Function buttons
const sigmoidBtn = document.getElementById('sigmoid-btn');
const reluBtn = document.getElementById('relu-btn');
const leakyReluBtn = document.getElementById('leaky-relu-btn');
const tanhBtn = document.getElementById('tanh-btn');
const softmaxBtn = document.getElementById('softmax-btn');

// Info sections
const sigmoidInfo = document.getElementById('sigmoid-info');
const reluInfo = document.getElementById('relu-info');
const leakyReluInfo = document.getElementById('leaky-relu-info');
const tanhInfo = document.getElementById('tanh-info');
const softmaxInfo = document.getElementById('softmax-info');

// Control sections
const leakyReluAlphaControl = document.getElementById('leaky-relu-alpha-control');
const softmaxInputsControl = document.getElementById('softmax-inputs-control');
const xInputControl = document.getElementById('x-input-control');

// State variables
let currentFunction = 'sigmoid';
let chart;
let alpha = 0.1;

// Initialize the graph
initializeGraph();

// Event listeners
sigmoidBtn.addEventListener('click', () => setActiveFunction('sigmoid'));
reluBtn.addEventListener('click', () => setActiveFunction('relu'));
leakyReluBtn.addEventListener('click', () => setActiveFunction('leakyRelu'));
tanhBtn.addEventListener('click', () => setActiveFunction('tanh'));
softmaxBtn.addEventListener('click', () => setActiveFunction('softmax'));

xInputSlider.addEventListener('input', handleXInputChange);
xInput.addEventListener('input', handleXInputChange);
xMin.addEventListener('change', updateGraph);
xMax.addEventListener('change', updateGraph);
alphaSlider.addEventListener('input', handleAlphaChange);

z1Input.addEventListener('input', updateSoftmaxOutput);
z2Input.addEventListener('input', updateSoftmaxOutput);
z3Input.addEventListener('input', updateSoftmaxOutput);

// Function to initialize the graph
function initializeGraph() {
    const ctx = activationGraph.getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Sigmoid',
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'x'
                    },
                    min: -5,
                    max: 5
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'f(x)'
                    },
                    min: -1.5,
                    max: 1.5
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `f(${context.parsed.x.toFixed(2)}) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        }
    });
    
    updateGraph();
}

// Function to set the active function
function setActiveFunction(functionName) {
    currentFunction = functionName;
    
    // Update active button
    [sigmoidBtn, reluBtn, leakyReluBtn, tanhBtn, softmaxBtn].forEach(btn => btn.classList.remove('active'));
    
    // Update info display
    [sigmoidInfo, reluInfo, leakyReluInfo, tanhInfo, softmaxInfo].forEach(info => info.style.display = 'none');
    
    // Hide all special controls
    leakyReluAlphaControl.style.display = 'none';
    softmaxInputsControl.style.display = 'none';
    xInputControl.style.display = 'block';
    
    // Set active function
    switch(functionName) {
        case 'sigmoid':
            sigmoidBtn.classList.add('active');
            sigmoidInfo.style.display = 'block';
            chart.data.datasets[0].label = 'Sigmoid';
            break;
        case 'relu':
            reluBtn.classList.add('active');
            reluInfo.style.display = 'block';
            chart.data.datasets[0].label = 'ReLU';
            break;
        case 'leakyRelu':
            leakyReluBtn.classList.add('active');
            leakyReluInfo.style.display = 'block';
            leakyReluAlphaControl.style.display = 'block';
            chart.data.datasets[0].label = 'Leaky ReLU';
            break;
        case 'tanh':
            tanhBtn.classList.add('active');
            tanhInfo.style.display = 'block';
            chart.data.datasets[0].label = 'Tanh';
            break;
        case 'softmax':
            softmaxBtn.classList.add('active');
            softmaxInfo.style.display = 'block';
            softmaxInputsControl.style.display = 'block';
            xInputControl.style.display = 'none';
            chart.data.datasets[0].label = 'Softmax';
            updateSoftmaxOutput();
            break;
    }
    
    updateGraph();
}

// Function to update the graph based on current settings
function updateGraph() {
    const min = parseFloat(xMin.value);
    const max = parseFloat(xMax.value);
    
    // Update slider range
    xInputSlider.min = min;
    xInputSlider.max = max;
    
    // Generate data points
    const data = [];
    const step = (max - min) / 100;
    
    for (let x = min; x <= max; x += step) {
        const y = calculateOutput(x);
        data.push({x, y});
    }
    
    // Update chart data
    chart.data.datasets[0].data = data;
    
    // Update chart scales
    chart.options.scales.x.min = min;
    chart.options.scales.x.max = max;
    
    // Adjust y-axis based on function
    if (currentFunction === 'relu' || currentFunction === 'leakyRelu') {
        chart.options.scales.y.min = -1;
        chart.options.scales.y.max = Math.max(5, max);
    } else if (currentFunction === 'sigmoid') {
        chart.options.scales.y.min = -0.1;
        chart.options.scales.y.max = 1.1;
    } else if (currentFunction === 'tanh') {
        chart.options.scales.y.min = -1.1;
        chart.options.scales.y.max = 1.1;
    } else if (currentFunction === 'softmax') {
        chart.options.scales.y.min = -0.1;
        chart.options.scales.y.max = 1.1;
    }
    
    chart.update();
    
    // Update output value for current x
    if (currentFunction !== 'softmax') {
        const x = parseFloat(xInput.value);
        const output = calculateOutput(x);
        outputValue.textContent = output.toFixed(4);
    }
}

// Function to calculate the output based on the current function
function calculateOutput(x) {
    switch(currentFunction) {
        case 'sigmoid':
            return 1 / (1 + Math.exp(-x));
        case 'relu':
            return Math.max(0, x);
        case 'leakyRelu':
            return x > 0 ? x : alpha * x;
        case 'tanh':
            return Math.tanh(x);
        default:
            return 0;
    }
}

// Function to handle x input changes
function handleXInputChange(e) {
    const value = parseFloat(e.target.value);
    
    // Update both slider and input field
    if (e.target === xInputSlider) {
        xInput.value = value;
    } else {
        xInputSlider.value = value;
    }
    
    // Calculate and update output
    const output = calculateOutput(value);
    outputValue.textContent = output.toFixed(4);
    
    // Add a point to highlight current position
    const currentData = chart.data.datasets[0].data;
    
    // Update chart with highlight point
    chart.update();
}

// Function to handle alpha changes for Leaky ReLU
function handleAlphaChange() {
    alpha = parseFloat(alphaSlider.value);
    alphaDisplay.textContent = alpha.toFixed(2);
    updateGraph();
}

// Function to calculate and update softmax output
function updateSoftmaxOutput() {
    const z1 = parseFloat(z1Input.value);
    const z2 = parseFloat(z2Input.value);
    const z3 = parseFloat(z3Input.value);
    
    const expZ1 = Math.exp(z1);
    const expZ2 = Math.exp(z2);
    const expZ3 = Math.exp(z3);
    const sum = expZ1 + expZ2 + expZ3;
    
    const softmax1 = expZ1 / sum;
    const softmax2 = expZ2 / sum;
    const softmax3 = expZ3 / sum;
    
    // Generate data for visualization
    const data = [
        {x: 1, y: softmax1},
        {x: 2, y: softmax2},
        {x: 3, y: softmax3}
    ];
    
    // Update chart data
    chart.data.datasets[0].data = data;
    chart.options.scales.x.min = 0.5;
    chart.options.scales.x.max = 3.5;
    chart.update();
    
    // Display the softmax values
    outputValue.innerHTML = `[${softmax1.toFixed(4)}, ${softmax2.toFixed(4)}, ${softmax3.toFixed(4)}]`;
}
