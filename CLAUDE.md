# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an educational data science repository containing interactive HTML/CSS/JavaScript visualizations for fundamental machine learning and statistical concepts. Each topic is organized in its own directory with a self-contained web application.

## Project Structure

The repository follows a modular structure where each concept is implemented as a standalone interactive tool:

- `activation-functions/` - Neural network activation functions (Sigmoid, ReLU, Leaky ReLU, Tanh, Softmax)
- `confusion-matrix/` - Classification metrics visualization (Precision, Recall, F1 Score)
- `means/` - Statistical means comparison (Arithmetic, Geometric, Harmonic, Quadratic)
- `data-types/` - CPU/GPU data types explorer (float16, bfloat16, int8, etc.)
- `Measures.md` - Detailed explanation of F1 score intuition

Each directory contains:
- `index.html` - Main visualization interface
- `script.js` - Interactive functionality and mathematical implementations
- `styles.css` - Visual styling and responsive design
- `README.md` - Concept explanation and educational content

## Architecture

### Frontend Implementation
- **Pure JavaScript**: No frameworks or build tools - uses vanilla JS with modern ES6+ features
- **Chart.js Integration**: Most visualizations use Chart.js for interactive graphs and real-time updates
- **Responsive Design**: CSS Grid and Flexbox for mobile-friendly layouts
- **Interactive Controls**: Sliders, input fields, and buttons for parameter manipulation

### Mathematical Implementations
- All activation functions, metrics, and statistical calculations are implemented from scratch
- Real-time computation and visualization updates
- IEEE 754 floating-point representation and binary visualization
- Precision analysis and error calculation tools

## Development Workflow

### Running the Applications
Each tool runs independently - simply open any `index.html` file in a web browser. No build process or dependencies required.

### Testing Changes
- Open the relevant `index.html` file in a browser
- Test interactive controls and parameter changes
- Verify mathematical accuracy of computations
- Check responsive behavior on different screen sizes

### Code Conventions
- Use modern JavaScript (ES6+) features
- Maintain consistent naming: camelCase for variables/functions
- Keep mathematical functions pure and well-documented
- Follow existing chart configuration patterns when adding new visualizations
- Ensure all interactive elements have proper event handling

## Key Implementation Details

### Chart.js Integration Pattern
Most visualizations follow this pattern:
```javascript
// Initialize chart with configuration
const chart = new Chart(ctx, config);

// Update data and refresh
chart.data.datasets[0].data = newData;
chart.update('none'); // Fast update without animation
```

### Mathematical Function Implementations
- Activation functions include both the function and its derivative
- Statistical measures are computed with proper handling of edge cases
- Floating-point precision considerations are documented and visualized

### Interactive Controls Synchronization
- Sliders and text inputs are bidirectionally synchronized
- Real-time updates without performance bottlenecks
- Parameter validation and range enforcement

## Design Standards and Visual Consistency

### CSS Design Principles
All visualizations follow a consistent design system based on the confusion-matrix implementation:

**Color Palette:**
- Primary: #3498db (blue)
- Secondary: #2980b9 (darker blue)
- Background: #f5f5f5 (light gray)
- Cards/Sections: #ffffff (white)
- Accent Colors: #e74c3c (red), #2ecc71 (green), #f39c12 (orange)
- Text: #2c3e50 (dark gray), #333 (medium), #666 (light)

**Layout Standards:**
- Container max-width: 1200px
- Border radius: 8px (consistent across all elements)
- Box shadows: 0 4px 6px rgba(0, 0, 0, 0.1) for main sections
- Padding: 25px for main content areas, 20px for cards
- Margins: 30px between major sections

**Typography:**
- Font family: Arial, sans-serif
- Headings: #2c3e50 color
- Body text: #333 with line-height 1.6

**Interactive Elements:**
- Buttons: #3498db background, hover to #2980b9
- Borders: #bdc3c7 for inputs and containers
- Focus states: #3498db border color
- Subtle transitions: 0.3s ease for all hover effects

### Component Consistency
- **Cards**: White background, subtle border, consistent hover effects
- **Controls**: Uniform input styling, button design, and spacing
- **Tables**: Consistent header styling and row interactions
- **Results**: Standardized display format across all tools

## Educational Focus

This repository prioritizes:
- **Intuitive Understanding**: Visual and interactive exploration over theoretical depth
- **Practical Applications**: Real-world context for when to use different concepts
- **Mathematical Accuracy**: Correct implementations that can be trusted for learning
- **Accessibility**: Clear explanations suitable for beginners to intermediate learners
- **Visual Consistency**: Uniform design language across all tools for professional appearance