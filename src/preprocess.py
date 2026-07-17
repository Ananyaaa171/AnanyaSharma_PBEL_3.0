import pandas as pd
from pathlib import Path
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE


# -----------------------------
# Project Paths
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "Models"
MODEL_DIR.mkdir(exist_ok=True)


# -----------------------------
# Load Dataset
# -----------------------------
def load_data(file_path):
    """
    Load the credit card fraud dataset.
    """
    df = pd.read_csv(file_path)
    return df


# -----------------------------
# Preprocess Dataset
# -----------------------------
def preprocess_data(df):

    # Separate features and target
    X = df.drop("Class", axis=1)
    y = df["Class"]

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    # Scale only Time and Amount
    scaler = StandardScaler()

    X_train = X_train.copy()
    X_test = X_test.copy()

    X_train[["Time", "Amount"]] = scaler.fit_transform(
        X_train[["Time", "Amount"]]
    )

    X_test[["Time", "Amount"]] = scaler.transform(
        X_test[["Time", "Amount"]]
    )

    # Save scaler
    joblib.dump(scaler, MODEL_DIR / "scaler.pkl")

    # Save feature names
    joblib.dump(list(X.columns), MODEL_DIR / "feature_columns.pkl")

    # Apply SMOTE only on training data
    smote = SMOTE(random_state=42)

    X_train_smote, y_train_smote = smote.fit_resample(
        X_train,
        y_train
    )

    return (
        X_train_smote,
        X_test,
        y_train_smote,
        y_test
    )