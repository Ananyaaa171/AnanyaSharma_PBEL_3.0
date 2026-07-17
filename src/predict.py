import joblib
import pandas as pd
from pathlib import Path

# ==========================================
# Project Paths
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "Models"
DATASET_PATH = BASE_DIR / "Dataset" / "creditcard.csv"

# ==========================================
# Load Saved Files
# ==========================================

model = joblib.load(MODEL_DIR / "random_forest.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
feature_columns = joblib.load(MODEL_DIR / "feature_columns.pkl")

# ==========================================
# Prediction Function
# ==========================================

def predict_transaction(transaction):

    # Convert dictionary to DataFrame
    df = pd.DataFrame([transaction])

    # Ensure columns are in correct order
    df = df[feature_columns]

    # Scale Time and Amount
    df[["Time", "Amount"]] = scaler.transform(
        df[["Time", "Amount"]]
    )

    # Prediction
    prediction = model.predict(df)[0]

    # Prediction Probability
    probabilities = model.predict_proba(df)

    print("\nPrediction (0 = Legitimate, 1 = Fraud):", prediction)
    print("Class Probabilities:", probabilities)

    probability = probabilities[0][1]

    if prediction == 1:
        result = "Fraud Transaction"
    else:
        result = "Legitimate Transaction"

    return result, probability


# ==========================================
# Main
# ==========================================

if __name__ == "__main__":

    print("=" * 50)
    print("AI Credit Card Fraud Detection")
    print("=" * 50)

    # Load dataset
    dataset = pd.read_csv(DATASET_PATH)

    # Pick the first fraud transaction
    fraud_transaction = dataset[dataset["Class"] == 1].iloc[0]

    # Remove target column
    sample_transaction = fraud_transaction.drop("Class").to_dict()

    # Predict
    prediction, probability = predict_transaction(sample_transaction)

    print("\nFinal Prediction :", prediction)
    print("Fraud Probability :", round(probability * 100, 2), "%")