# Stochastic Processes Interactive Visualization

An educational tool for exploring various stochastic (random) processes through interactive visualizations.

## Features

### Supported Processes

1. **Random Walk**
   - Classic discrete-time random process
   - Configurable step probability
   - Multiple path visualization
   - Step-by-step animation

2. **Brownian Motion (Wiener Process)**
   - Continuous-time stochastic process
   - Adjustable drift and volatility parameters
   - Gaussian increment simulation
   - Smooth path rendering

3. **Markov Chain**
   - Discrete state space process
   - Weather state example (Sunny/Cloudy/Rainy)
   - Transition matrix visualization
   - Memory-less property demonstration

4. **Poisson Process**
   - Counting process for rare events
   - Configurable arrival rate (λ)
   - Step function visualization
   - Multiple independent processes

5. **Lévy Process**
   - Heavy-tailed stable distributions
   - Adjustable stability (α), skewness (β), and scale parameters
   - Exhibits large jumps and extreme events
   - Non-Gaussian behavior demonstration

6. **Gaussian Process**
   - Smooth random functions
   - Configurable length scale and variance
   - Squared exponential covariance function
   - Represents uncertainty over functions

### Interactive Controls

- **Process Selection**: Switch between different stochastic processes
- **Parameter Adjustment**: Real-time parameter modification with sliders
- **Path Generation**: Generate multiple independent realizations
- **Animation**: Step-by-step process evolution
- **Responsive Design**: Works on desktop and mobile devices

## Mathematical Background

### Random Walk
A sequence X₀, X₁, X₂, ... where:
- X₀ = 0
- Xₙ = Xₙ₋₁ + Zₙ
- Zₙ ∈ {-1, +1} with probability p and (1-p)

### Brownian Motion
A continuous-time process W(t) with:
- W(0) = 0
- Independent increments
- W(t) - W(s) ~ N(0, t-s) for t > s
- With drift μ and volatility σ: dX = μdt + σdW

### Markov Chain
A sequence with the Markov property:
- P(Xₙ₊₁ = j | X₀, X₁, ..., Xₙ) = P(Xₙ₊₁ = j | Xₙ)
- Transition probabilities: P(Xₙ₊₁ = j | Xₙ = i) = pᵢⱼ

### Poisson Process
A counting process N(t) with:
- N(0) = 0
- Independent increments
- P(N(t+h) - N(t) = k) = (λh)ᵏe^(-λh)/k! for small h

### Lévy Process
A process X(t) with stationary independent increments and characteristic function:
- φ(k) = exp(itμ - |σk|^α(1 - iβ sign(k) tan(πα/2)))
- α ∈ (0,2]: stability parameter (controls tail heaviness)
- β ∈ [-1,1]: skewness parameter
- σ > 0: scale parameter

### Gaussian Process
A collection of random variables with joint Gaussian distribution:
- Any finite collection follows multivariate normal
- Specified by mean μ(x) and covariance k(x,x')
- Squared exponential kernel: k(x,x') = σ²exp(-|x-x'|²/(2ℓ²))

## Usage

1. Open `index.html` in a web browser
2. All six stochastic processes display simultaneously for easy comparison
3. Adjust global parameters (steps, paths) or individual process parameters
4. Click "Generate All Processes" for fresh realizations
5. Use "Animate All" to see step-by-step evolution across all processes
6. Observe how different parameters affect each process behavior
7. Compare characteristics between different process types

## Technical Implementation

- **Pure JavaScript**: No external dependencies except Chart.js
- **Real-time Updates**: Parameters changes instantly update visualizations
- **Mathematical Accuracy**: Proper statistical implementations
- **Performance Optimized**: Efficient rendering for large datasets
- **Educational Focus**: Clear parameter relationships and visual feedback

## Learning Objectives

- Understand different types of randomness in time series
- Explore the relationship between discrete and continuous processes
- Visualize the effect of parameters on process behavior
- Compare multiple realizations to understand variability
- Grasp fundamental concepts in probability theory and stochastic calculus

## Browser Compatibility

- Modern browsers with JavaScript ES6+ support
- Canvas API for Chart.js rendering
- Responsive design for various screen sizes
