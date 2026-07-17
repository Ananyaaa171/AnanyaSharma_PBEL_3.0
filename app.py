from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from pathlib import Path
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# ==========================================================
# Directories
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "Models"
UPLOAD_DIR = BASE_DIR / "uploads"
PREDICTION_DIR = BASE_DIR / "predictions"

UPLOAD_DIR.mkdir(exist_ok=True)
PREDICTION_DIR.mkdir(exist_ok=True)

# ==========================================================
# Load Model
# ==========================================================

model = joblib.load(MODEL_DIR / "random_forest.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
feature_columns = joblib.load(MODEL_DIR / "feature_columns.pkl")

prediction_file = None

# ==========================================================
# Home Route
# ==========================================================

@app.route("/")
def home():
    return jsonify({
        "message": "Credit Card Fraud Detection API is running."
    })

# ==========================================================
# Predict API
# ==========================================================

@app.route("/predict", methods=["POST"])
def predict():

    global prediction_file

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    upload_path = UPLOAD_DIR / file.filename
    file.save(upload_path)

    try:
        df = pd.read_csv(upload_path)
    except Exception:
        return jsonify({"error": "Invalid CSV file"}), 400

    if "Class" in df.columns:
        df = df.drop(columns=["Class"])

    missing = [c for c in feature_columns if c not in df.columns]

    if missing:
        return jsonify({
            "error": "Missing Columns",
            "missing": missing
        }), 400

    df = df[feature_columns]

    df[["Time", "Amount"]] = scaler.transform(
        df[["Time", "Amount"]]
    )

    predictions = model.predict(df)

    probabilities = model.predict_proba(df)[:, 1]

    result_df = df.copy()

    result_df["Prediction"] = [
        "Fraud" if x == 1 else "Legitimate"
        for x in predictions
    ]

    result_df["Fraud Probability (%)"] = (
        probabilities * 100
    ).round(2)

    prediction_file = PREDICTION_DIR / "predictions.csv"

    result_df.to_csv(prediction_file, index=False)

    total = len(result_df)

    fraud = int(
        (result_df["Prediction"] == "Fraud").sum()
    )

    legitimate = int(total - fraud)

    fraud_percent = round((fraud / total) * 100, 2)

    table = result_df.head(100).to_html(
        classes="table table-hover table-striped table-bordered",
        index=False
    )

    return jsonify({

        "total": total,

        "fraud": fraud,

        "legitimate": legitimate,

        "fraud_percent": fraud_percent,

        "table": table

    })

# ==========================================================
# Download Report
# ==========================================================

@app.route("/download")
def download():

    global prediction_file

    if prediction_file is None:
        return jsonify({"error": "No prediction file found"}), 404

    return send_file(
        prediction_file,
        as_attachment=True,
        download_name="Prediction_Report.csv"
    )

# ==========================================================
# Run
# ==========================================================

if __name__ == "__main__":
    app.run(debug=True)