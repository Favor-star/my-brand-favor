//HNADLE REGISTERING OPERATIONS
const regForm = document.querySelector(".register__contents");
const regPassword = document.getElementById("reg__password");
const regConfrimPassword = document.getElementById("confirm__password");
const regEmail = document.getElementById("reg__email");
const regNames = document.getElementById("reg__names");
const registerErrorDiv = document.getElementById("register__error");
const host = "http://localhost:8080";
//Handle the input of the names
regNames.onfocus = () => {
  document.getElementById("reg__v__names").innerHTML =
    "Enter both names separated by space";
};
regNames.onblur = (e) => {
  const inputValue = e.target.value.trim();
  const [firstName, lastName] = inputValue.split(" ");

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
regEmail.onfocus = () => {
  registerErrorDiv.innerHTML = "";
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

  //HANDLE THE SUBMISSION UPON CHECKING OF RECENT CONDITIONS
  const [firstName, lastName] = regNames.value.split(" ");
  const email = regEmail.value.trim();
  const password = regPassword.value;
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const dateCreated = ` ${day}/${month}/${year}, ${hours}:${minutes}:${seconds} `;
  storeUser({
    createdAt: dateCreated,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
};
async function storeUser(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  for (const singleUser of users) {
    if (user.email === singleUser.email) {
      registerErrorDiv.innerHTML = "User already exist";
      return;
    }
  }

  const registerUser = await fetch(`${host}/users`, {
    method: "post",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(user),
  });
  const res = await registerUser.json();

  if (!res.OK) {
    registerErrorDiv.innerHTML = res.message;
    return;
  }

  const { lastName, firstName, email } = res.user;
  // const usersToUpload = [...users, user];
  // localStorage.setItem("users", JSON.stringify(usersToUpload));
  registerErrorDiv.innerHTML = "Account created successfully";
  registerErrorDiv.style.padding = "10px";
  registerErrorDiv.style.backgroundColor = "green";
  registerErrorDiv.style.color = "white";
  localStorage.setItem(
    "activeUser",
    JSON.stringify({ lastName, firstName, email })
  );
  localStorage.setItem("accessToken", res.accessToken);
  localStorage.setItem("isUserLoggedIn", "true");
  setTimeout(() => {
    location.pathname = location.pathname.replace(
      /registerPage.html/,
      "dashboard.html"
    );
  }, 500);
}
//Once the user is created, naviaget to the dashboard
function navigateTo(user) {
  setTimeout(() => {
    navigateTo(user);
  }, 500);
}

//HANDLE LOGIN OPERATIONS
const loginForm = document.querySelector(".login__contents");
const loginErrorDiv = document.getElementById("login__error");
const loginEmail = document.getElementById("login__email");
const loginPassword = document.getElementById("login__password");

loginForm.onsubmit = async (e) => {
  const user = {
    email: loginEmail.value.trim(),
    password: loginPassword.value.trim(),
  };
  e.preventDefault();
  const logUser = await fetch(`${host}/users/login`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const response = await logUser.json();

  if (!response.OK) {
    loginErrorDiv.innerHTML = response.message;
    setTimeout(() => {
      loginErrorDiv.style.opacity = "0";
      setTimeout(() => {
        loginErrorDiv.innerHTML = "";
        loginErrorDiv.style.opacity = "1";
      }, 300);
    }, 1000);
    return;
  }
  const { firstName, lastName, email } = response.user;
  console.log(response);
  localStorage.setItem("isUserLoggedIn", "true");
  localStorage.setItem("accessToken", response.accessToken);
  localStorage.setItem(
    "activeUser",
    JSON.stringify({ firstName, lastName, email })
  );

  location.pathname = location.pathname.replace(
    /registerPage.html/,
    "dashboard.html"
  );
};
