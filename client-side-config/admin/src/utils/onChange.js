let arrayOfImages = [];

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

document.body.addEventListener("change", (e) => {
  if (e.target.id === "images-create-home-content") {
    const selectedFiles = event.target.files;
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
          account_fkid: 1,
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
            console.log(data);
          });
      })
      .catch((error) => {
        console.error("Error encoding files to Base64:", error);
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
          account_fkid: 1,
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
            console.log(data);
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

  if (e.target.id === "create-post") {
    const title = document.getElementById("title-create-new-post");
    const content = document.getElementById("content-create-new-post");

    encodeToBase64(arrayOfImages)
      .then((base64Array) => {
        const payload = {
          title: title.value,
          content: content.value,
          image: base64Array.join("[space]"),
          account_fkid: 1,
          profile_fkid: 2,
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
            console.log(data);
          });
      })
      .catch((error) => {
        console.error("Error encoding files to Base64:", error);
      });
  }
});
