const formEle = document.querySelector("form");
const firstNameEle = document.querySelector("#firstName");
const lastNameEle = document.querySelector("#lastName");
const emailEle = document.querySelector("#email");
const passwordEle = document.querySelector("#password");
const confirmPasswordEle = document.querySelector("#confirmPassword");
let users = [];

document.addEventListener("DOMContentLoaded", () => {
  users = JSON.parse(localStorage.getItem("users")) || [];
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // if (currentUser) {
  //   window.location.href = "/shop";
  // }
});

formEle.addEventListener("submit", (e) => {
  const firstNameErrEle = document.querySelector(".firstNameErr");
  const lastNameErrEle = document.querySelector(".lastNameErr");
  const emailErrEle = document.querySelector(".emailErr");
  const passwordErrEle = document.querySelector(".passwordErr");
  const confirmPasswordErrEle = document.querySelector(".confirmPasswordErr");
  const feedbackEle = document.querySelector(".feedback");

  let hasError = false;
  if (firstNameEle.value.trim() === "") {
    firstNameErrEle.style.display = "block";
    hasError = true;
  } else {
    firstNameErrEle.style.display = "none";
  }

  if (lastNameEle.value.trim() === "") {
    lastNameErrEle.style.display = "block";
    hasError = true;
  } else {
    lastNameErrEle.style.display = "none";
  }

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

  if (
    !validateConfirmPass(
      passwordEle.value.trim(),
      confirmPasswordEle.value.trim()
    )
  ) {
    confirmPasswordErrEle.style.display = "block";
    hasError = true;
  } else {
    confirmPasswordErrEle.style.display = "none";
  }
  if (isOldUser(emailEle.value.trim())) {
    feedbackEle.style.display = "block";
    hasError = true;
    console.log(feedbackEle);
  } else {
    feedbackEle.style.display = "none";
  }

  if (hasError) {
    e.preventDefault();
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    firstName: firstNameEle.value.trim(),
    lastName: lastNameEle.value.trim(),
    email: emailEle.value.trim(),
    password: passwordEle.value.trim(),
    createdAt: Date.now(),
  };

  users = [...users, newUser];
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...newUser, jwtToken: generateToken() })
  );
});

function validateEmail(mail) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(mail);
}

function isOldUser(userEmail) {
  const user = users.find((user) => user.email === userEmail);
  return user ? true : false;
}

function validateConfirmPass(pass, confirmPass) {
  return confirmPass !== "" && confirmPass === pass;
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
