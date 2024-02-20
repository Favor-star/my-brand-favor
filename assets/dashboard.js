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
function handleRegisteredUser(users) {
  users.forEach((element, index) => {
    const oneAccount = document.createElement("div");
    oneAccount.classList.add("one__account");
    oneAccount.setAttribute("data-target", index);

    oneAccount.innerHTML = `<img src="" alt="" />
                              <div class="one__account__texts">
                              <p>${element.firstName}</p>
                              <p>Created on: <strong>${element.dateCreated}</strong></p>
                              </div>
                              <span class="account__more__div">
  <span class="account__more__btn" style="padding: 0 3px">
    <i class="ri-more-2-fill"></i>
  </span>
  <span class="account__more hide">
    <i class="ri-delete-bin-line"></i> Delete User
  </span>
</span>;`;
    accountsList.appendChild(oneAccount);
  });
}
handleRegisteredUser(JSON.parse(localStorage.getItem("users")));
//function to handle to delete the user

const moreBtn = document.querySelectorAll(".account__more__btn");
const accountMore = document.querySelectorAll(".account__more");
const deleteUser = document.querySelectorAll(".account__more");
console.log(moreBtn);
moreBtn.forEach((oneBtn, index) => {
  oneBtn.onclick = (e) => {
    accountMore[index].classList.toggle("hide");
  };
});
// accountMore.forEach((elem, index) => {
//   const
//   if(index)
// })

console.log(deleteUser);

deleteUser.forEach((elem, index) => {
  elem.addEventListener("click", () => {
    const allAccounts = Array.from(document.querySelectorAll(".one__account"));
    const indexToDelete = allAccounts.findIndex(
      (elem) => Number(elem.getAttribute("data-target")) === index
    );
    const udpatedUsers = JSON.parse(localStorage.getItem("users")).filter(
      (user, index) => {
        return index !== indexToDelete;
      }
    );
    localStorage.setItem("users", JSON.stringify(udpatedUsers));
    accountsList.innerHTML = "";
    handleRegisteredUser(udpatedUsers);
    location.reload();
  });
});
