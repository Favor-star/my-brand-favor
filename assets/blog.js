"use strict";
// const host = "http://localhost:8080";
const host = "https://backend-my-brand-favor.onrender.com";
async function fetchBlogStories() {
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
}
const blogStories = document.querySelector(".blog__stories__contents");

async function showStoryOnBlog() {
  // const response = await fetch("http://localhost:8080/blogs");
  const result = await fetchBlogStories();
  // let stories = JSON.parse(localStorage.getItem("storiesList")) || [];

  result.forEach((element) => {
    const story = document.createElement("div");
    console.log();
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
function trackUserLikes(index, clickedAgain) {
  let storiesLikes = JSON.parse(localStorage.getItem("likedStories")) || [];
  if (!storiesLikes) {
    let likedStory = { storyIndex: index, likes: 0 };
    if (clickedAgain) {
      likedStory.likes--;
      storiesLikes.push(likedStory);
      return;
    }
    storiesLikes.push(likedStory);
    likedStory.likes++;
  }
  localStorage.setItem("storiesLikes", JSON.stringify(likedStory));
}

//FUNCTION TO HANDLE COMMENT SUBMISSION AS WELL AS COMMENT APPEND TO THE DIVISION
function trackUsercomment() {
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
  const comment = document.querySelector("#comment__input") || [],
    commentInput = document.querySelector("#main__comment");
  const comments = JSON.parse(localStorage.getItem("comments")) || [];
  const index = JSON.parse(localStorage.getItem("storyToRead"))[0];

  comment.onsubmit = (e) => {
    const { firstName, lastName } = JSON.parse(
      localStorage.getItem("activeUser")
    );
    e.preventDefault();
    const newComment = {
      storyIndex: index,
      comments: commentInput.value,
      commenter: [firstName, lastName],
    };

    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    commentInput.value = "";
  };
  const relatedComments = JSON.parse(localStorage.getItem("comments")).filter(
    (comment) => comment.storyIndex === index
  );

  relatedComments.forEach((elem) => {
    const oneComment = document.createElement("div");
    oneComment.style.marginBottom = "10px";
    oneComment.classList.add("one__comment");
    oneComment.innerHTML = `<span class="commenter__title">
            <p class="commenter">${elem.commenter[0]} ${elem.commenter[1]} </p>
            <!--<p class="time__commented">2 days ago</p>-->
          </span>
          <p class="show__comment">
            ${elem.comments}
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
    const com = document.getElementById("comments__wrapper");
    com && com.appendChild(oneComment);
  });
}
// trackUsercomment();

function handleTrendingStroy() {
  let stories = JSON.parse(localStorage.getItem("storiesList")) || [];
  const index = stories.length - 1;
  stories = stories[index];
  const readTrending = document.querySelector(".read__more") || [];
  const trendingHeader = document.querySelector("[trendingHeader]") || [];
  const trendingtext = document.querySelector("[trendingtext]") || {};
  const trendingImage = document.querySelector("[trendingImage]") || [];
  trendingHeader.innerHTML = stories.title;
  trendingImage.src = stories.image;
  trendingtext.innerHTML = `${stories.story.slice(0, 143)}...`;
  readTrending.onclick = (e) => {
    e.preventDefault();
    console.log("cliked");
    localStorage.setItem(
      "storyToRead",
      JSON.stringify([index, stories.title, stories.image, stories.story])
    );
    location.pathname = location.pathname.replace(/blog.html/, "story.html");
  };
}
// handleTrendingStroy();

function likeStory() {
  const likeBtn = document.querySelector("[likeStory]") || [];
  let isLiked = false;
  let storyIndex = JSON.parse(localStorage.getItem("storyToRead"))[0];
  let likesObj = {
    storyIndex: storyIndex,
  };
  likeBtn.onclick = () => {
    const { firstName, lastName } =
      JSON.parse(localStorage.getItem("activeUser")) || [];
    const likedStories = JSON.parse(localStorage.getItem("likedStory")) || [];
    if (!isLiked) {
      const thisStory = likedStories.find(
        (elem) => elem.storyIndex === storyIndex
      );
      const otherStories = likedStories.filter(
        (elem) => elem.storyIndex !== storyIndex
      );
      console.log(thisStory);
      if (thisStory) {
        thisStory.likes = 1;
        localStorage.setItem(
          "likedStory",
          JSON.stringify([...otherStories, thisStory])
        );
      } else {
        likesObj.likes = 1;
        likedStories.push(likesObj);
        localStorage.setItem("likedStory", JSON.stringify(likedStories));
      }
      likeBtn.innerHTML = `<i class="ri-heart-fill"></i> LIKED`;
    } else {
      likeBtn.innerHTML = `<i class="ri-heart-line"></i> LIKE THIS POST`;
      const thisStory = likedStories.find(
        (elem) => elem.storyIndex === storyIndex
      );
      const otherStories = likedStories.filter(
        (elem) => elem.storyIndex !== storyIndex
      );
      thisStory.likes = 0;
      localStorage.setItem(
        "likedStory",
        JSON.stringify([...otherStories, thisStory])
      );
    }
    isLiked = !isLiked;
  };
  onload = () => {
    const isStoryLIked =
      JSON.parse(localStorage.getItem("likedStory")).find(
        (elem) => elem.storyIndex === storyIndex
      ).likes !== 0;
    if (isStoryLIked) {
      likeBtn.innerHTML = `<i class="ri-heart-fill"></i> LIKED`;
      isLiked = true;
    } else {
      likeBtn.innerHTML = `<i class="ri-heart-line"></i> LIKE THIS POST`;
      isLiked = false;
    }
  };
}
// likeStory();
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
