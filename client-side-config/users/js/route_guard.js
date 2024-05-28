// check url path
const my_pathname = window.location.pathname;

// check if current url path is not at login
const bool = my_pathname.includes("login.html");

// if bool is false, check if it has token
const token = localStorage.getItem("token");
const has_token = token ? true : false;

// if has_token is false and bool is true, redirect to login.html
if (!has_token) {
  if (!bool) {
    window.location.href =
      "http://127.0.0.1:5500/client-side-config/users/src/login.html";
  }
} else {
  if (bool) {
    window.location.href = "./community.html";
  }
}
