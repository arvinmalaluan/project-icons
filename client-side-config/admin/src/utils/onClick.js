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
          if (data.message.role === 1) {
            setTimeout(function () {
              window.sessionStorage.setItem("id", data.message.id);
              window.localStorage.setItem("token", data.token);
              getProfileSignin();
              window.location.href =
                "http://127.0.0.1:5500/client-side-config/admin/src/templates/home.template.html";
            }, 2000);
          }
        } else {
          console.log("invalid", data);

          setTimeout(function () {
            signing_in.classList.add("d-none");
            sign_in.classList.remove("d-none");
          }, 2000);
        }
      });
  }

  if (event.target.id === "logout_btn") {
    window.localStorage.removeItem("token");
    window.location.href =
      "http://127.0.0.1:5500/client-side-config/admin/index.html";
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

  if (event.target.id === "edit-user") {
    console.log("i am clicked");
  }

  if (event.target.id === "save-update-changes") {
    const table_body = document.getElementById("users-tbl-body");
    const index = sessionStorage.getItem("row_index");

    if (lastPath.includes("community.template.html")) {
      const title = getId("title-edit-new-post").value;
      const content = getId("content-edit-new-post").value;
      const images = getId("images-edit-new-post").value;

      const id = sessionStorage.getItem("post_id");

      const payload = {
        title: title,
        content: content,
        image: images,
      };

      fetch(`http://localhost:3000/api/v1/https/community/post/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            table_body.rows[index].cells[2].innerText = title;
            table_body.rows[index].cells[3].innerText = createTime();

            sessionStorage.removeItem("post_id");
            sessionStorage.removeItem("row_index");
          }
        });
    }

    if (
      lastPath.includes("programs.template.html") ||
      lastPath.includes("articles.template.html")
    ) {
      const title = getId("title-edit-programs").value;
      const body = getId("content-edit-programs").value;
      const author = getId("author-edit-programs").value;
      const images = getId("images-edit-programs").value;
      const id = sessionStorage.getItem("post_id");

      const payload = {
        author: author,
        content: JSON.stringify({ title: title, content: body }),
        image: images,
      };

      fetch(`http://localhost:3000/api/v1/https/home-content/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            table_body.rows[index].cells[2].innerText = title;
            table_body.rows[index].cells[3].innerText = createTime();

            sessionStorage.removeItem("post_id");
            sessionStorage.removeItem("row_index");
          }
        });
    }

    if (lastPath.includes("users.template.html")) {
      const id = sessionStorage.getItem("post_id");
      const status = getId("user-status").value;
      const role = getId("user-role").value;

      const payload = {
        status: status,
        role_fkid: role,
      };

      fetch(`http://localhost:3000/api/v1/https/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            table_body.rows[index].cells[6].innerText = status;
            table_body.rows[index].cells[3].innerText =
              role == "2" ? "Startup" : "Partner";

            sessionStorage.removeItem("post_id");
            sessionStorage.removeItem("row_index");
          }
        });
    }
  }

  if (event.target.id === "temp-delete-user") {
    const table = document.getElementById("users-tbl-body");
    const index = table.childElementCount - 1;
    let tbl_name = "";

    if (lastPath.includes("users.template.html")) {
      tbl_name = "tbl_account";
    }

    showDeleteModal(table, index, tbl_name);
  }
});
