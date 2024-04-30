//LOGIN
async function createAcc() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const recovery_email = document.getElementById("recover").value;
  const role_fkid = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password1").value;

  if (!email || !password || !username || !confirmPassword || !role_fkid) {
    alert("Please fill all input fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 8) {
    alert("The password is not 8 characters long");
    return;
  }

  const preFunctionSuccess1 = await checkusername(username);

  if (!preFunctionSuccess1) {
    // Show an alert message if the pre-function failed
    alert("Username already exist");
    return;
  }

  const preFunctionSuccess = await checkemail(email);

  if (!preFunctionSuccess) {
    // Show an alert message if the pre-function failed
    alert("Email already exist");
    return;
  }

  // Send a POST request to the server to register the user
  try {
    const response = await fetch(
      "https://project-icons.onrender.com/api/v1/https/auth/signup",
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

    const responseData = await response.json();

    // Show confirmation message to the user
    alert("User registration successful! Please login to continue.");

    sessionStorage.setItem("user_id", responseData.insertId);
    sessionStorage.setItem("username", username);

    RandomProfile(responseData.insertId);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    delay(1000).then(() => {
      window.location.href = "./home.html";
    });
  } catch (error) {
    console.error("Error registering user:", error);
    alert("Failed to register user. Please try again.");
  }
}

//LOGIN
async function checkemail(email) {
  console.log("wow");
  var condition = `email = "${email}"`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/auth/checkval/${condition}`,
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

//LOGIN
async function checkusername(user) {
  console.log("wow");
  var condition = `username = "${user}"`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/auth/checkval/${condition}`,
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

//LOGIN
async function signin() {
  //This is the function for submitting the credentials in the login page
  //
  const email = document.getElementById("sign_email").value;
  const pass = document.getElementById("sign_password").value;

  // If both username and password fields are empty
  // the window will alert that the user needs to fill in both fields
  if (!email || !pass) {
    alert("Please fill missing input");
    return;
  }

  // we will change the url of this once we get to deploy our API
  await fetch("https://project-icons.onrender.com/api/v1/https/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, pass: pass }),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      if (response.message.auth == "valid") {
        sessionStorage.setItem("user_id", response.message.id);
        sessionStorage.setItem("username", response.message.username);

        console.log(response.message.role);

        if (response.message.role === 2) {
          console.log("The user is a startup");
          sessionStorage.setItem("role", "startup");
        } else {
          console.log("The user is a partner");
          sessionStorage.setItem("role", "partner");
        }

        getProfileSignin(response.message.id);

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        delay(1000).then(() => {
          window.location.href = "./home.html";
        });
      } else {
        alert("Invalid Username or Password");
        return;
      }
    });
}

//ALL
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

    <div
      class="border rounded-xs overflow-hidden d-flex align-items-center"
      style="width: 250px"
    >
      <img src="../img/search.svg" height="16px" alt="" class="px-2" />
      <input
        type="text"
        class="no-border py-1 text-sm rounded-pill"
        placeholder="Search here"
        style="height: 32px; outline: none"
      />
    </div>

    <li class="nav-item dropdown">
      <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
        <div
          class="p-2 d-flex align-items-center justify-content-center border rounded-xs"
        >
          <img src="../img/notif.svg" height="16px" alt="" />
        </div>
      </a>
      <!-- End Notification Icon -->

      <ul
        class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications"
      >
        <li class="dropdown-header">
          You have 4 new notifications
          <a href="#"
            ><span class="badge rounded-pill bg-primary p-2 ms-2"
              >View all</span
            ></a
          >
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li class="notification-item">
          <i class="bi bi-exclamation-circle text-warning"></i>
          <div>
            <h4>Lorem Ipsum</h4>
            <p>Quae dolorem earum veritatis oditseno</p>
            <p>30 min. ago</p>
          </div>
        </li>

        <li>
          <hr class="dropdown-divider" />
        </li>

        <li class="notification-item">
          <i class="bi bi-x-circle text-danger"></i>
          <div>
            <h4>Atque rerum nesciunt</h4>
            <p>Quae dolorem earum veritatis oditseno</p>
            <p>1 hr. ago</p>
          </div>
        </li>

        <li>
          <hr class="dropdown-divider" />
        </li>

        <li class="notification-item">
          <i class="bi bi-check-circle text-success"></i>
          <div>
            <h4>Sit rerum fuga</h4>
            <p>Quae dolorem earum veritatis oditseno</p>
            <p>2 hrs. ago</p>
          </div>
        </li>

        <li>
          <hr class="dropdown-divider" />
        </li>

        <li class="notification-item">
          <i class="bi bi-info-circle text-primary"></i>
          <div>
            <h4>Dicta reprehenderit</h4>
            <p>Quae dolorem earum veritatis oditseno</p>
            <p>4 hrs. ago</p>
          </div>
        </li>

        <li>
          <hr class="dropdown-divider" />
        </li>
        <li class="dropdown-footer">
          <a href="#">Show all notifications</a>
        </li>
      </ul>
      <!-- End Notification Dropdown Items -->
    </li>
    <!-- End Notification Nav -->

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

//ALL
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

//PROFILE
async function getProfileSignin(id) {
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/profile/${id}`,
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

//PROFILE
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
    const response = await fetch("https://project-icons.onrender.com/api/v1/https/profile", {
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

//PROFILE
function generateRandomUserID() {
  const randomNumber = Math.floor(Math.random() * 10000000); // Generate a random number between 0 and 9999999
  const userID = "User#" + randomNumber.toString().padStart(8, "0"); // Pad the random number with leading zeros if necessary
  return userID;
}

//PROFILE
async function uploadProfile(account_fkid, location, photo, name) {
  try {
    const response = await fetch("https://project-icons.onrender.com/api/v1/https/profile", {
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
    window.location.href = "./home.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}


//PROFILE
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
      `https://project-icons.onrender.com/api/v1/https/profile/${id}`,
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

//PROFILE
async function getProfile() {
  const id = sessionStorage.getItem("user_id");
  const username = sessionStorage.getItem("username");
  const profilepicContainer = document.getElementById("profilepic");
  const profileinfoContainer = document.getElementById("profileinfo");
  const profileinfoContainer1 = document.getElementById("profileinfo1");
  console.log(`https://project-icons.onrender.com/api/v1/https/profile/${id}`);

  // sessionStorage.removeItem("NewPic");
  // sessionStorage.removeItem("newAttach");

  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/profile/${id}`,
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

//PROFILE
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
    `https://project-icons.onrender.com/api/v1/https/profile/${id}`,
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

//PROFILE
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
    const response = await fetch("https://project-icons.onrender.com/api/v1/https/gallery", {
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
      `https://project-icons.onrender.com/api/v1/https/gallery/${id}`,
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
  await fetch(`https://project-icons.onrender.com/api/v1/https/gallery/${id}`, {
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

//PROFILE
async function VieweditService(id) {
  var titleInput = document.getElementById("servicename");
  var descInput = document.getElementById("descservice");
  var submitContainer = document.getElementById("submit1");

  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/service/post/${id}`,
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

//PROFILE
async function uploadService() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name_of_service = document.getElementById("nameofservice").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("https://project-icons.onrender.com/api/v1/https/service", {
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

//PROFILE
async function getService(id) {
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/service/${id}`,
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

//PROFILE
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
      `https://project-icons.onrender.com/api/v1/https/service/${condition}`,
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

//PROFILE
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
      `https://project-icons.onrender.com/api/v1/https/service/${id}`,
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

//PROFILE
async function uploadStartup() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name = sessionStorage.getItem("name");
  const title = document.getElementById("titlestart").value;
  const description = document.getElementById("descstart").value;
  const escapedDescription = description.replace(/'/g, "''");
  const link = document.getElementById("link").value;

  try {
    const response = await fetch(
      "https://project-icons.onrender.com/api/v1/https/startup-info",
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


//PROFILE
async function getStartup(id) {
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/startup-info/${id}`,
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

//PROFILE
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
      `https://project-icons.onrender.com/api/v1/https/startup-info/${condition}`,
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


//PROFILE
async function VieweditStartup(id) {
  var titleInput = document.getElementById("titlestart1");
  var descInput = document.getElementById("descstart1");
  var linkInput = document.getElementById("link1");
  var submitContainer = document.getElementById("submit");

  console.log(id);
  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/startup-info/post/${id}`,
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

//PROFILE
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
      `https://project-icons.onrender.com/api/v1/https/startup-info/${id}`,
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
      "https://project-icons.onrender.com/api/v1/https/home-content",
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
      `https://project-icons.onrender.com/api/v1/https/home-content/${id}`,
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
        `https://project-icons.onrender.com/api/v1/https/home-content/${id}`,
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

//COMMUNITY
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

//COMMUNITY
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
      `https://project-icons.onrender.com/api/v1/https/community/post`,
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

      if (post.author_photo === "") {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = ` <div class="border d-flex p-3 mb-2 bg-whitesmoke clickable" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
      <div class="d-flex gap-3">
      <img src="${img}" class="rounded-circle border flex-grow-0" style="width: 40px;" alt="" />
      <div>
        <p class="text-md m-0 font-semibold">
        ${post.title}
        </p>
        <p class="text-xs m-0 "><em>By: ${post.author_name}</em></p>
      </div>
     
    </div> 
    </div>`;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

//Community
async function weeklyHot() {
  const hotPostcontainer = document.getElementById("hotpost");

  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/community/post`,
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

      if (post.author_photo === "") {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = ` <div class="border d-flex p-3 mb-2 bg-whitesmoke clickable" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
        <div class="d-flex gap-3">
          <img src="${img}" class="rounded-circle border flex-grow-0" style="width: 40px;" alt="" />
          <div>
            <p class="text-md m-0 font-semibold">
            ${post.title}
            </p>
            <p class="text-xs m-0 "><em>By: ${post.author_name}</em></p>
          </div>
        </div> 
      </div>`;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

//Community
async function monthlyHot() {
  const hotPostcontainer = document.getElementById("hotpost");

  try {
    const response = await fetch(
      `https://project-icons.onrender.com/api/v1/https/community/post`,
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

      if (post.author_photo === "") {
        img = "../img/user_default.jpg";
      } else {
        img = post.author_photo;
      }

      const currentPostContent = ` <div class="border d-flex p-3 mb-2 bg-whitesmoke clickable" onclick="postModal(${post.post_id})" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
        <div class="d-flex gap-3">
          <img src="${img}" class="rounded-circle border flex-grow-0" style="width: 40px;" alt="" />
          <div>
            <p class="text-md m-0 font-semibold">
            ${post.title}
            </p>
            <p class="text-xs m-0 "><em>By: ${post.author_name}</em></p>
          </div>
        </div> 
      </div>`;

      postContent += currentPostContent;
    }

    hotPostcontainer.innerHTML = postContent;
  } catch (error) {
    console.error("Error fetching post data:", error.message);
  }
}

//ALL
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
