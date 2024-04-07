const currentPath = window.location.pathname.split("/");
const lastPath = currentPath[currentPath.length - 1];
const urlParams = new URLSearchParams(window.location.search);

// Create link element for CSS
const cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href =
  "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";

// Create script element for JavaScript
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";

// Append elements to the head section
document.head.appendChild(cssLink);
document.head.appendChild(script);

let currentPage = 1;
let rowsPerPage = 25;

function tableSearch() {
  let input, filter, table, tr, td, txtValue;

  // Initialization of variables
  input = document.querySelector("#search-user");
  filter = input.value.toUpperCase();
  tr = document.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");

    for (let j = 0; j < td.length; j++) {
      // Access each specific td element in the loop
      txtValue = td[j].textContent || td[j].innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        break; // Break out of the inner loop once a match is found
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function closeEditModal() {
  sessionStorage.removeItem("post_id");
  sessionStorage.removeItem("row_index");
}

function createDdownItem(index) {
  const dropdownItem = document.createElement("a");
  dropdownItem.className = "dropdown-item text-sm";
  dropdownItem.href = "#";

  dropdownItem.addEventListener("click", (e) => {
    const url = new URL(window.location); // Get current URL object
    const params = url.searchParams; // Access URL search params

    // Add or modify a parameter
    params.set("id", index);

    // Update the URL in history without reload
    window.history.pushState({}, "", url.toString());
  });

  return dropdownItem;
}

function createDdownItemDanger() {
  const dropdownItem = document.createElement("a");

  dropdownItem.className = "dropdown-item text-sm text-danger my-custom-link";
  dropdownItem.href = "#";

  return dropdownItem;
}

function showDeleteModal(table_body, index, tbl_name) {
  const id = table_body.rows[index].cells[1].innerText;

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        fetch(
          `http://localhost:3000/api/v1/https/admin/delete/${id}/${tbl_name}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              console.log(table_body.rows[index].remove());

              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function defineDropdownContent(dropdownMenuContent, index) {
  const table_body = document.getElementById("users-tbl-body");

  if (lastPath.includes("users.template.html")) {
    const dropdownItem1 = createDdownItem(index);
    const dropdownItem2 = createDdownItemDanger(
      index,
      table_body,
      "tbl_account"
    );

    dropdownItem1.setAttribute("data-bs-toggle", "modal");
    dropdownItem1.setAttribute("data-bs-target", "#edit_modal");

    dropdownItem1.textContent = "Edit User";
    dropdownItem1.setAttribute("id", "edit-user");
    dropdownItem2.textContent = "Delete User";
    dropdownItem2.setAttribute("id", "delete-user");

    dropdownItem1.addEventListener("click", (e) => {
      const id = table_body.rows[index].cells[1].innerText;

      fetch(`http://localhost:3000/api/v1/https/admin/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const organization = data.data[0].name;
          const email = data.data[0].email;
          const username = data.data[0].username;
          const last_logged_in = data.data[0].login_time;
          const status = data.data[0].status;
          const role = data.data[0].role_fkid;
          const profile = data.data[0].photo;

          document.getElementById("user-name").innerText = organization;
          document.getElementById("user-email").innerText = email;
          document.getElementById("user-username").innerText = username;
          document.getElementById("user-last_logged_in").innerText =
            last_logged_in;
          document.getElementById("user-status").value = status;
          document.getElementById("user-role").value = role;
          // profile && document.getElementById("user-profile").value = profile;

          sessionStorage.setItem("post_id", id);
          sessionStorage.setItem("row_index", index);
        });
    });

    dropdownItem2.addEventListener("click", (e) => {
      showDeleteModal(table_body, index, "tbl_account");
    });

    dropdownMenuContent.appendChild(dropdownItem1);
    dropdownMenuContent.appendChild(dropdownItem2);
  }

  if (lastPath.includes("articles.template.html")) {
    const dropdownItem1 = createDdownItem(index);
    const dropdownItem2 = createDdownItemDanger(index);

    dropdownItem1.textContent = "Edit Articles";
    dropdownItem1.setAttribute("data-bs-toggle", "modal");
    dropdownItem1.setAttribute("data-bs-target", "#edit_modal");
    dropdownItem2.textContent = "Delete Articles";

    dropdownItem1.addEventListener("click", (e) => {
      const id = table_body.rows[index].cells[1].innerText;

      fetch(`http://localhost:3000/api/v1/https/home-content/id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          const author = data.data[0].author;
          const contents = data.data[0].content;
          const image = data.data[0].image;
          const { title, content } = JSON.parse(contents);

          document.getElementById("title-edit-programs").value = title;
          document.getElementById("author-edit-programs").value = author;
          document.getElementById("content-edit-programs").value = content;

          sessionStorage.setItem("post_id", id);
          sessionStorage.setItem("row_index", index);
        });
    });

    dropdownItem2.addEventListener("click", (e) => {
      showDeleteModal(table_body, index, "tbl_home_content");
    });

    dropdownMenuContent.appendChild(dropdownItem1);
    dropdownMenuContent.appendChild(dropdownItem2);
  }

  if (lastPath.includes("programs.template.html")) {
    const dropdownItem1 = createDdownItem(index);
    const dropdownItem2 = createDdownItemDanger(index);

    dropdownItem1.textContent = "Edit Programs";
    dropdownItem1.setAttribute("data-bs-toggle", "modal");
    dropdownItem1.setAttribute("data-bs-target", "#edit_modal");
    dropdownItem2.textContent = "Delete Programs";

    dropdownItem1.addEventListener("click", (e) => {
      const id = table_body.rows[index].cells[1].innerText;

      fetch(`http://localhost:3000/api/v1/https/home-content/id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          const author = data.data[0].author;
          const contents = data.data[0].content;
          const image = data.data[0].image;
          const { title, content } = JSON.parse(contents);

          document.getElementById("title-edit-programs").value = title;
          document.getElementById("author-edit-programs").value = author;
          document.getElementById("content-edit-programs").value = content;

          sessionStorage.setItem("post_id", id);
          sessionStorage.setItem("row_index", index);
        });
    });

    dropdownItem2.addEventListener("click", (e) => {
      showDeleteModal(table_body, index, "tbl_home_content");
    });

    dropdownMenuContent.appendChild(dropdownItem1);
    dropdownMenuContent.appendChild(dropdownItem2);
  }

  if (lastPath.includes("queries.template.html")) {
    const dropdownItem1 = createDdownItem(index);
    const dropdownItem2 = createDdownItem();
    const dropdownItem3 = createDdownItem();
    const dropdownItem4 = createDdownItemDanger(index);

    dropdownItem1.textContent = "View Query";
    dropdownItem1.setAttribute("data-bs-toggle", "modal");
    dropdownItem1.setAttribute("data-bs-target", "#edit_modal");
    dropdownItem2.textContent = "Reply";
    dropdownItem3.textContent = "Mark as unread";
    dropdownItem4.textContent = "Delete Query";

    dropdownItem4.addEventListener("click", (e) => {
      showDeleteModal(table_body, index, "tbl_queries");
    });

    dropdownMenuContent.appendChild(dropdownItem1);
    dropdownMenuContent.appendChild(dropdownItem2);
    dropdownMenuContent.appendChild(dropdownItem3);
    dropdownMenuContent.appendChild(dropdownItem4);
  }

  if (lastPath.includes("community.template.html")) {
    const dropdownItem1 = createDdownItem(index);
    const dropdownItem2 = createDdownItemDanger();

    dropdownItem1.textContent = "Edit Post";
    dropdownItem1.setAttribute("data-bs-toggle", "modal");
    dropdownItem1.setAttribute("data-bs-target", "#edit_modal");
    dropdownItem2.textContent = "Delete Post";

    dropdownItem2.addEventListener("click", (e) => {
      showDeleteModal(table_body, index, "tbl_community_post");
    });

    dropdownItem1.addEventListener("click", (e) => {
      const id = table_body.rows[index].cells[1].innerText;

      fetch(`http://localhost:3000/api/v1/https/community/post/id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const title = data.data[0].title;
          const content = data.data[0].content;

          document.getElementById("title-edit-new-post").value = title;
          document.getElementById("content-edit-new-post").value = content;
          document.getElementById("images-edit-new-post");

          sessionStorage.setItem("post_id", id);
          sessionStorage.setItem("row_index", index);
        });
    });

    dropdownMenuContent.appendChild(dropdownItem1);
    dropdownMenuContent.appendChild(dropdownItem2);
  }
}

function populateLogic(results) {
  const tbody = document.getElementById("users-tbl-body");

  tbody.innerHTML = "";

  let new_results;
  updatePagination(results.length);

  if (lastPath === "users.template.html") {
    new_results = results.map((result, index) => ({
      id: result.id,
      organization: result.name ? result.name : "-- no record",
      category: result.role_fkid == 2 ? "Startup" : "Partner",
      email: result.email,
      last_logged_in: result.login_time,
      status: result.status,
    }));
  } else if (
    lastPath === "articles.template.html" ||
    lastPath === "programs.template.html"
  ) {
    new_results = results.map((result, index) => ({
      id: result.id,
      title: JSON.parse(result.content).title,
      date_posted: result.created,
      views: result.views,
      content_assessment: "high",
      status: result.status,
    }));
  } else if (lastPath === "queries.template.html") {
    new_results = results.map((result, index) => ({
      id: result.id,
      sender: result.sender,
      subject: result.subject,
      content: result.content,
      status: result.query_status,
      date_received: result.created_at,
    }));
  } else if (lastPath === "community.template.html") {
    new_results = results.map((result, index) => ({
      id: result.id,
      title: result.title,
      date_modified: result.timestamp,
      views: result.views,
    }));
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  for (let i = startIndex; i < endIndex && i < new_results.length; i++) {
    const rowData = new_results[i];
    const row = document.createElement("tr");
    const cbc = document.createElement("td");

    cbc.classList.add("text-center");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("class", "form-check-input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", "");
    checkbox.setAttribute("id", "flexCheckDefault");

    cbc.appendChild(checkbox);
    row.appendChild(cbc);

    Object.values(rowData).forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      cell.className = "text-sm align-middle text-whitesmoke";
      row.appendChild(cell);
    });

    const buttonCell = document.createElement("td");
    buttonCell.className = "text-center";

    const button = document.createElement("button");
    button.classList.add("text-xs", "border", "rounded", "bg-white");
    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("id", `button_${i}`);

    // Create img element
    const img = document.createElement("img");
    img.src = "../assets/svgs/More.svg";
    img.className = "h-4 w-4 p-1";
    img.alt = "";

    button.appendChild(img);

    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown");

    const dropdownMenuContent = document.createElement("div");
    dropdownMenuContent.className = "dropdown-menu";
    dropdownMenuContent.setAttribute("aria-labelledby", `button_${i}`); // Link to the current button's ID

    defineDropdownContent(dropdownMenuContent, i);

    dropdownMenu.appendChild(dropdownMenuContent);
    buttonCell.appendChild(button); // Append button to cell
    buttonCell.appendChild(dropdownMenu); // Also append dropdown to cell (acts as the button)

    button.onclick = function () {
      dropdownMenu.classList.toggle("show"); // Toggle visibility of the current dropdown
    };

    row.appendChild(buttonCell);
    tbody.appendChild(row);
  }
}

function get(path) {
  fetch(path)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const results = data.results;
        populateLogic(results);
      } else {
        console.log(data.message);
      }
    });
}

function populateTableBody() {
  switch (lastPath) {
    case "users.template.html":
      get("http://localhost:3000/api/v1/https/admin/users");
      break;
    case "articles.template.html":
      get("http://localhost:3000/api/v1/https/admin/articles");
      break;
    case "programs.template.html":
      get("http://localhost:3000/api/v1/https/admin/programs");
      break;
    case "queries.template.html":
      get("http://localhost:3000/api/v1/https/admin/queries");
      break;
    case "community.template.html":
      get("http://localhost:3000/api/v1/https/admin/community");
      break;
  }

  // lastPath ===  && populateLogic(dummyUsers);
  // lastPath ===  && populateLogic(dummyArticles);
  // lastPath ===  && populateLogic(dummyPrograms);
  // lastPath ===  && populateLogic(dummyQueries);
  // lastPath ===  && populateLogic(dummyCommunity);
}

function updatePagination(results_length) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(results_length / rowsPerPage);
  const trows = document.getElementById("total-rows");
  const currpos = document.getElementById("current-position");

  trows.innerText = results_length;
  currpos.innerText = `${currentPage} - ${rowsPerPage}`;

  pagination.innerHTML = "";

  for (let page = 1; page <= totalPages; page++) {
    const li = document.createElement("li");
    li.textContent = page;
    li.addEventListener("click", () => showPage(page));

    li.className = "text-white no-border cursor-pointer";

    if (page === currentPage) {
      li.className = "page-number-active apply-glass no-border";
      li.classList.remove = "border";
    }

    pagination.appendChild(li);
  }
}

function changePagePerRow() {
  const perRowSelect = document.querySelector("#page-per-row");

  if (perRowSelect) {
    rowsPerPage = parseInt(perRowSelect.value);

    showPage(currentPage);
  }
}

function showPage(page) {
  currentPage = page;
  updatePagination();
  populateTableBody();
}

// Initial pagination and table population
// lastPath !== "messenger.template.html" && updatePagination();
lastPath !== "messenger.template.html" && populateTableBody();

// let times_clicked = 0;
// let key_pressed = 0;
// const startTime = performance.now();

// function calculateDuration() {
//   const duration = performance.now() - startTime;
//   const seconds = Math.round(duration / 1000);

//   return seconds;
// }

// window.addEventListener("click", (e) => {
//   times_clicked++;
// });

// window.addEventListener("keyup", (e) => {
//   key_pressed++;
// });

// window.addEventListener("beforeunload", (e) => {
//   const payload = {
//     page: lastPath,
//     times_clicked: times_clicked,
//     duration: calculateDuration(),
//     modification_made: 0,
//     keys_pressed: key_pressed,
//   };

//   fetch("http://localhost:3000/api/v1/https/log/", {
//     method: "POST",
//     body: JSON.stringify(payload),
//     headers: {
//       "Content-type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// });
