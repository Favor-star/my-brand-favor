const activeUser = JSON.parse(localStorage.getItem("activeUser"));
const logout = document.querySelectorAll(".logout__btn");
console.log(logout);
const userName = document.getElementById("dashboard__userName");
const userNameDiv = document.querySelectorAll(".username__div");
userName.innerText = activeUser.firstName;
const logoutDiv = document.querySelectorAll(".logout__div");

userNameDiv.forEach((element) => {
  element.onclick = () => {
    console.log("clicked");
    logoutDiv.forEach((elem) => {
      elem.classList.toggle("hide");
    });
  };
});
// userNameDiv.addEventListener("click", () => {
//   logoutDiv.classList.toggle("hide");
// });
logout.forEach((element) => {
  element.onclick = () => {
    localStorage.setItem("isUserLoggedIn", "false");
    localStorage.removeItem("activeUser");
    location.href = "/";
  };
});

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
  document.getElementById("accounts__created__nmbr").innerHTML = users.length;
}
handleRegisteredUser(JSON.parse(localStorage.getItem("users")));

//function to handle to delete the user
const moreBtn = document.querySelectorAll(".account__more__btn");
const accountMore = document.querySelectorAll(".account__more");
const deleteUser = document.querySelectorAll(".account__more");
//THIS OPENS UP THE DELETE USER BUTTON
moreBtn.forEach((oneBtn, index) => {
  oneBtn.onclick = (e) => {
    accountMore[index].classList.toggle("hide");
  };
});

//THIS IS HANDLES OPERATIONS DONE AFTER THE USER DECIDE TO DELETE
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
    document.getElementById("accounts__created__nmbr").innerText =
      udpatedUsers.length;
    handleRegisteredUser(udpatedUsers);
    location.reload();
  });
});

//MANAGE ADDING A STORY
const storyForm = document.getElementById("add__story"),
  storyTitle = document.getElementById("title__story"),
  storyImage = document.getElementById("picture__story"),
  storyCategory = document.getElementById("category__story");
const mainStory = document.getElementById("main__story");
const storyErrorDiv = document.getElementById("story__errors");

storyTitle.onfocus = () => {
  storyErrorDiv.innerHTML = "";
};
mainStory.onfocus = () => {
  storyErrorDiv.innerHTML = "";
};
storyForm.onsubmit = (e) => {
  e.preventDefault();
  if (storyTitle.value === "") {
    storyErrorDiv.innerHTML = "Story Title can't be empty";
    return;
  }
  if (storyImage.value === "") {
    storyErrorDiv.innerHTML = "Please add at least one image";
    return;
  }
  if (mainStory.value === "") {
    storyErrorDiv.innerHTML = "Story itself can't be empty";
    return;
  }
  console.log(storyImage.files[0]);

  const file = storyImage.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64String = event.target.result;
    checkStory(
      storyTitle.value,
      base64String,
      storyCategory.value,
      mainStory.value
    );
  };
  reader.readAsDataURL(file);
};

const confirmStoryForm = document.querySelector(".story__confirm__form"),
  confirmTitle = document.querySelector(".confirm__title"),
  confirmImage = document.querySelector(".confirm__img"),
  confirmMain = document.querySelector(".story__main"),
  revert = document.querySelector(".revert");
function checkStory(title, image, category, story) {
  confirmMain.innerHTML = story;
  confirmTitle.innerHTML = title;
  confirmImage.src = image;
  confirmStoryForm.classList.remove("hide");

  revert.onclick = () => {
    confirmStoryForm.classList.add("hide");
  };
  confirmStoryForm.onsubmit = () => {
    uploadToStorage(title, image, category, story);
  } 
}
function uploadToStorage(title, image, category, story) {
  const stories = JSON.parse(localStorage.getItem("storiesList")) || [];
  const singleStory = {
    title: title,
    image: image,
    category: category,
    story: story,
  };
  const storiesToUpload = [...stories, singleStory];
  localStorage.setItem("storiesList", JSON.stringify(storiesToUpload));
}
// localStorage.removeItem("storiesList");
