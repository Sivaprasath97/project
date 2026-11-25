const raw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
const user = raw ? JSON.parse(raw) : null;

if (!user) {
  location.replace("index.html");
} else {
  // User info
  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  document.getElementById("greeting").textContent = `${part}, ${firstName} 👋`;
  document.getElementById("userName").textContent = user.name;
  document.getElementById("avatar").textContent = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    location.href = "index.html";
  });

  // Mobile sidebar toggle
  const sidebar = document.getElementById("sidebar");
  document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));

  // Bar chart (sample data)
  const sales = [
    ["Jan", 42], ["Feb", 55], ["Mar", 38], ["Apr", 64], ["May", 72], ["Jun", 58],
    ["Jul", 80], ["Aug", 69], ["Sep", 90], ["Oct", 76], ["Nov", 95], ["Dec", 84],
  ];
  const max = Math.max(...sales.map(([, v]) => v));
  const chart = document.getElementById("chart");

  sales.forEach(([month, value]) => {
    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";
    wrap.innerHTML = `<div class="bar" title="${month}: ₹${value}k"></div><span class="bar-label">${month}</span>`;
    chart.appendChild(wrap);
    requestAnimationFrame(() => {
      wrap.querySelector(".bar").style.height = `${(value / max) * 85}%`;
    });
  });

  // Recent activity
  const activity = [
    ["New order #1042 placed", "2m ago"],
    ["Payment received from Ravi K.", "18m ago"],
    ["New customer signed up", "1h ago"],
    ["Order #1038 shipped", "3h ago"],
    ["Refund issued for #1031", "Yesterday"],
  ];
  document.getElementById("activity").innerHTML = activity
    .map(([text, time]) => `<li><span>${text}</span><time>${time}</time></li>`)
    .join("");

  // Recent orders
  const orders = [
    ["#1042", "Priya Sharma", "25 Nov 2026", "₹2,450", "paid"],
    ["#1041", "Arjun Mehta", "24 Nov 2026", "₹8,999", "pending"],
    ["#1040", "Kavya Nair", "24 Nov 2026", "₹1,299", "paid"],
    ["#1039", "Rahul Verma", "23 Nov 2026", "₹5,750", "failed"],
    ["#1038", "Sneha Iyer", "22 Nov 2026", "₹3,120", "paid"],
  ];
  document.getElementById("ordersBody").innerHTML = orders
    .map(
      ([id, name, date, amount, status]) =>
        `<tr><td>${id}</td><td>${name}</td><td>${date}</td><td>${amount}</td>` +
        `<td><span class="badge ${status}">${status[0].toUpperCase() + status.slice(1)}</span></td></tr>`
    )
    .join("");
}
