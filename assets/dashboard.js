const activeUser = JSON.parse(localStorage.getItem("activeUser"));
const logout = document.getElementById("logout");

const userName = document.getElementById("dashboard__userName");
const userNameDiv = document.querySelector(".username__div");
userName.innerText = activeUser.firstName;
const logoutDiv = document.querySelector(".logout__div");

userNameDiv.addEventListener("click", () => {
  console.log("clickde");
  logoutDiv.classList.toggle("hide");
});
logout.onclick = () => {
  localStorage.setItem("isUserLoggedIn", "false");
  localStorage.removeItem("activeUser");
  location.href = "/";
};

const accountsList = document.getElementById("list__of__accounts");
function handleRegisteredUser() {
  const users = JSON.parse(localStorage.getItem("users"));
  console.log(users);
  users.forEach((element) => {
    const oneAccount = document.createElement("div");
    oneAccount.classList.add("one__account");
    oneAccount.innerHTML = `<img src="" alt="" />
                <div class="one__account__texts">
                  <p>${element.firstName}</p>
                  <p>Created on: <strong>${element.dateCreated}</strong></p>
                </div>
                <i class="ri-more-2-fill"></i>`;
    accountsList.appendChild(oneAccount);
  });
}
handleRegisteredUser();
//function to handle to delete the user
