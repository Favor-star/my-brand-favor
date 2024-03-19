"use strict";

const host = "http://localhost:8080";
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

//FUNCTION TO HANDLE REGISTER USER
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
  confirmStoryForm.classList.remove("hide");

  revert.onclick = () => {
    confirmStoryForm.classList.add("hide");
  };
  confirmStoryForm.onsubmit = (e) => {
    e.preventDefault();
    uploadToStorage(title, image, category, story);
  };
}
async function uploadToStorage(title, image, category, story) {
  const stories = JSON.parse(localStorage.getItem("storiesList")) || [];

  const result = await fetch(`${host}/blogs`, {
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
