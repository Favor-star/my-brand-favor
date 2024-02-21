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
    blogStories.appendChild(story);
  });
  const blogReadBtn = document.querySelectorAll(".read__story__button");
  console.log(blogReadBtn);
  blogReadBtn.forEach((elem, index) => {
    elem.onclick = (e) => {
      e.preventDefault();   
        location.pathname = "/assets/story.html";
    };
  });
}
showStoryOnBlog();

//FUNCTION TO READ THE BLOG PAGE
