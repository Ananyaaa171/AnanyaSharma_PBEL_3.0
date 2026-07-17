const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com";

const uploadForm = document.getElementById("uploadForm");

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

        // Summary Cards
        document.getElementById("total").innerText = data.total;
        document.getElementById("legitimate").innerText = data.legitimate;
        document.getElementById("fraud").innerText = data.fraud;
        document.getElementById("fraud_percent").innerText =
            data.fraud_percent + "%";

        // Table
        document.getElementById("resultsTable").innerHTML = data.table;

        // Pie Chart
        if (window.pieChart) window.pieChart.destroy();

        window.pieChart = new Chart(document.getElementById("pieChart"), {
            type: "pie",
            data: {
                labels: ["Fraud", "Legitimate"],
                datasets: [{
                    data: [data.fraud, data.legitimate],
                    backgroundColor: ["#dc3545", "#198754"]
                }]
            }
        });

        // Bar Chart
        if (window.barChart) window.barChart.destroy();

        window.barChart = new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: ["Fraud", "Legitimate"],
                datasets: [{
                    label: "Transactions",
                    data: [data.fraud, data.legitimate],
                    backgroundColor: ["#dc3545", "#198754"]
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
        });

    }
    catch (error) {

        console.error(error);

        alert("Prediction failed.");

    }

    finally {

        button.disabled = false;
        button.innerHTML = `
            <i class="bi bi-search"></i>
            Run Prediction
        `;

    }

});

// Search Table

function filterTable() {

    const input = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const table = document.querySelector("table");

    if (!table) return;

    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {

        const text = rows[i].innerText.toLowerCase();

        rows[i].style.display = text.includes(input)
            ? ""
            : "none";
    }
}