// Data Types Configuration
const dataTypes = {
    floating: {
        float64: {
            name: 'float64 (double)',
            platform: 'CPU/GPU',
            bits: 64,
            signBits: 1,
            exponentBits: 11,
            mantissaBits: 52,
            range: '±1.8e308',
            precision: '15-17 digits',
            memory: 8,
            description: 'Double precision floating point, standard for scientific computing',
            useCases: ['Scientific computing', 'High precision calculations', 'Default in many languages']
        },
        float32: {
            name: 'float32 (single)',
            platform: 'CPU/GPU',
            bits: 32,
            signBits: 1,
            exponentBits: 8,
            mantissaBits: 23,
            range: '±3.4e38',
            precision: '6-9 digits',
            memory: 4,
            description: 'Single precision floating point, balance of precision and performance',
            useCases: ['Deep learning', 'Graphics', 'General purpose computing']
        },
        float16: {
            name: 'float16 (half)',
            platform: 'GPU',
            bits: 16,
            signBits: 1,
            exponentBits: 5,
            mantissaBits: 10,
            range: '±65504',
            precision: '3-4 digits',
            memory: 2,
            description: 'Half precision floating point, memory efficient for ML',
            useCases: ['Deep learning inference', 'Mobile AI', 'Memory-constrained applications']
        },
        bfloat16: {
            name: 'bfloat16 (Brain Float)',
            platform: 'TPU/GPU',
            bits: 16,
            signBits: 1,
            exponentBits: 8,
            mantissaBits: 7,
            range: '±3.4e38',
            precision: '2-3 digits',
            memory: 2,
            description: 'Google\'s Brain Float, same range as float32 but less precision',
            useCases: ['ML training', 'TPU computing', 'Neural networks']
        }
    },
    integer: {
        int8: {
            name: 'int8',
            platform: 'CPU/GPU',
            bits: 8,
            range: '-128 to 127',
            precision: 'Exact',
            memory: 1,
            description: '8-bit signed integer',
            useCases: ['Quantized models', 'Image processing', 'Embedded systems']
        },
        uint8: {
            name: 'uint8',
            platform: 'CPU/GPU',
            bits: 8,
            range: '0 to 255',
            precision: 'Exact',
            memory: 1,
            description: '8-bit unsigned integer',
            useCases: ['Image pixels', 'Quantized weights', 'Data compression']
        },
        int16: {
            name: 'int16',
            platform: 'CPU/GPU',
            bits: 16,
            range: '-32,768 to 32,767',
            precision: 'Exact',
            memory: 2,
            description: '16-bit signed integer',
            useCases: ['Audio processing', 'Intermediate calculations', 'Fixed-point arithmetic']
        },
        int32: {
            name: 'int32',
            platform: 'CPU/GPU',
            bits: 32,
            range: '±2.1e9',
            precision: 'Exact',
            memory: 4,
            description: '32-bit signed integer',
            useCases: ['General computing', 'Array indices', 'Counters']
        },
        int64: {
            name: 'int64',
            platform: 'CPU/GPU',
            bits: 64,
            range: '±9.2e18',
            precision: 'Exact',
            memory: 8,
            description: '64-bit signed integer',
            useCases: ['Large datasets', 'Timestamps', 'High precision counting']
        }
    },
    specialized: {
        complex64: {
            name: 'complex64',
            platform: 'CPU/GPU',
            bits: 64,
            range: 'Two float32 values',
            precision: '6-9 digits each',
            memory: 8,
            description: 'Complex number with two float32 components',
            useCases: ['Signal processing', 'Fourier transforms', 'Scientific computing']
        },
        complex128: {
            name: 'complex128',
            platform: 'CPU/GPU',
            bits: 128,
            range: 'Two float64 values',
            precision: '15-17 digits each',
            memory: 16,
            description: 'Complex number with two float64 components',
            useCases: ['High precision signal processing', 'Mathematical computations']
        },
        bool: {
            name: 'bool',
            platform: 'CPU/GPU',
            bits: 8,
            range: 'True/False',
            precision: 'Exact',
            memory: 1,
            description: 'Boolean value (typically stored as 8-bit)',
            useCases: ['Masks', 'Conditions', 'Flags']
        }
    }
};

// Global state
let currentCategory = 'floating';
let selectedDataType = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    populateSelectors();
    displayDataTypes(currentCategory);
    createComparisonTable();
    createRangeBars();
});

function initializeEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.id.replace('-btn', '');
            displayDataTypes(currentCategory);
        });
    });

    // Precision testing
    document.getElementById('test-precision-btn').addEventListener('click', testPrecision);



    // Memory calculation
    document.getElementById('calculate-memory-btn').addEventListener('click', calculateMemory);
}

function populateSelectors() {
    // No selectors needed anymore - all visualizations show all data types
}

function displayDataTypes(category) {
    const grid = document.getElementById('data-types-grid');
    grid.innerHTML = '';

    Object.entries(dataTypes[category]).forEach(([key, type]) => {
        const card = createDataTypeCard(key, type);
        grid.appendChild(card);
    });
}

function createDataTypeCard(key, type) {
    const card = document.createElement('div');
    card.className = 'data-type-card';
    card.dataset.type = key;
    
    card.innerHTML = `
        <div class="data-type-header">
            <div class="data-type-name">${type.name}</div>
            <div class="data-type-platform">${type.platform}</div>
        </div>
        <div class="data-type-specs">
            <div class="spec-item">
                <div class="spec-label">Bits</div>
                <div class="spec-value">${type.bits}</div>
            </div>
            <div class="spec-item">
                <div class="spec-label">Memory</div>
                <div class="spec-value">${type.memory} bytes</div>
            </div>
            <div class="spec-item">
                <div class="spec-label">Range</div>
                <div class="spec-value">${type.range}</div>
            </div>
            <div class="spec-item">
                <div class="spec-label">Precision</div>
                <div class="spec-value">${type.precision}</div>
            </div>
        </div>
        <div class="data-type-description">${type.description}</div>
    `;

    return card;
}

function createComparisonTable() {
    const container = document.getElementById('comparison-table-container');
    
    // Get all data types
    const allTypes = [];
    Object.keys(dataTypes).forEach(category => {
        Object.keys(dataTypes[category]).forEach(typeKey => {
            allTypes.push({
                key: typeKey,
                ...dataTypes[category][typeKey],
                category: category
            });
        });
    });

    // Sort by category and then by bits for better organization
    allTypes.sort((a, b) => {
        if (a.category !== b.category) {
            const categoryOrder = { floating: 0, integer: 1, specialized: 2 };
            return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return a.bits - b.bits;
    });

    // Create table
    const table = document.createElement('table');
    table.className = 'comparison-table';
    
    // Create header with properties as columns
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const comparisonProperties = [
        { key: 'name', label: 'Data Type' },
        { key: 'bits', label: 'Size (bits)' },
        { key: 'memory', label: 'Memory (bytes)' },
        { key: 'range', label: 'Range' },
        { key: 'precision', label: 'Precision' },
        { key: 'platform', label: 'Platform' }
    ];
    
    comparisonProperties.forEach(prop => {
        const th = document.createElement('th');
        th.textContent = prop.label;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with data types as rows
    const tbody = document.createElement('tbody');
    
    allTypes.forEach(type => {
        const row = document.createElement('tr');
        
        comparisonProperties.forEach(prop => {
            const cell = document.createElement('td');
            
            if (prop.key === 'name') {
                cell.innerHTML = `<span class="data-type-header">${type.name}</span>`;
                cell.classList.add('data-type-name-cell');
            } else if (prop.key === 'platform') {
                cell.innerHTML = `<span class="platform-tag">${type[prop.key]}</span>`;
            } else {
                cell.textContent = type[prop.key];
            }
            
            row.appendChild(cell);
        });
        
        // Add category class to the row for styling
        row.classList.add(`row-${type.category}`);
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
}

function testPrecision() {
    const testValue = parseFloat(document.getElementById('test-value').value);
    const resultsGrid = document.getElementById('precision-results-grid');
    
    if (isNaN(testValue)) {
        resultsGrid.innerHTML = '<p style="color: #ff6b6b; text-align: center; grid-column: 1 / -1;">Please enter a valid number</p>';
        return;
    }
    
    resultsGrid.innerHTML = '';
    
    // Get all data types and create cards for each
    const allTypes = [];
    Object.keys(dataTypes).forEach(category => {
        Object.keys(dataTypes[category]).forEach(typeKey => {
            allTypes.push({
                key: typeKey,
                ...dataTypes[category][typeKey],
                category: category
            });
        });
    });
    
    // Sort by category and then by bits for better organization
    allTypes.sort((a, b) => {
        if (a.category !== b.category) {
            const categoryOrder = { floating: 0, integer: 1, specialized: 2 };
            return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return a.bits - b.bits;
    });
    
    allTypes.forEach(type => {
        const card = createPrecisionCard(type, testValue);
        resultsGrid.appendChild(card);
    });
}

function createPrecisionCard(type, testValue) {
    const card = document.createElement('div');
    card.className = 'precision-result-card';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'precision-card-header';
    
    const typeName = document.createElement('div');
    typeName.className = 'precision-type-name';
    typeName.textContent = type.name;
    
    const typeCategory = document.createElement('div');
    typeCategory.className = 'precision-type-category';
    typeCategory.textContent = type.category;
    
    header.appendChild(typeName);
    header.appendChild(typeCategory);
    card.appendChild(header);
    
    // Create binary representation
    const binaryDiv = document.createElement('div');
    binaryDiv.className = 'precision-binary';
    
    // Create analysis
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'precision-analysis';
    
    if (type.exponentBits) {
        // Floating point analysis
        const binary = floatToBinary(testValue, type);
        const approximateValue = simulateFloatPrecision(testValue, type);
        const error = Math.abs(testValue - approximateValue);
        const relativeError = testValue !== 0 ? (error / Math.abs(testValue)) * 100 : 0;
        
        binaryDiv.innerHTML = `
            <div>Original: ${testValue}</div>
            <div>Stored: ${approximateValue}</div>
            <div style="margin-top: 8px;">
                <span class="bit-group sign-bit">${binary.sign}</span>
                <span class="bit-group exponent-bits">${binary.exponent}</span>
                <span class="bit-group mantissa-bits">${binary.mantissa}</span>
            </div>
            <div style="margin-top: 5px; font-size: 0.75rem; opacity: 0.8;">
                <span style="color: #ff6b6b;">S</span> | 
                <span style="color: #51cf66;">Exp(${type.exponentBits})</span> | 
                <span style="color: #339af0;">Man(${type.mantissaBits})</span>
            </div>
        `;
        
        const errorClass = relativeError < 0.001 ? 'precision-good' : 
                          relativeError < 1 ? 'precision-warning' : 'precision-error';
        
        analysisDiv.innerHTML = `
            <div class="precision-stat">
                <div class="precision-stat-label">Absolute Error</div>
                <div class="precision-stat-value ${errorClass}">${error.toExponential(2)}</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">Relative Error</div>
                <div class="precision-stat-value ${errorClass}">${relativeError.toFixed(4)}%</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">Precision</div>
                <div class="precision-stat-value">${type.precision}</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">Range</div>
                <div class="precision-stat-value">${type.range}</div>
            </div>
        `;
    } else {
        // Integer analysis
        const intValue = Math.round(testValue);
        const inRange = checkIntegerRange(intValue, type);
        const truncated = testValue !== intValue;
        
        binaryDiv.innerHTML = `
            <div>Original: ${testValue}</div>
            <div>Stored: ${inRange ? intValue : 'OVERFLOW'}</div>
            <div style="margin-top: 8px;">
                ${inRange ? intValue.toString(2).padStart(Math.min(type.bits, 32), '0') : 'OVERFLOW'}
            </div>
            <div style="margin-top: 5px; font-size: 0.75rem; opacity: 0.8;">
                ${type.bits}-bit ${type.name.includes('u') ? 'unsigned' : 'signed'} integer
            </div>
        `;
        
        const truncationClass = truncated ? 'precision-warning' : 'precision-good';
        const rangeClass = inRange ? 'precision-good' : 'precision-error';
        
        analysisDiv.innerHTML = `
            <div class="precision-stat">
                <div class="precision-stat-label">Truncation</div>
                <div class="precision-stat-value ${truncationClass}">${truncated ? 'Yes' : 'No'}</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">In Range</div>
                <div class="precision-stat-value ${rangeClass}">${inRange ? 'Yes' : 'No'}</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">Loss</div>
                <div class="precision-stat-value">${Math.abs(testValue - intValue).toFixed(6)}</div>
            </div>
            <div class="precision-stat">
                <div class="precision-stat-label">Range</div>
                <div class="precision-stat-value">${type.range}</div>
            </div>
        `;
    }
    
    card.appendChild(binaryDiv);
    card.appendChild(analysisDiv);
    
    return card;
}

function createRangeBars() {
    const container = document.getElementById('range-bars-container');
    container.innerHTML = '';
    
    // Get all data types and calculate their ranges
    const allTypes = [];
    Object.keys(dataTypes).forEach(category => {
        Object.keys(dataTypes[category]).forEach(typeKey => {
            const type = {
                key: typeKey,
                ...dataTypes[category][typeKey],
                category: category
            };
            
            // Calculate numerical range for comparison
            type.numericRange = calculateNumericRange(type);
            allTypes.push(type);
        });
    });
    
    // Sort by range size (largest to smallest)
    allTypes.sort((a, b) => b.numericRange - a.numericRange);
    
    // Find max range for scaling
    const maxRange = Math.max(...allTypes.map(t => t.numericRange));
    
    // Create bar for each data type
    allTypes.forEach(type => {
        const barItem = createRangeBarItem(type, maxRange);
        container.appendChild(barItem);
    });
}

function calculateNumericRange(type) {
    // Convert range strings to numeric values for comparison
    const rangeStr = type.range.toLowerCase();
    
    if (rangeStr.includes('±')) {
        // Symmetric range like ±3.4e38
        const value = rangeStr.replace('±', '').trim();
        if (value.includes('e')) {
            const [base, exp] = value.split('e');
            return 2 * parseFloat(base) * Math.pow(10, parseInt(exp));
        }
        return 2 * parseFloat(value);
    } else if (rangeStr.includes(' to ')) {
        // Range like "-128 to 127"
        const [min, max] = rangeStr.split(' to ').map(s => {
            const num = s.replace(/,/g, '').trim();
            if (num.includes('e')) {
                const [base, exp] = num.split('e');
                return parseFloat(base) * Math.pow(10, parseInt(exp));
            }
            return parseFloat(num);
        });
        return Math.abs(max - min);
    } else if (rangeStr.includes('true/false')) {
        return 2; // Boolean has 2 possible values
    } else if (rangeStr.includes('float')) {
        // Complex types - use component range
        return 2 * 3.4e38; // Assume float32 components
    }
    
    // Default fallback
    return Math.pow(2, type.bits || 8);
}

function createRangeBarItem(type, maxRange) {
    const item = document.createElement('div');
    item.className = 'range-bar-item';
    
    // Label
    const label = document.createElement('div');
    label.className = 'range-bar-label';
    label.textContent = type.name;
    
    // Visual bar
    const visual = document.createElement('div');
    visual.className = 'range-bar-visual';
    
    const fill = document.createElement('div');
    fill.className = `range-bar-fill ${type.category}`;
    
    // Calculate width percentage using logarithmic scale for better visualization
    const logRange = Math.log10(Math.max(type.numericRange, 1));
    const logMaxRange = Math.log10(Math.max(maxRange, 1));
    const widthPercent = (logRange / logMaxRange) * 100;
    
    fill.style.width = `${Math.max(widthPercent, 5)}%`; // Minimum 5% for visibility
    fill.textContent = `${type.bits} bits`;
    
    visual.appendChild(fill);
    
    // Value display with exponential notation
    const value = document.createElement('div');
    value.className = 'range-bar-value';
    
    // Calculate order of magnitude
    const magnitude = Math.floor(Math.log10(Math.max(type.numericRange, 1)));
    let exponentialDisplay = '';
    
    if (type.numericRange >= 1e6) {
        exponentialDisplay = `≈ 10^${magnitude}`;
    } else if (type.numericRange >= 1000) {
        exponentialDisplay = `≈ ${(type.numericRange / 1000).toFixed(1)}K`;
    } else {
        exponentialDisplay = `${type.numericRange}`;
    }
    
    value.innerHTML = `
        ${type.range}<br>
        <small>${exponentialDisplay}</small><br>
        <small style="color: #999; font-size: 0.75rem;">log₁₀: ${magnitude}</small>
    `;
    
    item.appendChild(label);
    item.appendChild(visual);
    item.appendChild(value);
    
    return item;
}

function calculateMemory() {
    const arraySize = parseInt(document.getElementById('array-size').value);
    const resultsGrid = document.getElementById('memory-results-grid');
    
    if (!arraySize || arraySize <= 0) {
        resultsGrid.innerHTML = '<p style="color: #ff6b6b; text-align: center; grid-column: 1 / -1;">Please enter a valid array size</p>';
        return;
    }
    
    resultsGrid.innerHTML = '';
    
    // Get all data types and calculate memory for each
    const allTypes = [];
    Object.keys(dataTypes).forEach(category => {
        Object.keys(dataTypes[category]).forEach(typeKey => {
            allTypes.push({
                key: typeKey,
                ...dataTypes[category][typeKey],
                category: category
            });
        });
    });
    
    // Sort by category and then by memory size
    allTypes.sort((a, b) => {
        if (a.category !== b.category) {
            const categoryOrder = { floating: 0, integer: 1, specialized: 2 };
            return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return a.memory - b.memory;
    });
    
    // Find the largest memory usage for comparison
    const maxMemory = Math.max(...allTypes.map(t => t.memory * arraySize));
    
    // Create card for each data type
    allTypes.forEach(type => {
        const card = createMemoryCard(type, arraySize, maxMemory);
        resultsGrid.appendChild(card);
    });
}

function createMemoryCard(type, arraySize, maxMemory) {
    const card = document.createElement('div');
    card.className = 'memory-result-card';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'memory-card-header';
    
    const typeName = document.createElement('div');
    typeName.className = 'memory-type-name';
    typeName.textContent = type.name;
    
    const typeCategory = document.createElement('div');
    typeCategory.className = 'memory-type-category';
    typeCategory.textContent = type.category;
    
    header.appendChild(typeName);
    header.appendChild(typeCategory);
    card.appendChild(header);
    
    // Calculate memory usage
    const totalBytes = arraySize * type.memory;
    const kb = totalBytes / 1024;
    const mb = totalBytes / (1024 * 1024);
    const gb = totalBytes / (1024 * 1024 * 1024);
    
    // Create memory breakdown
    const breakdown = document.createElement('div');
    breakdown.className = 'memory-breakdown';
    
    const memoryItems = [
        { value: totalBytes.toLocaleString(), label: 'Bytes' },
        { value: kb.toFixed(2), label: 'KB' },
        { value: mb.toFixed(2), label: 'MB' },
        { value: gb.toFixed(4), label: 'GB' }
    ];
    
    memoryItems.forEach(item => {
        const memoryItem = document.createElement('div');
        memoryItem.className = 'memory-item';
        
        const value = document.createElement('div');
        value.className = 'memory-value';
        value.textContent = item.value;
        
        const label = document.createElement('div');
        label.className = 'memory-label';
        label.textContent = item.label;
        
        memoryItem.appendChild(value);
        memoryItem.appendChild(label);
        breakdown.appendChild(memoryItem);
    });
    
    card.appendChild(breakdown);
    
    // Add efficiency comparison
    const efficiency = document.createElement('div');
    efficiency.className = 'memory-efficiency';
    
    const bytesPerElement = type.memory;
    const efficiencyRatio = (maxMemory / totalBytes);
    
    let efficiencyText = '';
    if (efficiencyRatio > 4) {
        efficiencyText = `🟢 Very efficient: ${efficiencyRatio.toFixed(1)}x less memory than largest type`;
    } else if (efficiencyRatio > 2) {
        efficiencyText = `🟡 Efficient: ${efficiencyRatio.toFixed(1)}x less memory than largest type`;
    } else if (efficiencyRatio === 1) {
        efficiencyText = `🔴 Largest memory usage`;
    } else {
        efficiencyText = `${bytesPerElement} bytes per element`;
    }
    
    efficiency.innerHTML = `
        <strong>Efficiency:</strong> ${efficiencyText}<br>
        <strong>Per element:</strong> ${bytesPerElement} bytes
    `;
    
    card.appendChild(efficiency);
    
    return card;
}

// Helper functions
function findDataType(key) {
    for (const category of Object.values(dataTypes)) {
        if (category[key]) return category[key];
    }
    return null;
}

function floatToBinary(value, dataType) {
    // Simplified binary representation for demonstration
    const buffer = new ArrayBuffer(dataType.memory);
    const view = new DataView(buffer);
    
    if (dataType.memory === 4) {
        view.setFloat32(0, value);
        const bits = view.getUint32(0);
        return {
            sign: (bits >>> 31).toString(),
            exponent: ((bits >>> 23) & 0xFF).toString(2).padStart(8, '0'),
            mantissa: (bits & 0x7FFFFF).toString(2).padStart(23, '0')
        };
    } else if (dataType.memory === 8) {
        view.setFloat64(0, value);
        const high = view.getUint32(0);
        const low = view.getUint32(4);
        return {
            sign: (high >>> 31).toString(),
            exponent: ((high >>> 20) & 0x7FF).toString(2).padStart(11, '0'),
            mantissa: ((high & 0xFFFFF).toString(2).padStart(20, '0') + 
                      low.toString(2).padStart(32, '0'))
        };
    }
    return { sign: '0', exponent: '0', mantissa: '0' };
}

function binaryToFloat(binary, dataType) {
    // Simplified conversion for demonstration
    return parseFloat(document.getElementById('test-value').value);
}

function simulateFloatPrecision(value, dataType) {
    // Simulate precision loss based on data type
    if (dataType.key === 'float64') {
        return value; // Double precision, minimal loss for most values
    } else if (dataType.key === 'float32') {
        // Single precision simulation
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, value);
        return view.getFloat32(0);
    } else if (dataType.key === 'float16') {
        // Half precision simulation (approximate)
        const sign = value < 0 ? -1 : 1;
        const absValue = Math.abs(value);
        
        if (absValue === 0) return 0;
        if (absValue > 65504) return sign * Infinity; // Overflow
        if (absValue < 6.103515625e-5) return sign * 0; // Underflow
        
        // Approximate float16 precision
        const precision = Math.pow(2, -10); // ~10 bits of precision
        const rounded = Math.round(absValue / precision) * precision;
        return sign * rounded;
    } else if (dataType.key === 'bfloat16') {
        // bfloat16 simulation (approximate)
        const sign = value < 0 ? -1 : 1;
        const absValue = Math.abs(value);
        
        if (absValue === 0) return 0;
        if (absValue > 3.4e38) return sign * Infinity; // Same range as float32
        if (absValue < 1.175494e-38) return sign * 0; // Underflow
        
        // Approximate bfloat16 precision (7 bits mantissa)
        const precision = Math.pow(2, -7);
        const exponent = Math.floor(Math.log2(absValue));
        const mantissa = absValue / Math.pow(2, exponent);
        const roundedMantissa = Math.round(mantissa / precision) * precision;
        return sign * roundedMantissa * Math.pow(2, exponent);
    }
    
    return value;
}

function checkIntegerRange(value, dataType) {
    const ranges = {
        int8: { min: -128, max: 127 },
        uint8: { min: 0, max: 255 },
        int16: { min: -32768, max: 32767 },
        int32: { min: -2147483648, max: 2147483647 },
        int64: { min: -9223372036854775808, max: 9223372036854775807 },
        bool: { min: 0, max: 1 }
    };
    
    const range = ranges[dataType.key];
    if (!range) return true; // Unknown type, assume in range
    
    return value >= range.min && value <= range.max;
}

function drawRangeVisualization(ctx, dataType, width, height) {
    const centerY = height / 2;
    const margin = 50;
    const lineWidth = width - 2 * margin;

    // Draw main line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, centerY);
    ctx.lineTo(width - margin, centerY);
    ctx.stroke();

    // Draw range markers
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    if (dataType.range.includes('±')) {
        // Symmetric range
        const range = dataType.range.replace('±', '');
        ctx.fillText(`-${range}`, margin, centerY + 20);
        ctx.fillText('0', width / 2, centerY + 20);
        ctx.fillText(`+${range}`, width - margin, centerY + 20);
        
        // Draw markers
        ctx.fillStyle = '#667eea';
        [margin, width / 2, width - margin].forEach(x => {
            ctx.beginPath();
            ctx.arc(x, centerY, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    } else if (dataType.range.includes(' to ')) {
        // Asymmetric range
        const [min, max] = dataType.range.split(' to ');
        ctx.fillText(min, margin, centerY + 20);
        ctx.fillText(max, width - margin, centerY + 20);
        
        // Draw markers
        ctx.fillStyle = '#667eea';
        [margin, width - margin].forEach(x => {
            ctx.beginPath();
            ctx.arc(x, centerY, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${dataType.name} Range`, width / 2, 30);
}

// Initialize range visualization on load
setTimeout(() => {
    visualizeRange();
}, 100);
