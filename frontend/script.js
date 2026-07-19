// ===============================
// AI Credit Card Fraud Detection
// Frontend Script
// ===============================

const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com/predict";

const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("csvFile");

const loadingSpinner = document.getElementById("loadingSpinner");
const resultsSection = document.getElementById("resultsSection");

const totalTransactions = document.getElementById("totalTransactions");
const fraudCount = document.getElementById("fraudCount");
const legitCount = document.getElementById("legitCount");

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const summaryText = document.getElementById("summaryText");
const downloadBtn = document.getElementById("downloadBtn");

let pieChart = null;
let barChart = null;
let latestResults = [];

// -------------------------------
// Upload CSV
// -------------------------------

uploadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!fileInput.files.length) {
        alert("Please select a CSV file.");
        return;
    }

    loadingSpinner.classList.remove("d-none");
    resultsSection.style.display = "none";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {

        let response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        // Retry once in case Render is waking up
        if (!response.ok) {

            await new Promise(resolve => setTimeout(resolve, 3000));

            response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

        }

        if (!response.ok) {
            throw new Error("Prediction failed.");
        }

        const data = await response.json();

        loadingSpinner.classList.add("d-none");
        resultsSection.style.display = "block";

        renderResults(data);

    } catch (error) {

        loadingSpinner.classList.add("d-none");

        alert(
            "Unable to connect to the backend.\n\nIf you're using Render, the backend may still be waking up. Please wait a few seconds and try again."
        );

        console.error(error);

    }

});
// -------------------------------
// Render Results
// -------------------------------

function renderResults(data) {

    latestResults = data.predictions || [];

    const fraud = latestResults.filter(
        item => item.prediction === "Fraud"
    ).length;

    const legit = latestResults.length - fraud;

    totalTransactions.textContent = latestResults.length;
    fraudCount.textContent = fraud;
    legitCount.textContent = legit;

    summaryText.innerHTML = `
        <strong>${fraud}</strong> fraudulent and
        <strong>${legit}</strong> legitimate transactions detected.
        <br><br>
        Model Accuracy:
        <strong>99.84%</strong>
    `;

    renderTable(latestResults);
    createCharts(fraud, legit);

}

// -------------------------------
// Prediction Table
// -------------------------------

function renderTable(results) {

    tableBody.innerHTML = "";

    results.forEach((result, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.prediction}</td>
            <td>${result.confidence ?? "-"}</td>
        `;

        tableBody.appendChild(row);

    });

}

// -------------------------------
// Search Table
// -------------------------------

searchInput.addEventListener("keyup", () => {

    const search = searchInput.value.toLowerCase();

    [...tableBody.children].forEach(row => {

        row.style.display = row.textContent
            .toLowerCase()
            .includes(search)
            ? ""
            : "none";

    });

});

// -------------------------------
// Charts
// -------------------------------

function createCharts(fraud, legit) {

    if (pieChart) {
        pieChart.destroy();
    }

    if (barChart) {
        barChart.destroy();
    }

    pieChart = new Chart(
        document.getElementById("pieChart"),
        {
            type: "pie",
            data: {
                labels: [
                    "Fraud",
                    "Legitimate"
                ],
                datasets: [{
                    data: [
                        fraud,
                        legit
                    ]
                }]
            }
        }
    );

    barChart = new Chart(
        document.getElementById("barChart"),
        {
            type: "bar",
            data: {
                labels: [
                    "Fraud",
                    "Legitimate"
                ],
                datasets: [{
                    label: "Transactions",
                    data: [
                        fraud,
                        legit
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );

}
// -------------------------------
// Download CSV Report
// -------------------------------

downloadBtn.addEventListener("click", () => {

    if (!latestResults.length) {
        alert("No prediction results available.");
        return;
    }

    let csv = "Prediction,Confidence\n";

    latestResults.forEach(result => {

        csv += `${result.prediction},${result.confidence ?? ""}\n`;

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "fraud_detection_report.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});