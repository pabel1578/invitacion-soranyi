const API_URL = "http://localhost:3000/api/rsvps";
const targetDate = new Date("May 10, 2026 17:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const petalsContainer = document.getElementById("petals");

function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 6 + Math.random() * 6 + "s";
  petal.style.opacity = 0.5 + Math.random() * 0.5;
  petal.style.transform = `scale(${0.7 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
  petalsContainer.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 13000);
}

setInterval(createPetal, 350);

const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

rsvpForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    full_name: document.getElementById("guestName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    attendance: document.getElementById("attending").value,
    guests_count: Number(document.getElementById("guests").value),
    message: document.getElementById("message").value.trim()
  };

  if (!data.full_name) {
    formStatus.textContent = "Por favor escribe tu nombre.";
    formStatus.style.color = "crimson";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Guardando...";
  formStatus.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "No se pudo guardar la confirmación.");
    }

    formStatus.textContent = "Tu confirmación fue guardada correctamente 💖";
    formStatus.style.color = "green";
    rsvpForm.reset();
    document.getElementById("guests").value = 1;
  } catch (error) {
    formStatus.textContent = error.message;
    formStatus.style.color = "crimson";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Guardar confirmación";
  }
});