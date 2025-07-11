// DOM Elements - Input Values
const valueASlider = document.getElementById('value-a-slider');
const valueBSlider = document.getElementById('value-b-slider');

const valueADisplay = document.getElementById('value-a-display');
const valueBDisplay = document.getElementById('value-b-display');

const valueA = document.getElementById('value-a');
const valueB = document.getElementById('value-b');

const valueAMeterFill = document.getElementById('value-a-meter-fill');
const valueBMeterFill = document.getElementById('value-b-meter-fill');

// DOM Elements - Means
const arithmeticMean = document.getElementById('arithmetic-mean');
const geometricMean = document.getElementById('geometric-mean');
const harmonicMean = document.getElementById('harmonic-mean');
const quadraticMean = document.getElementById('quadratic-mean');

const arithmeticMeterFill = document.getElementById('arithmetic-meter-fill');
const geometricMeterFill = document.getElementById('geometric-meter-fill');
const harmonicMeterFill = document.getElementById('harmonic-meter-fill');
const quadraticMeterFill = document.getElementById('quadratic-meter-fill');

// Initialize values
let inputA = 0.5;
let inputB = 0.5;

// Event listeners for sliders
valueASlider.addEventListener('input', handleSliderChange);
valueBSlider.addEventListener('input', handleSliderChange);

// Initial update
updateDisplays();

// Handler for slider changes
function handleSliderChange() {
    // Get values from sliders (convert from 0-100 to 0-1)
    inputA = parseInt(valueASlider.value) / 100;
    inputB = parseInt(valueBSlider.value) / 100;
    
    // Update displays
    updateDisplays();
}

// Calculate different means of the two input values
function calculateMeans() {
    // Arithmetic Mean
    const am = (inputA + inputB) / 2;
    
    // Geometric Mean
    const gm = inputA === 0 || inputB === 0 ? 0 : Math.sqrt(inputA * inputB);
    
    // Harmonic Mean
    const hm = inputA === 0 && inputB === 0 ? 0 : 2 * (inputA * inputB) / (inputA + inputB);
    
    // Quadratic Mean (Root Mean Square)
    const qm = Math.sqrt((Math.pow(inputA, 2) + Math.pow(inputB, 2)) / 2);
    
    return { am, gm, hm, qm };
}

// Update all displays with current values
function updateDisplays() {
    // Update input value displays
    valueADisplay.textContent = inputA.toFixed(2);
    valueBDisplay.textContent = inputB.toFixed(2);
    
    // Update input value text
    valueA.textContent = inputA.toFixed(2);
    valueB.textContent = inputB.toFixed(2);
    
    // Update input meters
    valueAMeterFill.style.width = `${inputA * 100}%`;
    valueBMeterFill.style.width = `${inputB * 100}%`;
    
    // Calculate means
    const means = calculateMeans();
    
    // Update means values
    arithmeticMean.textContent = means.am.toFixed(2);
    geometricMean.textContent = means.gm.toFixed(2);
    harmonicMean.textContent = means.hm.toFixed(2);
    quadraticMean.textContent = means.qm.toFixed(2);
    
    // Update means meters
    arithmeticMeterFill.style.width = `${means.am * 100}%`;
    geometricMeterFill.style.width = `${means.gm * 100}%`;
    harmonicMeterFill.style.width = `${means.hm * 100}%`;
    quadraticMeterFill.style.width = `${means.qm * 100}%`;
}
