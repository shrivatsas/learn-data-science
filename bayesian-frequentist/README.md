# Bayesian vs Frequentist Probability - Interactive Learning Module

An interactive educational tool that demonstrates the fundamental differences between Bayesian and Frequentist approaches to statistical inference through hands-on examples and visualizations.

## Features

### 1. **Overview Tab**
- Side-by-side comparison of key concepts
- Visual explanation of Bayes' Theorem
- Philosophy and interpretation differences

### 2. **Coin Flip Demo**
- Interactive coin flip experiment
- Real-time comparison of Bayesian posterior vs Frequentist confidence intervals
- Adjustable prior beliefs (uniform, fair coin, biased)
- Visual probability distributions

### 3. **Medical Test Scenario**
- Classic medical diagnosis example
- Demonstrates the importance of base rates (prior probabilities)
- Interactive probability tree diagram
- Shows how Bayesian reasoning handles rare diseases

### 4. **A/B Testing Comparison**
- Real-world A/B testing scenario
- Frequentist significance testing vs Bayesian probability statements
- Interactive parameter adjustment
- Posterior distribution visualization

### 5. **Side-by-Side Comparison**
- Comprehensive comparison table
- When to use each approach
- Practical guidance for choosing methods

## Key Learning Objectives

### Understanding Core Differences
- **Frequentist**: Parameters are fixed; probability is long-run frequency
- **Bayesian**: Parameters are random; probability represents belief/uncertainty

### Practical Applications
- **Medical Testing**: How base rates affect diagnosis interpretation
- **A/B Testing**: Different ways to interpret experimental results
- **Coin Flips**: Simple example showing mathematical differences

### Statistical Concepts
- Confidence intervals vs Credible intervals
- P-values vs Posterior probabilities
- Prior beliefs and their impact on inference
- Bayes' Theorem in practice

## Technical Implementation

### Interactive Elements
- **Sliders**: Adjust parameters in real-time
- **Visualizations**: Chart.js powered probability distributions
- **Simulations**: Monte Carlo methods for Bayesian calculations
- **Dynamic Updates**: Real-time recalculation of statistics

### Mathematical Functions
- Beta distribution PDF and random generation
- Normal distribution CDF approximation
- Gamma function implementation
- Two-proportion z-test calculations

## Usage

1. Open `index.html` in a web browser
2. Navigate through tabs to explore different scenarios
3. Adjust parameters using sliders and inputs
4. Observe how results differ between approaches
5. Read interpretations to understand practical implications

## Educational Value

This module helps students understand:
- Why the same data can lead to different conclusions
- The role of prior beliefs in statistical inference
- When each approach is most appropriate
- How to interpret statistical results correctly

## Browser Compatibility

- Modern browsers with ES6+ support
- Chart.js for visualizations
- Responsive design for mobile devices

## Files Structure

```
bayesian-frequentist/
├── index.html          # Main interface
├── styles.css          # Modern responsive styling
├── script.js           # Interactive functionality
└── README.md           # This documentation
```

## Examples Covered

1. **Coin Flip**: Basic probability estimation with different priors
2. **Medical Test**: Base rate fallacy and diagnostic accuracy
3. **A/B Testing**: Business decision making under uncertainty
4. **Theoretical Comparison**: When to use each approach

Perfect for statistics courses, data science education, and anyone wanting to understand these fundamental statistical philosophies!
