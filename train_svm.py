import joblib
import numpy as np
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification

# Example: Create a synthetic dataset (replace with your actual weather data)
X, y = make_classification(n_samples=1000, n_features=8, random_state=42)

# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the data (important for SVM performance)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train the SVM model (using a radial basis function kernel)
model = svm.SVC(kernel='rbf', random_state=42)
model.fit(X_train, y_train)

# Save the trained model to a file using joblib
joblib.dump(model, 'models/svm_model.pkl')

print("Model saved as svm_model.pkl")
