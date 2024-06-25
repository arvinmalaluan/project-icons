// Create link element for Tailwind CSS
const tailwindLink = document.createElement("link");
tailwindLink.rel = "stylesheet";
tailwindLink.href =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

// Create script element for SweetAlert2 JavaScript
const sweetAlertScript = document.createElement("script");
sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";

// Append elements to the head section
document.head.appendChild(tailwindLink); // Append Tailwind CSS
document.head.appendChild(sweetAlertScript); // Append SweetAlert2 JavaScript

// Function to load Flowbite CSS and JavaScript
function loadFlowbite() {
  // Create a link element for the Flowbite CSS
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css";

  // Create a script element for the Flowbite JavaScript
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js";

  // Append the link and script elements to the document head
  document.head.appendChild(cssLink);
  document.head.appendChild(script);
}

// Call the function to load Flowbite CSS and JavaScript
loadFlowbite();

async function createAcc() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  const role_fkid = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password1").value;

  if (!email || !password || !username || !confirmPassword || !role_fkid) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill all input fields",
    });
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Passwords do not match",
    });
    return;
  }

  if (password.length < 8) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "The password is not 8 characters long",
    });
    return;
  }

  const preFunctionSuccess1 = await checkusername(username);

  if (!preFunctionSuccess1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Username already exist",
    });
    return;
  }

  const preFunctionSuccess = await checkemail(email);

  if (!preFunctionSuccess) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email already exist",
    });
    return;
  }

  // Send a POST request to the server to register the user
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/https/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // recovery_email,
          email,
          password,
          role_fkid,
          username,
        }), // Send email and password to the server
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the error message from the server
      throw new Error(errorMessage || "Failed to register user");
    }

    const responseData = await response.json(); // Get the response data from the server

    // Generate random profile immediately after sign-up
    await RandomProfile(responseData.insertId);

    // Show confirmation message to the user
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "User registration successful! A verification email has been sent to your email address. Please verify your email to activate your account.",
    }).then(() => {
      // Redirect to login page after clicking "OK" on the SweetAlert
      window.location.href = "./login.html";

      // Alternatively, you can redirect to another page or trigger additional actions here
    });
  } catch (error) {
    console.error("Error registering user:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to register user. Please try again.",
    });
  }
}

async function checkemail(email) {
  console.log("wow");
  var condition = `email = "${email}"`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/auth/checkval/${condition}`,
      {
        method: "GET",
      }
    );

    console.log("Response status:", response.status); // Log the response status

    if (response.status === 200) {
      return true;
    } else if (response.status === 204) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function checkusername(user) {
  console.log("wow");
  var condition = `username = "${user}"`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/auth/checkval/${condition}`,
      {
        method: "GET",
      }
    );

    console.log("Response status:", response.status); // Log the response status

    if (response.status === 200) {
      return true;
    } else if (response.status === 204) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function signin() {
  const email = document.getElementById("sign_email").value;
  const pass = document.getElementById("sign_password").value;

  if (!email || !pass) {
    // alert("Please fill in both email and password fields.");
    Swal.fire({
      icon: "warning",
      // title: 'Please fill in both email and password fields.',
      text: "Please fill in both email and password fields.",
    });
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/https/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, pass: pass }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to sign in. Please try again later.");
    }

    const data = await response.json();

    console.log("Sign-in response:", data);

    if (
      data.success === 1 &&
      data.message &&
      data.message.auth === "valid" &&
      data.message.id
    ) {
      console.log("User ID:", data.message.id);
      sessionStorage.setItem("user_id", data.message.id);
      sessionStorage.setItem("username", data.message.username);
      localStorage.setItem("token", data.token);

      if (data.message.role === 2) {
        sessionStorage.setItem("role", "startup");
      } else if (data.message.role === 3) {
        sessionStorage.setItem("role", "partner");
      } else if (data.message.role === 4) {
        sessionStorage.setItem("role", "content_manager");
      } else {
        sessionStorage.setItem("role", "admin");
      }

      console.log(
        "User ID in session storage:",
        sessionStorage.getItem("user_id")
      );

      if (!data.message.isVerified) {
        // Prompt the user to verify their email
        Swal.fire({
          title: "Email Not Verified!",
          text: "Please verify your email before signing in.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      getProfileSignin(data.message.id);

      // Redirect to home.html after a delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);

      // Call fetchAndDisplaySearchResults after setting the user ID
      const keyword = new URLSearchParams(window.location.search).get(
        "keyword"
      );
      if (keyword) {
        fetchAndDisplaySearchResults(keyword);
      } else {
        console.error("Keyword not found in URL parameters");
      }

      window.location.href = "./community.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Username or Password",
        text: "Please check your username and password and try again.",
      });
    }
  } catch (error) {
    console.error("Error signing in:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to sign in. Please try again later.",
    });
  }
}

// Function to render the navbar
async function navBar() {
  const navbarContainer = document.getElementById("header");
  const name = sessionStorage.getItem("name");
  const image = sessionStorage.getItem("image");
  const navbarContent = `
      <div class="d-flex ">
      <i class="bi bi-list d-block d-md-none" style="font-size: 24px; margin-right: 16px;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"></i>
      <a href="home.html" class="logo d-flex align-items-center">
        <img src="../img/logo2.png" alt="logo" style="height: 32px" />
      </a>
    </div>

    <nav class="header-nav">
      <ul class="d-flex align-items-center gap-2">
        <li class="nav-item d-block d-lg-none"></li>
        <div class="relative">
          <input 
            id="searchInput" 
            autocomplete="off" 
            onkeypress="handleKeyPress(event)"
            oninput="handleSearchInput(event)" 
            type="text" 
            class="w-full sm:w-30 h-10 pl-3 sm:pl-4 pr-10 sm:pr-12 border border-gray-300 rounded-md text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Search user or post..."
          />
          <span class="absolute inset-y-0 right-2 flex items-center pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 ml-1 sm:ml-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <div id="searchResults" class="absolute z-10 w-full sm:max-w-md max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg"></div>
        </div>

      
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown" style="z-index: 999;">
            <img src="${
              image !== "null"
                ? image
                : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
            }" alt="Profile" class="rounded-circle border flex-grow-0" style="outline: 1px solid #0a3172" height="40px" width="40px" />
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile" style="z-index: 999;">
            <li class="dropdown-header">
              <h6 class="name-text" style="white-space: pre-wrap;">${name}</h6>
              <span>BatstateU CTI</span>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item d-flex align-items-center" href="profile.html"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
          </svg>
          </i><span>My Profile</span></a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item d-flex align-items-center" href="community.html"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
          </svg>
          </i><span>Community</span></a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item d-flex align-items-center" href="messages.html"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
          </svg>
          </i><span>Messages</span></a></li>
            <li><hr class="dropdown-divider" /></li>
            
          ${
            sessionStorage.getItem("role") == "content_manager"
              ? `
            <li><a class="dropdown-item d-flex align-items-center" href="manage_newsletter.page.html">
              <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12zM13 4l5 5h-5V4zM7 8h3v2H7V8zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"></path></svg>
              </i><span>Manage Newsletter</span></a></li>
              <li><hr class="dropdown-divider" />
            </li>
            `
              : `
            <li><a class="dropdown-item d-flex align-items-center" href="newsletter.page.html">
              <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12zM13 4l5 5h-5V4zM7 8h3v2H7V8zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"></path></svg>
              </i><span>Newsletter</span></a></li>
              <li><hr class="dropdown-divider" />
            </li>
            `
          }

          <li><a class="dropdown-item d-flex align-items-center" href="#">
            <i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
            </svg>
            </i><span>Account Settings</span></a>
          </li>
          
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item d-flex align-items-center" href="#" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i><span>Log Out</span></a></li>
          </ul>
        </li>
      </ul>
    </nav>
  `;

  navbarContainer.innerHTML = navbarContent;

  // const dropdownNotificationButton = document.getElementById("dropdownNotificationButton");
  // dropdownNotificationButton.addEventListener("click", displayNotification);
}

// onMessageListener((payload) => {
//   console.log("Notification received:", payload);
//   // Extract notification data and display it in the navbar dropdown
//   displayNotification(payload.data.title, payload.data.body, payload.data.click_action);
// });

// function displayNotification(title, body, clickAction) {
//   const notificationContent = `
//       <a href="${clickAction}" class="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
//           <div>
//               <h3 class="text-lg font-medium text-gray-900">${title}</h3>
//               <p class="text-sm text-gray-500">${body}</p>
//           </div>
//       </a>
//   `;
//   const dropdownNotification = document.getElementById("dropdownNotification");
//   dropdownNotification.innerHTML += notificationContent;
// }

// Call the navBar function to render the navbar when the page loads
window.addEventListener("DOMContentLoaded", navBar);

function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout",
    allowOutsideClick: () => {
      const popup = Swal.getPopup();
      popup.classList.remove("swal2-show");
      setTimeout(() => {
        popup.classList.add("animate__animated", "animate__headShake");
      });
      setTimeout(() => {
        popup.classList.remove("animate__animated", "animate__headShake");
      }, 500);
      return false;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear session storage
      sessionStorage.clear();
      localStorage.clear();

      // Replace current page with login page in the browser history
      history.replaceState({}, "", "login.html");

      // Redirect to login page
      window.location.href = "login.html";
    }
  });
}

async function getProfileSignin(id) {
  console.log(id);
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
    const profile = data.results[0];

    if (profile.photo === "" || null) {
      console.log("wew");
      img = "../img/user_default.jpg";
    } else {
      img = profile.photo;
    }

    sessionStorage.setItem("profile_id", profile.id);
    sessionStorage.setItem("name", profile.name);
    sessionStorage.setItem("image", img);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

async function RandomProfile(id) {
  const name = generateRandomUserID();
  // const name = generateRandomUserID();
  const data = {
    name: name,
    // name: name,
    bio: "",
    location: "",
    photo: "",
    account_fkid: id,
  };

  try {
    const response = await fetch("http://localhost:3000/api/v1/https/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);

    if (!response.ok) {
      console.log(response);
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    const responseData = await response.json();
    const insertId = responseData.results.insertId;

    alert("Profile uploaded successfully!");
    sessionStorage.setItem("profile_id", insertId);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("image", "../img/user_default.jpg");
  } catch (error) {
    console.log(response);
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

function generateRandomUserID() {
  const randomNumber = Math.floor(Math.random() * 10000000); // Generate a random number between 0 and 9999999
  const userID = "User#" + randomNumber.toString().padStart(8, "0"); // Pad the random number with leading zeros if necessary
  return userID;
}

async function uploadProfile(account_fkid, location, photo, name) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/https/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_fkid,
        name,
        photo,
        location,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    const responseData = await response.json();
    const insertId = responseData.results.insertId;

    alert("Profile uploaded successfully!");
    sessionStorage.setItem("profile_id", insertId);
    window.location.href = "/home.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getProfileID() {
  const id = sessionStorage.getItem("user_id");
  const username = sessionStorage.getItem("username");
  const profilepicContainer = document.getElementById("profilepic");
  const profileinfoContainer = document.getElementById("profileinfo");
  const profileinfoContainer1 = document.getElementById("profileinfo1");

  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");

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

    const content = data.results[0];

    let img;

    if (content.photo === "") {
      img =
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg";
    } else {
      img = content.photo;
    }

    const profilepicContent = `<img
      src="${img}"
      class="rounded-circle img-fluid"
      alt="Avatar"
      style="
        width: 100%;
        height:auto;
        outline: 3px solid #0a3172;
        outline-offset: 2px;
      "
    />`;

    profilepicContainer.innerHTML = profilepicContent;

    const profileinfoContent = `<p class="h5 mt-3 mb-0 text-uppercase" style="font-weight: bold;">${content.name}</p>
  <p class="mt-0 text-muted text-sm">${username}</p>
  <p class="mt-3 text-muted text-sm">
    <i>${content.bio}</i>
  
  </p>
  <div class="d-flex flex-row gap-3">
    <p class="text-muted text-sm">
      <span class="fw-bold">4</span> following
    </p>

    <p class="text-muted text-sm">
      <span class="fw-bold">4</span> followers
    </p>
  </div>

  <p class="m-0 text-sm">${content.location}</p>
  <p class="m-0 text-sm">facebook.com/haiffu</p>
  <p class="m-0 text-sm">linkedin.com/haiffu</p>
  <p class="m-0 text-sm">dribbble.com/haiffu</p>

  <button
    class="no-border w-100 bg-whitesmoke rounded-xs text-xs py-2 mt-3"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    onclick="ViewUser()"
  >
    Edit Profile
  </button>`;

    profileinfoContainer.innerHTML = profileinfoContent;

    const profileinfoContent1 = `
    <div class="d-block d-sm-none d-lg-block" >
      <p class="h5 mt-3 mb-0 text-uppercase">${content.name}</p>
      <p class="mt-0 text-muted text-sm">${username}</p>

      <p class="mt-3 text-muted text-sm">
        <i>${content.bio}</i>
      </p>
    </div>

    <button
      class="d-block d-sm-none d-lg-block justify-content-center no-border w-100 bg-whitesmoke rounded-xs text-xs py-2"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      onclick="ViewUser()"
    >
      Edit Profile
    </button>

    <div
      class="d-flex d-sm-flex d-sm-none d-lg-block d-lg-flex mt-4 gap-3"
    >
      <p class="text-muted text-sm">
        <span class="fw-bold">4</span> following
      </p>

      <p class="text-muted text-sm">
        <span class="fw-bold">4</span> followers
      </p>
    </div>

    <div class="d-block d-sm-none d-lg-block">
      <p class="m-0 text-sm">${content.location}</p>
      <p class="m-0 text-sm">facebook.com/haiffu</p>
      <p class="m-0 text-sm">linkedin.com/haiffu</p>
      <p class="m-0 text-sm">dribbble.com/haiffu</p>
    </div>

    <div
    class="p-4 mt-4 border rounded-xs mb-4 d-none d-lg-block d-xl-block ms-4"
    style="margin-right: 24px"
  >
    <p class="m-0 text-sm fw-semibold">Recent Activities</p>
    <p class="text-xs text-muted m-0">
      When you take actions across ICONS, we'll provide links to that
      activity here.
    </p>
  </div>
 `;

    profileinfoContainer1.innerHTML = profileinfoContent1;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

async function getProfile() {
  const id = sessionStorage.getItem("user_id");
  const username = sessionStorage.getItem("username");
  const profilepicContainer = document.getElementById("profilepic");
  const profileinfoContainer = document.getElementById("profileinfo");
  const profileinfoContainer1 = document.getElementById("profileinfo1");
  console.log(`http://localhost:3000/api/v1/https/profile/${id}`);

  // sessionStorage.removeItem("NewPic");
  // sessionStorage.removeItem("newAttach");

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

    const content = data.results[0];

    console.log(content);

    let img;

    if (content.photo === "") {
      img =
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg";
    } else {
      img = content.photo;
    }

    const profilepicContent = `<img
      src="${img}"
      class="rounded-circle img-fluid"
      alt="Avatar"
      style="
        width: 100%;
        height:auto;
        outline: 3px solid #0a3172;
        outline-offset: 2px;
      "
    />`;

    profilepicContainer.innerHTML = profilepicContent;

    const profileinfoContent = `<p class="h5 mt-3 mb-0 text-uppercase" style="font-weight: bold;">${content.name}</p>
    <p class="mt-0 text-muted text-sm">${username}</p>
    <p class="mt-3 text-muted text-sm">
      <i>${content.id}</i>
  
  </p>
  <div class="d-flex flex-row gap-3">
    <p class="text-muted text-sm">
      <span class="fw-bold">4</span> following
    </p>

    <p class="text-muted text-sm">
      <span class="fw-bold">4</span> followers
    </p>
  </div>

  <p class="m-0 text-sm">${content.location}</p>
  <p class="m-0 text-sm">facebook.com/haiffu</p>
  <p class="m-0 text-sm">linkedin.com/haiffu</p>
  <p class="m-0 text-sm">dribbble.com/haiffu</p>

  <button
    class="no-border w-100 bg-whitesmoke rounded-xs text-xs py-2 mt-3"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    onclick="ViewUser()"
  >
    Edit Profile
  </button>`;

    profileinfoContainer.innerHTML = profileinfoContent;

    const profileinfoContent1 = `
    <div class="d-block d-sm-none d-lg-block" >
      <p class="h5 mt-3 mb-0 text-uppercase">${content.name}</p>
      <p class="mt-0 text-muted text-sm">${username}</p>

      <p class="mt-3 text-muted text-sm">
        <i>${content.bio}</i>
      </p>
    </div>

    <button
      class="d-block d-sm-none d-lg-block justify-content-center no-border w-100 bg-whitesmoke rounded-xs text-xs py-2"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      onclick="ViewUser()"
    >
      Edit Profile
    </button>

    <div
      class="d-flex d-sm-flex d-sm-none d-lg-block d-lg-flex mt-4 gap-3"
    >
      <p class="text-muted text-sm">
        <span class="fw-bold">4</span> following
      </p>

      <p class="text-muted text-sm">
        <span class="fw-bold">4</span> followers
      </p>
    </div>

    <div class="d-block d-sm-none d-lg-block">
      <p class="m-0 text-sm">${content.location}</p>
      <p class="m-0 text-sm">facebook.com/haiffu</p>
      <p class="m-0 text-sm">linkedin.com/haiffu</p>
      <p class="m-0 text-sm">dribbble.com/haiffu</p>
    </div>

    <div
    class="p-4 mt-4 border rounded-xs mb-4 d-none d-lg-block d-xl-block ms-4"
    style="margin-right: 24px"
  >
    <p class="m-0 text-sm fw-semibold">Recent Activities</p>
    <p class="text-xs text-muted m-0">
      When you take actions across ICONS, we'll provide links to that
      activity here.
    </p>
  </div>
 `;

    profileinfoContainer1.innerHTML = profileinfoContent1;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

async function editProfile() {
  const img = sessionStorage.getItem("imgsrc");
  const id = sessionStorage.getItem("profile_id");

  const body = {
    name: document.getElementById("name").value,
    bio: document.getElementById("bio").value,
    location: document.getElementById("location-select").value,
    photo: img,
  };

  const response = await fetch(
    `http://localhost:3000/api/v1/https/profile/${id}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post data");
  } else {
    location.reload();
    sessionStorage.setItem("image", img);
  }
}

function removePic() {
  const confirmed = confirm(
    "Are you sure you want to remove your profile picture?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  sessionStorage.setItem("imgsrc", "");
  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");
  editProfile();
}

//Search
function handleSearchInput(event) {
  const keyword = document.getElementById("searchInput").value.trim();

  if (keyword.length === 0) {
    clearSearchResults();
    displayNoResultsMessage(); // Display message when search input is empty
    return;
  }

  search(keyword);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    console.log("Enter key pressed");
    navigateToSearchResults();
  }
}

function clearSearchResults() {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";
}

async function search(keyword) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/search?keyword=${keyword}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const data = await response.json();
    displaySearchResults(data);
  } catch (error) {
    console.error("Error searching:", error.message);
    displaySearchError(error.message);
  }
}

async function navigateToSearchResults() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword.length === 0) {
    return;
  }

  // Fetch search results
  const response = await fetch(
    `http://localhost:3000/api/v1/https/search?keyword=${keyword}`
  );
  if (!response.ok) {
    console.error("Failed to fetch search results");
    return;
  }
  const data = await response.json();

  // Redirect only if there are search results
  if (data.users && data.users.length > 0) {
    window.location.href = `http://127.0.0.1:5500/client-side-config/users/src/search-results.html?keyword=${keyword}`;
  } else {
    displayNoResultsMessage(); // Display message when no results are found
  }
}

function displayNoResultsMessage() {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "<p>No results found</p>";
}

// Inside displaySearchResults function
function displaySearchResults(results) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  // Optionally, you can get the current user ID if needed
  const currentUserId = sessionStorage.getItem("user_id");
  console.log("Current User ID:", currentUserId); // Log the current user ID

  if (!results || (!results.users && !results.posts)) {
    displayNoResultsMessage(); // Display message when no results are found
    console.log("No user found");
    return;
  }

  if (results.users && results.users.length > 0) {
    // Iterate through users and display them
    results.users.forEach((user) => {
      const userContainer = document.createElement("div");
      userContainer.classList.add("user-container");

      // Truncate the name if it's too long
      const truncatedName =
        user.name.length > 18 ? user.name.substring(0, 18) + "..." : user.name;

      // Create an image element for the profile picture
      const profilePic = document.createElement("img");
      profilePic.src = user.photo ? user.photo : "../img/user_default.jpg"; // Use default profile picture if user.photo is not available
      profilePic.alt = `${user.name}'s profile picture`;
      profilePic.classList.add("profile-picture");

      // Create a link to view the user
      const viewUserLink = document.createElement("a");
      viewUserLink.textContent = truncatedName;
      viewUserLink.title = user.name; // Add full name as title for tooltip
      viewUserLink.href =
        user.id == currentUserId
          ? `http://127.0.0.1:5500/client-side-config/users/src/profile.html?userId=${user.id}`
          : `http://127.0.0.1:5500/client-side-config/users/src/other_profile.html?userId=${user.id}`;
      // Remove target="_blank" to open the profile in the same page
      viewUserLink.classList.add("user-link");

      // Append profile picture and username to the user container
      userContainer.appendChild(profilePic);
      userContainer.appendChild(viewUserLink);

      searchResults.appendChild(userContainer);
    });
  }

  // if (results.posts && results.posts.length > 0) {
  //   results.posts.forEach(post => {
  //     const postElement = document.createElement('div');
  //     const viewPostLink = document.createElement('a');
  //     viewPostLink.textContent = `Post:${post.title}`;
  //     viewPostLink.href = `http://localhost:3000/api/v1/https/community/post/${post.id}`;
  //     viewPostLink.target = '_blank';
  //     viewPostLink.classList.add('post-link');
  //     postElement.appendChild(viewPostLink);
  //     searchResults.appendChild(postElement);
  //   });

  // }
}

function displaySearchError(message) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = `<p>Error: ${message}</p>`;
}

function viewUserAccount(userId) {
  window.location.href = `http://localhost:3000/api/v1/https/profile/${userId}`;
}

function viewFullPost(postId) {
  window.location.href = `http://localhost:3000/api/v1/https/community/post/${postId}`;
}

// Gallery //

async function gallery() {
  const user_id = sessionStorage.getItem("user_id");
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadGallery(user_id, imageBase64, description);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadGallery(account_fkid, image, description) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/https/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_fkid,
        image,
        description,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getGallery() {
  const id = sessionStorage.getItem("user_id");
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/gallery/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editGallery() {
  const id = sessionStorage.getItem("user_id");
  const body = {
    image: document.getElementById("image").value,
  };
  await fetch(`http://localhost:3000/api/v1/https/gallery/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

// Service //

async function VieweditService(id) {
  var titleInput = document.getElementById("servicename");
  var descInput = document.getElementById("descservice");
  var submitContainer = document.getElementById("submit1");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/post/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    titleInput.value = data.results[0].name_of_service;
    descInput.value = data.results[0].description;

    submitContent = `<button type="button" class="btn btn-primary" onclick="editService(${data.results[0].id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function VieweditService(id) {
  var titleInput = document.getElementById("servicename");
  var descInput = document.getElementById("descservice");
  var submitContainer = document.getElementById("submit1");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/post/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    titleInput.value = data.results[0].name_of_service;
    descInput.value = data.results[0].description;

    submitContent = `<button type="button" class="btn btn-primary" onclick="editService(${data.results[0].id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function uploadService() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name_of_service = document.getElementById("nameofservice").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/https/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_fkid,
        name_of_service,
        description,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to service profile");
    }

    alert("Service uploaded successfully!");
    location.reload();
  } catch (error) {
    console.error("Error service :", error);
    alert("Failed to upload service. Please try again.");
  }
}

async function getService(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function deleteService(id) {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const confirmed = confirm(
    "Are you sure you want to delete this service information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id} AND profile_fkid = ${profile_fkid}`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/${condition}`,
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

async function editService(id) {
  console.log(id);
  const confirmed = confirm(
    "Are you sure you want to edit this service information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  description = document.getElementById("descservice").value;
  const escapedDescription = description.replace(/'/g, "''");

  const body = {
    name_of_service: document.getElementById("servicename").value,
    description: escapedDescription,
    name_of_service: document.getElementById("servicename").value,
    description: escapedDescription,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/${id}`,
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
      throw new Error(errorMessage || "Failed to update service content");
    }
  } catch (error) {
    console.error("Error updating home content:", error);
    alert("Failed to update home content. Please try again.");
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/service/${id}`,
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
      throw new Error(errorMessage || "Failed to update service content");
    }
  } catch (error) {
    console.error("Error updating home content:", error);
    alert("Failed to update home content. Please try again.");
  }
}

// Startup_Info //

async function uploadStartup() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name = sessionStorage.getItem("name");
  const title = document.getElementById("titlestart").value;
  const description = document.getElementById("descstart").value;
  const escapedDescription = description.replace(/'/g, "''");
  const link = document.getElementById("link").value;

  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/https/startup-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_fkid,
          title,
          name,
          description: escapedDescription,
          link,
        }),
      }
    );
    alert("Startup uploaded successfully!");
    location.reload();

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload startup to server");
    }
  } catch (error) {
    console.error("Error uploading startup:", error);
    alert("Failed to upload startup. Please try again.");
  }
}

async function getStartup(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/startup-info/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function deleteStartup(id) {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const confirmed = confirm(
    "Are you sure you want to delete this startup information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id} AND profile_fkid = ${profile_fkid}`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/startup-info/${condition}`,
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

async function VieweditStartup(id) {
  var titleInput = document.getElementById("titlestart1");
  var descInput = document.getElementById("descstart1");
  var linkInput = document.getElementById("link1");
  var submitContainer = document.getElementById("submit");

  console.log(id);
  console.log(id);
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/startup-info/post/${id}`,
      `http://localhost:3000/api/v1/https/startup-info/post/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    titleInput.value = data.results[0].title;
    descInput.value = data.results[0].description;
    linkInput.value = data.results[0].link;

    submitContent = `<button type="button" class="btn btn-primary" onclick="editStartup(${id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function editStartup(id) {
  // Prompt the user for confirmation
  const confirmed = confirm(
    "Are you sure you want to edit this startup information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  description = document.getElementById("descstart1").value;
  const escapedDescription = description.replace(/'/g, "''");

  const body = {
    title: document.getElementById("titlestart1").value,
    description: escapedDescription,
    link: document.getElementById("link1").value,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/startup-info/${id}`,
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
      throw new Error(errorMessage || "Failed to update home content");
    }
  } catch (error) {
    console.error("Error updating home content:", error);
    alert("Failed to update home content. Please try again.");
  }
}

// Home Content

async function homecontent() {
  const user_id = sessionStorage.getItem("user_id");
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadHome(user_id, type, title, content, imageBase64);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadHome(account_fkid, type, title, content, image) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/https/home-content",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_fkid,
          type,
          title,
          content,
          image,
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getHome(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/home-content/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editHome(id) {
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageDataUrl = event.target.result;

    const body = {
      type: document.getElementById("type").value,
      title: document.getElementById("title").value,
      content: document.getElementById("content").value,
      image: imageDataUrl,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/https/home-content/${id}`,
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
        throw new Error(errorMessage || "Failed to update home content");
      }
    } catch (error) {
      console.error("Error updating home content:", error);
      alert("Failed to update home content. Please try again.");
    }
  };

  reader.readAsDataURL(imageFile);
}

// Conversation

async function conversation() {
  const message_fkid = sessionStorage.getItem("message_id");
  const message_content = document.getElementById("message").value;
  const sender = document.getElementById("sender").value;
  const image = document.getElementById("image").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadConvo(message_fkid, message_content, sender, imageBase64);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadConvo(message_fkid, message_content, sender, image) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/https/conversation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_fkid,
          message_content,
          sender,
          image,
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getConvo() {
  var userid = sessionStorage.getItem("user_id");
  console.log(userid);

  if (userid) {
    socket.emit("fetch-room-ids", userid);

    socket.on("other-user", (roomIds) => {
      console.log("Room IDs:", roomIds);
      // Process the received room IDs as needed
    });
  } else {
    console.log("User ID is not available.");
  }
}

async function editConvo(id) {
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageDataUrl = event.target.result;

    const body = {
      message_content: document.getElementById("message").value,
      image: imageDataUrl || null, // Set image to imageDataUrl if it's truthy, otherwise set it to null
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/https/conversation/${id}`,
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
        throw new Error(
          errorMessage || "Failed to update conversation content"
        );
      }
    } catch (error) {
      console.error("Error updating conversation content:", error);
      alert("Failed to update conversation content. Please try again.");
    }
  };

  if (!imageFile) {
    // If no file is selected, proceed with the FileReader without alerting the user
    reader.onload(null);
  } else {
    reader.readAsDataURL(imageFile);
  }
}

//Message

async function uploadMessage() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const profile_fkid1 = sessionStorage.getItem("profile_id1");
  const account_fkid = sessionStorage.getItem("account_id");
  const account_fkid1 = sessionStorage.getItem("account_id1");
  const room = generateRoomId(8);

  try {
    const response = await fetch("http://localhost:3000/api/v1/https/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_fkid,
        room,
        account_fkid,
        account_fkid1,
        profile_fkid1,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to service profile");
    }

    alert("Service uploaded successfully!");
  } catch (error) {
    console.error("Error service :", error);
    alert("Failed to upload service. Please try again.");
  }
}

async function getMessage(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/message/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editMessage() {
  const id = sessionStorage.getItem("profile_id");
  const body = {};
  await fetch(`http://localhost:3000/api/v1/https/message/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

function generateRoomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters.charAt(randomIndex);
  }

  return roomId;
}

function toggleTextExpansion() {
  const postContent = document.getElementById("postContent");
  const seeMoreSpan = document.getElementById("see-more");
  if (postContent.classList.contains("text-truncate")) {
    postContent.classList.remove("text-truncate");
    seeMoreSpan.textContent = "See less";
  } else {
    postContent.classList.add("text-truncate");
    seeMoreSpan.textContent = "See more";
  }
}

function toggleTextExpansion1(postId) {
  const postContent = document.getElementById(`postContainer${postId}`);
  const seeMoreButton = document.getElementById(`seeMoreButton${postId}`);
  if (postContent.classList.contains("text-truncate")) {
    postContent.classList.remove("text-truncate");
    seeMoreButton.textContent = "See less";
  } else {
    postContent.classList.add("text-truncate");
    seeMoreButton.textContent = "See more";
  }
}
//Community

async function dailyHot() {
  const hotPostcontainer = document.getElementById("hotpost");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted today
      const postDate = new Date(post.timestamp);
      postDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

      return postDate.getTime() === today.getTime(); // Compare timestamps
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this day</p>";

      return;
    }

    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-4 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-4 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-md m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
      `;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function weeklyHot() {
  const hotPostcontainer = document.getElementById("hotpost");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get the start of the current week (Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted within the current week
      const postDate = new Date(post.timestamp);
      return postDate >= startOfWeek;
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this week</p>";

      return;
    }

    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-4 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-4 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-md m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
    `;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function monthlyHot() {
  const hotPostcontainer = document.getElementById("hotpost");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get the start of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted within the current month
      const postDate = new Date(post.timestamp);
      return postDate >= startOfMonth;
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this month</p>";

      return;
    }

    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    console.log(postData.data);

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-1 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-2 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-sm m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
    `;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function dailyHot2() {
  const hotPostcontainer2 = document.getElementById("hotpost2");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted today
      const postDate = new Date(post.timestamp);
      postDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

      return postDate.getTime() === today.getTime(); // Compare timestamps
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer2.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this day</p>";

      return;
    }

    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-4 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-4 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-md m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
    `;

      postContent += currentPostContent;
    }

    hotPostcontainer2.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function weeklyHot2() {
  const hotPostcontainer2 = document.getElementById("hotpost2");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get the start of the current week (Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted within the current week
      const postDate = new Date(post.timestamp);
      return postDate >= startOfWeek;
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer2.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this week</p>";

      return;
    }

    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-4 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-4 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-md m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
    `;

      postContent += currentPostContent;
    }

    hotPostcontainer2.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

async function monthlyHot2() {
  const hotPostcontainer2 = document.getElementById("hotpost2");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/community/post`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await response.json();

    // Get the start of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    postData.data = postData.data.filter((post) => {
      // Filter posts that were posted within the current month
      const postDate = new Date(post.timestamp);
      return postDate >= startOfMonth;
    });

    // Check if there are no posts for today
    if (postData.data.length === 0) {
      hotPostcontainer2.innerHTML =
        "<p class='text-xs m-0 text-gray-500 text-center'>No data for this month</p>";

      return;
    }
    postData.data.sort((a, b) => {
      // Sort by number of likes in descending order
      return b.like_count - a.like_count;
    });

    let postContent = "";

    console.log(postData.data);

    // Limit the loop to 5 iterations or the length of postData.data, whichever is smaller
    const limit = Math.min(postData.data.length, 5);
    for (let i = 0; i < limit; i++) {
      const post = postData.data[i];
      const timestamp = new Date(post.timestamp);

      const formattedTimestamp = timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let img;

      if (post.author_photo === "" || post.author_photo == null) {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = `
        <div class="border flex p-4 mb-1 bg-gray-100 cursor-pointer" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
          <div class="flex gap-4 items-center">
            <img src="${img}" class="rounded-full border w-12 h-12 object-cover" alt="Avatar" />
            <div>
              <p class="text-md m-0 font-semibold">
                ${post.title}
              </p>
              <p class="text-xs m-0 text-gray-600"><em>By: ${post.author_name}</em></p>
              <p class="text-xs m-0 text-gray-500">${formattedTimestamp}</p>
            </div>
          </div> 
        </div>
    `;

      postContent += currentPostContent;
    }

    hotPostcontainer2.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

function toggleActive(link, functionName) {
  // Remove the 'active' class from all navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((navLink) => {
    navLink.classList.remove("active");
  });

  // Add the 'active' class to the clicked navigation link
  link.classList.add("active");

  // Call the corresponding JavaScript function based on the tab clicked
  window[functionName]();
}
