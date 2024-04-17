// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, onChildAdded, push, set, get, update, onValue, remove, ref, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"; // prettier-ignore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcABEi4_K0QE00gKHgiDZlPZfz2c69W8o",
  authDomain: "chat-application-36ea5.firebaseapp.com",
  databaseURL: "https://chat-application-36ea5-default-rtdb.firebaseio.com",
  projectId: "chat-application-36ea5",
  storageBucket: "chat-application-36ea5.appspot.com",
  messagingSenderId: "701910481985",
  appId: "1:701910481985:web:4ba7820635165ceeed5ac0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function createNewChat() {
  const chatRef = ref(db, `chats/${active_route ? active_route : "room_2_1"}`); // Reference the chat room path
  const date = new Date();

  const newMessage = {
    message: document.getElementById("message-box").value,
    timestamp: JSON.stringify(date),
    sender: 13,
  };

  push(chatRef, newMessage)
    .then((snapshot) => {
      // console.log("Message added successfully:", snapshot.key);
    })
    .catch((error) => {
      console.error("Error adding message:", error);
    });
}

function getRoomMessages(child_key) {
  const dbref = ref(db);
  active_route = child_key;

  if (active_chat.innerText == child_key) {
    console.log("same");
  } else {
    get(child(dbref, `chats/${child_key}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          active_chat.innerText = child_key;

          for (const values in snapshot.val()) {
            const data = snapshot.val()[values];
            const p = document.createElement("p");
            p.innerText = data.message;

            m_window.append(p);
          }
        } else {
          alert("data not found");
        }
      })
      .catch((error) => console.log(error));
  }
}

function checkIfRoomExists(id, name_param, photo) {
  const dbref = ref(db);
  const myid = sessionStorage.getItem("profile_id");
  const child_key = `room_${myid}_${id}`;

  const name = document.getElementById("name-main-container");
  const status = document.getElementById("status-main-container");
  const photo_ = document.getElementById("photo-main-container");
  const window = document.getElementById("msg-window");

  sessionStorage.setItem("recipient_id", id);
  sessionStorage.setItem("active_room", child_key);

  get(child(dbref, `chats/${child_key}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        active_chat.innerText = child_key;

        for (const values in snapshot.val()) {
          const data = snapshot.val()[values];
          const p = document.createElement("p");
          p.innerText = data.message;
        }
      } else {
        name.innerText = name_param;
        photo_.src = photo ? photo : "../assets/images/default_image.png";
        window.innerHTML = "";
      }
    })
    .catch((error) => console.log(error));
}

const chatRef = ref(db, "chats/chatlist/");
onChildAdded(
  chatRef,
  (snapshot) => {
    const childData = snapshot.val();
    const childKey = snapshot.key; // Get the key of the added child
    console.log("New child added:", childKey, childData);
  },
  (error) => {
    console.error("Error:", error);
  }
);

if (window.location.pathname.includes("messenger.template.html")) {
  fetch(`http://localhost:3000/api/v1/https/profile/`)
    .then((response) => response.json()) // Parse the response as JSON (assuming your API returns JSON)
    .then((data) => {
      document.body.addEventListener("keyup", (e) => {
        const results = data.results;
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
                button.className =
                  "w-100 py-2 gap-2 border-0 text-start bg-white d-flex";

                const img = document.createElement("img");
                img.src = data.photo
                  ? data.photo
                  : "../assets/images/default_image.png";
                img.className = "image_24";
                button.append(img);
                button.append(p);

                button.addEventListener("click", (e) => {
                  checkIfRoomExists(data.id, data.name, data.photo);

                  document.getElementById("search-for-person-messenger").value =
                    "";
                  document
                    .getElementById("search-results")
                    .classList.add("d-none");
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
    })
    .catch((error) => {
      console.error("Error fetching profiles:", error);
    });
}
