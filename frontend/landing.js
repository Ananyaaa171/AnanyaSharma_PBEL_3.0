// ==============================
// AI Credit Card Fraud Detection
// Landing Page Script
// ==============================

// Replace with your Render backend URL
const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com";

const startBtn = document.getElementById("startBtn");
const configSection = document.getElementById("configSection");
const configForm = document.getElementById("configForm");

// -------------------------------
// Wake Backend
// -------------------------------

async function wakeBackend() {
    try {
        await fetch(API_URL, {
            method: "GET",
            mode: "cors"
        });

        console.log("Backend wake request sent.");
    } catch (error) {
        console.log("Backend is still waking up...");
    }
}

// -------------------------------
// Start Button
// -------------------------------

startBtn.addEventListener("click", () => {

    configSection.style.display = "block";

    configSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    wakeBackend();

});

// -------------------------------
// Continue Button
// -------------------------------

configForm.addEventListener("submit", function (e) {

    e.preventDefault();

    // Optional loading effect
    const btn = document.getElementById("continueBtn");

    btn.disabled = true;
    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Preparing Analysis...
    `;

    // Small delay for smoother transition
    setTimeout(() => {
        window.location.href = "predict.html";
    }, 1000);

});