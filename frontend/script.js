const SUPABASE_URL = "https://jzvtnewrjqqrbfqqgfen.supabase.co";
const SUPABASE_KEY = "sb_publishable_hz2d16pgL0on7xb4oUtO4A_QhX9TCmy";

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

  const music = document.getElementById("bgMusic");

// Intento automático (PC)
window.addEventListener("load", () => {
  music.volume = 0.4; // volumen suave
  music.play().catch(() => {
    console.log("Autoplay bloqueado");
  });
});

// Para celular (primer toque)
document.addEventListener("click", () => {
  if (music.paused) {
    music.play();
  }
}, { once: true });

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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error Supabase:", result);
      throw new Error(result.message || result.error || "No se pudo guardar la confirmación.");
    }

    formStatus.textContent = "Tu confirmación fue guardada correctamente 💖";
    formStatus.style.color = "green";
    rsvpForm.reset();
    document.getElementById("guests").value = 1;
  } catch (error) {
    console.error("Error guardando:", error);
    formStatus.textContent = error.message || "Error guardando la confirmación.";
    formStatus.style.color = "crimson";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Guardar confirmación";
  }
});

const music = document.getElementById("bgMusic");
const enterBtn = document.getElementById("enterBtn");
const introOverlay = document.getElementById("introOverlay");

// volumen suave
music.volume = 0.35;

enterBtn.addEventListener("click", async () => {
  try {
    await music.play();
  } catch (error) {
    console.log("No se pudo iniciar la música");
  }

  // efecto fade
  introOverlay.style.opacity = "0";

  setTimeout(() => {
    introOverlay.style.display = "none";
  }, 700);
});