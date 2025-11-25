const EditProfileformEle = document.querySelector(".EditProfile form");
const EditPasswordformEle = document.querySelector(".EditPassword form");

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    const userInfo = document.querySelector("#userInfo");
    userInfo.textContent = `Hello, ${currentUser.firstName} ${currentUser.lastName}`;
  }
});

EditProfileformEle.addEventListener("submit", (e) => {
  const firstNameEle = document.querySelector("#firstName");
  const lastNameEle = document.querySelector("#lastName");
  const EditFeedbackEle = document.querySelector(".EditProfile .feedback");

  let hasError = false;

  if (firstNameEle.value.trim() === "" && lastNameEle.value.trim() === "") {
    hasError = true;
    EditFeedbackEle.style.display = "block";
  } else {
    EditFeedbackEle.style.display = "none";
  }

  if (!currentUser) {
    hasError = true;
  }

  if (hasError) {
    e.preventDefault();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const newUsers = users.filter((user) => user.email !== currentUser.email);

  if (firstNameEle.value.trim() !== "") {
    currentUser.firstName = firstNameEle.value.trim();
  }
  if (lastNameEle.value.trim() !== "") {
    currentUser.lastName = lastNameEle.value.trim();
  }

  localStorage.setItem("users", JSON.stringify([...newUsers, currentUser]));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Data saved successfully");
});

EditPasswordformEle.addEventListener("submit", (e) => {
  const passwordEle = document.querySelector("#password");
  const newPasswordEle = document.querySelector("#newPassword");
  const newConfirmPasswordEle = document.querySelector("#confirmPassword");

  const passwordErrEle = document.querySelector(".passwordErr");
  const newPasswordErrEle = document.querySelector(".newPasswordErr");
  const confirmPasswordErrEle = document.querySelector(".confirmPasswordErr");
  const EditFeedbackEle = document.querySelector(".EditPassword .feedback");

  let hasError = false;

  passwordErrEle.style.display = "none";
  newPasswordErrEle.style.display = "none";
  confirmPasswordErrEle.style.display = "none";
  EditFeedbackEle.style.display = "none";
  const passwordVal = passwordEle.value.trim();
  const newPasswordVal = newPasswordEle.value.trim();
  const confirmPasswordVal = newConfirmPasswordEle.value.trim();

  if (passwordVal === "") {
    hasError = true;
    passwordErrEle.style.display = "block";
  }

  if (newPasswordVal === "") {
    hasError = true;
    newPasswordErrEle.style.display = "block";
  }

  if (confirmPasswordVal === "") {
    hasError = true;
    confirmPasswordErrEle.style.display = "block";
  }

  if (hasError) {
    e.preventDefault();
    return;
  }

  if (!validateConfirmPass(newPasswordVal, confirmPasswordVal)) {
    hasError = true;
    confirmPasswordErrEle.textContent = "Passwords must be equal";
    confirmPasswordErrEle.style.display = "block";
    EditFeedbackEle.style.display = "none";
  } else if (!currentUser || currentUser.password !== passwordVal) {
    hasError = true;
    EditFeedbackEle.textContent = "You entered wrong password";
    EditFeedbackEle.style.display = "block";
    confirmPasswordErrEle.style.display = "none";
  } else if (currentUser.password === newPasswordVal) {
    hasError = true;
    EditFeedbackEle.textContent =
      "New password can't be the same as the old one";
    EditFeedbackEle.style.display = "block";
    confirmPasswordErrEle.style.display = "none";
  }

  if (hasError) {
    e.preventDefault();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const newUsers = users.filter((user) => user.email !== currentUser.email);
  currentUser.password = newPasswordVal;
  localStorage.setItem("users", JSON.stringify([...newUsers, currentUser]));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Password changed successfully");
  localStorage.removeItem("currentUser");
  window.location.replace("../");
});

function validateConfirmPass(pass, confirmPass) {
  return confirmPass !== "" && confirmPass === pass;
}

const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.replace("../");
});
