// Create link element for Tailwind CSS
const tailwindLink = document.createElement("link");
tailwindLink.rel = "stylesheet";
tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

// Create link element for SweetAlert2 CSS
const sweetAlertCssLink = document.createElement("link");
sweetAlertCssLink.rel = "stylesheet";
sweetAlertCssLink.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";

// Create script element for SweetAlert2 JavaScript
const sweetAlertScript = document.createElement("script");
sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";


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

function loadNotiffirebase(){
  const script = document.createElement('script');
  script.src = 'firebase_notif.js'; 

  document.head.appendChild(script);
}

loadNotiffirebase();



// Append elements to the head section
document.head.appendChild(tailwindLink); // Append Tailwind CSS
document.head.appendChild(sweetAlertCssLink); // Append SweetAlert2 CSS
document.head.appendChild(sweetAlertScript); // Append SweetAlert2 JavaScript



async function createAcc() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const recovery_email = document.getElementById("recover").value;
  const role_fkid = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password1").value;

  if (!email || !password || !username || !confirmPassword || !role_fkid) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill all input fields',
    });
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Passwords do not match',
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
          recovery_email,
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
      icon: 'success',
      title: 'Success!',
      text: 'User registration successful! A verification email has been sent to your email address. Please verify your email to activate your account.',
    }).then(() => {
      // Redirect to login page after clicking "OK" on the SweetAlert
      window.location.href = "./login.html";

      // Alternatively, you can redirect to another page or trigger additional actions here
    });
  } catch (error) {
    console.error("Error registering user:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to register user. Please try again.',
    });
  }
}



async function signin() {
  const email = document.getElementById("sign_email").value;
  const pass = document.getElementById("sign_password").value;

  if (!email || !pass) {
      alert("Please fill in both email and password fields.");
      return;
  }

  try {
      const response = await fetch("http://localhost:3000/api/v1/https/auth/signin", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, pass: pass }),
      });

      if (!response.ok) {
          throw new Error('Failed to sign in. Please try again later.');
      }

      const data = await response.json();

      console.log('Sign-in response:', data);

      if (data.success === 1 && data.message && data.message.auth === "valid" && data.message.id) {
          console.log('User ID:', data.message.id);
          sessionStorage.setItem("user_id", data.message.id);
          sessionStorage.setItem("username", data.message.username);
  
          if (data.message.role === 2) {
              sessionStorage.setItem("role", "startup");
          } else {
              sessionStorage.setItem("role", "partner");
          }
  
          console.log('User ID in session storage:', sessionStorage.getItem("user_id"));
  
          if (!data.message.isVerified) {
              // Prompt the user to verify their email
              Swal.fire({
                  title: 'Email Not Verified!',
                  text: 'Please verify your email before signing in.',
                  icon: 'warning',
                  confirmButtonText: 'OK'
              });
              return;
          }
  
          getProfileSignin(data.message.id);
  
          // Redirect to home.html after a delay
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          await delay(1000);
  
          // Call fetchAndDisplaySearchResults after setting the user ID
          const keyword = new URLSearchParams(window.location.search).get('keyword');
          if (keyword) {
              fetchAndDisplaySearchResults(keyword);
          } else {
              console.error('Keyword not found in URL parameters');
          }
  
          window.location.href = "./community.html";
      } else {
          alert("Invalid Username or Password");
      }
  } catch (error) {
      console.error('Error signing in:', error);
      alert("Failed to sign in. Please try again later.");
  }
}





async function navBar() {
  const navbarContainer = document.getElementById("header");
  const name = sessionStorage.getItem("name");
  const image = sessionStorage.getItem("image");
  const navbarContent = `
    

  <div class="d-flex">
  <i class="bi bi-list d-block d-md-none" style="font-size: 24px; margin-right: 16px;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"></i>
  <a href="home.html" class="logo d-flex align-items-center">
  
    <img src="../img/logo2.png" alt="logo" style="height: 32px" />
  </a>

</div>

<nav class="header-nav">
  <ul class="d-flex align-items-center gap-2">
    <li class="nav-item d-block d-lg-none"></li>
    <!-- End Search Icon-->

    <div class="search-container">
    <input 
    id="searchInput" 
    autocomplete="off" 
    onkeypress="handleKeyPress(event)"
    oninput="handleSearchInput(event)" 
    type="text" 
    class="search-input" 
    placeholder="Search user or post..."
    />

   
    <div id="searchResults" class="search-results"></div>
    </div>

    <li class="nav-item dropdown">
    <button id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" class="relative flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clip-rule="evenodd" />
        </svg>
        <span class="badge rounded-full bg-primary text-white px-2 py-1 ml-2">4</span>
    </button>
    <div id="dropdownNotification" class="z-20 hidden w-80 bg-white divide-y divide-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
        <div class="py-2 px-4 font-medium text-gray-700 rounded-t-lg bg-gray-100 dark:bg-gray-800 dark:text-white">
            Notifications
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Replace this section with your actual notifications -->
            <a href="#" class="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div class="flex-shrink-0">
                    <img class="rounded-full w-12 h-12" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image">
                </div>
                <div class="w-3/4 ps-3">
                    <div class="text-gray-800 text-sm mb-1 dark:text-gray-200">New message from <span class="font-semibold text-gray-900 dark:text-white">Jese Leos</span>: "Hey, what's up? All set for the presentation?"</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">a few moments ago</div>
                </div>
                <div class="w-1/4 text-right">
                    <span class="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </span>
                </div>
            </a>
            <!-- End Example Notification -->
        </div>
        <a href="#" class="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <div class="inline-flex items-center">
                <svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                </svg>
                View all
            </div>
        </a>
    </div>
</li>



    <li class="nav-item dropdown pe-3">
      <a
        class="nav-link nav-profile d-flex align-items-center pe-0"
        href="#"
        data-bs-toggle="dropdown"
      >
        <img
          src="${image}"
          alt="Profile"
          class="rounded-circle border flex-grow-0"
          style="outline: 1px solid #0a3172"
          height="40px"
          width="40px"
        /> </a
      ><!-- End Profile Iamge Icon -->

      <ul
        class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
      >
        <li class="dropdown-header">
          <h6>${name}</h6>
          <span>BatstateU CTI</span>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <a
            class="dropdown-item d-flex align-items-center"
            href="profile.html"
          >
            <i class="fa-regular fa-user"></i>
            <span>My Profile</span>
          </a>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <a
            class="dropdown-item d-flex align-items-center"
            href="community.html"
          >
            <i class="fa-solid fa-users-rectangle"></i>
            <span>Community</span>
          </a>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <a
            class="dropdown-item d-flex align-items-center"
            href="messages.html"
          >
            <i class="fa-regular fa-message"></i>
            <span>Messages</span>
          </a>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <a class="dropdown-item d-flex align-items-center" href="#">
            <i class="fa-solid fa-gear"></i>
            <span>Account Settings</span>
          </a>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <a class="dropdown-item d-flex align-items-center" href="#" onclick="logout()">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </a>
        </li>
      </ul>
      <!-- End Profile Dropdown Items -->
    </li>
    <!-- End Profile Nav -->
  </ul>
</nav>
<!-- End Icons Navigation -->`;

  navbarContainer.innerHTML = navbarContent;
}

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
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear session storage
      sessionStorage.clear();
      
      // Replace current page with login page in the browser history
      history.replaceState({}, '', 'login.html');
      
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
  const data = {
    name: name,
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

    if (content.photo === "") {
      img = "../img/user_default.jpg";
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

    const profileinfoContent = `<p class="h5 mt-3 mb-0 text-uppercase">${content.name}</p>
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

    if (content.photo === "") {
      img = "../img/user_default.jpg";
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

    const profileinfoContent = `<p class="h5 mt-3 mb-0 text-uppercase">${content.name}</p>
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
  const keyword = document.getElementById('searchInput').value.trim(); 

  if (keyword.length === 0) {
    clearSearchResults();
    displayNoResultsMessage(); // Display message when search input is empty
    return;
  }

  search(keyword); 
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    console.log('Enter key pressed');
    navigateToSearchResults();
  }
}


function clearSearchResults() {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = ''; 
}

async function search(keyword) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/https/search?keyword=${keyword}`);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await response.json();
    displaySearchResults(data);
  } catch (error) {
    console.error('Error searching:', error.message);
    displaySearchError(error.message);
  }
}

async function navigateToSearchResults() {
  const keyword = document.getElementById('searchInput').value.trim(); 
  if (keyword.length === 0) {
    return;
  }

  // Fetch search results
  const response = await fetch(`http://localhost:3000/api/v1/https/search?keyword=${keyword}`);
  if (!response.ok) {
    console.error('Failed to fetch search results');
    return;
  }
  const data = await response.json();

  // Redirect only if there are search results
  if (data.users && data.users.length > 0) {
    window.location.href = `http://localhost:3000/api/v1/https/search/results?keyword=${keyword}`;
  } else {
    displayNoResultsMessage(); // Display message when no results are found
  }
}

function displayNoResultsMessage() {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '<p>No results found</p>';
}

function displaySearchResults(results) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  if (!results || (!results.users && !results.posts)) {
    displayNoResultsMessage(); // Display message when no results are found
    console.log('No user found');
    return;
  }

  if (results.users && results.users.length > 0) {
    // Iterate through users and display them
    results.users.forEach(user => {
      const userContainer = document.createElement('div');
      userContainer.classList.add('user-container');

      // Truncate the name if it's too long
      const truncatedName = user.name.length > 18 ? user.name.substring(0, 18) + '...' : user.name;

      // Create an image element for the profile picture
      const profilePic = document.createElement('img');
      profilePic.src = user.photo ? user.photo : '../img/user_default.jpg'; // Use default profile picture if user.photo is not available
      profilePic.alt = `${user.name}'s profile picture`;
      profilePic.classList.add('profile-picture');

      // Create a link to view the user
      const viewUserLink = document.createElement('a');
      viewUserLink.textContent = truncatedName;
      viewUserLink.title = user.name; // Add full name as title for tooltip
      viewUserLink.href = `http://localhost:3000/api/v1/https/search/other?userId=${user.id}`;
      viewUserLink.target = '_blank';
      viewUserLink.classList.add('user-link');

      // Append profile picture and username to the user container
      userContainer.appendChild(profilePic);
      userContainer.appendChild(viewUserLink);

      searchResults.appendChild(userContainer);
    });
  }

  
/*if (results.posts && results.posts.length > 0) {
  results.posts.forEach(post => {
    const postElement = document.createElement('div');
    const viewPostLink = document.createElement('a');
    viewPostLink.textContent = `Post:${post.title}`;
    viewPostLink.href = `http://localhost:3000/api/v1/https/community/post/${post.id}`;
    viewPostLink.target = '_blank';
    viewPostLink.classList.add('post-link');
    postElement.appendChild(viewPostLink);
    searchResults.appendChild(postElement);
  });
}*/
}

function displaySearchError(message) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = `<p>Error: ${message}</p>`;
}

function viewUserAccount(userId) {
  window.location.href = `http://localhost:3000/api/v1/https/profile/${userId}`;
}

function viewFullPost(postId){
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
  try {
    const response = await fetch(
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

async function getConvo(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/conversation/${id}`,
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
//Community
