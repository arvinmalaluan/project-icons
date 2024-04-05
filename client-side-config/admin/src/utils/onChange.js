let arrayOfImages = [];

function createTime() {
  // Create a new Date object
  let date = new Date();

  // Get the different parts of the date and time
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1
  let day = date.getDate().toString().padStart(2, "0");
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let seconds = date.getSeconds().toString().padStart(2, "0");
  let milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  // Construct the date string
  let dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  return dateString;
}

function encodeToBase64(files) {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        // Create a new FileReader
        const reader = new FileReader();

        // Define the onload event handler
        reader.onload = function (event) {
          // Retrieve the Base64 encoded data URL
          const base64String = event.target.result;

          // Resolve the promise with the Base64 encoded string
          resolve(base64String);
        };

        // Define the onerror event handler
        reader.onerror = function (error) {
          // Reject the promise with the error
          reject(error);
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
      });
    })
  );
}

function escapeQuotations(my_content) {
  const contentString = JSON.stringify(my_content);

  let escapedString = contentString
    .replace(/\\/g, "\\\\") // escape backslashes
    .replace(/"/g, '\\"'); // escape double quotes

  return escapedString;
}

function createTblContent(data) {
  const table = document.getElementById("users-tbl-body");
  const newRow = table.insertRow();

  try {
    const default_tr = document.getElementById("no-rec-tr");
    default_tr.remove();
  } catch (e) {
    // Some error handlers in the future
  }

  if (
    lastPath.includes("articles.template.html") ||
    lastPath.includes("programs.template.html")
  ) {
    const title = document.getElementById("title-create-home-content").value;

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);
    const cell8 = newRow.insertCell(7);

    cell1.className = "text-sm align-middle text-whitesmoke";
    cell2.className = "text-sm align-middle text-whitesmoke";
    cell3.className = "text-sm align-middle text-whitesmoke";
    cell4.className = "text-sm align-middle text-whitesmoke";
    cell5.className = "text-sm align-middle text-whitesmoke";
    cell6.className = "text-sm align-middle text-whitesmoke";
    cell7.className = "text-sm align-middle text-whitesmoke";
    cell8.className = "text-center";

    cell1.innerHTML = `<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">`;
    cell2.innerHTML = data.results.insertId;
    cell3.innerHTML = title;
    cell4.innerHTML = createTime();
    cell5.innerHTML = `0`;
    cell6.innerHTML = `high`;
    cell7.innerHTML = `in feed`;
    cell8.innerHTML = `<button class="text-xs border rounded bg-white" data-bs-toggle="dropdown" id="button_5"><img src="../assets/svgs/More.svg" class="h-4 w-4 p-1" alt=""></button>`;

    document.getElementById("title-create-home-content").value = "";
    document.getElementById("author-create-home-content").value = "";
    document.getElementById("content-create-home-content").value = "";
    document.getElementById("images-create-home-content").value = "";
  }

  if (lastPath.includes("community.template.html")) {
    const title = document.getElementById("title-create-new-post").value;

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.className = "text-center";
    cell2.className = "text-sm align-middle text-whitesmoke";
    cell3.className = "text-sm align-middle text-whitesmoke";
    cell4.className = "text-sm align-middle text-whitesmoke";
    cell5.className = "text-sm align-middle text-whitesmoke";
    cell6.className = "text-center";

    cell1.innerHTML = `<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">`;
    cell2.innerHTML = data.results.insertId;
    cell3.innerHTML = title;
    cell4.innerHTML = createTime();
    cell5.innerHTML = `0`;
    cell6.innerHTML = `<button class="text-xs border rounded bg-white" data-bs-toggle="dropdown" id="button_5"><img src="../assets/svgs/More.svg" class="h-4 w-4 p-1" alt=""></button>`;

    document.getElementById("title-create-new-post").value = "";
    document.getElementById("content-create-new-post").value = "";
    document.getElementById("images-create-home-content").value = "";
  }

  if (lastPath.includes("users.template.html")) {
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);
    const cell8 = newRow.insertCell(7);
    const temp_data = data;

    cell1.className = "text-sm align-middle text-whitesmoke";
    cell2.className = "text-sm align-middle text-whitesmoke";
    cell3.className = "text-sm align-middle text-whitesmoke";
    cell4.className = "text-sm align-middle text-whitesmoke";
    cell5.className = "text-sm align-middle text-whitesmoke";
    cell6.className = "text-sm align-middle text-whitesmoke";
    cell7.className = "text-sm align-middle text-whitesmoke";
    cell8.className = "text-center";

    cell1.innerHTML = `<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">`;
    cell2.innerHTML = temp_data.id;
    cell3.innerHTML = temp_data.organization;
    cell4.innerHTML = temp_data.category == "2" ? "Startup" : "Partner";
    cell5.innerHTML = temp_data.email;
    cell6.innerHTML = temp_data.last_logged_in;
    cell7.innerHTML = temp_data.status;
    cell8.innerHTML = `<button class="text-xs border rounded bg-white" data-bs-toggle="dropdown" id="button_5"><img src="../assets/svgs/More.svg" class="h-4 w-4 p-1" alt=""></button>`;
  }
}

function generateRandomUserID() {
  const randomNumber = Math.floor(Math.random() * 10000000); // Generate a random number between 0 and 9999999
  const userID = "User#" + randomNumber.toString().padStart(8, "0"); // Pad the random number with leading zeros if necessary
  return userID;
}

async function RandomProfile(id) {
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

  const data = {
    name: generateRandomUserID(),
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

    if (!response.ok) {
      console.log(response);
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    const set_temp_data = {
      id: id,
      organization: data.name,
      category: document.getElementById("category-create-new-user").value,
      email: document.getElementById("email-create-new-user").value,
      last_logged_in: "",
      status: "allowed",
    };

    createTblContent(set_temp_data);

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
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

// function displayToast(hideAfterSeconds) {
//   const myToast = new bootstrap.Toast(".create-toast");

//   setTimeout(() => {
//     myToast.show();
//   }, 1000);
// }

// displayToast(50000);

document.body.addEventListener("change", (e) => {
  if (e.target.id === "images-create-home-content") {
    const selectedFiles = e.target.files;
    const attached_imgs_count = document.getElementById("attached-imgs-count");
    arrayOfImages.push(...selectedFiles);

    // Create a list and append list items with images and delete buttons
    const ulElement = document.createElement("ul");

    arrayOfImages.forEach((file, index) => {
      const liElement = document.createElement("li");
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(file);

      // Create a delete button
      const deleteButton = document.createElement("button");

      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", () => {
        // Delete the file and the corresponding list item
        arrayOfImages.splice(index, 1);
        liElement.remove();

        // Clear the file input to allow re-uploading the same file
        document.getElementById("images-create-home-content").value = "";

        attached_imgs_count.innerText = ulElement.childNodes.length;
      });

      liElement.appendChild(imgElement);
      liElement.appendChild(deleteButton);
      ulElement.appendChild(liElement);

      attached_imgs_count.innerText = ulElement.childNodes.length;

      // Apply Tailwind CSS classes
      ulElement.className = "row w-100 px-3";
      deleteButton.className = "format-remove-btn-insert-images";
      liElement.className = "square-element col-2 border rounded-sm";
    });

    // Assuming you have an element with the ID "image-list" to append the list
    const imageListContainer = document.getElementById("image-list");
    imageListContainer.innerHTML = ""; // Clear existing content
    imageListContainer.appendChild(ulElement);
  }
});

// ! Exception due to complexities
document.body.addEventListener("click", (e) => {
  if (e.target.id === "create-article") {
    const title = document.getElementById("title-create-home-content");
    const author = document.getElementById("author-create-home-content");
    const content = document.getElementById("content-create-home-content");

    encodeToBase64(arrayOfImages)
      .then((base64Array) => {
        const my_content = {
          title: title.value,
          content: content.value,
        };

        const payload_content = escapeQuotations(my_content);

        const payload = {
          author: author.value,
          content: payload_content,
          image: base64Array.join("[space]"),
          type: "article",
          account_fkid: sessionStorage.getItem("id"),
        };

        fetch("http://localhost:3000/api/v1/https/home-content/", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            createTblContent(data);
          });
      })
      .catch((error) => {
        console.error("Error encoding files to Base64:", error);
      });
  }

  if (e.target.id === "create-user") {
    const create = getId("create-user");
    const creating = getId("creating-user");
    const cancel = getId("cancel");

    const category = getId("category-create-new-user");
    const email = getId("email-create-new-user");

    const recovery_email = email.value.split("@")[0];

    const payload = {
      role_fkid: category.value,
      email: email.value,
      username: recovery_email,
      recovery_email: `${recovery_email}.recovery@gmail.com`,
      password: "icons_default_password",
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
          RandomProfile(data.data.insertId);
        } else {
          // error handler
        }
      });
  }

  if (e.target.id === "create-program") {
    const title = document.getElementById("title-create-home-content");
    const author = document.getElementById("author-create-home-content");
    const content = document.getElementById("content-create-home-content");

    encodeToBase64(arrayOfImages)
      .then((base64Array) => {
        const my_content = {
          title: title.value,
          content: content.value,
        };

        const payload_content = escapeQuotations(my_content);

        const payload = {
          author: author.value,
          content: payload_content,
          image: base64Array.join("[space]"),
          type: "program",
          account_fkid: sessionStorage.getItem("id"),
        };

        fetch("http://localhost:3000/api/v1/https/home-content/", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            createTblContent(data);
          });
      })
      .catch((error) => {
        console.error("Error encoding files to Base64:", error);
      });
  }

  if (e.target.id === "create-post") {
    const title = document.getElementById("title-create-new-post");
    const content = document.getElementById("content-create-new-post");

    encodeToBase64(arrayOfImages)
      .then((base64Array) => {
        const payload = {
          title: title.value,
          content: content.value,
          image: base64Array.join("[space]"),
          account_fkid: sessionStorage.getItem("id"),
          profile_fkid: sessionStorage.getItem("profile_id"),
        };

        fetch("http://localhost:3000/api/v1/https/community/post", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              createTblContent(data);
            }
          });
      })
      .catch((error) => {
        console.error("Error encoding files to Base64:", error);
      });
  }

  if (e.target.id === "close-modal") {
    const title = document.getElementById("title-create-home-content");
    const author = document.getElementById("author-create-home-content");
    const content = document.getElementById("content-create-home-content");
    const imageListContainer = document.getElementById("image-list");
    const attached_imgs_count = document.getElementById("attached-imgs-count");

    title.value = "";
    author.value = "";
    content.value = "";
    arrayOfImages = [];
    imageListContainer.innerHTML = "";
    attached_imgs_count.innerText = 0;
  }

  if (e.target.id === "close-modal-community") {
    const title = document.getElementById("title-create-new-post");
    const content = document.getElementById("content-create-new-post");
    const imageListContainer = document.getElementById("image-list");
    const attached_imgs_count = document.getElementById("attached-imgs-count");

    title.value = "";
    content.value = "";
    arrayOfImages = [];
    imageListContainer.innerHTML = "";
    attached_imgs_count.innerText = 0;
  }
});

// window.addEventListener("load", (e) => {
//   // Create toast container element
//   const toastContainer = document.createElement("div");
//   toastContainer.classList.add(
//     "toast-container",
//     "position-fixed",
//     "top-0",
//     "end-0",
//     "p-3"
//   );
//   toastContainer.style.marginRight = "16px";

//   // Create toast element
//   const toast = document.createElement("div");
//   toast.id = "create-toast";
//   toast.classList.add("create-toast");
//   toast.setAttribute("role", "alert");
//   toast.setAttribute("aria-live", "assertive");
//   toast.setAttribute("aria-atomic", "true");

//   // Create toast header
//   const toastHeader = document.createElement("div");
//   toastHeader.classList.add("toast-header");

//   // Create image element for header
//   const img = document.createElement("img");
//   img.src = "../assets/svgs/ErrorWarning.svg";
//   img.classList.add("rounded", "me-2", "icon-sz-20");
//   img.alt = "...";

//   // Create strong element for header
//   const strong = document.createElement("strong");
//   strong.classList.add("me-auto", "text-success");
//   strong.textContent = "Successfully Created";

//   // Create small element for header
//   const small = document.createElement("small");
//   small.id = "time-ago";
//   small.textContent = "0s ago";

//   // Create button element for closing
//   const closeButton = document.createElement("button");
//   closeButton.type = "button";
//   closeButton.classList.add("btn-close");
//   closeButton.setAttribute("data-bs-dismiss", "toast");
//   closeButton.setAttribute("aria-label", "Close");

//   // Append elements to toast header
//   toastHeader.appendChild(img);
//   toastHeader.appendChild(strong);
//   toastHeader.appendChild(small);
//   toastHeader.appendChild(closeButton);

//   // Create toast body
//   const toastBody = document.createElement("div");
//   toastBody.classList.add("toast-body");

//   // Create paragraph element for body
//   const paragraph = document.createElement("p");
//   paragraph.classList.add("m-0", "text-sm", "text-muted");
//   paragraph.id = "toast-text-content";
//   paragraph.textContent = "The user is successfully created.";

//   // Append paragraph to toast body
//   toastBody.appendChild(paragraph);

//   // Append toast header and body to toast element
//   toast.appendChild(toastHeader);
//   toast.appendChild(toastBody);

//   // Append toast element to toast container
//   toastContainer.appendChild(toast);

//   // Append toast container to document body
//   document.body.appendChild(toastContainer);
// });

// TODO: email verification
// TODO: reset password
// TODO: filter community post based on location
