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
  //CHECK WHETHER THE USER IS LOGGED IN AND THEN HANDLE THE REST
  const isActive = localStorage.getItem("isuserLoggedIn");
  const activeUser = JSON.stringify(localStorage.getItem("activeUser"));
  if (isActive) {
    document.getElementById("dashboard__userName").innerHTML =
      activeUser.firstName;
  }
};
// const blogReadBtn = document.querySelectorAll(".read__story__button");
// blogReadBtn.forEach((elem, index) => {
//   elem.onclick = (e) => {
//     e.preventDefault();
//     console.log("Clicked")
//     const stories = JSON.parse(localStorage.getItem("storiesList"));
//     location.pathname = "/assets/story.html";

//     setTimeout(() => {
    
//       document.querySelector(".story__main").innerHTML = stories[index].story;
//     }, 500);
//   };
// });

//FUNCTION TO HANDLE BACK TO HOME ONCE USER CLICKS THE LOGO BUTTON
const logoBtn = document.querySelectorAll(".head__to__home");
logoBtn.forEach((element) => {
  element.style.cursor = "pointer";
  element.style.userSelect = "none";
  element.onclick = () => {
    location.pathname = "/";
  };
});

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
  }
};
