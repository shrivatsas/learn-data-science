# Statistical Means and Averages

This interactive tool helps you understand different types of means (averages) and their mathematical properties.

## Types of Means Explained

### Arithmetic Mean

- **Formula**: AM = (A + B) / 2
- **Generalized**: AM = (x₁ + x₂ + ... + xₙ) / n
- **Intuition**: 
  - The "standard" average most people are familiar with
  - Equal to the sum of values divided by the count
  - Minimizes the sum of squared differences from each point
  - Heavily influenced by outliers
  - Best used when data is roughly symmetric

### Geometric Mean

- **Formula**: GM = √(A × B)
- **Generalized**: GM = (x₁ × x₂ × ... × xₙ)^(1/n)
- **Intuition**:
  - Represents the central tendency by multiplication rather than addition
  - Always less than or equal to arithmetic mean (unless all values are equal)
  - Used for growth rates, returns, and ratios
  - Cannot handle negative or zero values
  - Less sensitive to extreme values than arithmetic mean

### Harmonic Mean

- **Formula**: HM = 2 × (A × B) / (A + B)
- **Generalized**: HM = n / (1/x₁ + 1/x₂ + ... + 1/xₙ)
- **Intuition**:
  - The reciprocal of the arithmetic mean of reciprocals
  - Always less than or equal to geometric mean (unless all values are equal)
  - Used for averaging rates, speeds, and ratios
  - Gives greater weight to smaller values
  - Used in F1 score calculation (harmonic mean of precision and recall)

### Quadratic Mean (Root Mean Square)

- **Formula**: QM = √((A² + B²) / 2)
- **Generalized**: QM = √((x₁² + x₂² + ... + xₙ²) / n)
- **Intuition**:
  - Square root of the arithmetic mean of squared values
  - Always greater than or equal to arithmetic mean (unless all values are equal)
  - Used in statistics, engineering, and physics
  - Useful when variances are important or when dealing with sinusoidal data
  - Emphasizes larger values more than arithmetic mean

## The Inequality of Means

For any set of positive numbers, the following inequality holds:

Harmonic Mean ≤ Geometric Mean ≤ Arithmetic Mean ≤ Quadratic Mean

The equality holds if and only if all the values are identical.

## Using This Tool

This interactive visualization allows you to:

1. **Adjust input values** using sliders
2. **See how different means respond** to changes in input values
3. **Visualize the inequality of means** across different scenarios
4. **Build intuition** about which mean is appropriate for different types of data

Experiment with different values, especially with one value much larger than the other, to see how each type of mean responds differently to the imbalance.
