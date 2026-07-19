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

const summaryText = document.getElementById("summaryText");
const downloadBtn = document.getElementById("downloadBtn");

let pieChart = null;
let barChart = null;

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

        // Retry once if Render is waking up
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

    }

    catch (error) {

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

    // Statistics

    totalTransactions.textContent = data.total;
    fraudCount.textContent = data.fraud;
    legitCount.textContent = data.legitimate;

    // Summary

    summaryText.innerHTML = `
        <strong>${data.fraud}</strong> fraudulent and
        <strong>${data.legitimate}</strong> legitimate transactions detected.
        <br><br>

        Fraud Percentage:
        <strong>${data.fraud_percent}%</strong>

        <br>

        Model Accuracy:
        <strong>99.84%</strong>
    `;

    // Backend already returns the complete HTML table

    document.querySelector(".table-responsive").innerHTML = data.table;

    // Create Charts

    createCharts(data.fraud, data.legitimate);

}
// -------------------------------
// Search Table
// -------------------------------

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const filter = this.value.toLowerCase();

    const rows = document.querySelectorAll(".table tbody tr");

    rows.forEach(row => {

        row.style.display = row.innerText
            .toLowerCase()
            .includes(filter)
            ? ""
            : "none";

    });

});

// -------------------------------
// Charts
// -------------------------------

function createCharts(fraud, legitimate) {

    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    // Pie Chart
    pieChart = new Chart(
        document.getElementById("pieChart"),
        {
            type: "pie",
            data: {
                labels: [
                    "Fraudulent",
                    "Legitimate"
                ],
                datasets: [{
                    data: [
                        fraud,
                        legitimate
                    ],
                    backgroundColor: [
                        "#dc3545",
                        "#198754"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );

    // Bar Chart
    barChart = new Chart(
        document.getElementById("barChart"),
        {
            type: "bar",
            data: {
                labels: [
                    "Fraudulent",
                    "Legitimate"
                ],
                datasets: [{
                    label: "Transactions",
                    data: [
                        fraud,
                        legitimate
                    ],
                    backgroundColor: [
                        "#dc3545",
                        "#198754"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
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
// Download Report
// -------------------------------

downloadBtn.addEventListener("click", () => {

    const table = document.querySelector(".table");

    if (!table) {
        alert("No report available.");
        return;
    }

    let csv = [];

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {

        const cols = row.querySelectorAll("th, td");

        let rowData = [];

        cols.forEach(col => {

            rowData.push(
                `"${col.innerText.replace(/"/g, '""')}"`
            );

        });

        csv.push(rowData.join(","));

    });

    const blob = new Blob(
        [csv.join("\n")],
        { type: "text/csv;charset=utf-8;" }
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
