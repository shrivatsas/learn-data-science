# CPU & GPU Data Types Explorer

An interactive visualization tool for exploring different data types used in CPU and GPU computing, including specialized formats like bfloat16.

## Features

### 📊 Data Type Categories
- **Floating Point**: float64, float32, float16, bfloat16
- **Integer**: int8, uint8, int16, int32, int64
- **Specialized**: complex64, complex128, bool

### 🔍 Interactive Visualizations

#### 1. Data Type Grid
- Visual cards showing specifications for each data type
- Click to select and view detailed information
- Organized by categories (Floating Point, Integer, Specialized)

#### 2. Comparison Tool
- Side-by-side comparison of any two data types
- Shows differences in size, memory usage, range, and precision
- Helpful for choosing the right data type for your application

#### 3. Precision Visualizer
- Test how different data types handle specific values
- Binary representation display for floating-point types
- Precision loss analysis and error calculations
- IEEE 754 format breakdown (sign, exponent, mantissa)

#### 4. Range Visualizer
- Visual representation of data type ranges
- Interactive canvas showing min/max values
- Helpful for understanding overflow/underflow risks

#### 5. Memory Usage Calculator
- Calculate memory requirements for arrays of different sizes
- Shows breakdown in bytes, KB, MB, and GB
- Essential for memory optimization in large-scale applications

## Data Types Covered

### Floating Point Types

#### float64 (Double Precision)
- **Size**: 64 bits (8 bytes)
- **Range**: ±1.8e308
- **Precision**: 15-17 decimal digits
- **Use Cases**: Scientific computing, high precision calculations

#### float32 (Single Precision)
- **Size**: 32 bits (4 bytes)
- **Range**: ±3.4e38
- **Precision**: 6-9 decimal digits
- **Use Cases**: Deep learning, graphics, general purpose computing

#### float16 (Half Precision)
- **Size**: 16 bits (2 bytes)
- **Range**: ±65504
- **Precision**: 3-4 decimal digits
- **Use Cases**: Deep learning inference, mobile AI, memory-constrained applications

#### bfloat16 (Brain Float)
- **Size**: 16 bits (2 bytes)
- **Range**: ±3.4e38 (same as float32)
- **Precision**: 2-3 decimal digits
- **Use Cases**: ML training, TPU computing, neural networks
- **Special**: Developed by Google, maintains float32 range with reduced precision

### Integer Types

#### int8 / uint8
- **Size**: 8 bits (1 byte)
- **Range**: -128 to 127 (signed) / 0 to 255 (unsigned)
- **Use Cases**: Quantized models, image processing, embedded systems

#### int16
- **Size**: 16 bits (2 bytes)
- **Range**: -32,768 to 32,767
- **Use Cases**: Audio processing, intermediate calculations

#### int32
- **Size**: 32 bits (4 bytes)
- **Range**: ±2.1 billion
- **Use Cases**: General computing, array indices, counters

#### int64
- **Size**: 64 bits (8 bytes)
- **Range**: ±9.2 quintillion
- **Use Cases**: Large datasets, timestamps, high precision counting

### Specialized Types

#### complex64 / complex128
- **Size**: 64/128 bits (8/16 bytes)
- **Components**: Two float32/float64 values (real + imaginary)
- **Use Cases**: Signal processing, Fourier transforms, scientific computing

#### bool
- **Size**: 8 bits (1 byte, typically)
- **Range**: True/False
- **Use Cases**: Masks, conditions, flags

## Key Insights

### bfloat16 vs float16
- **bfloat16**: Same exponent range as float32 (8 bits) but reduced mantissa (7 bits)
- **float16**: Smaller exponent range (5 bits) but more mantissa precision (10 bits)
- **Trade-off**: bfloat16 better for training (wider range), float16 better for inference (higher precision)

### Memory Optimization
- Using float16 instead of float32 can halve memory usage
- Integer quantization (int8) can reduce memory by 4x compared to float32
- Critical for deploying models on mobile devices and edge computing

### Precision Considerations
- Floating-point arithmetic is not exact
- Accumulation of small errors can become significant
- Choose data type based on required precision vs. performance trade-offs

## Usage

1. Open `index.html` in a web browser
2. Select different data type categories using the buttons
3. Click on data type cards to see detailed information
4. Use the comparison tool to compare any two data types
5. Test precision with specific values using the precision visualizer
6. Visualize ranges and calculate memory usage for your applications

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- JavaScript ES6+ features used
- Responsive design for mobile and desktop

## Educational Value

This tool helps understand:
- Why different data types exist
- Trade-offs between precision, range, and memory
- How floating-point numbers are represented in binary
- Memory implications of data type choices
- Platform-specific optimizations (CPU vs GPU vs TPU)

Perfect for students, researchers, and practitioners working with:
- Machine Learning and Deep Learning
- Scientific Computing
- Graphics Programming
- Embedded Systems
- High-Performance Computing
