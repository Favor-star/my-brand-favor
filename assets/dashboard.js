"use strict";
const host = `https://backend-my-brand-favor.onrender.com`;
// const host = "http://localhost:8080";
const accessToken = localStorage.getItem("accessToken");
const fetchStories = async () => {
  const result = await fetch(`${host}/blogs`);
  if (result.ok) {
    const loader = document.querySelector(".loader_wrapper");
    loader.style.transition = "all .2s ease-in-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
  const response = await result.json();

  return response;
};
const fetchComments = async () => {
  const result = await fetch(`${host}/comments`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response = await result.json();
  return response;
};
const fetchUsers = async () => {
  const result = await fetch(`${host}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response = await result.json();
  return response;
};
let path = location.pathname;
path =
  localStorage.getItem("isUserLoggedIn") === "false"
    ? path.replace(/assets\/dashboard.html/, "/")
    : path;
const activeUser = JSON.parse(localStorage.getItem("activeUser"));
const logout = document.querySelectorAll(".logout__btn");
const userName = document.getElementById("dashboard__userName");
const userNameDiv = document.querySelectorAll(".username__div");
userName.innerText = activeUser.firstName;
const logoutDiv = document.querySelectorAll(".logout__div");

//show the name of logged in person

userNameDiv.forEach((element) => {
  element.onclick = () => {
    console.log("clicked");
    logoutDiv.forEach((elem) => {
      elem.classList.toggle("hide");
    });
  };
});

//HANDLE LOGOUT OPERATION
logout.forEach((element) => {
  element.onclick = () => {
    localStorage.setItem("isUserLoggedIn", "false");
    localStorage.removeItem("activeUser");
    localStorage.removeItem("accessToken");
    location.pathname = location.pathname.replace(/assets\/dashboard.html/, "");
  };
});

const accountsList = document.getElementById("list__of__accounts");

//FUNCTION TO HANDLE APPENDING OF REGISTER USER
async function handleRegisteredUser() {
  const users = await fetchUsers();
  accountsList.innerHTML = "";
  users.forEach((element) => {
    const oneAccount = document.createElement("div");
    oneAccount.classList.add("one__account");
    oneAccount.setAttribute("data-target", element._id);
    oneAccount.innerHTML = `<img src="" alt="" />
                              <div class="one__account__texts">
                              <p>${element.firstName}</p>
                              <p>Created on: <strong>${element.createdAt}</strong></p>
                              </div>
                              <span class="account__more__div">
  <span class="account__more__btn" style="padding: 0 3px">
    <i class="ri-more-2-fill"></i>
  </span>
  <span class="account__more hide">
    <i class="ri-delete-bin-line"></i> Delete User
  </span>
</span>`;
    accountsList.appendChild(oneAccount);
  });
  document.getElementById("accounts__created__nmbr").innerHTML = users.length;
  deleteTheUser();
}
handleRegisteredUser();

function deleteTheUser() {
  //function to handle to delete the user
  const moreBtn = document.querySelectorAll(".account__more__btn");
  const accountMore = document.querySelectorAll(".account__more");
  const deleteUserElem = document.querySelectorAll(".account__more");

  //THIS OPENS UP THE DELETE USER BUTTON
  moreBtn.forEach((oneBtn, index) => {
    oneBtn.onclick = (e) => {
      deleteUserElem[index].classList.toggle("hide");
    };
  });
  //THIS IS HANDLES OPERATIONS DONE AFTER THE USER DECIDE TO DELETE
  deleteUserElem.forEach((elem, index) => {
    elem.addEventListener("click", async () => {
      const deleteID =
        elem.parentElement.parentElement.getAttribute("data-target");
      console.log(deleteID);

      //DELETE THE USER FROM DATABASE AND RETURN RESPONSE
      const deleteUser = await fetch(`${host}/users/${deleteID}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const deleteResponse = await deleteUser.json();
      console.log(deleteResponse);
      if (!deleteResponse.OK) {
        alert("User cannot be deleted successfully.Please try again");
        return;
      }
      //CALL THE FUNCTION WHICH IS RESPONSIBLE FOR RE-APPENDING THE USERS, SO THAT CHANGES TAKES EFFECTS TO THE USER
      handleRegisteredUser();
    });
  });
}

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
  // confirmStoryForm.classList.remove("hide");

  revert.onclick = () => {
    confirmStoryForm.classList.add("hide");
  };
  storyErrorDiv.innerHTML = `<i style="color: var(--black)" class='bx bx-loader-alt bx-spin'></i>`;
  uploadToStorage(title, image, category, story);
  // confirmStoryForm.onsubmit = (e) => {
  //   e.preventDefault();
  // };
}
async function uploadToStorage(title, image, category, story) {
  const stories = JSON.parse(localStorage.getItem("storiesList")) || [];

  const response = await fetch(`${host}/blogs`, {
    method: "post",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      storyTitle: title,
      storyContent: story,
      storyCategory: category,
      storyImageURL: image,
    }),
  });

  const result = await response.json();
  if (result.OK) {
    storyErrorDiv.innerHTML = result.message;
    storyErrorDiv.style.color = "white";
    storyErrorDiv.style.padding = "10px";
    storyErrorDiv.style.backgroundColor = "green";

    setTimeout(() => {
      storyErrorDiv.innerHTML = "";
      storyErrorDiv.style.color = "red";
      storyErrorDiv.style.padding = "0";
      storyErrorDiv.style.backgroundColor = "red";
      storyImage.value = "";
      storyTitle.value = "";
      mainStory.value = "";
      appendStory();
    }, 3500);
  } else storyErrorDiv.innerHTML = result.message;

  // const singleStory = {
  //   id: Date.now(),
  //   title: title,
  //   image: image,
  //   category: category,
  //   story: story,
  // };
  // const storiesToUpload = [...stories, singleStory];
  // localStorage.setItem("storiesList", JSON.stringify(storiesToUpload));
}

//FUNCTION TO APPEND AVAILABLE STORIES ON THEIR RESPECTIVE DIVS
async function appendStory() {
  const retrievedStories = await fetchStories();
  const comments = await fetchComments();
  document.querySelector(".story__list").innerHTML = "";
  retrievedStories.forEach((story, index) => {
    const matchingComments = comments.filter(
      (comment) => comment.storyID === story._id
    )[0];

    //FUNCTION TO APPEND NUMBER OF HOW MANY THE STORY WAS VIEWED
    const oneStory = document.createElement("div");
    oneStory.classList.add("one__story__list");
    oneStory.setAttribute("data-target", story._id);
    oneStory.innerHTML = `
   <span class="list__title">
     <span class="title__number">${index + 1}.</span>
      <span class="title__number">
        ${story.storyTitle}
       </span>
     </span>
     <span class="list__views">
       <i class="ri-eye-fill"></i>
       <span class="views__nmbr">${
         //  clicked === undefined
         //    ? "NO"
         //    : clicked.index === index
         //    ? clicked.clicks
         //    : "NO"
         !story.storyVisits ? 0 : story.storyVisits
       } VIEWS</span>
     </span>
     <span>
        <!--<div class="list__views">
            <i class="ri-heart-fill"></i>
            <span>${0} "LIKES"</span>
        </div>-->
          <div class="list__views">
            <i class="ri-message-fill"></i>
            <span>${
              !matchingComments ? 0 : matchingComments.comments.length
            } COMMENTS</span>
          </div>
      </span>
      <div class="more__div">
        <i class="more__btn ri-more-2-fill"></i>
        <div class="more__content">
              <label  class="switch">
                <input type="checkbox" name="check" class="checkbox-slider">
                <span class="slider"></span>
              </label>
              <span class="mores for__hiding not__allowed">
                  <i class="ri-eye-off-fill"></i>
                  Hide Story
              </span>
              <span class="mores for__editing not__allowed">
                <i class="ri-file-edit-line"></i>
                Edit Story
              </span>
              <span class="mores for__deleting not__allowed">
                <i class="ri-delete-bin-line"></i>
                Delete Story
              </span>
          </div>
      </div>`;

    // views[index].innerHTML = clicked.clicks;
    // userClicks.forEach((elem) => {
    //   views.forEach((view, index) => {
    //     if (elem.index === index) {
    //       view.innerHTML = `${elem.clicks} VIEWS`;
    //     }
    //   });
    // });

    document.querySelector(".story__list").appendChild(oneStory);
  });

  deleteStoryInList();
}
//HANDLE CONFIRMATION OF DELETING THE STORIES
function confirmStoryDeletion() {
  const checkboxes = document.querySelectorAll(".checkbox-slider");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const parent = e.target.closest(".more__content");
      if (parent) {
        const mores = parent.querySelectorAll(".mores");
        mores.forEach((more) => {
          //  more.style.display = checkbox.checked ? "inline-block" : "none";
          more.style.cursor = checkbox.checked ? "pointer" : "not-allowed";
          if (checkbox.checked) more.classList.remove("not__allowed");
          else more.classList.add("not__allowed");
          // more.style.pointerEvents = checkbox.checked ? "auto" : "none";
        });
      }
    });
  });
}

// appendStory(JSON.parse(localStorage.getItem("storiesList")));
appendStory();
async function deleteStoryInList() {
  //HANDLE THE MORE BUTTON WITHIN THE RECENT STORIES
  const storyDelete = document.querySelectorAll(".more__content"),
    moreButton = document.querySelectorAll(".more__btn");
  moreButton.forEach((elem, index) => {
    elem.addEventListener("click", (e) => {
      storyDelete[index].classList.toggle("shown");
    });
  });
  //FUNCTION TO HANDLE THE DELETE STORY IN RECENTLY ADDED STORY LISTS
  const forDeleting = document.querySelectorAll(".for__deleting");
  forDeleting.forEach((elem, index) => {
    elem.onclick = async () => {
      console.log("Clicked");
      const deleteID =
        elem.parentElement.parentElement.parentElement.getAttribute(
          "data-target"
        );
      const deleteStory = await fetch(`${host}/blogs/${deleteID}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const deleteRes = await deleteStory.json();
      if (!deleteRes.OK) {
        console.log("User could not be deleted");
        return;
      }
      console.log(deleteRes);
      appendStory();

      // const newStroy = JSON.parse(localStorage.getItem("storiesList")).filter(
      //   (story, storyIndex) => {
      //     return storyIndex !== index;
      //   }
      // );
      // localStorage.setItem("storiesList", JSON.stringify(newStroy));
      // document.querySelector(".story__list").innerHTML = "";
      // appendStory(newStroy);
    };
  });
  confirmStoryDeletion();
}

function updateStory() {}

//FUNCTION TO APPEND LIKES AND COMMENT TO THEIR RESPECTIVE INTERACTION MANAGEMENT
function appendLikesAndComments() {
  const commentsList = JSON.parse(localStorage.getItem("comments")) || [];

  const likes = JSON.parse(localStorage.getItem("likedStory")) || [];
  const titles = (JSON.parse(localStorage.getItem("storiesList")) || []).map(
    (elem) => elem.title
  );

  const storyComments = document.querySelector("[allComments]");
  const commentLikes = document.querySelector(".comments__likes");

  titles.forEach((title, index) => {
    const relatedComments = commentsList.filter(
      (elem) => elem.storyIndex === index
    );
    const singleStory = document.createElement("details");
    singleStory.classList.add("single__story");
    singleStory.innerHTML = `
    
                <summary class="story__summary">
                 ${index + 1}. ${title}
                </summary>
                <div class="comments__likes">
                  <div class="comments">
                  </div>
                  <div class="likes">
                    <h3>Liked by:</h3>
                    <div class="actual__likes">
                      <div class="one__like">
                        <span class="liker__info">
                          <span>John Doe</span>
                          <span>a minute ago</span>
                        </span>
                        <i class="ri-arrow-right-up-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>`;
    const comments = singleStory.querySelector(".comments");
    relatedComments.forEach((comment) => {
      const oneComment = document.createElement("div");
      oneComment.classList.add("one__comment");
      oneComment.innerHTML = `
                <span class="name__date">
                  <span>${comment.commenter[0]} ${comment.commenter[1]}</span>
                    <span><!--2 hours ago--></span>
                </span>
                <div class="actual__comment">
                  <span>${comment.comments}</span>
                  <i class="ri-more-2-line"></i>
                </div>`;
      comments.appendChild(oneComment);
    });
    storyComments.appendChild(singleStory);
  });
}
appendLikesAndComments();
//FUNCTION TO SHOW QUICK STATISTICS ON THEIR RESPECTIVE LOCATIONS
function quickStatistics() {
  const likes = (JSON.parse(localStorage.getItem("likedStory")) || []).length;
  const comments = (JSON.parse(localStorage.getItem("comments")) || []).length;
  const clicks = JSON.parse(localStorage.getItem("userClicks"));
  if (clicks) {
    const sumOfClicks = clicks.reduce((total, elem) => total + elem.clicks, 0);
    document.querySelector("[totalClicks]").innerText = sumOfClicks;
  }
  document.querySelector("[totalLikes]").innerText = likes;
  document.querySelector("[totalShares]");
  document.querySelector("[totalComments]").innerText = comments;
}
quickStatistics();

function adminViewing() {
  const forAdmin = document.querySelectorAll(".for__admin");
  const generalSettings = document.querySelector(".standard");
  const dashboardHeader = document.querySelector("[dashboard__header]");

  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (user.email !== "favoureliab@gmail.com") {
    forAdmin.forEach((element) => {
      element.style.display = "none";
    });
    generalSettings.setAttribute("open", "true");
    dashboardHeader.textContent = "USER DASHBOARD";
  }
}
adminViewing();
async function updateUserInfo() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const matchingUserRes = await fetch(`${host}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const matchingUser = (await matchingUserRes.json()).filter(
    (user) => user.email === activeUser.email
  )[0];
  const firstNameEdit = document.getElementById("firstname__edit"),
    usernameEdit = document.getElementById("username__edit"),
    lastNameEdit = document.getElementById("lastname__edit"),
    phoneEdit = document.getElementById("phone__nmbr__edit"),
    passwordEdit = document.getElementById("password__edit"),
    updateErrorDiv = document.querySelector(".updateErrorDiv");
  const updateInfoForm = document.querySelector("[update__info]");
  firstNameEdit.value = `${matchingUser.firstName}`;
  lastNameEdit.value = `${matchingUser.lastName}`;
  usernameEdit.value = `${matchingUser.firstName.toLowerCase()}${matchingUser.lastName.toLowerCase()}`;
  checkPassword();
  updateInfoForm.onsubmit = async (e) => {
    e.preventDefault();
    updateErrorDiv.innerHTML = `<i style="color: var(--black)" class='bx bx-loader-alt bx-spin'></i>`;
    const infoToUpdate = checkPassword()
      ? {
          firstName: firstNameEdit.value,
          lastName: lastNameEdit.value,
          password: passwordEdit.value.trim(),
        }
      : {
          firstName: firstNameEdit.value,
          lastName: lastNameEdit.value,
        };
    try {
      const matchingUserID = matchingUser._id;
      const updateUserRes = await fetch(`${host}/users/${matchingUserID}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infoToUpdate),
      });
      const updateUser = await updateUserRes.json();
      if (updateUser.OK) {
        updateErrorDiv.innerHTML = updateUser.message;
        updateErrorDiv.classList.add("success");
        setTimeout(() => {
          updateErrorDiv.innerHTML = "";
          updateErrorDiv.classList.remove("success");
        }, 3500);
        console.log(updateUser.userToUpdate.firstName);
        localStorage.removeItem("activeUser");
        localStorage.setItem(
          "activeUser",
          JSON.stringify({
            email: updateUser.userToUpdate.email,
            lastName: updateUser.userToUpdate.lastName,
            firstName: updateUser.userToUpdate.firstName,
          })
        );
        console.log(JSON.parse(localStorage.getItem("activeUser")));
        setTimeout(() => {
          location.reload();
        }, 3000);
        return;
      }
      throw new Error("User could not be updated successfully");
    } catch (error) {
      updateErrorDiv.style.color = "red";
      updateErrorDiv.innerHTML =
        "Informationn could not be updated. Please  try again!";
      setTimeout(() => {
        updateErrorDiv.innerHTML = "";
      }, 3500);
      return;
    }
  };
}
updateUserInfo();

function checkPassword() {
  const passwordEdit = document.getElementById("password__edit");
  const updateErrorDiv = document.querySelector(".updateErrorDiv");
  const confrimPasswordEdit = document.querySelector(
    "#password__confirm__edit"
  );
  updateErrorDiv.style.color = "red";
  //HANDLING PASSWORD VALIDATION
  passwordEdit.onfocus = (e) => {
    updateErrorDiv.innerHTML =
      "Your password should contain at least: 1 uppercase, 1 lowercase,1 symbol, one number and be more than 5 characters";
  };
  passwordEdit.oninput = (e) => {
    const inputValue = e.target.value.trim();
    const result = /(?=.*\d)(?=.*\W)(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(
      inputValue
    );
    if (result) updateErrorDiv.innerHTML = "";
  };
  passwordEdit.onblur = (e) => {
    const inputValue = e.target.value.trim(); //[!@#$%^&*()-_=+{};:',<.>?]
    const result = /(?=.*\d)(?=.*\W)(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(
      inputValue
    );
    updateErrorDiv.innerHTML = result
      ? ""
      : inputValue === ""
      ? ""
      : "Not valid Password";
  };
  if (
    passwordEdit.value.trim() !== "" &&
    passwordEdit.value.trim() === confrimPasswordEdit.value.trim()
  ) {
    return true;
  }
  return false;
}
// async function deleteUser() {
//   const activeUser = JSON.parse(localStorage.getItem("activeUser"));
//   const user = await fetchUsers().filter(user => user.email === activeUser.email)
// console.log(user)
//   console.log(activeUser);
//   const matchingUserID = (await fetchUsers()).filter((user) => user);
// }
// deleteUser();
