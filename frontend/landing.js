const API_URL = "https://creditcardfrauddetector-fwbr.onrender.com";

const startBtn = document.getElementById("startBtn");
const loadingModal = new bootstrap.Modal(
    document.getElementById("loadingModal")
);

const loadingText = document.getElementById("loadingText");

startBtn.addEventListener("click", startDetection);

async function startDetection() {

    startBtn.disabled = true;

    loadingModal.show();

    loadingText.innerHTML = "Connecting to AI Engine...";

    const maxAttempts = 20;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        loadingText.innerHTML =
            `Initializing AI Engine...<br>
             Attempt ${attempt} of ${maxAttempts}`;

        try {

            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 5000);

            const response = await fetch(API_URL, {
                method: "GET",
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (response.ok) {

                loadingText.innerHTML =
                    "✅ AI Engine Ready!";

                setTimeout(() => {

                    window.location.href = "predict.html";

                }, 1000);

                return;
            }

        } catch (error) {

            // Backend is probably still waking up.
            // Ignore and retry.

        }

        await sleep(3000);

    }

    loadingModal.hide();

    alert(
        "The AI server is taking longer than expected to start. Please try again in a few moments."
    );

    startBtn.disabled = false;

}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}