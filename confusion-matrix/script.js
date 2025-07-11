// DOM Elements
const tpSlider = document.getElementById('tp-slider');
const fpSlider = document.getElementById('fp-slider');
const tnSlider = document.getElementById('tn-slider');
const fnSlider = document.getElementById('fn-slider');
const precisionSlider = document.getElementById('precision-slider');
const recallSlider = document.getElementById('recall-slider');

const tpDisplay = document.getElementById('tp-display');
const fpDisplay = document.getElementById('fp-display');
const tnDisplay = document.getElementById('tn-display');
const fnDisplay = document.getElementById('fn-display');
const precisionDisplay = document.getElementById('precision-display');
const recallDisplay = document.getElementById('recall-display');
const f1ScoreDisplay = document.getElementById('f1-score');
const f1MeterFill = document.getElementById('f1-meter-fill');

const tpValue = document.getElementById('tp-value');
const fpValue = document.getElementById('fp-value');
const tnValue = document.getElementById('tn-value');
const fnValue = document.getElementById('fn-value');

// State variables
let isUpdatingFromLayer1 = false;
let isUpdatingFromLayer2 = false;

// Initialize values
let tp = 50;
let fp = 50;
let tn = 50;
let fn = 50;
let precision = 0.5;
let recall = 0.5;
let f1Score = 0.5;

// Event listeners for Layer 1 sliders (Confusion Matrix Elements)
tpSlider.addEventListener('input', handleLayer1Change);
fpSlider.addEventListener('input', handleLayer1Change);
tnSlider.addEventListener('input', handleLayer1Change);
fnSlider.addEventListener('input', handleLayer1Change);

// Event listeners for Layer 2 sliders (Derived Metrics)
precisionSlider.addEventListener('input', handleLayer2Change);
recallSlider.addEventListener('input', handleLayer2Change);

// Initial update
updateDisplays();

// Handler for Layer 1 slider changes (TP, FP, TN, FN)
function handleLayer1Change() {
    if (isUpdatingFromLayer2) return;
    
    isUpdatingFromLayer1 = true;
    
    // Get values from sliders
    tp = parseInt(tpSlider.value);
    fp = parseInt(fpSlider.value);
    tn = parseInt(tnSlider.value);
    fn = parseInt(fnSlider.value);
    
    // Calculate derived metrics
    calculateDerivedMetrics();
    
    // Update displays
    updateDisplays();
    
    // Update Layer 2 sliders
    updateLayer2Sliders();
    
    isUpdatingFromLayer1 = false;
}

// Handler for Layer 2 slider changes (Precision, Recall)
function handleLayer2Change() {
    if (isUpdatingFromLayer1) return;
    
    isUpdatingFromLayer2 = true;
    
    // Get values from sliders
    precision = parseInt(precisionSlider.value) / 100;
    recall = parseInt(recallSlider.value) / 100;
    
    // Calculate F1 Score
    calculateF1Score();
    
    // Adjust TP, FP, FN to match Precision and Recall
    // We'll keep TP constant and adjust FP and FN
    adjustConfusionMatrix();
    
    // Update displays
    updateDisplays();
    
    // Update Layer 1 sliders
    updateLayer1Sliders();
    
    isUpdatingFromLayer2 = false;
}

// Calculate Precision, Recall, and F1 Score from TP, FP, TN, FN
function calculateDerivedMetrics() {
    // Avoid division by zero
    precision = tp === 0 && fp === 0 ? 0 : tp / (tp + fp);
    recall = tp === 0 && fn === 0 ? 0 : tp / (tp + fn);
    
    calculateF1Score();
}

// Calculate F1 Score from Precision and Recall
function calculateF1Score() {
    // Avoid division by zero
    f1Score = precision === 0 && recall === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
}

// Adjust TP, FP, FN to match Precision and Recall
function adjustConfusionMatrix() {
    // Keep TP constant at its current value
    // Adjust FP to match Precision: FP = TP * (1 - Precision) / Precision
    if (precision === 0) {
        fp = 100; // Maximum value if precision is 0
    } else {
        fp = Math.round(tp * (1 - precision) / precision);
        fp = Math.min(Math.max(fp, 0), 100); // Clamp between 0 and 100
    }
    
    // Adjust FN to match Recall: FN = TP * (1 - Recall) / Recall
    if (recall === 0) {
        fn = 100; // Maximum value if recall is 0
    } else {
        fn = Math.round(tp * (1 - recall) / recall);
        fn = Math.min(Math.max(fn, 0), 100); // Clamp between 0 and 100
    }
    
    // TN can remain unchanged as it doesn't affect Precision or Recall
}

// Update all displays with current values
function updateDisplays() {
    // Update Layer 1 displays
    tpDisplay.textContent = tp;
    fpDisplay.textContent = fp;
    tnDisplay.textContent = tn;
    fnDisplay.textContent = fn;
    
    // Update confusion matrix cell values
    tpValue.textContent = tp;
    fpValue.textContent = fp;
    tnValue.textContent = tn;
    fnValue.textContent = fn;
    
    // Update Layer 2 displays
    precisionDisplay.textContent = precision.toFixed(2);
    recallDisplay.textContent = recall.toFixed(2);
    
    // Update F1 Score display
    f1ScoreDisplay.textContent = f1Score.toFixed(2);
    
    // Update F1 meter
    f1MeterFill.style.width = `${f1Score * 100}%`;
}

// Update Layer 1 sliders to match current values
function updateLayer1Sliders() {
    tpSlider.value = tp;
    fpSlider.value = fp;
    tnSlider.value = tn;
    fnSlider.value = fn;
}

// Update Layer 2 sliders to match current values
function updateLayer2Sliders() {
    precisionSlider.value = Math.round(precision * 100);
    recallSlider.value = Math.round(recall * 100);
}
