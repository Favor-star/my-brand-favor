const blogStories = document.querySelector(".blog__stories__contents");

function showStoryOnBlog() {
  let stories = JSON.parse(localStorage.getItem("storiesList")) || [];
  stories.forEach((element) => {
    const story = document.createElement("div");
    console.log();
    story.classList.add("one__story__card");
    story.innerHTML = `<div class="one__story__card">
              <div class="one__story__img">
                <img src="${element.image}" alt="${element.id}" />
                <div class="tag">- Tech</div>
              </div>
              <div class="one__story__texts">
                <h4>
                 ${element.title}
                </h4>
                <p>
                ${element.story.slice(0, 100)}...
                </p>
                <a  class="buttons read__story__button">Read Full Story</a>
              </div>
            </div>`;
    blogStories && blogStories.appendChild(story);
  });

  const blogReadBtn = document.querySelectorAll(".read__story__button");
  blogReadBtn.forEach((elem, index) => {
    elem.onclick = (e) => {
      e.preventDefault();
      //handle the amount the user clicked the story
      trackUserClick(index);
      localStorage.removeItem("storyToread");
      localStorage.setItem(
        "storyToRead",
        JSON.stringify([
          index,
          stories[index].title,
          stories[index].image,
          stories[index].story,
        ])
      );
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
  storyMain.innerHTML = story[3];
  storyImage.src = story[2];
  storyTitle.innerHTML = story[1];
}
readStory();

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
