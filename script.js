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

console.log(loginEmailInput);
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

regForm.onsubmit = (e) => {
  e.preventDefault();
  
  if (regConfrimPassword.value !== regPassword.value) {
    registerErrorDiv.innerHTML = "Password aren't matching";
    return;
  }

};
