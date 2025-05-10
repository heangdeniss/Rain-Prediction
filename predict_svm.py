import sys
import pandas as pd
from sklearn.externals import joblib

# Load the trained SVM model
model = joblib.load('path_to_your_model/svm_model.pkl')  # Update path

def predict(data):
    # Convert the input data to DataFrame
    input_data = pd.DataFrame([data])

    # Make the prediction
    prediction = model.predict(input_data)
    return prediction[0]

if __name__ == "__main__":
    # Parse the features from command-line arguments
    data = {
        'feelslikenow': float(sys.argv[1]),
        'precipcover': float(sys.argv[2]),
        'sealevelpressure': float(sys.argv[3]),
        'surrounds': float(sys.argv[4]),
        'years': float(sys.argv[5]),
        'month_cos': float(sys.argv[6]),
        'month_sin': float(sys.argv[7]),
        'sunrise_hour': float(sys.argv[8])
    }

    # Get the prediction
    result = predict(data)
    
    # Output the result to stdout (which will be captured by the Express server)
    print(result)
