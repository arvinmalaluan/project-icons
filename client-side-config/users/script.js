function loadTailwindCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'; // Adjust the version as needed
  document.head.appendChild(link);
}

// Call the function to load Tailwind CSS
loadTailwindCSS();

function loadFlowbite() {
  // Create a link element for the Flowbite CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css';

  // Create a script element for the Flowbite JavaScript
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js';

  // Append the link and script elements to the document head
  document.head.appendChild(cssLink);
  document.head.appendChild(script);
}

// Call the function to load Flowbite CSS and JavaScript
loadFlowbite();


// Create a <style> element
const style = document.createElement('style');

// Set the CSS rules
style.textContent = `
    .popover-content {
        padding: 10px;
    }
`;

// Append the <style> element to the <head> section of the document
document.head.appendChild(style);



async function CreatePost() {
  const title = document.getElementById("title").value;
  const author = sessionStorage.getItem("name");
  const content = document.getElementById("body").value;
  const escapedContent = content.replace(/'/g, "''");
  const account_fkid = sessionStorage.getItem("user_id");
  const profile_fkid = sessionStorage.getItem("profile_id");
  let imageData = null;

  // Get the file input element
  const fileInput = document.getElementById("imageInput");
  // Check if a file is selected
  if (fileInput.files.length > 0) {
    // Get the selected file
    const file = fileInput.files[0];
    // Read the file as a data URL
    imageData = await readFileAsDataURL(file);
  }

  try {
    const postData = {
      title: title,
      author: author,
      content: escapedContent,
      account_fkid: account_fkid,
      profile_fkid: profile_fkid,
      image: imageData,
    };

    const response = await fetch(
      "http://localhost:3000/api/v1/https/community/post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bufferToImageURL(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}

//Fetch Post
async function fetchPost() {
  var postContainer1 = document.getElementById("posts");
  var userid = sessionStorage.getItem("user_id");
  var name = sessionStorage.getItem("name");
  const contentContainer = document.getElementById("postContainer1");


  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`, {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    postData.data.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    let postContent = "";

    for (const post of postData.data) {
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const userVoteStatus = await checkUserVoteStatus(post.post_id, userid); // Assuming userId is 1

      let likestatus, dislikestatus;

      if (userVoteStatus === "upvote") {
        likestatus = `<img src="../img/like.selected.svg" alt="" />`;
        dislikestatus = `<img src="../img/dislike.unselected.svg" alt="" />`;
      } else if (userVoteStatus === "downvote") {
        likestatus = `<img src="../img/like.unselected.svg" alt="" />`;
        dislikestatus = `<img src="../img/dislike.selected.svg" alt="" />`;
      } else {
        likestatus = `<img src="../img/like.unselected.svg" alt="" />`;
        dislikestatus = `<img src="../img/dislike.unselected.svg" alt="" />`;
      }

      let options;

      if (name === post.author) {
        options = `<ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-header text-start">
                <h6>Options</h6>
            </li>

            <li><a class="dropdown-item" href="#" onclick="redirectToProfile(${post.post_id})" onclick="redirectToProfile(${post.post_id})">Edit Post</a></li>
            <li><a class="dropdown-item" href="#" onclick="deletePost(${post.post_id})">Delete Post</a></li>
        </ul>`;
      } else {
        options = `<ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-header text-start">
                <h6>Options</h6>
            </li>

            <li><a class="dropdown-item" href="#">Hide</a></li>
            <li><a class="dropdown-item" href="#">Report</a></li>
        </ul>`;
      }

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const userId = post.user_id;

      const currentPostContent = `
      <div class="border rounded-xs mt-4 mb-2" data-post-id="${post.post_id}">
        <!-- heading -->
        <div class="p-3">
          <div class="d-flex gap-2 align-items-start justify-content-between">
            <div class="d-flex gap-2">
              <div class="relative group">
                <img
                  src=${img}
                  class="rounded-circle user-avatar"
                  style="width: 40px; height: 40px; cursor: pointer;"
                  alt="Avatar"
                />
                <!-- Popover content -->
                <div data-popover id="popover-user-profile-${post.post_id}" role="tooltip" class="absolute z-10 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm invisible" style="padding: 10px; display: flex; flex-direction: column;">
                  <!-- Image, Name, and Button container -->
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <!-- Image and Name container -->
                    <div style="display: flex; align-items: center;">
                      <a href="javascript:void(0);" onclick="navigateToProfile(${userId})">
                        <img src="${img}" class="rounded-circle pop-user-avatar" style="width: 40px; height: 40px;" alt="Avatar" />
                      </a>
                      <p class="m-2" style="margin-left: 8px; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>
                        <a href="javascript:void(0);" onclick="navigateToProfile(${userId})">
                          ${post.author_name.length > 15 ? post.author_name.substring(0, 15) + '...' : post.author_name}
                        </a>
                      </strong></p>
                    </div>
                    <!-- Message button -->
                    <button class="bg-yellow-600 px-2 py-1 text-white rounded">Message</button>
                  </div>
                  <!-- Bio and Location -->
                  <!-- Bio -->
                  <p class="m-0 bio" style="font-style: italic; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${post.author_bio.length > 50 ? post.author_bio.substring(0, 50) + '...' : post.author_bio || "No User Bio"}
                  </p>
                  <div style="display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
                      <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
                    </svg>
                    <p class="m-0" style="font-size: 10px;">${post.author_location || "No User Location"}</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="m-0 text-sm font-semibold">
                  <a href="javascript:void(0);" onclick="navigateToProfile(${userId})">
                    ${post.author_name}
                  </a>
                </p>
                <p class="m-0 text-xs text-gray-500">${formattedTimestamp}</p>
              </div>
            </div>
            <div class="d-flex gap-2 clickable"  data-bs-toggle="dropdown">
              <a><img src="../img/more.svg" style="height: 1rem" alt="" /></a>
            </div>
            ${options}
          </div>
        </div>
        <!-- Content -->
        <div>
          <p class="font-semibold px-3 m-0">
            ${post.title}
          </p>
          <div>
            <p class="text-xs px-3 mb-2 content-span cursor-pointer leading-normal ${post.content.length > 300 ? "text-truncate" : ""}" style="word-wrap: break-word;" id="postContainer${post.post_id}">
              ${post.content}
              <a class="text-xs text-gray-500 mt-1" id="seeMoreButton${post.post_id}" style="${post.content.length > 300 ? "display: block;" : "display:none;"}" onclick="toggleTextExpansion1(${post.post_id});">See More</a>
            </p>
          </div>
          <div id="wow" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
            <div class=${post.image ? "position-relative border" : "d-none"}>
              <img src="${post.image}" width="100%" height="350px" class=${!post.image || (post.image == "null" && "d-none")} style="object-fit: cover; object-position: center" alt=""/>
              <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" style="background-color: rgba(0, 0, 0, 0.5); display: none;" onclick="postModal(${post.post_id})">
                <span>View Post</span>
              </div>
            </div>
          </div>
          <div class="d-flex px-3 py-2 justify-content-between align-items-center">
            ${post.like_count ? `<p class="text-sm text-muted mb-0">${post.like_count} ${post.like_count > 1 ? "upvotes" : "upvote"}</p>` : "<p></p>"}
            ${post.comment_count ? `<p class="text-sm text-muted mb-0">${post.comment_count} ${post.comment_count > 1 ? "comments" : "comment"}</p>` : "<p></p>"}
          </div>
          <div class="d-flex px-3 gap-2 pb-2 mt-2">
            <div class="d-flex gap-1">
              <div style="height: 30px; width: 30px" class="p-1 d-flex justify-content-center align-items-center border rounded-xs clickable" onclick="upVote(${post.post_id})">
                ${likestatus}
              </div>
              <div style="height: 30px; width: 30px" onclick="downVote(${post.post_id})" class="p-1 d-flex justify-content-center align-items-center border rounded-xs clickable">
                ${dislikestatus}
              </div>
            </div>
            <input type="text" placeholder="Write your comment here" class="w-100 text-xs px-2 border rounded-xs" onclick="postModal(${post.post_id}); openModalAndScrollToCommentInput(${post.post_id},'commentInput')"/>
          </div>
        </div>
      </div>
    `;
    

    

      postContent += currentPostContent;
  }

    postContainer1.innerHTML = postContent;

// Add event listeners to user avatars to show popover
const userAvatars = document.querySelectorAll('.user-avatar');
userAvatars.forEach((avatar) => {
    let timer;
    avatar.addEventListener('mouseenter', () => {
        const postId = avatar.closest('.border').getAttribute('data-post-id');
        const popover = document.querySelector(`#popover-user-profile-${postId}`);
        if (popover) {
            popover.style.top = '-17px'; // Adjust the value as needed
            popover.style.left = '50%';
            popover.style.transform = 'translateX(-113%)';
            popover.style.padding = '10px';
            popover.classList.add('visible');
            popover.classList.remove('invisible');
            clearTimeout(timer); // Clear the timer to prevent hiding the popover
        }
    });

    avatar.addEventListener('mouseleave', () => {
        const postId = avatar.closest('.border').getAttribute('data-post-id');
        const popover = document.querySelector(`#popover-user-profile-${postId}`);
        if (popover) {
            timer = setTimeout(() => { // Set a timer to hide the popover after a delay
                popover.classList.remove('visible');
                popover.classList.add('invisible');
            }, 200); // Adjust the delay as needed
        }
    });

    // Add event listener to the popover to prevent it from hiding when the mouse enters
    const popovers = document.querySelectorAll('[data-popover]');
    popovers.forEach((popover) => {
        popover.addEventListener('mouseenter', () => {
            clearTimeout(timer); // Clear the timer to prevent hiding the popover
        });

        popover.addEventListener('mouseleave', () => {
            timer = setTimeout(() => { // Set a timer to hide the popover after a delay
                popover.classList.remove('visible');
                popover.classList.add('invisible');
            }, 200); // Adjust the delay as needed
        });
    });
});


// Ensure popover is initially invisible
document.addEventListener('DOMContentLoaded', () => {
    const popovers = document.querySelectorAll('[data-popover]');
    popovers.forEach((popover) => {
        popover.classList.add('invisible');
    });
});


  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

// Function to navigate to the appropriate profile
async function navigateToProfile(userId) {
  const currentUserId = sessionStorage.getItem("user_id");
  console.log("Current user id: ", currentUserId);
  console.log("Author ID : ", userId);
  const url = currentUserId == userId ? `http://127.0.0.1:5500/client-side-config/users/src/profile.html?userId=${currentUserId}` : `http://127.0.0.1:5500/client-side-config/users/src/other_profile.html?userId=${userId}`;
  window.location.href = url;
    }


async function checkUserVoteStatus(postId, userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/engage/vote/community_post_fkid = ${postId} AND account_fkid = ${userId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      // console.log("no engagement");
    }

    const voteStatus = await response.json();

    if (
      voteStatus.data[0].is_liked === 1 &&
      voteStatus.data[0].is_disliked === 0
    ) {
      return "upvote";
    }

    if (
      voteStatus.data[0].is_liked === 0 &&
      voteStatus.data[0].is_disliked === 0
    ) {
      return "none";
    }

    if (
      voteStatus.data[0].is_liked === 0 &&
      voteStatus.data[0].is_disliked === 1
    ) {
      return "downvote";
    }
  } catch (error) {
    return "none"; // Return 'none' as default if an error occurs
  }
}

async function postModal(id) {
  var userid = sessionStorage.getItem("user_id");
  let currentURL = window.location.href;
  let newURL = currentURL + `?postId=${id}`;

  // Update the URL only if postId parameter doesn't exist
  if (!currentURL.includes("postId")) {
    window.history.pushState({}, "", newURL);
  }

  try {
    var titleModalContainer = document.getElementById("titlemodal");
    var imageModalContainer = document.getElementById("images");
    var contentModalContainer = document.getElementById("contentainer");
    var commentsContainer = document.getElementById("commentsContainer");
    var inputsContainer = document.getElementById("inputs");
    const image = sessionStorage.getItem("image");
    var name = sessionStorage.getItem("name");

    // Fetch post data using the postId
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post/id=${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    if (Array.isArray(postData.data) && postData.data.length > 0) {
      const firstPost = postData.data[0];

      const date = new Date(firstPost.timestamp);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!firstPost.image || firstPost.image == "null") {
        document.getElementById("image-holder-view-post").className = "d-none";
        document.getElementById("info-holder-view-post").className =
          "col-12 col-lg-6 m-auto d-flex justify-content-between flex-column";
      }

      const userVoteStatus = await checkUserVoteStatus(
        firstPost.post_id,
        userid
      ); // Assuming userId is 1

      let likestatus, dislikestatus, likebg_color, dislikebg_color;

      if (userVoteStatus === "upvote") {
        likestatus = `<img src="../img/like.selected.svg" style="width: 14px;" alt="" class="me-1" alt="" />`;
        dislikestatus = ` <img src="../img/dislike.unselected.svg" style="width: 14px;" alt="" class="me-1" />`;
        likebg_color = `bg-gainsboro`;
        dislikebg_color = `bg-whitesmoke`;
      } else if (userVoteStatus === "downvote") {
        likestatus = `<img src="../img/like.unselected.svg" style="width: 14px;" alt="" class="me-1" alt="" />`;
        dislikestatus = `<img src="../img/dislike.selected.svg" style="width: 14px;" alt="" class="me-1" alt="" />`;
        likebg_color = `bg-whitesmoke`;
        dislikebg_color = `bg-gainsboro`;
      } else {
        likestatus = `<img src="../img/like.unselected.svg" style="width: 14px;" alt="" class="me-1" alt="" />`;
        dislikestatus = `<img src="../img/dislike.unselected.svg"  style="width: 14px;" alt="" class="me-1" alt="" />`;
        likebg_color = `bg-whitesmoke`;
        dislikebg_color = `bg-whitesmoke`;
      }

      if (name === firstPost.author) {
        options = `<ul class="dropdown-menu dropdown-menu-end">
        <li class="dropdown-header text-start">
            <h6>Options</h6>
        </li>

        <li><a class="dropdown-item" href="#" onclick="redirectToProfile(${firstPost.post_id})">Edit Post</a></li>
        <li><a class="dropdown-item" href="#" onclick="deletePost(${firstPost.post_id})">Delete Post</a></li>
    </ul>`;
      } else {
        options = `<ul class="dropdown-menu dropdown-menu-end">
        <li class="dropdown-header text-start">
            <h6>Options</h6>
        </li>

        <li><a class="dropdown-item" href="#">Hide</a></li>
        <li><a class="dropdown-item" href="#">Report</a></li>
    </ul>`;
      }

      

      const titleModalContent = `
        <div class="d-flex align-items-start gap-2">
            <img src="${
                firstPost.author_photo ? firstPost.author_photo : "../img/user_default.jpg"
            }" class="mt-1 rounded-circle img-fluid" style="width: 40px; height: 40px" alt="Avatar" />
            <div>
                <p class="m-0 text-sm font-semibold">${firstPost.author_name}</p>
                <p class="m-0 text-xs text-gray-500">${formattedDate}</p>
            </div>
        </div>
        <div class="d-flex gap-2" data-bs-toggle="dropdown">
            <img src="../img/more.svg" style="height: 16px" alt="" />
        </div>
        ${options}
  `;
  
      titleModalContainer.innerHTML = titleModalContent;

      const contentmodalContent = `
              <p class="font-semibold m-0">${firstPost.title}</p>
              <p class="text-xs mb-2 text-truncate" style="word-wrap: break-word;" id="postContent">
                  ${firstPost.content}
                  
              </p>
              <span id="see-more" onclick="toggleTextExpansion()" class="text-xs clickable">See more</span>
                  <p class="text-xs mt-1 m-0">${firstPost.like_count} upvotes</p>
                  <div class="btn-group mt-3 d-flex" style="width: 100%;">
                  
                      <button class="btn ${likebg_color} d-flex align-items-center justify-content-center" onclick="upVote(${firstPost.post_id})">
                      ${likestatus}
                          <p class="m-0 ml-2 text-sm">Upvote</p>
                      </button>
                      <button class="btn ${dislikebg_color} d-flex align-items-center justify-content-center" onclick="downVote(${firstPost.post_id})">
                      ${dislikestatus}
                          <p class="m-0 ml-2 text-sm">Downvote</p>
                      </button>
                  </div>`;

      contentModalContainer.innerHTML = contentmodalContent;

      const imageModalContent = `<img src="${firstPost.image}" alt="" class="w-100" height="600px" style="object-fit: cover; object-position: center">`;

      imageModalContainer.innerHTML = imageModalContent;

      const inputModalContent = `
              <form class="d-flex justify-content-between w-100 align-items-center" onsubmit="addComment(${firstPost.post_id}); return false;">
              <div>
              <img src="${image}" class="rounded-circle" style="width: 33px; height: 33px" alt="Avatar" />
          </div>
          <input type="text" name="" placeholder="Write a comment" class="form-control mx-2 px-2 py-1" id="commentInput">
          <button class="btn d-flex align-items-center justify-content-center" style="width: 20px; height: 30px;">
              <i class="bi bi-send"></i>
          </button>
              </form>
             `;

      inputsContainer.innerHTML = inputModalContent;
    } else {
      console.error("No post data found");
    }

    const response1 = await fetch(
      `http://localhost:3000/api/v1/https/community/comment/community_post_fkid = ${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData1
     = await response1.json();
    console.log(postData1);

    let commentContent = "";

    for (const post of postData1.data) {
      if (name === post.profile_name) {
        options1 = ` <ul class="dropdown-menu">
        <li id="edit-${post.comment_id}"><a class="dropdown-item" onclick="editComment(${post.comment_id}, '${post.comment_content}')">Edit Comment</a></li>
        <li><a class="dropdown-item" onclick="deleteComment(${post.comment_id})">Delete Comment</a></li>
      </ul>`;
      } else {
        options1 = ` <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Hide Comment</a></li>
        <li><a class="dropdown-item" href="#">Report Comment</a></li>
      </ul>`;
      }
      const commentModalContent = `
      <div class="comment-container d-flex gap-2 mt-3 align-items-center" id="comment-container-${
        post.comment_id
      }">
          <img src="${
            post.profile_photo ? post.profile_photo : "../img/user_default.jpg"
          }" class="rounded-circle" style="width: 40px; height: 40px;" alt="Avatar" />
          <div class="rounded p-2" style="background-color: gainsboro;">
              <p class="text-sm font-semibold p-0 m-0">${post.profile_name}</p>
              <div id="comment-text-${post.comment_id}">
              <p class="text-xs p-0 m-0" style="overflow-wrap: break-word;">${
                post.comment_content
              }</p>
              </div>
            
          </div>
          <i class="bi bi-three-dots-vertical clickable" id="three-dots-icon-${
            post.comment_id
          }" data-bs-toggle="dropdown" aria-expanded="false"></i>
          ${options1}
         
      </div>`;

      commentContent += commentModalContent;
    }

    commentsContainer.innerHTML = commentContent;

    // Add event listeners for showing the icon on hover based on container IDs
    postData1.data.forEach((post) => {
      const commentContainer = document.getElementById(
        `comment-container-${post.comment_id}`
      );
      const icon = document.getElementById(
        `three-dots-icon-${post.comment_id}`
      );

      commentContainer.addEventListener("mouseover", function () {
        if (icon) {
          icon.style.display = "inline-block";
        }
      });

      commentContainer.addEventListener("mouseout", function () {
        if (icon) {
          icon.style.display = "none";
        }
      });
    });

    // Add event listeners for showing the icon on hover based on container IDs
    postData1.data.forEach((post) => {
      const commentContainer = document.getElementById(
        `comment-container-${post.comment_id}`
      );
      const icon = document.getElementById(
        `three-dots-icon-${post.comment_id}`
      );

      commentContainer.addEventListener("mouseover", function () {
        if (icon) {
          icon.style.display = "inline-block";
        }
      });

      commentContainer.addEventListener("mouseout", function () {
        if (icon) {
          icon.style.display = "none";
        }
      });
    });
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

// Function to close the modal and clear the postId parameter from the URL
function closeModal() {
  let currentURL = window.location.href;
  let newURL = currentURL.split("?")[0]; // Remove query parameters
  window.history.pushState({}, "", newURL);
}

async function upVote(id) {
  const user_id = sessionStorage.getItem("user_id");
  const profile_id = sessionStorage.getItem("profile_id");

  try {
    const existingEngagement = await checkUserVoteStatus(id, user_id); // Assuming userId is 1

    if (existingEngagement === "upvote") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/https/community/engage/${id}/${user_id}`,
          {
            method: "DELETE",
          }
        );

        if (response.status === 204) {
          location.reload(); // Reload the page upon successful deletion
        } else {
          throw new Error("Failed to delete engagement");
        }
      } catch (error) {
        console.error("Error deleting engagement:", error);
        // Handle the error here (e.g., show an error message to the user)
      }
    } else if (existingEngagement === "downvote") {
      const postData = {
        is_liked: 1,
        is_disliked: 0,
      };
      const response = await fetch(
        `http://localhost:3000/api/v1/https/community/engage/${id}/${user_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      } else {
        location.reload();
      }
    } else {
      const postData = {
        is_liked: 1,
        is_disliked: 0,
        community_post_fkid: id,
        account_fkid: user_id,
        profile_fkid: profile_id,
      };

      // Fetch post data
      const response = await fetch(
        `http://localhost:3000/api/v1/https/community/engage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      } else {
        location.reload();
      }
    }

    // If no existing engagement, proceed with upvoting
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

async function downVote(id) {
  const user_id = sessionStorage.getItem("user_id");
  const profile_id = sessionStorage.getItem("profile_id");

  try {
    const existingEngagement = await checkUserVoteStatus(id, user_id); // Assuming userId is 1

    if (existingEngagement === "downvote") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/https/community/engage/${id}/${user_id}`,
          {
            method: "DELETE",
          }
        );

        if (response.status === 204) {
          location.reload(); // Reload the page upon successful deletion
        } else {
          throw new Error("Failed to delete engagement");
        }
      } catch (error) {
        console.error("Error deleting engagement:", error);
        // Handle the error here (e.g., show an error message to the user)
      }
    } else if (existingEngagement === "upvote") {
      const postData = {
        is_liked: 0,
        is_disliked: 1,
      };
      const response = await fetch(
        `http://localhost:3000/api/v1/https/community/engage/${id}/${user_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      } else {
        location.reload();
      }
    } else {
      const postData = {
        is_liked: 0,
        is_disliked: 1,
        community_post_fkid: id,
        account_fkid: user_id,
        profile_fkid: profile_id,
      };

      // Fetch post data
      const response = await fetch(
        `http://localhost:3000/api/v1/https/community/engage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      } else {
        location.reload();
      }
    }
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

async function addComment(id) {
  const user_id = sessionStorage.getItem("user_id");
  const profile_id = sessionStorage.getItem("profile_id");
  const image = sessionStorage.getItem("image");
  const name = sessionStorage.getItem("name");
  const container = document.getElementById("commentsContainer");
  const inputcontainer = document.getElementById("commentInput");
  const commentText = document.getElementById("commentInput").value;

  if (!commentText) {
    return;
  }

  if (!inputcontainer) {
    console.log("works");
    return;
  }

  try {
    // Assuming you have an input field with id "commentInput"
    const postData = {
      comment: commentText,
      community_post_fkid: id,
      account_fkid: user_id,
      profile_fkid: profile_id,
    };

    const response = await fetch(
      "http://localhost:3000/api/v1/https/community/comment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const responseData = await response.json();

    const comment = responseData.results;

    // Verify comment.insertId
    if (!comment || !comment.insertId) {
      throw new Error("Invalid comment ID received from the server");
    }

    // Construct comment container ID
    const commentContainerId = `comment-container-${comment.insertId}`;

    // Create new comment container element
    var newElement = document.createElement("div");
    newElement.setAttribute("id", commentContainerId);
    newElement.classList.add("d-flex", "gap-2", "mt-3", "align-items-center");

    newElement.innerHTML = `
      <img src="${image}" class="rounded-circle" style="width: 40px; height: 40px;" alt="Avatar">
      <div class="rounded p-2" style="background-color: gainsboro;">
        <p class="text-sm font-semibold p-0 m-0">${name}</p>
        <p class="text-xs p-0 m-0" style="overflow-wrap: break-word;">${commentText}</p>
      </div>
      <i class="bi bi-three-dots-vertical clickable" id="three-dots-icon-${comment.insertId}" data-bs-toggle="dropdown" aria-expanded="false"></i>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" onclick="editComment(${comment.insertId}, '${commentText}')">Edit Comment</a></li>
        <li><a class="dropdown-item" onclick="deleteComment(${comment.insertId})">Delete Comment</a></li>
      </ul>`;

    // Append new comment container to the container
    container.appendChild(newElement);
    inputcontainer.value = "";

    // Add event listeners
    const commentContainer = document.getElementById(commentContainerId);
    if (commentContainer) {
      const icon = commentContainer.querySelector(
        `#three-dots-icon-${comment.insertId}`
      );
      if (icon) {
        commentContainer.addEventListener("mouseover", function () {
          icon.style.display = "inline-block";
        });

        commentContainer.addEventListener("mouseout", function () {
          icon.style.display = "none";
        });
      } else {
        console.error(
          `Icon with ID three-dots-icon-${comment.insertId} not found`
        );
      }
    } else {
      console.error(
        `Comment container with ID ${commentContainerId} not found`
      );
    }
    // Optionally, handle success response if needed
  } catch (error) {
    console.error("Error adding comment:", error.message);
    // Optionally, display an error message to the user
  }
}

async function deleteComment(id) {
  const confirmed = confirm("Are you sure you want to delete this comment?");
  console.log(id);

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id}`;
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/comment/${condition}`,
      {
        method: "DELETE",
      }
    );

    console.log("Response status:", response.status); // Log the response status

    if (response.status === 200) {
      location.reload(); // Reload the page upon successful deletion
    } else {
      throw new Error("Failed to delete comment");
    }
  } catch (error) {
    console.error("Error deleting engagement:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

function editComment(commentId, currentContent) {
  const commentTextElement = document.getElementById(
    `comment-text-${commentId}`
  );

  // Create an input field with the current comment content
  const inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.setAttribute("value", currentContent);
  inputField.classList.add("form-control");

  // Replace the comment text with the input field
  commentTextElement.innerHTML = "";
  commentTextElement.appendChild(inputField);

  // Focus on the input field
  inputField.focus();

  // Add an event listener to handle updating the comment upon pressing Enter
  inputField.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const updatedContent = inputField.value;
      await updateComment(commentId, updatedContent);

      if (updatedContent === ""){
        deleteComment(commentId);
      }
      
    }
  });
}

async function updateComment(commentId, updatedContent) {
  try {
    // Perform an API request to update the comment content
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/comment/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: updatedContent }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update comment");
    }

    // Update the comment text with the updated content
    const commentContainer = document.getElementById(
      `comment-text-${commentId}`
    );

    const updateContainer = document.getElementById(`edit-${commentId}`);

    const updateContent = `<a class="dropdown-item" onclick="editComment(${commentId}, '${updatedContent}')">Edit Comment</a>`
    const commentTextContent = ` <p class="text-xs p-0 m-0" style="overflow-wrap: break-word;">${updatedContent}</p>`;
    commentContainer.innerHTML = commentTextContent;
    updateContainer.innerHTML = updateContent;
  } catch (error) {
    console.error("Error updating comment:", error);
  }
}

// PROFILE
async function fetchAccPost() {
  const id = sessionStorage.getItem("user_id");
  const postContainer = document.getElementById("posts1");
  const offcanvaspostContainer = document.getElementById("posts2");
  const image = sessionStorage.getItem("image");
  const seeMoreButton = document.getElementById("seeMoreButton");

  // Show skeleton loading placeholders initially
  const skeletonContainers = document.querySelectorAll('.skeleton-container');
  skeletonContainers.forEach(container => {
    container.style.display = 'flex';
  });

  try {
    const response = await fetch(`http://localhost:3000/api/v1/https/community/post/account_fkid=${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    postData.data.sort((a, b) => {
      // Sort by timestamp in descending order
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    let postContent = "";

    for (let i = 0; i < Math.min(postData.data.length, 5); i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);
      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const currentPostContent = `
      <div class="flex gap-2 items-center cursor-pointer shadow-md" onclick="postModal(${post.post_id}); openModalAndScrollToCommentInput(${post.post_id}, 'commentInput')">
          <div>
              <img
                  src="${image !== 'null' ? image : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'}"
                  class="rounded-full"
                  style="width: 30px; height: 30px; margin-bottom: 0.85rem;"
                  alt="Avatar"
              />
          </div>
          <div>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
              <p class="text-xs m-0 text-gray-500">${post.title}</p>
          </div>
      </div>
      `;
  
      postContent += currentPostContent;
    }

    // Hide skeleton loading placeholders after posts are loaded
    skeletonContainers.forEach(container => {
      container.style.display = 'none';
    });

    postContainer.innerHTML = postContent;
    offcanvaspostContainer.innerHTML = postContent;

    // Show/hide "See More" button based on the number of posts
    console.log("Number of posts:", postData.data.length);
    if (postData.data.length > 5) {
      seeMoreButton.style.display = "block";
    } else {
      seeMoreButton.style.display = "none";
    }

    // Functionality for "See More" button
    console.log("Button visibility:", seeMoreButton.style.display);
    seeMoreButton.addEventListener("click", function() {
      console.log("See More button clicked");

      if (this.textContent === "See More") {
        // Show all remaining posts
        let remainingPostContent = "";
        for (let i = 5; i < postData.data.length; i++) {
          const post = postData.data[i];
          const timestamp = new Date(post.timestamp);
          const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          const currentPostContent = `
            <div class="flex gap-2 items-center cursor-pointer shadow-md" onclick="postModal(${post.post_id}); openModalAndScrollToCommentInput(${post.post_id}, 'commentInput')">
              <div>
                <img
                  src="${image !== 'null' ? image : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'}"
                  class="rounded-full"
                  style="width: 30px; height: 30px; margin-bottom: 0.85rem;"
                  alt="Avatar"
                />
              </div>
              <div>
                <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
                <p class="text-xs m-0 text-gray-500">${post.title}</p>
              </div>
            </div>
          `;
          remainingPostContent += currentPostContent;
        }
        postContainer.innerHTML += remainingPostContent;
        this.textContent = "See Less";
      } else {
        // Hide additional posts
        // Remove the posts added by "See More" action
        // Update button text
        this.textContent = "See More";
      }
    });
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

document.addEventListener('DOMContentLoaded', fetchAccPost);










// Profile fetching post
async function fetchAccPostProfile() {
  const id = sessionStorage.getItem("user_id");
  const id1 = sessionStorage.getItem("profile_id");
  const postContainer = document.getElementById("posts");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post/account_fkid=${id} OR profile_fkid=${id1}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    postData.data.sort((a, b) => {
      // First, sort by like_count in descending order
      if (b.like_count !== a.like_count) {
        return b.like_count - a.like_count;
      }
      // If like_count is the same, sort by dislike_count in ascending order
      return a.dislike_count - b.dislike_count;
    });

    let postContent = "";

    for (const post of postData.data) {
      const timestamp = new Date(post.timestamp);
      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const currentPostContent = `
      <div class="col-lg-6 col-12">
            <div class="p-3 border rounded-xs">
              <div class="d-flex justify-content-between mb-2">
                <p class="text-xs text-muted m-0">${formattedTimestamp}</p>
                <img src="./../img/more.svg" height="0.5rem" alt="not-found" class="clickable dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" />
                <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" onclick="redirectToCommunity(${post.post_id})">View Post</a></li>
                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#PostModal" onclick="VieweditPost(${post.post_id})">Edit</a></li>
                <li><a class="dropdown-item" onclick="deletePost(${post.post_id})">Delete</a></li>
              </ul>
              </div>
              <p class="fw-semibold m-0">${post.title}</p>
              <p class="text-xs mb-2 mt-1 truncate-overflow text-truncate" style="word-wrap: break-word;">
                ${post.content}
              </p>
            </div>
          </div>
            `;

      postContent += currentPostContent;
    }

    postContainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function fetchStartups() {
  const id = sessionStorage.getItem("profile_id");
  const postContainer = document.getElementById("startups");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/startup-info/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    let postContent = "";

    for (const post of postData.results) {
      const timestamp = new Date(post.timestamp);
      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const currentPostContent = `
      <div class="col-lg-4 col-12">
            <div class="border p-3 rounded-xs">
              <div class="d-flex justify-content-between">
              <p class="font-semibold m-0">${post.title}</p>
              <img src="./../img/more.svg" height="0.5rem" alt="not-found" class="clickable dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" />
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#"  onclick="VieweditStartup(${post.id})" data-bs-toggle="modal" data-bs-target="#Startup">Edit</a></li>
                <li><a class="dropdown-item" onclick="deleteStartup(${post.id})">Delete</a></li>
              </ul>
              </div>
              
              <p class="m-0 text-xs mb-2 mt-1">
                ${post.description}
              </p>
              <a href="${post.link}" class="text-decoration-none">Read more</a>
            </div>
          </div>
            `;

      postContent += currentPostContent;
    }

    postContainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function fetchPartners() {
  const id = sessionStorage.getItem("profile_id");
  const postContainer = document.getElementById("startups");
  console.log("wow");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();
    console.log(postData);

    let postContent = "";

    for (const post of postData.results) {
      const timestamp = new Date(post.timestamp);
      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const currentPostContent = `
      <div class="col-lg-4 col-12">
            <div class="border p-3 rounded-xs">
              <div class="d-flex justify-content-between">
              <p class="font-semibold m-0">${post.name_of_service}</p>
              <img src="./../img/more.svg" height="0.5rem" alt="not-found" class="clickable dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" />
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#"  onclick="VieweditService(${post.id})" data-bs-toggle="modal" data-bs-target="#Service">Edit</a></li>
                <li><a class="dropdown-item" onclick="deleteStartup(${post.id})">Delete</a></li>
              </ul>
              </div>
              
              <p class="m-0 text-xs mb-2 mt-1">
                ${post.description}
              </p>
            </div>
          </div>
            `;

      postContent += currentPostContent;
    }

    postContainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function deletePost(id) {
  const id1 = sessionStorage.getItem("user_id");
  const confirmed = confirm("Are you sure you want to delete this post?");

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id} AND account_fkid = ${id1}`; // Ensure no spaces in the condition

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post/${condition}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      location.reload(); // Reload the page upon successful deletion
    } else {
      throw new Error("Failed to delete engagement");
    }
  } catch (error) {
    console.error("Error deleting engagement:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function VieweditPost(id) {
  var titleInput = document.getElementById("title");
  var descInput = document.getElementById("body");
  var imageContainer = document.getElementById("imageContainer");
  var submitContainer = document.getElementById("submits");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post/id = ${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    titleInput.value = data.data[0].title;
    descInput.value = data.data[0].content;

    sessionStorage.setItem("image64", data.data[0].image);

    var image = document.createElement("img");
    image.classList.add("img-fluid", "w-100");
    image.src = data.data[0].image;
    image.style.height = "600px";

    // Clear previous content and append the new image
    imageContainer.innerHTML = "";
    imageContainer.appendChild(image);

    // Center the image vertically and horizontally
    imageContainer.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center"
    );

    submitContent = `<button type="button" class="btn btn-primary" onclick="editPost(${id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function editPost(id) {
  const confirmed = confirm("Are you sure you want to edit this post?");

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  // Get the file input element
  const fileInput = document.getElementById("imageInput");
  // Check if a file is selected
  if (fileInput.files.length > 0) {
    // Get the selected file
    const file = fileInput.files[0];
    // Read the file as a data URL
    imageData = await readFileAsDataURL(file);
  } else {
    imageData = sessionStorage.getItem("image64");
  }

  description = document.getElementById("body").value;
  const escapedDescription = description.replace(/'/g, "''");

  const body = {
    title: document.getElementById("title").value,
    content: escapedDescription,
    image: imageData,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post/${id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      alert("Updated Successfully");
      location.reload();
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to update post");
    }
  } catch (error) {
    console.error("Error updating post:", error);
    alert("Failed to update post. Please try again.");
  }
}

async function ViewUser() {
  const id = sessionStorage.getItem("user_id");
  var nameInput = document.getElementById("name");
  var bioInput = document.getElementById("bio");
  var locationInput = document.getElementById("location-select");
  var imageContainer = document.getElementById("imageContainer1");
  var submitContainer = document.getElementById("submit1");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/profile/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    nameInput.value = data.results[0].name;
    bioInput.value = data.results[0].bio;
    locationInput.value = data.results[0].location;

    let imgsrc;

    const newpic = sessionStorage.getItem("NewPic");
    const newpic1 = sessionStorage.getItem("newAttach");

    if (newpic) {
      imgsrc = newpic;
    } else if (newpic1) {
      imgsrc = newpic1;
    } else if (data.results[0].photo) {
      sessionStorage.setItem("image64", data.results[0].photo);
      imgsrc = data.results[0].photo;
    } else {
      imgsrc = "../img/user_default.jpg";
    }

    sessionStorage.setItem("imgsrc", imgsrc);

    var image = document.createElement("img");
    image.classList.add("img-fluid", "rounded");
    image.src = imgsrc;
    image.style.maxWidth = "100%";
    image.style.outline = "3px solid #0a3172";
    image.style.outlineOffset = "2px";

    // Clear previous content and append the new image

    var button = document.createElement("button");
    button.classList.add(
      "btn",
      "position-absolute",
      "top-0",
      "end-0",
      "p-0",
      "rounded",
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );
    button.style.width = "30px";
    button.style.height = "30px";
    button.type = "button";

    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("aria-expanded", "false");

    var i = document.createElement("i");
    i.classList.add("bi", "bi-three-dots");

    button.appendChild(i);

    var ul = document.createElement("ul");

    ul.classList.add("dropdown-menu");

    const ulContent = ` <li><a class="dropdown-item" onclick="openPictureModal()">Take a Picture</a></li>
    <li><a class="dropdown-item" onclick="openImageInput()">Attach an Image</a></li>
    <li><a class="dropdown-item" onclick="removePic()">Remove Profile Picture</a></li>`;

    ul.innerHTML = ulContent;

    imageContainer.innerHTML = "";
    imageContainer.appendChild(button);
    imageContainer.appendChild(ul);
    imageContainer.appendChild(image);

    // Center the image vertically and horizontally
    imageContainer.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center"
    );

    submitContent = `<button type="button" class="btn btn-primary" onclick="saveEditProfile(${id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.getElementById("videoElement");
    videoElement.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

function closeCamera() {
  let videoElement = document.getElementById("videoElement");

  // Check if the video element and its srcObject are valid
  if (videoElement && videoElement.srcObject) {
    let stream = videoElement.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    videoElement.srcObject = null;
  }

  // Clear the src attribute of the image element
  let capturedImage = document.getElementById("capturedImage");
  if (capturedImage) {
    capturedImage.src = "";
  }

  // Hide the camera container
  let cameraContainer = document.getElementById("cameraContainer");
  if (cameraContainer) {
    cameraContainer.style.display = "none";
  }
}

function takePicture() {
  var video = document.getElementById("videoElement");
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  // Set the canvas dimensions to match the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the captured image data as a data URL
  var imageDataURL = canvas.toDataURL("image/jpeg");

  // Display the captured image
  var capturedImage = document.getElementById("capturedImage");
  capturedImage.src = imageDataURL;
  sessionStorage.setItem("NewPic", imageDataURL);
  capturedImage.style.display = "block";
}

function openPictureModal() {
  const myModal = new bootstrap.Modal(document.getElementById("PicModal"));
  myModal.show();

  openCamera();
}

function clearImg() {
  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");
}

function openImageInput() {
  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");

  // Create a file input element
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*"; // Accept all types of image files

  // Add an event listener to handle when a file is selected
  input.addEventListener("change", function (event) {
    var file = event.target.files[0];
    if (file) {
      // Read the selected file as a data URL
      var reader = new FileReader();
      reader.onload = function (event) {
        var base64String = event.target.result;
        sessionStorage.setItem("newAttach", base64String);
        ViewUser(1);
      };
      reader.readAsDataURL(file);
    }
  });

  // Click the file input element to trigger the file selection dialog
  input.click();
}