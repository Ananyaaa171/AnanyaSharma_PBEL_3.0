const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com";

const uploadForm = document.getElementById("uploadForm");

let pieChart = null;
let barChart = null;

uploadForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput.files.length === 0) {
        alert("Please select a CSV file.");
        return;
    }

    const button = uploadForm.querySelector("button");

    button.disabled = true;
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Predicting...
    `;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {

        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        console.log("API Response:", data);

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed.");
        }

        // Update Summary Cards
        document.getElementById("total").innerText = data.total;
        document.getElementById("legitimate").innerText = data.legitimate;
        document.getElementById("fraud").innerText = data.fraud;
        document.getElementById("fraud_percent").innerText =
            data.fraud_percent + "%";

        // Update Prediction Table
        document.getElementById("resultsTable").innerHTML = data.table;

        // ============================
        // Pie Chart
        // ============================

        if (pieChart) {
            pieChart.destroy();
        }

        const pieCtx = document
            .getElementById("pieChart")
            .getContext("2d");

        pieChart = new Chart(pieCtx, {

            type: "pie",

            data: {

                labels: ["Fraud", "Legitimate"],

                datasets: [{

                    data: [
                        Number(data.fraud),
                        Number(data.legitimate)
                    ],

                    backgroundColor: [
                        "#dc3545",
                        "#198754"
                    ],

                    borderWidth: 1

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: true

            }

        });

        // ============================
        // Bar Chart
        // ============================

        if (barChart) {
            barChart.destroy();
        }

        const barCtx = document
            .getElementById("barChart")
            .getContext("2d");

        barChart = new Chart(barCtx, {

            type: "bar",

            data: {

                labels: ["Fraud", "Legitimate"],

                datasets: [{

                    label: "Transactions",

                    data: [
                        Number(data.fraud),
                        Number(data.legitimate)
                    ],

                    backgroundColor: [
                        "#dc3545",
                        "#198754"
                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        }

                    }

                }

            }

        });

    }

    catch (error) {

        console.error(error);

        alert(error.message || "Prediction failed.");

    }

    finally {

        button.disabled = false;

        button.innerHTML = `
            <i class="bi bi-search"></i>
            Run Prediction
        `;

    }

});

// ======================================
// Search Table
// ======================================

function filterTable() {

    const input = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const table = document.querySelector("#resultsTable table");

    if (!table) return;

    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {

        const text = rows[i].innerText.toLowerCase();

        rows[i].style.display = text.includes(input)
            ? ""
            : "none";

    }

}