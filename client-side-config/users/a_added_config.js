// Create link element for CSS
const cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"; // prettier-ignore
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(cssLink);
document.head.appendChild(script);

const title = document.getElementById("nl_title");
const description = document.getElementById("nl_desc");
const link = document.getElementById("nl_link");
const checker_title = document.getElementById("nl_checker_title");
const checker_desc = document.getElementById("nl_checker_desc");
const checker_link = document.getElementById("nl_checker_link");

function checkNlContents() {
  let eligibility = 0;

  if (title.value.length < 1) {
    checker_title.classList.remove("d-none");
    eligibility += false;
  } else {
    checker_title.classList.add("d-none");
    eligibility += true;
  }

  if (description.value.length < 1) {
    checker_desc.classList.remove("d-none");
    eligibility += false;
  } else {
    checker_desc.classList.add("d-none");
    eligibility += true;
  }

  if (link.value.length < 1) {
    checker_link.classList.remove("d-none");
    eligibility += false;
  } else {
    checker_link.classList.add("d-none");
    eligibility += true;
  }

  return eligibility;
}

function addNewsletter() {
  const eligibility = checkNlContents();

  if (eligibility == 3) {
    const payload = {
      title: title.value,
      description: description.value,
      link: link.value,
    };

    fetch("http://localhost:3000/api/v1/https/newsletter/create", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
        } else {
          console.log("error");
        }
      });
  } else {
    console.log("missing values");
  }
}

function deleteNewsletter(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        fetch(
          `http://localhost:3000/api/v1/https/admin/delete/${id}/tbl_newsletter`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      } catch (e) {
        console.log(e);
      }
    }
  });
}

document.body.addEventListener("click", (e) => {
  if (e.target.id == "add_nl" || e.target.id == "nl_close") {
    title.value = "";
    description.value = "";
    link.value = "";
  } else if (e.target.id == "nl_add_open") {
    const update = document.getElementById("nl_update");
    const add = document.getElementById("nl_add");

    update.classList.add("d-none");
    add.classList.remove("d-none");
  } else if (e.target.id == "nl_update") {
    const eligibility = checkNlContents();

    if (eligibility == 3) {
      const id = sessionStorage.getItem("nl_active_id");

      const payload = {
        title: title.value,
        description: description.value,
        link: link.value,
      };

      fetch(`http://localhost:3000/api/v1/https/newsletter/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
          }
        });
    } else {
      console.log("missing values");
    }
  }
});

function show_btns(id) {
  document.getElementById(id).classList.remove("d-none");
}

function hide_btns(id) {
  document.getElementById(id).classList.add("d-none");
}

function editNewsletter(title, description, link, id) {
  sessionStorage.setItem("nl_active_id", id);

  const modal = document.getElementById("add_nl");
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();

  document.getElementById("nl_title").value = title;
  document.getElementById("nl_desc").value = description;
  document.getElementById("nl_link").value = link;

  const update = document.getElementById("nl_update");
  const add = document.getElementById("nl_add");

  update.classList.remove("d-none");
  add.classList.add("d-none");
}

fetch(`http://localhost:3000/api/v1/https/newsletter/get-all`)
  .then((response) => response.json()) // Parse the response as JSON (assuming your API returns JSON)
  .then((data) => {
    if (data.success) {
      const results = data.results;

      // Sort the data by timestamp in descending order (newest first)
      results.sort((a, b) => {
        // Parse the timestamps into Date objects for comparison
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);

        // Compare the timestamps (greater date comes first)
        return dateB - dateA;
      });

      const lastpath = window.location.pathname.split("/").slice(-1)[0];
      const container = document.getElementById("nl_container");
      const date_now = new Date().toISOString().split("T")[0];

      results.map((item, index) => {
        const init_id = `date_${item.timestamp.split("T")[0]}`;
        const finalid = init_id.split("-").join("_");
        const is_today = date_now == item.timestamp.split("T")[0];

        // Format the date object into the desired format (month name, day, year)
        const date = new Date(item.timestamp.split("T")[0]);
        const formatted_date = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const title = `<p class="pb-2 mt-4" id=${finalid}>${is_today ? "Today's Newsletter" : `${formatted_date} Newsletter`}</p>`; // prettier-ignore
        // check if title already exists
        const check_title = document.getElementById(finalid);

        if (!check_title) {
          let template = "";

          if (lastpath == "manage_newsletter.page.html") {
            template = `
        <div class="row" id="div_${finalid}">
          <div class="d-flex gap-2 py-2 nl_hover col-12" onmouseenter="show_btns('btns_${finalid}_${index}')" onmouseleave="hide_btns('btns_${finalid}_${index}')">
            <section class="nl_truncate w-100 p-2 rounded nl_body_card">
              <p class="nl_company_name nl_truncate">${item.title}</p>
              <p class="nl_brief_description nl_truncate">${item.description}</p>
            </section>

            <div class="d-flex align-items-center gap-2 d-none" id="btns_${finalid}_${index}">
              <button class="px-4 py-2 text-sm rounded btn btn-light" onclick="editNewsletter('${item.title}', '${item.description}', '${item.link}', '${item.id}')">Edit</button>
              <button class="px-4 py-2 text-sm rounded btn btn-danger" onclick="deleteNewsletter('${item.id}')">Delete</button>
            </div>
          </div>
        </div>
  `;
          } else {
            template = `
        <div class="row" id="div_${finalid}">
            <div class="d-flex gap-2 py-2 nl_hover col-12 col-md-6">
                <img
                src="https://cdn.freelogovectors.net/wp-content/uploads/2023/05/accenture_logo-freelogovectors.net_.png"
                class="newsletter_logo"
                alt=""
                />
                <section class="nl_truncate w-100 p-2 rounded nl_body_card">
                    <p class="nl_company_name nl_truncate">${item.title}</p>
                    <p class="nl_brief_description nl_truncate mb-4">${item.description}</p>
                    <a href=${item.link}>Read more</a>
                </section>
            </div>
        </div>
    `;
          }

          container.innerHTML += title;
          container.innerHTML += template;
        } else {
          const parent_div = document.getElementById(`div_${finalid}`);
          let template = "";

          if (lastpath == "manage_newsletter.page.html") {
            template = `
        <div class="d-flex gap-2 py-2 nl_hover col-12" onmouseenter="show_btns('btns_${finalid}_${index}')" onmouseleave="hide_btns('btns_${finalid}_${index}')">
          <section class="nl_truncate w-100 p-2 rounded nl_body_card">
            <p class="nl_company_name nl_truncate">${item.title}</p>
            <p class="nl_brief_description nl_truncate">${item.description}</p>
          </section>

          <div class="d-flex align-items-center gap-2 d-none" id="btns_${finalid}_${index}">
            <button class="px-4 py-2 text-sm rounded btn btn-light" onclick="editNewsletter('${item.title}', '${item.description}', '${item.link}', '${item.id}')">Edit</button>
            <button class="px-4 py-2 text-sm rounded btn btn-danger" onclick="deleteNewsletter('${item.id}')">Delete</button>
          </div>
        </div>
      `;
          } else {
            template = `
        <div class="d-flex gap-2 py-2 nl_hover col-12 col-md-6">
            <img
            src="https://cdn.freelogovectors.net/wp-content/uploads/2023/05/accenture_logo-freelogovectors.net_.png"
            class="newsletter_logo"
            alt=""
            />
            <section class="nl_truncate w-100 p-2 rounded nl_body_card">
                <p class="nl_company_name nl_truncate">${item.title}</p>
                <p class="nl_brief_description nl_truncate mb-4">${item.description}</p>
                <a href=${item.link}>Read more</a>
            </section>
        </div>
    `;
          }

          parent_div.innerHTML += template;
        }
      });
    }
  })
  .catch((error) => {
    console.error("Error fetching profiles:", error);
  });
