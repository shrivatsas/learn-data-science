# Activation Functions in Neural Networks

This interactive tool helps you understand the intuition behind common activation functions used in neural networks.

## Why Activation Functions Matter

Activation functions introduce non-linearity into neural networks, which is crucial for learning complex patterns. Without them, neural networks would be limited to learning only linear relationships.

## Common Activation Functions Explained

### Sigmoid

- **Formula**: σ(x) = 1 / (1 + e^(-x))
- **Range**: (0, 1)
- **Intuition**: 
  - Maps any input to a value between 0 and 1
  - Useful for binary classification output layers
  - Historically used but has issues with vanishing gradients
  - S-shaped curve that "squashes" extreme values

### ReLU (Rectified Linear Unit)

- **Formula**: f(x) = max(0, x)
- **Range**: [0, ∞)
- **Intuition**:
  - Simple and computationally efficient
  - Helps solve the vanishing gradient problem
  - Introduces sparsity (many neurons output 0)
  - Most widely used activation in hidden layers

### Leaky ReLU

- **Formula**: f(x) = max(αx, x), where α is a small constant
- **Range**: (-∞, ∞)
- **Intuition**:
  - Addresses the "dying ReLU" problem where neurons can get stuck
  - Small negative slope (α) allows for small gradients when the neuron is not active
  - Helps maintain some information flow even for negative inputs

### Tanh (Hyperbolic Tangent)

- **Formula**: tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
- **Range**: (-1, 1)
- **Intuition**:
  - Zero-centered outputs help in later layers
  - S-shaped curve similar to sigmoid but with range (-1, 1)
  - Often performs better than sigmoid in hidden layers
  - Still has vanishing gradient issues for extreme values

### Softmax

- **Formula**: softmax(z)_i = e^(z_i) / Σ e^(z_j)
- **Range**: (0, 1) for each output, with sum = 1
- **Intuition**:
  - Converts a vector of values into a probability distribution
  - Used in multi-class classification output layers
  - Emphasizes the largest values while suppressing lower ones
  - Ensures all outputs sum to 1, making them interpretable as probabilities

## Using This Tool

This interactive visualization allows you to:

1. **Select different activation functions** to see their shapes and behaviors
2. **Adjust input values** using sliders or direct input to see how outputs change
3. **Modify parameters** like the alpha value for Leaky ReLU
4. **Visualize Softmax** behavior with multiple inputs
5. **Compare functions** to understand their different properties and use cases

Experiment with different input values and observe how each activation function responds. This hands-on approach will help build intuition for why certain activation functions are preferred in different neural network architectures and layers.
