const Themeswitcher = document.querySelectorAll(".theme-switcher");
const body = document.querySelector("body");

Themeswitcher.forEach((elem) => {
  elem.addEventListener("click", () => {
    // body.classList.toggle("dark__mode");

    if (body.classList.contains("dark__mode")) {
      body.classList.remove("dark__mode");
      localStorage.setItem("colorMode", "white");
      elem.classList.remove("bxs-moon");
      elem.classList.add("bxs-sun");
    } else {
      body.classList.add("dark__mode");
      localStorage.setItem("colorMode", "dark");
      elem.classList.remove("bxs-sun");
      elem.classList.add("bxs-moon");
    }
  });
});
const mode = (value) => {
  if (value == "dark") {
    body.classList.add("dark__mode");
  } else {
    body.classList.remove("dark__mode");
  }
};
onload = mode(localStorage.getItem("colorMode"));