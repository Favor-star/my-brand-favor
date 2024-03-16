"use strict";
//SETTING LAZY LOADING ON IMAGES
document.querySelectorAll("img").forEach((elem) => {
  elem.setAttribute("loading", "lazy");
});

//FUNCTION TO HANDLE THE THEME SWITCHING
const mode = (value) => {
  if (value == "dark") {
    body.classList.add("dark__mode");
  } else {
    body.classList.remove("dark__mode");
  }
};

const Themeswitcher = document.querySelectorAll(".theme-switcher"),
  body = document.querySelector("body");

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
//HANDLING THE BUTTON FOR UPDATING THE STATUS OF THE MODE SWITCHING BUTTON
onload = () => {
  mode(localStorage.getItem("colorMode"));
  if (localStorage.getItem("colorMode") === "dark") {
    Themeswitcher.forEach((elem) => {
      elem.classList.remove("bxs-moon");
      elem.classList.add("bxs-sun");
    });
  }
  // CHECK WHETHER THE USER IS LOGGED IN AND THEN HANDLE THE REST
  // const isActive = localStorage.getItem("isuserLoggedIn");
  // const activeUser = JSON.stringify(localStorage.getItem("activeUser"));
  // if (isActive) {
  //   document.getElementById("dashboard__userName").innerHTML =
  //     activeUser.firstName;
  // }
};
//SHOW THE USERNAME ON NAVBAR FOR SMALL SCREEN
if (
  window.innerWidth < 430 &&
  localStorage.getItem("isUserLoggedIn") === "true"
) {
  if (document.querySelectorAll(".username__div")[1] === undefined);
  // document.querySelectorAll(".username__div")[1].innerHTML =
  //   JSON.parse(localStorage.getItem("activeUser")).firstName || "Login";
}
//FUNCTION TO HANDLE BACK TO HOME ONCE USER CLICKS THE LOGO BUTTON
const logoBtn = document.querySelectorAll(".head__to__home");
logoBtn.forEach((element) => {
  element.style.cursor = "pointer";
  element.style.userSelect = "none";
  element.onclick = () => {
    location.pathname = "/";
  };
});

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
  }
  if (
    window.innerWidth < 430 &&
    localStorage.getItem("isUserLoggedIn") === "true"
  ) {
    if (!document.querySelectorAll(".username__div")[1]) return;
    document.querySelectorAll(".username__div")[1].innerHTML =
      JSON.parse(localStorage.getItem("activeUser")).firstName || "Login";
  }
};

//HANDLING THE CONTACT ME PAGE
const messageMeForm = document.querySelector(".msg__box");
const msgMeEmail = document.getElementById("msg__me__email"),
  msgMeName = document.getElementById("msg__me__name"),
  msgMeSubject = document.getElementById("msg__me__subject"),
  msgMeBody = document.getElementById("msg__me__body"),
  msgMeErrorDiv = document.getElementById("contact__form__error");

messageMeForm &&
  messageMeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
      msgMeBody.value === "" ||
      msgMeEmail.value === "" ||
      msgMeName.value === "" ||
      msgMeSubject.value === ""
    ) {
      msgMeErrorDiv.style.transition = "all .2s ease-in-out";
      msgMeErrorDiv.innerHTML = "Please don't leave an empty input";
      setTimeout(() => {
        msgMeErrorDiv.style.opacity = "0";
        setTimeout(() => {
          msgMeErrorDiv.innerHTML = "";
          msgMeErrorDiv.style.opacity = "1";
        }, 500);
      }, 1000);
      return;
    }
    const storedMessage =
      JSON.parse(localStorage.getItem("userMessages")) || [];
    const singleMessage = {
      message: msgMeBody.value,
      senderName: msgMeName.value,
      senderEmail: msgMeEmail.value,
      subject: msgMeSubject.value,
    };
    const messageToUpload = [...storedMessage, singleMessage];
    localStorage.setItem("userMessages", JSON.stringify(messageToUpload));
    alert("Thanks for contacting us! We will reach you soon");
  });
