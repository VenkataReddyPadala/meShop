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

  if (passwordEle.value.trim() === "") {
    hasError = true;
    passwordErrEle.style.display = "block";
  } else {
    passwordErrEle.style.display = "none";
  }

  if (newPasswordEle.value.trim() === "") {
    hasError = true;
    newPasswordErrEle.style.display = "block";
  } else {
    newPasswordErrEle.style.display = "none";
  }

  if (
    !validateConfirmPass(
      newPasswordEle.value.trim(),
      newConfirmPasswordEle.value.trim()
    )
  ) {
    hasError = true;
    confirmPasswordErrEle.style.display = "block";
  } else {
    confirmPasswordErrEle.style.display = "none";
  }

  if (
    (!currentUser || currentUser.password !== passwordEle.value.trim()) &&
    !hasError
  ) {
    hasError = true;
    EditFeedbackEle.style.display = "block";
  } else {
    EditFeedbackEle.style.display = "none";
  }

  if (hasError) {
    e.preventDefault();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const newUsers = users.filter((user) => user.email !== currentUser.email);
  currentUser.password = newPasswordEle.value.trim();
  localStorage.setItem("users", JSON.stringify([...newUsers, currentUser]));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Password changed successfully");
});

function validateConfirmPass(pass, confirmPass) {
  return confirmPass !== "" && confirmPass === pass;
}

const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.replace("/");
});
