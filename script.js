const Themeswitcher = document.querySelectorAll(".theme-switcher"),
  body = document.querySelector("body"),
  moreButton = document.querySelectorAll(".more__btn");

Themeswitcher.forEach((elem) => {
  elem.addEventListener("click", () => {
    // body.classList.toggle("dark__mode");

    if (body.classList.contains("dark__mode")) {
      body.classList.remove("dark__mode");
      localStorage.setItem("colorMode", "white");
      elem.classList.remove("bxs-sun");
      elem.classList.add("bxs-moon");
    } else {
      body.classList.add("dark__mode");
      localStorage.setItem("colorMode", "dark");
      elem.classList.remove("bxs-moon");
      elem.classList.add("bxs-sun");
    }
  });
});
//DECRALING THE SELF INVOKED FUNCTION TO HANDLE THE CONDITION OF THE MODE SWITCHER BUTTON
() => {};
onload = () => {
  mode(localStorage.getItem("colorMode"));
  if (localStorage.getItem("colorMode") === "dark") {
    Themeswitcher.forEach((elem) => {
      elem.classList.remove("bxs-moon");
      elem.classList.add("bxs-sun");
    });
  }
};
//FUNCTION TO HANDLE THE THEME SWITCHING
const mode = (value) => {
  if (value == "dark") {
    body.classList.add("dark__mode");
  } else {
    body.classList.remove("dark__mode");
  }
};

//HANDLE THE NAVIGATION PANE
const navigationPane = document.querySelector("#navigation__pane");
document.getElementById("menu-bar").addEventListener("click", () => {
  navigationPane.style.display = "block";
  setTimeout(() => {
    navigationPane.style.transform = "translateY(0)";
  }, 50);
});
const handleMenuClose = () => {
  navigationPane.style.transform = "translateY(-100%)";
  setTimeout(() => {
    navigationPane.style.display = "block";
  }, 50);
};
document.getElementById("close").addEventListener("click", handleMenuClose);
document
  .querySelectorAll(".nav__sub")
  .forEach((nav) => nav.addEventListener("click", handleMenuClose));

window.onresize = () => {
  if (window.innerWidth >= 834) {
    navigationPane.style.display = "none";
    console.log(window);
  }
};

//HANDLE THE MORE BUTTON WITHIN THE RECENT STORIES
moreButton.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    document
      .querySelector(".more__content")
      .classList.toggle("more__content__shown");
  });
});

//LOGIN FORM VALIDATION
const loginValidDiv = document.getElementById("login__v__email");
const loginEmailInput = document.getElementById("login__email");

loginEmailInput.onblur = (e) => {
  const inputValue = e.target.value;
  loginValidDiv.innerHTML = !/@/g.test(inputValue)
    ? "You should add @ in the email"
    : "";
};

//HNADLE REGISTERING OPERATIONS
const regForm = document.querySelector(".register__contents");
const regPassword = document.getElementById("reg__password");
const regConfrimPassword = document.getElementById("confirm__password");
const regEmail = document.getElementById("reg__email");
const regNames = document.getElementById("reg__names");
const registerErrorDiv = document.getElementById("register__error");
localStorage.setItem("isUserLoggedIn", "false");

//Handle the input of the names
regNames.onfocus = () => {
  document.getElementById("reg__v__names").innerHTML =
    "Enter both names separated by space";
};
regNames.onblur = (e) => {
  const inputValue = e.target.value.trim();
  const [firstName, lastName] = inputValue.split(" ");
  console.log(lastName);
  //CONDITION TO DISPLAY THE ERROR MESSAGE BASED ON THE INPUTS
  document.getElementById("reg__v__names").innerHTML =
    firstName === ""
      ? ""
      : lastName === undefined
      ? "You didn't add the last name"
      : "";
};
//HANDLING THE EMAIL VALIDATION
regEmail.onblur = (e) => {
  const inputValue = e.target.value.trim();
  document.getElementById("reg__v__email").innerText =
    inputValue === ""
      ? ""
      : !/@/g.test(inputValue)
      ? " @ symbol should be included in your email"
      : " ";
};
//HANDLING PASSWORD VALIDATION
regPassword.onfocus = (e) => {
  document.getElementById("reg__v_password").innerHTML =
    "Your password should contain at least: 1 uppercase, 1 lowercase,1 symbol, one number and be more than 5 characters";
};
regPassword.oninput = (e) => {
  const inputValue = e.target.value.trim();
  const result = /(?=.*\d)(?=.*\W)(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(inputValue);
  if (result) document.getElementById("reg__v_password").innerHTML = "";
};
regPassword.onblur = (e) => {
  const inputValue = e.target.value.trim(); //[!@#$%^&*()-_=+{};:',<.>?]
  const result = /(?=.*\d)(?=.*\W)(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(inputValue);
  document.getElementById("reg__v_password").innerHTML = result
    ? ""
    : inputValue === ""
    ? ""
    : "Not valid Password";
};
regForm.onsubmit = (e) => {
  e.preventDefault();
  //check if there is no error left in the div
  if (document.getElementById("reg__v__names").innerHTML !== "") {
    registerErrorDiv.innerHTML = "Correct errors in names";
    return;
  }
  if (document.getElementById("reg__v__email").innerText !== "") {
    registerErrorDiv.innerHTML = "Correct errors in email";
    return;
  }
  if (document.getElementById("reg__v_password").innerHTML !== "") {
    registerErrorDiv.innerHTML = "Correct Errors in password";
    return;
  }
  //check whether there is no input left blank
  if (
    regEmail.value === "" ||
    regNames.value === "" ||
    regPassword.value === ""
  ) {
    registerErrorDiv.innerHTML = "No input must be left blank";
    return;
  }
  if (regConfrimPassword.value !== regPassword.value) {
    registerErrorDiv.innerHTML = "Password aren't matching";
    return;
  }

  //HANDLE THE SUBMISSION UPON CHECNKING OF RECENT CONDITIONS
  const [firstName, lastName] = regNames.value.split(" ");
  const email = regEmail.value.trim();
  const password = regPassword.value;

  storeUser({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
};
function storeUser(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  console.log(users);
  console.log(users);
  for (const singleUser of users) {
    if (user.email === singleUser.email) {
      registerErrorDiv.innerHTML = "User already exist";
      return;
    }
  }
  const usersToUpload = [...users, user];
  console.log(usersToUpload);
  localStorage.setItem("users", JSON.stringify(usersToUpload));
  registerErrorDiv.innerHTML = "Account created successfully";
  registerErrorDiv.style.padding = "10px";
  registerErrorDiv.style.backgroundColor = "green";
  registerErrorDiv.style.color = "white";
  localStorage.setItem("activeUser", JSON.stringify(user));
  localStorage.setItem("isUserLoggedIn", "true");
  setTimeout(() => {
    location.href = "/assets/dashboard.html";
  }, 500);
}
//Once the user is created, naviaget to the dashboard
function navigateTo(user) {
  setTimeout(() => {
    console.log(document.getElementById("dashboard__userName"));
    navigateTo(user);
  }, 500);
}
// localStorage.removeItem("users")
// localStorage.removeItem("activeUser")

// if (isUserLoggedin) {
//   const activeUser = JSON.stringify(localStorage.getItem("activeUser"));
//   document.getElementById("dashboard__userName").innerHTML =
//     activeUser.firstName;
// }
console.log(localStorage.getItem("isUserLoggedIn"));
onload = () => {
  const isActive = localStorage.getItem("isuserLoggedIn");
  const activeUser = JSON.stringify(localStorage.getItem("activeUser"));
  if (isActive) {
    document.getElementById("dashboard__userName").innerHTML =
      activeUser.firstName;
  }
};
