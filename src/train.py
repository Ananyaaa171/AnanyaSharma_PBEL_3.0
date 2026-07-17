import os
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from preprocess import load_data, preprocess_data

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Create models folder
os.makedirs("models", exist_ok=True)

# Load Dataset
df = load_data("Dataset/creditcard.csv")

# Preprocess Data
X_train, X_test, y_train, y_test = preprocess_data(df)

# -----------------------------
# Logistic Regression
# -----------------------------
print("\nTraining Logistic Regression...")

lr_model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

lr_model.fit(X_train, y_train)

# -----------------------------
# Random Forest
# -----------------------------
print("\nTraining Random Forest...")

rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train, y_train)

# -----------------------------
# XGBoost
# -----------------------------
print("\nTraining XGBoost...")

xgb_model = XGBClassifier(
    n_estimators=150,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss"
)

xgb_model.fit(X_train, y_train)

# Save Models
joblib.dump(lr_model, "models/logistic_regression.pkl")
joblib.dump(rf_model, "models/random_forest.pkl")
joblib.dump(xgb_model, "models/xgboost.pkl")

print("\nModels saved successfully.")

# -----------------------------
# Evaluation Function
# -----------------------------
def evaluate(model, name):

    predictions = model.predict(X_test)

    print(f"\n{name}")

    print("-" * 40)

    print("Accuracy :", accuracy_score(y_test, predictions))
    print("Precision:", precision_score(y_test, predictions))
    print("Recall   :", recall_score(y_test, predictions))
    print("F1 Score :", f1_score(y_test, predictions))
    print("ROC AUC  :", roc_auc_score(y_test, predictions))

    print("\nConfusion Matrix")

    print(confusion_matrix(y_test, predictions))

    print("\nClassification Report")

    print(classification_report(y_test, predictions))

# Evaluate All Models
evaluate(lr_model, "Logistic Regression")
evaluate(rf_model, "Random Forest")
evaluate(xgb_model, "XGBoost")