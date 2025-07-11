# Confusion Matrix and Classification Metrics

This interactive tool helps you understand the relationship between confusion matrix elements and classification metrics like precision, recall, and F1 score.

## Understanding the Confusion Matrix

A confusion matrix is a table used to evaluate the performance of a classification model. It breaks down predictions into four categories:

- **True Positive (TP)**: Correctly predicted positive cases
- **False Positive (FP)**: Incorrectly predicted positive cases (Type I error)
- **True Negative (TN)**: Correctly predicted negative cases
- **False Negative (FN)**: Incorrectly predicted negative cases (Type II error)

## Key Classification Metrics

### Precision

- **Formula**: Precision = TP / (TP + FP)
- **Range**: [0, 1]
- **Intuition**: 
  - Measures how many of your positive predictions were actually positive
  - High precision means few false alarms
  - Answers: "When the model predicts positive, how often is it correct?"
  - Important when false positives are costly

### Recall (Sensitivity)

- **Formula**: Recall = TP / (TP + FN)
- **Range**: [0, 1]
- **Intuition**:
  - Measures how many of the actual positives your model caught
  - High recall means few missed positives
  - Answers: "What proportion of actual positives did the model identify?"
  - Important when false negatives are costly

### F1 Score

- **Formula**: F1 = 2 * (Precision * Recall) / (Precision + Recall)
- **Range**: [0, 1]
- **Intuition**:
  - Harmonic mean of precision and recall
  - Balances precision and recall when they trade off
  - Punishes extreme imbalances between precision and recall
  - If either precision or recall is very low, F1 will be closer to the lower value

## The Precision-Recall Trade-off

In most classification problems, there's an inherent trade-off between precision and recall:

- Increasing precision often reduces recall
- Increasing recall often reduces precision

This happens because making your model more selective (higher threshold) tends to increase precision but decrease recall, while making it more inclusive (lower threshold) does the opposite.

## Using This Tool

This interactive visualization allows you to:

1. **Adjust confusion matrix elements** directly using sliders
2. **See how changing these values affects** precision, recall, and F1 score
3. **Directly manipulate precision and recall** to see how the confusion matrix elements must change
4. **Visualize the F1 score** as a balance between precision and recall

Experiment with different scenarios to build intuition about these metrics and their relationships. Try extreme cases (like setting FP or FN to very high values) to see how the metrics respond.
