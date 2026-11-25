// Demo-only auth: users are stored in the browser's localStorage.
// For a real app, registration and login must be handled by a backend server.

const USERS_KEY = "users";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Hash the password so it's not stored as plain text (SHA-256, with fallback).
async function hashPassword(password) {
  if (window.crypto && crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0;
  for (const c of password) h = (h * 31 + c.charCodeAt(0)) | 0;
  return "fallback-" + h;
}

function showAlert(message, type = "error") {
  const el = document.getElementById("alert");
  el.textContent = message;
  el.className = `alert ${type} show`;
}

function setFieldError(id, message) {
  const input = document.getElementById(id);
  const err = document.querySelector(`.field-error[data-for="${id}"]`);
  if (err) err.textContent = message || "";
  if (input && input.type !== "checkbox") input.classList.toggle("invalid", !!message);
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
  document.querySelectorAll(".invalid").forEach((e) => e.classList.remove("invalid"));
  document.getElementById("alert").className = "alert";
}

function setSession(user, remember) {
  const data = JSON.stringify({ name: user.name, email: user.email });
  (remember ? localStorage : sessionStorage).setItem("currentUser", data);
}

// If already logged in, skip the auth pages.
if (localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")) {
  location.replace("dashboard.html");
}

// Show / hide password buttons
document.querySelectorAll(".toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "Hide" : "Show";
  });
});

// ---------- Login ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  // Show a success message after registering
  if (new URLSearchParams(location.search).get("registered")) {
    showAlert("Account created! Please log in.", "success");
  }

  document.getElementById("forgot").addEventListener("click", (e) => {
    e.preventDefault();
    showAlert("Password reset needs a backend server — not available in this demo.");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;
    let ok = true;

    if (!EMAIL_RE.test(email)) { setFieldError("email", "Enter a valid email address."); ok = false; }
    if (!password) { setFieldError("password", "Enter your password."); ok = false; }
    if (!ok) return;

    const user = getUsers().find((u) => u.email === email);
    if (!user || user.password !== (await hashPassword(password))) {
      showAlert("Incorrect email or password.");
      return;
    }

    setSession(user, remember);
    location.href = "dashboard.html";
  });
}

// ---------- Register ----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const passInput = document.getElementById("password");
  const bar = document.getElementById("strengthBar");

  passInput.addEventListener("input", () => {
    const p = passInput.value;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const colors = ["#dc2626", "#f97316", "#eab308", "#16a34a"];
    bar.style.width = p ? `${Math.max(score, 1) * 25}%` : "0";
    bar.style.background = colors[Math.max(score, 1) - 1];
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = passInput.value;
    const confirm = document.getElementById("confirm").value;
    const terms = document.getElementById("terms").checked;
    let ok = true;

    if (name.length < 2) { setFieldError("name", "Enter your full name."); ok = false; }
    if (!EMAIL_RE.test(email)) { setFieldError("email", "Enter a valid email address."); ok = false; }
    if (password.length < 8) { setFieldError("password", "Password must be at least 8 characters."); ok = false; }
    if (confirm !== password || !confirm) { setFieldError("confirm", "Passwords do not match."); ok = false; }
    if (!terms) { setFieldError("terms", "You must accept the terms."); ok = false; }
    if (!ok) return;

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      setFieldError("email", "An account with this email already exists.");
      return;
    }

    users.push({ name, email, password: await hashPassword(password), createdAt: new Date().toISOString() });
    saveUsers(users);
    location.href = "index.html?registered=1";
  });
}
