let selectedCountry = "";
let selectedService = "";
let selectedPlan = "";

const INSTAGRAM_URL = "https://www.instagram.com/__stream_store_?stkn=eXBva3hpa21zd3Bt";

// PRICING MATRIX (STREAMING + CLOUD STORAGE)
const pricingData = {
    "Nepal": {
        "Amazon Prime Video": { "1m": "NPR 149", "3m": "NPR 399", "6m": "NPR 599", "12m": "NPR 1,499" },
        "Netflix": { "1m": "NPR 450", "3m": "NPR 999", "6m": "NPR 1,799", "12m": "NPR 2,999" },
        "Disney+ Hotstar": { "1m": "NPR 300", "3m": "NPR 800", "6m": "NPR 1,500", "12m": "NPR 2,800" },
        "iCloud Storage": { "1m": "NPR 150 (50GB)", "3m": "NPR 450 (200GB)", "6m": "NPR 850", "12m": "NPR 1,450 (2TB)" },
        "Google Storage": { "1m": "NPR 250 (100GB)", "3m": "NPR 400 (200GB)", "6m": "NPR 1,350 (2TB)", "12m": "NPR 2,500 (100GB/Yr)" }
    },
    "India": {
        "Amazon Prime Video": { "1m": "₹299", "3m": "₹599", "6m": "₹1,099", "12m": "₹1,499" },
        "Netflix": { "1m": "₹199", "3m": "₹499", "6m": "₹899", "12m": "₹1,699" },
        "Disney+ Hotstar": { "1m": "₹149", "3m": "₹299", "6m": "₹499", "12m": "₹899" },
        "iCloud Storage": { "1m": "₹75 (50GB)", "3m": "₹219 (200GB)", "6m": "₹425", "12m": "₹749 (2TB)" },
        "Google Storage": { "1m": "₹130 (100GB)", "3m": "₹210 (200GB)", "6m": "₹650 (2TB)", "12m": "₹1,300 (100GB/Yr)" }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const countryScreen = document.getElementById("country-screen");

    setTimeout(() => {
        welcomeScreen.style.opacity = "0";
        setTimeout(() => {
            welcomeScreen.classList.add("hidden");
            countryScreen.classList.remove("hidden");
        }, 500);
    }, 1500);
});

function selectCountry(country) {
    selectedCountry = country;
    const flagUrl = country === "Nepal" ? "https://flagcdn.com/w40/np.png" : "https://flagcdn.com/w40/in.png";

    document.getElementById("badge-flag").src = flagUrl;
    document.getElementById("badge-country-name").innerText = country;

    const qrOptionTitle = document.getElementById("qr-option-title");
    const qrModalTitle = document.getElementById("qr-modal-title");
    const qrImage = document.getElementById("qr-code-img");

    if (country === "Nepal") {
        qrOptionTitle.innerText = "eSewa / Fonepay";
        qrModalTitle.innerText = "Scan to Pay via eSewa / Fonepay";
        qrImage.src = "/static/qr-esewa.png";
    } else {
        qrOptionTitle.innerText = "Google Pay / UPI";
        qrModalTitle.innerText = "Scan to Pay via Google Pay / UPI";
        qrImage.src = "/static/qr-gpay.png";
    }

    document.getElementById("country-screen").classList.add("hidden");
    document.getElementById("main-store").classList.remove("hidden");
}

function selectService(service) {
    selectedService = service;
    document.getElementById("main-store").classList.add("hidden");
    document.getElementById("plan-screen").classList.remove("hidden");
    document.getElementById("selected-service-title").innerText = service + " — Select Plan";

    const prices = pricingData[selectedCountry][service];
    document.getElementById("price-1m").innerText = prices["1m"];
    document.getElementById("price-3m").innerText = prices["3m"];
    document.getElementById("price-6m").innerText = prices["6m"];
    document.getElementById("price-12m").innerText = prices["12m"];
}

function backToStore() {
    document.getElementById("plan-screen").classList.add("hidden");
    document.getElementById("main-store").classList.remove("hidden");
}

function selectPlan(plan) {
    selectedPlan = plan;
    document.getElementById("plan-screen").classList.add("hidden");
    document.getElementById("payment-screen").classList.remove("hidden");

    document.getElementById("payment-options-view").classList.remove("hidden");
    document.getElementById("qr-modal").classList.add("hidden");

    document.getElementById("order-summary-text").innerText = `Order: ${selectedService} (${selectedPlan}) — Region: ${selectedCountry}`;
}

function backToPlans() {
    document.getElementById("payment-screen").classList.add("hidden");
    document.getElementById("plan-screen").classList.remove("hidden");
}

function openQRPayment() {
    document.getElementById("payment-options-view").classList.add("hidden");
    document.getElementById("qr-modal").classList.remove("hidden");
}

function closeQRPayment() {
    document.getElementById("qr-modal").classList.add("hidden");
    document.getElementById("payment-options-view").classList.remove("hidden");
}

function submitPaymentProof() {
    const fileInput = document.getElementById("payment-screenshot");
    if (fileInput.files.length === 0) {
        alert("Please select and upload your payment screenshot first.");
        return;
    }

    const formData = new FormData();
    formData.append("screenshot", fileInput.files[0]);
    formData.append("service", selectedService);
    formData.append("plan", selectedPlan);
    formData.append("country", selectedCountry);

    // Send payment proof screenshot to streamstore90@gmail.com via Flask backend
    fetch("/send-verification-email", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Email notification status:", data);
    })
    .catch(error => {
        console.error("Error sending email:", error);
    });

    // Hide QR view and render clean in-app Success Screen
    document.getElementById("qr-modal").classList.add("hidden");
    document.getElementById("payment-options-view").classList.add("hidden");
    document.getElementById("success-screen").classList.remove("hidden");
}