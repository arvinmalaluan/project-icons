// For decoding jwtToken without using external libraries
function decodeJWT(jwtString) {
  const tokenParts = jwtString.split(".");
  const header = JSON.parse(
    atob(tokenParts[0].replace("-", "+").replace("_", "/"))
  );
  const payload = JSON.parse(
    atob(tokenParts[1].replace("-", "+").replace("_", "/"))
  );

  return {
    payload,
  };
}

async function getProfileSignin() {
  const data = decodeJWT(localStorage.getItem("token"));
  const id = data.payload.id;

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/https/profile/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    const profile = data.results[0];

    let img;

    if (profile.photo === "") {
      // ! Change this into real image path
      img = "../img/user_default.jpg";
    } else {
      img = profile.photo;
    }

    sessionStorage.setItem("profile_id", profile.id);
    sessionStorage.setItem("name", profile.name);
    sessionStorage.setItem("img", img);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

const hasToken = localStorage.getItem("token");
const pathname = window.location.pathname;

if (hasToken) {
  if (pathname.includes("/client-side-config/admin/index.html")) {
    getProfileSignin();
    window.location.href =
      "http://127.0.0.1:5500/client-side-config/admin/src/templates/home.template.html";
  }

  const data = decodeJWT(localStorage.getItem("token"));
  const id = data.payload.id;
  sessionStorage.setItem("id", id);
  getProfileSignin();
} else {
  if (!pathname.includes("/client-side-config/admin/index.html")) {
    window.location.href =
      "http://127.0.0.1:5500/client-side-config/admin/index.html";
  }
}
