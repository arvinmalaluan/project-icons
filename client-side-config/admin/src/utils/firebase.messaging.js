// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, onChildAdded, push, set, get, update, onValue, remove, ref, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"; // prettier-ignore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

if (window.location.pathname.includes("messenger.template.html")) {
  sessionStorage.setItem("active_room", "");
  sessionStorage.setItem("room_exist", "");
  sessionStorage.setItem("recipient_id", "");

  fetch(`http://localhost:3000/api/v1/https/profile/`)
    .then((response) => response.json()) // Parse the response as JSON (assuming your API returns JSON)
    .then((data) => {
      const results = data.results;

      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAcABEi4_K0QE00gKHgiDZlPZfz2c69W8o",
        authDomain: "chat-application-36ea5.firebaseapp.com",
        databaseURL:
          "https://chat-application-36ea5-default-rtdb.firebaseio.com",
        projectId: "chat-application-36ea5",
        storageBucket: "chat-application-36ea5.appspot.com",
        messagingSenderId: "701910481985",
        appId: "1:701910481985:web:4ba7820635165ceeed5ac0",
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getDatabase();

      function createNewChat() {
        const message_ = document.getElementById("message-box");

        if (message_.value) {
          const active_route = sessionStorage.getItem("active_room");
          const room_exist = sessionStorage.getItem("room_exist");
          const chatRef = ref(db, `chats/chatlist`); // Reference to the chat room path
          const convoRef = ref(db, `chats/rooms/${active_route}`); // Reference to the existing rooms path
          const date = new Date();

          const users = sessionStorage.getItem("active_room").split("_");

          const newMessage = {
            message: message_.value,
            timestamp: JSON.stringify(date),
            sender: sessionStorage.getItem("profile_id"),
            room: sessionStorage.getItem("active_room"),
          };

          const newRoomLoad = {
            last_message: message_.value,
            last_update: new Date().valueOf(),
            party_one: users[1],
            party_two: users[2],
          };

          push(chatRef, newMessage)
            .then((snapshot) => {
              // console.log("Message added successfully:", snapshot.key);
            })
            .catch((error) => {
              console.error("Error adding message:", error);
            });

          if (room_exist === "false") {
            set(convoRef, newRoomLoad)
              .then((snapshot) => {
                // console.log("Message added successfully:", snapshot);
              })
              .catch((error) => {
                console.error("Error adding message:", error);
              });
          } else {
            update(convoRef, newRoomLoad);
          }
        } else {
          console.log("cannot be null");
        }
      }

      function getRoomMessages() {
        const dbref = ref(db);
        const active = sessionStorage.getItem("active_room");

        get(child(dbref, `chats/chatlist`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              for (const values in snapshot.val()) {
                const data = snapshot.val()[values];

                if (data.room === active) {
                  let msg;
                  const window = document.getElementById("msg-window");

                  if (data.sender == sessionStorage.getItem("profile_id")) {
                    msg = `<li class="msg-me"><span class="me">${data.message}</span></li>`;
                  } else {
                    msg = `<li class="msg-you"><span class="you">${data.message}</span></li>`;
                  }

                  window.innerHTML += msg;
                }
              }
            } else {
              alert("data not found");
            }
          })
          .catch((error) => console.log(error));
      }

      function checkIfRoomExists(id, name_param, photo) {
        const dbref = ref(db);
        const myid = sessionStorage.getItem("profile_id");
        const child_key = `room_${myid > id ? myid : id}_${
          myid < id ? myid : id
        }`;

        const name = document.getElementById("name-main-container");
        const status = document.getElementById("status-main-container");
        const photo_ = document.getElementById("photo-main-container");
        const window = document.getElementById("msg-window");

        sessionStorage.setItem("recipient_id", id);
        sessionStorage.setItem("active_room", child_key);

        get(child(dbref, `chats/rooms/${child_key}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              name.innerText = name_param;
              photo_.src = photo ? photo : "../assets/images/default_image.png";
              window.innerHTML = "";
              sessionStorage.setItem("room_exist", true);

              getRoomMessages();
            } else {
              name.innerText = name_param;
              photo_.src = photo ? photo : "../assets/images/default_image.png";
              window.innerHTML = "";
              sessionStorage.setItem("room_exist", false);
            }
          })
          .catch((error) => console.log(error));
      }

      const chatRef = ref(db, `chats/chatlist`);
      onChildAdded(
        chatRef,
        (snapshot) => {
          const childData = snapshot.val();
          const childKey = snapshot.key; // Get the key of the added child

          if (childData.room == sessionStorage.getItem("active_room")) {
            let msg;
            const window = document.getElementById("msg-window");

            if (childData.sender == sessionStorage.getItem("profile_id")) {
              msg = `<li class="msg-me"><span class="me">${childData.message}</span></li>`;
            } else {
              msg = `<li class="msg-you"><span class="you">${childData.message}</span></li>`;
            }

            window.innerHTML += msg;
          }
        },
        (error) => {
          console.error("Error:", error);
        }
      );

      const convoRefListener = ref(db, `chats/rooms`);
      onChildAdded(
        convoRefListener,
        (snapshot) => {
          const childData = snapshot.val();
          const childKey = snapshot.key; // Get the key of the added child
          const myid = sessionStorage.getItem("profile_id");

          if (childData.party_one == myid || childData.party_two == myid) {
            const find = childData.party_one == myid ? childData.party_two : childData.party_one; // prettier-ignore

            results.map((result, index) => {
              if (result.id == find) {
                const windowElement = document.getElementById("convo-list");
                const existingListItems = Array.from(windowElement.querySelectorAll("li")); // prettier-ignore

                const listItem = document.createElement("li");
                listItem.classList.add( "list-group-item", "list-convos", "text-truncate", "d-flex", "align-items-center", "px-2", "py-2", "gap-2", "rounded" ); // prettier-ignore
                listItem.setAttribute("id", childData.last_update);

                const avatarDiv = document.createElement("div");
                avatarDiv.classList.add("border", "border-full");

                const avatarImage = document.createElement("img");
                avatarImage.src = data.photo ? data.photo : "../assets/images/default_image.png"; // prettier-ignore
                avatarImage.classList.add("rounded-circle", "shadow-4", "h-40", "w-40"); // prettier-ignore
                avatarImage.alt = "Avatar";

                avatarDiv.appendChild(avatarImage);

                const contentDiv = document.createElement("div");
                contentDiv.classList.add("w-full", "rounded");

                const nameElement = document.createElement("div");
                nameElement.classList.add("fw-bold", "text-truncate");
                nameElement.style.width = "285px";
                nameElement.textContent = result.name;

                const messageElement = document.createElement("div");
                messageElement.classList.add("text-muted", "text-xs");
                messageElement.id = "last-message";
                messageElement.textContent = "You: is dumb. 16h";

                contentDiv.appendChild(nameElement);
                contentDiv.appendChild(messageElement);

                listItem.appendChild(avatarDiv);
                listItem.appendChild(contentDiv);

                let inserted = false; // Flag to track insertion

                // Loop through existing list items and compare IDs (modified logic)
                existingListItems.forEach((existingItem, index) => {
                  // Check if existingItem has an ID and current item should be inserted before it
                  if (
                    existingItem.id &&
                    !inserted &&
                    existingItem.id < listItem.id
                  ) {
                    // Insert before the current item
                    windowElement.insertBefore(listItem, existingItem);
                    inserted = true; // Set flag after successful insertion
                  }
                });

                // Append to the end if not inserted yet
                if (!inserted) {
                  windowElement.appendChild(listItem);
                }

                listItem.addEventListener("click", () => {
                  checkIfRoomExists(result.id, result.name, result.photo);
                });
              }
            });
          }
        },
        (error) => {
          console.error("Error:", error);
        }
      );

      document.body.addEventListener("keyup", (e) => {
        const results_box = document.getElementById("results-box");

        if (e.target.id == "search-for-person-messenger") {
          results_box.innerText = "";
          const filtered_results = results.filter((item, index) => {
            return item.name
              .toLowerCase()
              .includes(e.target.value.toLowerCase());
          });

          if (e.target.value.length > 0) {
            document
              .getElementById("search-results")
              .classList.remove("d-none");

            if (filtered_results.length > 0) {
              document.getElementById("no-results").classList.add("d-none");

              filtered_results.map((data, index) => {
                const button = document.createElement("button");
                const p = document.createElement("p");
                p.innerText = data.name;
                button.className = "w-100 py-2 gap-2 border-0 text-start bg-white d-flex"; // prettier-ignore

                const img = document.createElement("img");
                img.src = data.photo ? data.photo : "../assets/images/default_image.png"; // prettier-ignore
                img.className = "image_24";
                button.append(img);
                button.append(p);

                button.addEventListener("click", (e) => {
                  checkIfRoomExists(data.id, data.name, data.photo);

                  document.getElementById("search-for-person-messenger").value = ""; // prettier-ignore
                  document.getElementById("search-results").classList.add("d-none"); // prettier-ignore
                });

                results_box.append(button);
              });
            } else {
              document.getElementById("no-results").classList.remove("d-none");
            }
          } else {
            document.getElementById("search-results").classList.add("d-none");
          }
        }
      });

      document.body.addEventListener("click", (e) => {
        if (e.target.id === "send-message") {
          createNewChat();
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching profiles:", error);
    });
}
