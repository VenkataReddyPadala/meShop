const loginBtn = document.querySelector(".loginBtn");
const signupBtn = document.querySelector(".signupBtn");
signupBtn.addEventListener("click", () => (window.location.href = "/signup"));
loginBtn.addEventListener("click", () => (window.location.href = "/login"));
