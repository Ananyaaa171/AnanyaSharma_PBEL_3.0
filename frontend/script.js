const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com";

let pieChart = null;
let barChart = null;

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
        Running Prediction...
    `;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {

        let response;

        // Try twice in case Render has just finished waking up
        for (let attempt = 1; attempt <= 2; attempt++) {

            try {

                response = await fetch(`${API_URL}/predict`, {
                    method: "POST",
                    body: formData
                });

                if (response.ok) break;

            } catch (err) {

                if (attempt === 2) throw err;

            }

            // Wait 3 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        if (!response || !response.ok) {
            throw new Error("Prediction failed.");
        }

        const data = await response.json();

        console.log(data);

        // -------------------------------
        // Summary Cards
        // -------------------------------

        document.getElementById("total").innerText = data.total;
        document.getElementById("legitimate").innerText = data.legitimate;
        document.getElementById("fraud").innerText = data.fraud;
        document.getElementById("fraud_percent").innerText =
            data.fraud_percent + "%";

        // -------------------------------
        // Results Table
        // -------------------------------

        document.getElementById("resultsTable").innerHTML = data.table;

        // -------------------------------
        // Destroy Previous Charts
        // -------------------------------

        if (pieChart) {
            pieChart.destroy();
        }

        if (barChart) {
            barChart.destroy();
        }

        // -------------------------------
        // Pie Chart
        // -------------------------------

        pieChart = new Chart(
            document.getElementById("pieChart"),
            {
                type: "pie",
                data: {
                    labels: ["Fraud", "Legitimate"],
                    datasets: [{
                        data: [
                            data.fraud,
                            data.legitimate
                        ],
                        backgroundColor: [
                            "#dc3545",
                            "#198754"
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        );

        // -------------------------------
        // Bar Chart
        // -------------------------------

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
                            data.fraud,
                            data.legitimate
                        ],
                        backgroundColor: [
                            "#dc3545",
                            "#198754"
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "The AI server is still starting. Please wait a few seconds and try again."
        );

    }

    finally {

        button.disabled = false;

        button.innerHTML = `
            <i class="bi bi-search"></i>
            Run Prediction
        `;

    }

});

// --------------------------------------
// Search Table
// --------------------------------------

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

        rows[i].style.display =
            text.includes(input)
                ? ""
                : "none";
    }

}