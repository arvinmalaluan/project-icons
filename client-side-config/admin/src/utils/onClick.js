const getId = (id) => {
  return document.querySelector(`#${id}`);
};

function delayMessage(delayTime) {
  setTimeout(function () {}, delayTime);
}

const hideSide = (act, div, btn) => {
  const bool = window.location.pathname.includes("template.html");

  if (act) {
    !div.classList.contains("close-toggle") &&
      div.classList.add("close-toggle");

    const src = bool
      ? "../../src/assets/svgs/ArrowSideRight.svg"
      : "./src/assets/svgs/ArrowSideRight.svg";

    btn.setAttribute("src", src);
  } else {
    div.classList.contains("close-toggle") &&
      div.classList.remove("close-toggle");

    const src = bool
      ? "../../src/assets/svgs/ArrowSideLeft.svg"
      : "./src/assets/svgs/ArrowSideLeft.svg";

    btn.setAttribute("src", src);
  }
};

document.body.addEventListener("click", (event) => {
  if (event.target.id === "toggle-side-right") {
    const btn = getId("toggle-side-right");
    const act = btn.getAttribute("src").includes("ArrowSideLeft");
    const div = getId("side-bar");

    hideSide(act, div, btn);
  }

  if (event.target.id === "toggle-side-left") {
    const btn = getId("toggle-side-left");
    const act = btn.getAttribute("src").includes("ArrowSideLeft");
    const div = getId("side-bar");

    hideSide(act, div, btn);
  }

  if (event.target.id === "sign_in_btn") {
    const signing_in = getId("signing_in_btn_div");
    const sign_in = getId("sign_in_btn_div");

    signing_in.classList.remove("d-none");
    sign_in.classList.add("d-none");

    const email = getId("email");
    const passw = getId("password");

    const payload = {
      email: email.value,
      pass: passw.value,
    };

    fetch("http://localhost:3000/api/v1/https/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTimeout(function () {
            window.localStorage.setItem("token", data.token);
            window.location.href =
              "http://127.0.0.1:5500/src/templates/home.template.html";
          }, 2000);
        } else {
          console.log("invalid");

          setTimeout(function () {
            signing_in.classList.add("d-none");
            sign_in.classList.remove("d-none");
          }, 2000);
        }
      });
  }

  if (event.target.id === "logout_btn") {
    window.localStorage.removeItem("token");
    window.location.href = "http://127.0.0.1:5500/index.html";
  }

  if (event.target.id === "create-user") {
    const create = getId("create-user");
    const creating = getId("creating-user");
    const cancel = getId("cancel");
    const toastContent = getId("toast");
    const toast = new bootstrap.Toast(toastContent);

    const userModal = getId("add_new_users");
    const modal = bootstrap.Modal.getInstance(userModal);

    const message = getId("toast-text-content");

    const category = getId("category-create-new-user");
    const email = getId("email-create-new-user");

    const payload = {
      role: category.value,
      email: email.value,
      pass: "icons_default_password",
    };

    create.classList.add("d-none");
    creating.classList.remove("d-none");
    cancel.setAttribute("disabled", "true");

    fetch("http://localhost:3000/api/v1/https/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTimeout(function () {
            create.classList.remove("d-none");
            creating.classList.add("d-none");
            cancel.removeAttribute("disabled");

            toast.show();
            modal.hide();

            message.innerHTML = `You have successfully created user <b>${email.value}</b>`;

            category.value = "0";
            email.value = "";
          }, 2000);
        } else {
          setTimeout(function () {
            toast.hide();
          }, 1000);
        }
      });
  }

  if (event.target.id === "select-all-checkbox") {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");

    const generalCheckbox = getId("select-all-checkbox");

    generalCheckbox.addEventListener("change", function () {
      const isChecked = this.checked;

      checkboxes.forEach((checkbox, index) => {
        if (checkbox !== generalCheckbox) {
          checkbox.checked = isChecked;
        }
      });
    });
  }

  if (event.target.id === "set-as-author") {
    const author = getId("author-create-home-content");

    author.value = "Center for Technopreneurship and Innovation";
  }

  if (event.target.id === "close_btn_modal") {
    const myModal = new bootstrap.Modal("#delete_modal");

    myModal.hide();
  }
});
