"use strict";

// const host = "http://localhost:8080";
const accessToken = localStorage.getItem("accessToken");
const host = "https://backend-my-brand-favor.onrender.com";
async function fetchBlogStories() {
  const response = await fetch(`${host}/blogs`);
  if (response.ok) {
    const loader = document.querySelector(".loader_wrapper");
    if (!loader) return;
    loader.style.transition = "all .2s ease-in-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }

  const result = await response.json();
  return result;
}
async function fetchRelatedComments() {
const storyID = JSON.parse(localStorage.getItem("storyToRead"))._id;
  const response = await fetch(`${host}/comments/${storyID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    const loader = document.querySelector(".loader_wrapper");
    if (!loader) return;
    loader.style.transition = "all .2s ease-in-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
  const result = (await response.json())[0];
  return result;
}
fetchRelatedComments();

async function showStoryOnBlog() {
  const blogStories = document.querySelector(".blog__stories__contents");
  // const response = await fetch("http://localhost:8080/blogs");
  const result = await fetchBlogStories();
  // let stories = JSON.parse(localStorage.getItem("storiesList")) || [];

  result &&
    result.forEach((element) => {
      const story = document.createElement("div");

      story.classList.add("one__story__card");
      story.innerHTML = `
              <div class="one__story__img">
                <img src="${element.storyImageURL}" alt="${element._id}" />
                <div class="tag">- Tech</div>
              </div>
              <div class="one__story__texts">
                <h4>
                 ${element.storyTitle}
                </h4>
                <p>
                ${element.storyContent.slice(0, 100)}...
                </p>
                <a id="${
                  element._id
                }" class="buttons read__story__button">Read Full Story</a>
              </div>`;
      blogStories && blogStories.appendChild(story);
    });

  const blogReadBtn = document.querySelectorAll(".read__story__button");
  blogReadBtn.forEach((elem, index) => {
    elem.onclick = (e) => {
      e.preventDefault();
      const oneStory = result.find(
        (elem) => elem._id === e.target.getAttribute("id")
      );

      //handle the amount the user clicked the story
      trackUserClick(elem._id);
      localStorage.removeItem("storyToread");
      localStorage.setItem("storyToRead", JSON.stringify(oneStory));
      location.pathname = location.pathname.replace(/blog.html/, "story.html");
    };
  });
}
showStoryOnBlog();
//FUNCTION TO READ THE BLOG PAGE
function readStory() {
  const storyMain = document.querySelector(".story__main");
  const storyImage = document.querySelector("#story__img");
  const storyTitle = document.querySelector("#story__title");

  const story = JSON.parse(localStorage.getItem("storyToRead")) || [];
  if (story.length === 0) {
    if (!storyMain) return;
    storyMain.innerHTML = "Ooops";
    storyMain.style.fontSize = "10rem";
    storyTitle.textContent = "NO STORY FOUND, PLEASE RETURN";
    return;
  }
  if (!storyMain) return;
  storyMain.innerHTML = story.storyContent;
  storyImage.src = story.storyImageURL;
  storyTitle.innerHTML = story.storyTitle;
}
readStory();

//FUNCTION TO HANDLE HOW MANY THE USER HAVE CLICKED THE STORY
function trackUserClick(elementIndex) {
  let userClicks = JSON.parse(localStorage.getItem("userClicks")) || [];

  let elementData = userClicks.find((item) => item.index === elementIndex);
  if (!elementData) {
    elementData = { index: elementIndex, clicks: 0 };
    userClicks.push(elementData);
  }
  elementData.clicks++;

  localStorage.setItem("userClicks", JSON.stringify(userClicks));
}

//FUNCTION TO HANDLE COMMENT SUBMISSION AS WELL AS COMMENT APPEND TO THE DIVISION

function checkAddcommentStatus() {
  const commentDiv = document.querySelector(".add__comment") || [];

  if (localStorage.getItem("isUserLoggedIn") === "true") {
    commentDiv.innerHTML = `
    PLEASE ADD A COMMENT TO EXPRESS WHAT YOU THINK ABOUT THIS ARTICLE
    <form id="comment__input">
          <textarea
            name="main__comment"
            id="main__comment"
            cols="30"
            rows="10"
            placeholder="Comment goes here"
          ></textarea>
          <button type="submit" href="" class="buttons" style="padding: 8px 10px"
            >SUBMIT <i style="font-size: 20px" class="ri-mail-send-line"></i
          ></button></form>`;
  } else {
    commentDiv.innerHTML = `<a href="registerPage.html" class="buttons action"
            >LOGIN TO ADD COMMENT</a
          >`;
  }
}
checkAddcommentStatus();

const comment = document.querySelector("#comment__input");
comment &&
  comment.addEventListener("submit", async (e) => {
    e.preventDefault();
    addUserComment();
  });
async function addUserComment() {
const storyID = JSON.parse(localStorage.getItem("storyToRead"))._id;
  const commentInput = document.querySelector("#main__comment");
  const { firstName, lastName } = JSON.parse(
    localStorage.getItem("activeUser")
  );

  const createComment = await fetch(`${host}/comments`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      storyID: storyID,
      comments: [
        {
          commentor: [firstName, lastName],
          commentBody: commentInput.value,
        },
      ],
    }),
  });
  const commentResponse = await createComment.json();
  if (commentResponse.OK) {
    commentInput.value = "";
  }
  appendUserComments();
}
async function appendUserComments() {
  const commentWrapper = document.getElementById("comments__wrapper");
  const result = await fetchRelatedComments();
  if (!result) {
    if (!commentWrapper) return;
    commentWrapper.innerHTML = "NO COMMENTS YET";
    return;
  }
  const relatedComments = result.comments;

  if (!commentWrapper) return;
  commentWrapper.innerHTML = "";
  relatedComments.forEach((comment) => {
    const oneComment = document.createElement("div");
    oneComment.style.marginBottom = "10px";
    oneComment.classList.add("one__comment");
    oneComment.innerHTML = `<span class="commenter__title">
            <p class="commenter">${comment.commentor[0]} ${comment.commentor[1]} </p>
            <!--<p class="time__commented">2 days ago</p>-->
          </span>
          <p class="show__comment">
            ${comment.commentBody}
          </p>
          <!--<div class="comments__icons">
            <div class="icons">
              <i class="ri-heart-3-line"></i>
              10
            </div>
            <div class="icons">
              <i class="ri-reply-line"></i>
              100
            </div>
            <div class="icons">
              <i class="ri-share-forward-2-line"></i>
              SHARE
            </div>
          </div>-->`;

    commentWrapper && commentWrapper.appendChild(oneComment);
  });
}
appendUserComments();

async function handleTrendingStroy() {
  let stories = await fetchBlogStories();
  if (!stories) return;
  const index = stories.length - 1;
  stories = stories[index];
  const readTrending = document.querySelector(".read__more") || [];
  const trendingHeader = document.querySelector("[trendingHeader]") || [];
  const trendingtext = document.querySelector("[trendingtext]") || [];
  const trendingImage = document.querySelector("[trendingImage]") || [];
  trendingHeader.innerHTML = stories.storyTitle;
  trendingImage.src = stories.storyImageURL;
  trendingtext.innerHTML = `${stories.storyContent.slice(0, 143)}...`;
  readTrending.onclick = (e) => {
    e.preventDefault();
    console.log("cliked");
    localStorage.setItem("storyToRead", JSON.stringify(stories));
    location.pathname = location.pathname.replace(/blog.html/, "story.html");
  };
}
handleTrendingStroy();
//FUNCTION TO STORE LIKES IN THE DATABASE
async function trackUserLikes() {
const storyID = JSON.parse(localStorage.getItem("storyToRead"))._id;
  let storiesLikes = JSON.parse(localStorage.getItem("likedStories")) || [];
  const { firstName, lastName } = JSON.parse(
    localStorage.getItem("activeUser")
  );
  const likes = await fetch(`${host}/comments/like/${storyID}`, {
    method: "PATCH",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likedBy: `${firstName} ${lastName}` }),
  });
  const result = await likes.json();
  return result;
}
//FUNCTION TO SHOW WHETHER THE SORY WAS LIKED BY THE USER
const likeBtn = document.querySelector("[likeStory]") || [];
async function likeStory() {
  // let isLiked = false;
  // let storyIndex = JSON.parse(localStorage.getItem("storyToRead"))[0];
  // let likesObj = {
  //   storyIndex: storyIndex,
  // };
  likeBtn.onclick = async () => {
    const isLiked = await trackUserLikes();
    console.log(isLiked);
    if (isLiked.message.includes("added")) {
      likeBtn.innerHTML = `<i class="ri-heart-fill"></i> LIKED`;
    } else {
      likeBtn.innerHTML = `<i class="ri-heart-line"></i> LIKE THIS POST`;
    }
  };
}
likeStory();

const trackLikeOnLoad = async () => {
const storyID = JSON.parse(localStorage.getItem("storyToRead"))._id;
  const response = await fetch(`${host}/comments/${storyID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  if (result.length === 0) return;
  const likes = result[0].likedBy;
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (likes.includes(`${activeUser.firstName} ${activeUser.lastName}`)) {
    likeBtn.innerHTML = `<i class="ri-heart-fill"></i> LIKED`;
  } else {
    likeBtn.innerHTML = `<i class="ri-heart-line"></i> LIKE THIS POST`;
  }
};
trackLikeOnLoad();
const shareStory = () => {
  const shareBtn = document.querySelector("[shareStory]") || [];
  shareBtn.onclick = () => {
    console.log("CLICKED");
    navigator.clipboard
      .writeText(location.href)
      .then(() => {
        alert("SUCCESS!! 😊 STORY LINK COPPIED TO CLIPBOARD");
      })
      .catch((error) => {
        alert("There was an error:", error);
      });
  };
};
shareStory();
