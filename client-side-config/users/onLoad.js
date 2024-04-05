const currentPath = window.location.pathname.split("/");
const lastPath = currentPath[currentPath.length - 1];

document.addEventListener("DOMContentLoaded", (e) => {
  if (lastPath.includes("home.html")) {
    const name = sessionStorage.getItem("name");

    document.querySelector("#user-name").innerText = name;
  }
});
