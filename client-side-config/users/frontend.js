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

  // Send a POST request to the server to register the user
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
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
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the error message from the server
      throw new Error(errorMessage || "Failed to register user");
    }

    const responseData = await response.json();

    console.log(responseData.insertId);

    // Show confirmation message to the user
    alert("User registration successful! Please login to continue.");

    sessionStorage.setItem("user_id", responseData.insertId);

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
  await fetch("http://localhost:3000/api/v1/auth/signin", {
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

async function navBar() {
  const navbarContainer = document.getElementById("header");
  const name = sessionStorage.getItem("name");
  const image = sessionStorage.getItem("image");
  console.log(navbarContainer);
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
        class="no-border py-1 text-sm"
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
            href="profile1.html"
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
            href="community1.html"
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
            href="messages1.html"
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
  sessionStorage.clear();
  window.location.href = "login.html";
}

async function getProfileSignin(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    const profile = data.results[0];

    console.log(profile.id);

    console.log("id:", profile.id);

    let role;

    if (profile.role_fkid == 2) {
      role = "startup";
    } else {
      role = "partner";
    }

    if (profile.photo === "") {
      img = "../img/user_default.jpg";
    } else {
      img = profile.photo;
    }

    sessionStorage.setItem("profile_id", profile.id);
    sessionStorage.setItem("name", profile.name);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("image", img);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

async function RandomProfile(id) {
  const data = {
    name: generateRandomUserID(),
    bio: "",
    location: "",
    photo: "",
    account_fkid: id,
  };

  try {
    const response = await fetch("http://localhost:3000/api/v1/profile", {
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
    const response = await fetch("http://localhost:3000/api/v1/profile", {
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

async function getProfileID() {
  id = sessionStorage.getItem("user_id");
  const profilepicContainer = document.getElementById("profilepic");
  const profileinfoContainer = document.getElementById("profileinfo");
  const profileinfoContainer1 = document.getElementById("profileinfo1");
  console.log("wowowow");
  console.log(id);

  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");

  try {
    const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
      method: "GET",
    });

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
  <p class="mt-0 text-muted text-sm">@mrnice</p>
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
      <p class="mt-0 text-muted text-sm">@mrnice</p>

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
  id = sessionStorage.getItem("user_id");

  console.log("User Id:", id);
  const profilepicContainer = document.getElementById("profilepic");
  const profileinfoContainer = document.getElementById("profileinfo");
  const profileinfoContainer1 = document.getElementById("profileinfo1");
  console.log("wowowow");
  console.log(id);

  sessionStorage.removeItem("NewPic");
  sessionStorage.removeItem("newAttach");

  try {
    const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    const content = data.results[0];

    console.log(content.id);

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
  <p class="mt-0 text-muted text-sm">@mrnice</p>
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
      <p class="mt-0 text-muted text-sm">@mrnice</p>

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
  console.log("wow");
  const body = {
    name: document.getElementById("name").value,
    bio: document.getElementById("bio").value,
    location: document.getElementById("location-select").value,
    photo: img,
  };
  const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
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
    const response = await fetch("http://localhost:3000/api/v1/gallery", {
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
    const response = await fetch(`http://localhost:3000/api/v1/gallery/${id}`, {
      method: "GET",
    });

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
  await fetch(`http://localhost:3000/api/v1/gallery/${id}`, {
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

async function uploadService() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name_of_service = document.getElementById("nameofservice").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/service", {
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
    const response = await fetch(`http://localhost:3000/api/v1/service/${id}`, {
      method: "GET",
    });

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

async function editService(id) {
  const body = {
    name_of_service: document.getElementById("nameofservice").value,
    description: document.getElementById("description").value,
  };
  await fetch(`http://localhost:3000/api/v1/service/${id}`, {
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

// Startup_Info //

async function uploadStartup() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name = sessionStorage.getItem("name");
  const title = document.getElementById("titlestart").value;
  const description = document.getElementById("descstart").value;
  const escapedDescription = description.replace(/'/g, "''");
  const link = document.getElementById("link").value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/startup-info", {
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
    });
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
      `http://localhost:3000/api/v1/startup-info/${id}`,
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
      `http://localhost:3000/api/v1/startup-info/${condition}`,
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

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/post/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

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
      `http://localhost:3000/api/v1/startup-info/${id}`,
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
    const response = await fetch("http://localhost:3000/api/v1/home-content", {
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

async function getHome(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/home-content/${id}`,
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
        `http://localhost:3000/api/v1/home-content/${id}`,
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
    const response = await fetch("http://localhost:3000/api/v1/conversation", {
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

async function getConvo(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/conversation/${id}`,
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
        `http://localhost:3000/api/v1/conversation/${id}`,
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
    const response = await fetch("http://localhost:3000/api/v1/message", {
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
    const response = await fetch(`http://localhost:3000/api/v1/message/${id}`, {
      method: "GET",
    });

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
  await fetch(`http://localhost:3000/api/v1/message/${id}`, {
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
