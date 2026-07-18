# 💳 AI-Powered Credit Card Fraud Detection System

An end-to-end Machine Learning web application that detects fraudulent credit card transactions using a trained Random Forest model. Users can upload transaction datasets in CSV format and receive instant fraud predictions, interactive visualizations, and downloadable prediction reports.

## 🌐 Live Demo

**Frontend (Netlify):**  
https://idyllic-starship-455f05.netlify.app/

---

## 📌 Project Overview

Credit card fraud is a significant challenge in the financial sector. This project leverages Machine Learning to classify transactions as **Fraudulent** or **Legitimate** based on anonymized transaction features.

The application provides:

- Upload transactions via CSV
- Predict fraudulent transactions
- Display fraud statistics
- Interactive Pie and Bar Charts
- Searchable prediction table
- Downloadable prediction report

---

## ✨ Features

- 📂 CSV file upload
- 🤖 Machine Learning-based fraud detection
- 📊 Interactive Pie Chart
- 📈 Interactive Bar Chart
- 📋 Prediction report table
- 🔍 Search predictions
- 📥 Download prediction results as CSV
- 🌐 Responsive web interface

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js

### Backend
- Python
- Flask

### Machine Learning
- Scikit-learn
- Random Forest Classifier
- Logistic Regression
- XGBoost
- Pandas
- NumPy
- Joblib

---

## 📂 Project Structure

```
AnanyaSharma_PBEL_3.0
│
├── Dataset/
├── Models/
├── Results/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── vercel.json
│
├── src/
│   ├── preprocess.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
│
├── static/
├── templates/
├── app.py
├── requirements.txt
└── README.md
```

---

## 🧠 Machine Learning Models

The following models were trained and evaluated:

- Logistic Regression
- Random Forest Classifier ⭐ (Best Performing)
- XGBoost Classifier

The Random Forest model is used for deployment because it achieved the best performance on the dataset.

---

## 📊 Dataset

This project uses the **Credit Card Fraud Detection Dataset** containing anonymized European card transactions.

Dataset characteristics:

- 31 Features
- Highly Imbalanced Dataset
- Binary Classification
- Fraud Label:
  - **0 → Legitimate**
  - **1 → Fraud**

---

## 🚀 How to Run Locally

### Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### Navigate to Project

```bash
cd AnanyaSharma_PBEL_3.0
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Flask Server

```bash
python app.py
```

The backend will start on:

```
http://127.0.0.1:5000
```

Open the frontend in your browser and start uploading CSV files.

---

## 📷 Application Workflow

1. Upload CSV dataset.
2. Backend preprocesses transaction data.
3. Random Forest model predicts each transaction.
4. Results are displayed instantly.
5. Pie Chart and Bar Chart visualize fraud distribution.
6. User can search predictions.
7. Prediction report can be downloaded as CSV.

---

## 📈 Output

The application displays:

- Total Transactions
- Legitimate Transactions
- Fraudulent Transactions
- Fraud Percentage
- Prediction Table
- Pie Chart
- Bar Chart

---

## 📦 Future Improvements

- User authentication
- Real-time transaction prediction
- Explainable AI (SHAP/LIME)
- Model retraining dashboard
- REST API documentation
- Cloud database integration

---

## 👩‍💻 Author

**Ananya Sharma**

---

## 📄 License


