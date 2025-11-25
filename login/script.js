// document.addEventListener("DOMContentLoaded", () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   if (currentUser) {
//     window.location.href = "/shop";
//   }
// });

const form = document.querySelector("form");
const emailEle = document.querySelector("#email");
const passwordEle = document.querySelector("#password");

form.addEventListener("submit", (e) => {
  let hasError = false;
  const passwordErrEle = document.querySelector(".passwordErr");
  const emailErrEle = document.querySelector(".emailErr");
  const feedbackEle = document.querySelector(".feedback");
  if (!validateEmail(emailEle.value.trim())) {
    emailErrEle.style.display = "block";
    hasError = true;
  } else {
    emailErrEle.style.display = "none";
  }
  if (passwordEle.value.trim().length < 8) {
    passwordErrEle.style.display = "block";
    hasError = true;
  } else {
    passwordErrEle.style.display = "none";
  }
  let getUser;
  if (
    validateEmail(emailEle.value.trim()) &&
    passwordEle.value.trim().length >= 8
  ) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    getUser = users.find((user) => user.email === emailEle.value.trim());
    if (!getUser) {
      hasError = true;
      feedbackEle.textContent = "Email doesnt exist. Please signup";
      feedbackEle.style.display = "block";
    } else if (getUser.password !== passwordEle.value.trim()) {
      console.log(getUser.password, passwordEle.value.trim());
      hasError = true;
      feedbackEle.textContent = "Email or password incorrect";
      feedbackEle.style.display = "block";
    }
  }
  if (hasError) {
    e.preventDefault();
    return;
  }
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...getUser, jwtToken: generateToken() })
  );
});

function validateEmail(mail) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(mail);
}

function generateToken(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
