async function CreatePost() {
  const title = document.getElementById("title").value;
  console.log(title);
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
    console.log(imageData);
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

    console.log(postData);

    const response = await fetch(
      "http://localhost:3000/api/v1/community/post",
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

async function fetchPost() {
  var postContainer = document.getElementById("posts");
  var userid = sessionStorage.getItem("user_id");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post`,
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
    console.log("Like Count:", postData.data[0]);

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

      const currentPostContent = `
            <div class="border rounded-xs mt-4 mb-2">
            <!-- heading -->
            <div class="p-3">
              <div
                class="d-flex gap-2 align-items-start justify-content-between"
              >
                <div class="d-flex gap-2">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                    class="rounded-circle"
                    style="width: 38px"
                    alt="Avatar"
                  />

                  <div>
                    <p class="m-0 text-sm font-semibold">
                      ${post.author}
                    </p>
                    <p class="m-0 text-xs">${formattedTimestamp}</p>
                  </div>
                </div>

                <div class="d-flex gap-2 clickable"  data-bs-toggle="dropdown">
                  <a><img src="../img/more.svg" style="height: 16px" alt="" /></a>
    
                </div>

                <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-header text-start">
                    <h6>Options</h6>
                </li>
  
                <li><a class="dropdown-item" href="#">Hide</a></li>
                <li><a class="dropdown-item" href="#">Report</a></li>
            </ul>
              </div>
            </div>

            <!-- Content -->
            <div>
              <p class="font-semibold px-3 m-0">
                ${post.title}
              </p>
              <p class="text-xs px-3 mb-2 text-truncate">
                ${post.content}
              </p>
              <div id="wow" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
              <div class="position-relative border">
              <img
                src="${post.image}"
                width="100%"
                height="350px"
                class="mb-2"
                style="object-fit: cover; object-position: center"
                alt=""
              />
              <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" style="background-color: rgba(0, 0, 0, 0.5); display: none;" onclick="postModal(${post.post_id})">
              <span>View Post</span>
          </div>
          </div>
              </div>
              <p class="px-3 m-0 text-xs text-muted pb-2">${post.like_count} upvotes</p>

              <div class="d-flex px-3 gap-2 pb-2 mt-2">
                <div class="d-flex gap-1">
                  <div
                    style="height: 30px; width: 30px"
                    class="p-1 d-flex justify-content-center align-items-center border rounded-xs clickable"
                    onclick="upVote(${post.post_id})"
                  >
                  ${likestatus}
                  </div>
                  <div
                    style="height: 30px; width: 30px"
                    onclick="downVote(${post.post_id})"
                    class="p-1 d-flex justify-content-center align-items-center border rounded-xs clickable"
                  >
                  ${dislikestatus}
                  </div>
                </div>
                
                <input
                  type="text"
                  placeholder="Write your comment here"
                  class="w-100 text-xs px-2 border rounded-xs"
                  onclick="postModal(${post.post_id}); openModalAndScrollToCommentInput(${post.post_id},'commentInput')"
                />

                <div
                    style="height: 30px; width: 30px"
                    class="p-3 d-flex justify-content-center align-items-center border rounded-xs"
                  >
                  <i class="bi bi-send"></i>
                  </div>
              </div>
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

async function checkUserVoteStatus(postId, userId) {
  console.log(postId);
  console.log(userId);
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/engage/vote/community_post_fkid = ${postId} AND account_fkid = ${userId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.log("no engagement");
    }

    const voteStatus = await response.json();
    console.log(voteStatus.data[0].is_liked);

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
    console.log("no engagement");
    return "none"; // Return 'none' as default if an error occurs
  }
}

async function postModal(id) {
  var userid = sessionStorage.getItem("user_id");
  try {
    var titleModalContainer = document.getElementById("titlemodal");
    var imageModalContainer = document.getElementById("images");
    var contentModalContainer = document.getElementById("contentainer");
    var commentsContainer = document.getElementById("commentsContainer");
    var inputsContainer = document.getElementById("inputs");

    // Fetch post data using the postId
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post/id=${id}`,
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

      console.log(firstPost);

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
      // Content

      const titleModalContent = `
              <div class="d-flex gap-2">
                              <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" class="rounded-circle img-fluid" style="width: 38px" alt="Avatar" />
                              <div>
                                  <p class="m-0 text-sm font-semibold">${firstPost.author}</p>
                                  <p class="m-0 text-xs">${formattedDate}</p>
                              </div>
                          </div>
                          <div class="d-flex gap-2" data-bs-toggle="dropdown">
                              <img src="../img/more.svg" style="height: 16px" alt="" />
                          </div>
                          <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-header text-start">
                    <h6>Options</h6>
                </li>
  
                <li><a class="dropdown-item" href="#">Hide</a></li>
                <li><a class="dropdown-item" href="#">Report</a></li>
            </ul>
                          `;
      titleModalContainer.innerHTML = titleModalContent;

      const contentmodalContent = `
              <p class="font-semibold px-3 m-0">${firstPost.title}</p>
              <p class="text-xs px-3 mb-2 text-truncate" id="postContent">
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
              <form class="d-flex justify-content-between align-items-center" onsubmit="addComment(${firstPost.post_id}); return false;">
              <div>
              <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" class="rounded-circle img-fluid me-5" style="width: 38px" alt="Avatar" />
          </div>
          <input type="text" name="" class="form-control me-3" id="commentInput" style="height: 30px;">
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
      `http://localhost:3000/api/v1/community/comment/community_post_fkid = ${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData1 = await response1.json();
    console.log(postData1.data);

    let commentContent = "";

    for (const post of postData1.data) {
      const commentModalContent = ` <div class="d-flex gap-2 mt-3">
          <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" class="rounded-circle" style="width: 40px; height: 40px;" alt="Avatar" />
          <div class="rounded p-2" style="background-color: gainsboro;">
              <p class="text-sm font-semibold p-0 m-0">${post.profile_name}</p>
              <p class="text-xs p-0 m-0" style="overflow-wrap: break-word;">${post.comment_content}</p>
          </div>
      </div>`;

      commentContent += commentModalContent;
    }

    commentsContainer.innerHTML = commentContent;
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

async function upVote(id) {
  const user_id = sessionStorage.getItem("user_id");
  const profile_id = sessionStorage.getItem("profile_id");

  try {
    const existingEngagement = await checkUserVoteStatus(id, user_id); // Assuming userId is 1

    if (existingEngagement === "upvote") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/community/engage/${id}/${user_id}`,
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
        `http://localhost:3000/api/v1/community/engage/${id}/${user_id}`,
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
        `http://localhost:3000/api/v1/community/engage`,
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
  console.log("Downvote button clicked");
  console.log(id);
  console.log(user_id);

  try {
    const existingEngagement = await checkUserVoteStatus(id, user_id); // Assuming userId is 1

    if (existingEngagement === "downvote") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/community/engage/${id}/${user_id}`,
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
        `http://localhost:3000/api/v1/community/engage/${id}/${user_id}`,
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
        `http://localhost:3000/api/v1/community/engage`,
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
  console.log("lol");
  try {
    const commentText = document.getElementById("commentInput").value; // Assuming you have an input field with id "commentInput"
    const postData = {
      comment: commentText,
      community_post_fkid: id,
      account_fkid: user_id,
      profile_fkid: profile_id,
    };

    const response = await fetch(
      "http://localhost:3000/api/v1/community/comment",
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

    location.reload();

    // Optionally, handle success response if needed
  } catch (error) {
    console.error("Error adding comment:", error.message);
    // Optionally, display an error message to the user
  }
}

// PROFILE

async function fetchAccPost() {
  const id = sessionStorage.getItem("user_id");
  var postContainer = document.getElementById("posts1");
  console.log(postContainer);
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post/account_fkid=${id}`,
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
            <div class="d-flex gap-2 align-items-center">
            <div>
              <img
                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                class="rounded-circle"
                style="width: 32px"
                alt="Avatar"
              />
            </div>
            <div>
              <p class="text-xs m-0 text-muted">${formattedTimestamp}</p>
              <p class="text-xs m-0 text-muted">${post.title}</p>
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

// Profile fetching post
async function fetchAccPostProfile() {
  id = sessionStorage.getItem("user_id");
  id1 = sessionStorage.getItem("profile_id");
  var postContainer = document.getElementById("posts");
  console.log(postContainer);
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post/account_fkid=${id} OR profile_fkid=${id1}`,
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
                <img src="./../img/more.svg" height="16px" alt="not-found" class="clickable dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" />
                <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" onclick="redirectToCommunity(${post.post_id})">View Post</a></li>
                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#PostModal" onclick="VieweditPost(${post.post_id})">Edit</a></li>
                <li><a class="dropdown-item" onclick="deletePost(${post.post_id})">Delete</a></li>
              </ul>
              </div>
              <p class="fw-semibold m-0">${post.title}</p>
              <p class="text-xs mb-2 mt-1 truncate-overflow">
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
  id = sessionStorage.getItem("profile_id");
  console.log("ID:", id);
  var postContainer = document.getElementById("startups");
  console.log(postContainer);
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/${id}`,
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
      console.log(post.link);
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
              <img src="./../img/more.svg" height="16px" alt="not-found" class="clickable dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" />
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

async function deletePost(id) {
  const id1 = sessionStorage.getItem("user_id");
  const confirmed = confirm("Are you sure you want to delete this post?");

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id} AND account_fkid = ${id1}`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post/${condition}`,
      {
        method: "DELETE",
      }
    );

    console.log("Response status:", response.status); // Log the response status

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
  var submitContainer = document.getElementById("submit1");

  console.log(id);

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/community/post/id = ${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

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
    console.log(imageData);
  } else {
    imageData = sessionStorage.getItem("image64");
    console.log(imageData);
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
      `http://localhost:3000/api/v1/community/post/${id}`,
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
  id = sessionStorage.getItem("user_id");
  var nameInput = document.getElementById("name");
  var bioInput = document.getElementById("bio");
  var locationInput = document.getElementById("location-select");
  var imageContainer = document.getElementById("imageContainer1");
  var submitContainer = document.getElementById("submit1");

  console.log(id);

  try {
    const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    nameInput.value = data.results[0].name;
    bioInput.value = data.results[0].bio;
    locationInput.value = data.results[0].location;

    console.log(data.results[0].photo);

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
      console.log("wow");
    } else {
      imgsrc = "../img/user_default.jpg";
      console.log("gumana");
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
        console.log("64:", base64String);
        sessionStorage.setItem("newAttach", base64String);
        ViewUser(1);
      };
      reader.readAsDataURL(file);
    }
  });

  // Click the file input element to trigger the file selection dialog
  input.click();
}
