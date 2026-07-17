import os
from pathlib import Path
import joblib
import matplotlib.pyplot as plt

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    RocCurveDisplay
)

from preprocess import load_data, preprocess_data

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "Models"
RESULT_DIR = BASE_DIR / "Results"

RESULT_DIR.mkdir(exist_ok=True)

# ==========================================================
# Load Dataset
# ==========================================================

print("Loading dataset...")

dataset = load_data(BASE_DIR / "Dataset" / "creditcard.csv")

X_train, X_test, y_train, y_test = preprocess_data(dataset)

# ==========================================================
# Load Models
# ==========================================================

print("Loading trained models...")

lr_model = joblib.load(MODEL_DIR / "logistic_regression.pkl")
rf_model = joblib.load(MODEL_DIR / "random_forest.pkl")
xgb_model = joblib.load(MODEL_DIR / "xgboost.pkl")

models = {
    "Logistic Regression": lr_model,
    "Random Forest": rf_model,
    "XGBoost": xgb_model
}

# ==========================================================
# Store Results
# ==========================================================

accuracy_list = []
precision_list = []
recall_list = []
f1_list = []
roc_list = []

# ==========================================================
# Evaluate Models
# ==========================================================

for name, model in models.items():

    print(f"\nEvaluating {name}")

    predictions = model.predict(X_test)

    probabilities = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(y_test, predictions)
    recall = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    roc = roc_auc_score(y_test, probabilities)

    accuracy_list.append(accuracy)
    precision_list.append(precision)
    recall_list.append(recall)
    f1_list.append(f1)
    roc_list.append(roc)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC AUC  : {roc:.4f}")

    # ------------------------------------------------------
    # Confusion Matrix
    # ------------------------------------------------------

    cm = confusion_matrix(y_test, predictions)

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=["Legitimate", "Fraud"]
    )

    disp.plot()

    plt.title(f"{name} Confusion Matrix")

    plt.savefig(
        RESULT_DIR / f"{name.replace(' ', '_').lower()}_confusion_matrix.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

# ==========================================================
# ROC Curve
# ==========================================================

plt.figure(figsize=(8,6))

for name, model in models.items():

    RocCurveDisplay.from_estimator(
        model,
        X_test,
        y_test,
        ax=plt.gca(),
        name=name
    )

plt.title("ROC Curve Comparison")

plt.savefig(
    RESULT_DIR / "roc_curve.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()

# ==========================================================
# Comparison Chart
# ==========================================================

plt.figure(figsize=(10,6))

x = range(len(models))

plt.bar(x, accuracy_list, width=0.15, label="Accuracy")
plt.bar([i+0.15 for i in x], precision_list, width=0.15, label="Precision")
plt.bar([i+0.30 for i in x], recall_list, width=0.15, label="Recall")
plt.bar([i+0.45 for i in x], f1_list, width=0.15, label="F1 Score")
plt.bar([i+0.60 for i in x], roc_list, width=0.15, label="ROC-AUC")

plt.xticks([i+0.30 for i in x], models.keys())

plt.ylabel("Score")

plt.title("Model Performance Comparison")

plt.legend()

plt.savefig(
    RESULT_DIR / "model_comparison.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()

# ==========================================================
# Print Final Summary
# ==========================================================

print("\n")
print("="*60)
print("Evaluation Completed Successfully")
print("="*60)

print(f"\nResults saved in:\n{RESULT_DIR}")