# Statistical Distributions Explorer

An interactive web application for exploring and understanding common probability distributions used in statistics and data science.

## Overview

This tool provides an intuitive way to learn about statistical distributions by allowing you to manipulate parameters and observe how they affect the shape, statistics, and properties of different probability distributions.

## Features

### Supported Distributions

1. **Normal (Gaussian) Distribution**
   - Parameters: Mean (μ) and Standard Deviation (σ)
   - The classic bell-shaped curve fundamental to statistics
   - Used in: Heights, test scores, measurement errors

2. **Uniform Distribution**
   - Parameters: Minimum (a) and Maximum (b)
   - Equal probability across a defined range
   - Used in: Random number generation, equal likelihood scenarios

3. **Exponential Distribution**
   - Parameters: Rate (λ)
   - Models waiting times and decay processes
   - Used in: Reliability analysis, radioactive decay, queue theory

4. **Binomial Distribution**
   - Parameters: Number of trials (n) and Probability of success (p)
   - Discrete distribution for counting successes
   - Used in: Quality control, A/B testing, survey analysis

5. **Poisson Distribution**
   - Parameters: Average rate (λ)
   - Models rare events over fixed intervals
   - Used in: Call center arrivals, manufacturing defects, web traffic

6. **Beta Distribution**
   - Parameters: Shape parameters Alpha (α) and Beta (β)
   - Flexible distribution bounded between 0 and 1
   - Used in: Bayesian analysis, modeling proportions, project timelines

7. **Gamma Distribution**
   - Parameters: Shape (k) and Scale (θ)
   - Generalizes the exponential distribution
   - Used in: Rainfall modeling, reliability engineering, queue analysis

### Interactive Controls

- **Real-time Parameter Adjustment**: Use sliders or input fields to modify distribution parameters
- **Synchronized Controls**: Sliders and number inputs are bidirectionally linked
- **Live Visualization**: Charts update instantly as parameters change
- **Statistical Metrics**: View mean, variance, standard deviation, and skewness

### Educational Content

Each distribution includes:
- Mathematical definition and properties
- Parameter explanations
- Real-world applications and use cases
- Visual representation of probability density/mass functions

## How to Use

1. **Select a Distribution**: Choose from the dropdown menu
2. **Adjust Parameters**: Use sliders or type values directly
3. **Observe Changes**: Watch the chart and statistics update in real-time
4. **Learn**: Read the distribution information to understand applications

## Technical Implementation

### Mathematics
- All probability density functions (PDF) and probability mass functions (PMF) are implemented from scratch
- Statistical calculations (mean, variance, skewness) use exact formulas
- Special functions (Gamma function, Beta function) are computed numerically

### Visualization
- Built with Chart.js for smooth, interactive charts
- Responsive design adapts to different screen sizes
- Real-time updates without performance bottlenecks

### Browser Compatibility
- Works in all modern web browsers
- No installation or dependencies required
- Pure HTML, CSS, and JavaScript implementation

## Educational Value

This tool helps students and practitioners:

1. **Visualize Abstract Concepts**: See how mathematical parameters translate to visual shapes
2. **Understand Relationships**: Observe how changing parameters affects distribution properties
3. **Compare Distributions**: Switch between different types to see their unique characteristics
4. **Apply Knowledge**: Learn when and where each distribution is used in practice

## Getting Started

Simply open `index.html` in any modern web browser. No server or build process required.

## Key Learning Outcomes

After using this tool, users will understand:
- How distribution parameters control shape and spread
- The relationship between visual appearance and statistical properties
- When to apply different distributions in real-world scenarios
- The mathematical foundations underlying common statistical models

## Further Learning

This tool provides a foundation for understanding:
- Statistical inference and hypothesis testing
- Bayesian statistics and prior distributions
- Machine learning probability models
- Quality control and process monitoring
- Risk analysis and decision theory

## Technical Notes

The implementation prioritizes mathematical accuracy and educational clarity. All calculations are performed client-side, ensuring privacy and enabling offline use.