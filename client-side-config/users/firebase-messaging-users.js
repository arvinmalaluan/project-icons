// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, onChildAdded, push, set, get, update, onValue, remove, ref, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"; // prettier-ignore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

if (window.location.pathname.includes("/messages.html")) {
  sessionStorage.setItem("active_room", "");
  sessionStorage.setItem("room_exist", "");
  sessionStorage.setItem("recipient_id", "");
  const photo = document.getElementById("photo-main-container");
  const call = document.getElementById("call");
  const write = document.getElementById("write");

  photo.className = "d-none";
  call.className = "d-none";
  write.className = "d-none";

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
      var emojiPicker;

      $(document).ready(function() {
        // Initialize EmojiPicker
        emojiPicker = $("#message-box").emojioneArea({
            pickerPosition: "top",
            search: true,
            tones: true,
            autocomplete: false,
        });
    
        // Auto resize textarea
        emojiPicker[0].emojioneArea.on("input", function() {
            var el = emojiPicker[0].emojioneArea.editor[0];
            el.style.height = "auto";
            el.style.height = (el.scrollHeight) + "px";
        });
    
        // Close emoji picker when input is focused again
        emojiPicker[0].emojioneArea.on('focus', function() {
            emojiPicker[0].emojioneArea.hidePicker();
        });
    
        // Send message on button click or Enter key press
        $('#send-button').on('click', createNewChat);
        emojiPicker[0].emojioneArea.editor.on('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                createNewChat();
            }
        });
    });
    
      
      // Define createNewChat function
      function createNewChat() {
          var message_ = emojiPicker[0].emojioneArea.getText().trim().replace(/\n/g, '<br>'); // Replace newlines with <br>
          console.log("Message:", message_);
      
          if (message_) { // Check if message is not empty
              const active_route = sessionStorage.getItem("active_room");
              const room_exist = sessionStorage.getItem("room_exist");
              const chatRef = ref(db, `chats/chatlist`); // Reference to the chat room path
              const convoRef = ref(db, `chats/rooms/${active_route}`); // Reference to the existing rooms path
              const date = new Date();
      
              const users = sessionStorage.getItem("active_room").split("_");
      
              const newMessage = {
                  message: message_,
                  timestamp: date.toISOString(), // Store timestamp as ISO string
                  sender: sessionStorage.getItem("profile_id"),
                  room: sessionStorage.getItem("active_room"),
              };
      
              const newRoomLoad = {
                  last_message: message_,
                  sender: sessionStorage.getItem("profile_id"),
                  last_update: date.valueOf(),
                  party_one: users[1],
                  party_two: users[2],
              };
      
              // Batch Firebase operations
              Promise.all([
                  push(chatRef, newMessage),
                  room_exist === "false" ? set(convoRef, newRoomLoad) : update(convoRef, newRoomLoad)
              ]).then(([chatSnapshot, roomSnapshot]) => {
                  console.log("Message and room updated successfully:", chatSnapshot.key, roomSnapshot);
                  emojiPicker[0].emojioneArea.setText(''); // Clear the emoji picker
                  emojiPicker[0].emojioneArea.hidePicker(); // Hide the emoji picker
                  getRoomMessages(); // Refresh messages
              }).catch((error) => {
                  console.error("Error adding message or updating room:", error);
              });
          } else {
              console.log("Message cannot be empty");
          }
      }
      

  // Add event listener to message containers
  document.addEventListener('click', function(event) {
    const messageContainer = event.target.closest('.message-container');
    if (messageContainer) {
        showFullTimestamp(messageContainer);
    }
  });
  
  function showFullTimestamp(messageContainer) {
    console.log('Message clicked'); // Debugging line
    const messageTime = messageContainer.querySelector('.message-time');
    if (messageTime) {
        if (messageTime.style.display === 'none' || messageTime.style.display === '') {
            messageTime.style.display = 'block';
        } else {
            messageTime.style.display = 'none';
        }
    }
  }
 
  function getRoomMessages() {
    const dbref = ref(db);
    const active = sessionStorage.getItem("active_room");
    const window = document.getElementById("msg-window");

    // Fetch initial messages
    get(child(dbref, `chats/chatlist`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                let lastDate = "";

                // Clear previous messages before appending new ones
                window.innerHTML = "";

                for (const values in snapshot.val()) {
                    const data = snapshot.val()[values];

                    if (data.room === active) {
                        // Check if the conversation has been deleted
                        if (!data.deleted) {
                            let msg;
                            let timestamp = new Date(data.timestamp);
                            let formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            let formattedDate = timestamp.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

                            if (formattedDate !== lastDate) {
                                window.innerHTML += `<div class="date-breakline font-light">~${formattedDate} / ${formattedTime}~</div>`;
                                lastDate = formattedDate;
                            }

                            if (data.sender == sessionStorage.getItem("profile_id")) {
                                msg = `
                                    <div class="message-container me" onclick="showFullTimestamp(this)">
                                        <p class="message-content px-3 py-1 text-sm">${data.message}</p>
                                        <span class="message-time">${formattedTime}</span>
                                    </div>`;
                            } else {
                                msg = `
                                    <div class="message-container you" onclick="showFullTimestamp(this)">
                                        <p class="message-content px-3 py-1 text-sm">${data.message}</p>
                                        <span class="message-time">${formattedTime}</span>
                                    </div>`;
                            }

                            window.innerHTML += msg;
                        }
                    }
                }

                // Scroll down to the bottom after loading messages
                scrollToBottom(window);
            } else {
                alert("Data not found");
            }
        })
        .catch((error) => console.error(error));
}


// Function to scroll to the bottom of an element
function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

// Call the function to fetch initial messages when the window is loaded
window.onload = getRoomMessages;

      function formatTime(timestamp) {
        const currentTime = new Date();
        const delta = (currentTime.getTime() - timestamp) / 1000; // Convert milliseconds to seconds

        if (delta < 60) {
          return `${Math.floor(delta)} s`;
        } else if (delta < 3600) {
          return `${Math.floor(delta / 60)} m`;
        } else if (delta < 86400) {
          return `${Math.floor(delta / 3600)} h`;
        } else if (delta < 604800) {
          return `${Math.floor(delta / 86400)} d`;
        } else if (delta < 31536000) {
          return `${Math.floor(delta / 604800)} w`;
        } else {
          return `${Math.floor(delta / 31536000)} y`;
        }
      }

      function checkIfRoomExists(id, name_param, photo) {
        console.log("Checking room existence for:", id, name_param, photo);
        const dbref = ref(db);
        const myid = sessionStorage.getItem("profile_id");
        const child_key = `room_${myid > id ? myid : id}_${myid < id ? myid : id}`;
        const call = document.getElementById("call");
        const write = document.getElementById("write");
        const name = document.getElementById("profile-name");
        const photo_ = document.getElementById("profile-picture");
        const window = document.getElementById("msg-window");
        const nameMainContainer = document.getElementById("name-main-container");
        const photoMainContainer = document.getElementById("photo-main-container");
        const viewProfileButton = document.getElementById("view-profile-button");
        const deleteConvoButton = document.getElementById("delete-convo-button");
    
        console.log("viewProfileButton:", viewProfileButton); // Debugging output
    
        if (viewProfileButton) { // Check if viewProfileButton exists
            photo_.className = "d-flex";
            write.className = "d-flex gap-2 align-items-center px-2 py-2";
            call.className = "d-flex align-items-center gap-3";
    
            sessionStorage.setItem("recipient_id", id);
            sessionStorage.setItem("active_room", child_key);
    
            get(child(dbref, `chats/rooms/${child_key}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        name.innerText = name_param;
                        nameMainContainer.innerText = name_param; // Populate name-main-container
                        photo_.src = photo ? photo : "../img/user_default.jpg";
                        photoMainContainer.src = photo ? photo : "../img/user_default.jpg"; // Populate photo-main-container
                        photo_.classList.add("profile-picture"); // Add rounded and border classes
                        window.innerHTML = "";
                        sessionStorage.setItem("room_exist", true);
                        console.log("Myid:", myid);
                        console.log("id:", id);
    
                        // Set the view profile button href based on the user ID
                        const profileUrl = id == myid ? `http://127.0.0.1:5500/client-side-config/users/src/profile.html?userId=${id}` : `http://127.0.0.1:5500/client-side-config/users/src/other_profile.html?userId=${id}`;
                        console.log("Profile URL:", profileUrl); // Debugging output
                        viewProfileButton.href = profileUrl;

    
                        // Add event listener to view profile button
                        viewProfileButton.addEventListener("click", function(event) {
                            // Prevent the default behavior of the link
                            event.preventDefault();
                            // Navigate to the profile URL
                            window.location.href = profileUrl;
                        });
    
                        // Event listener for the delete convo button
                        deleteConvoButton.addEventListener("click", function() {
                            if (confirm("Are you sure you want to delete this conversation?")) {
                                const active_route = sessionStorage.getItem("active_room");
                                const dbRef = ref(db);
                                const conversationRef = child(dbRef, `chats/rooms/${active_route}`);
    
                                // Remove the conversation data from the database
                                remove(conversationRef)
                                    .then(() => {
                                        console.log("Conversation deleted successfully");
                                        // Optionally, remove the conversation from the display
                                        window.innerHTML = "";
                                    })
                                    .catch((error) => {
                                        console.error("Error deleting conversation:", error);
                                    });
                            }
                        });
    
                        // Show the profile container
                        const profileContainer = document.getElementById("profile-container");
                        profileContainer.classList.remove("d-none");
    
                        getRoomMessages();
                    } else {
                        name.innerText = name_param;
                        nameMainContainer.innerText = name_param; // Populate name-main-container
                        photo_.src = photo ? photo : "../img/user_default.jpg";
                        photoMainContainer.src = photo ? photo : "../img/user_default.jpg"; // Populate photo-main-container
                        photo_.classList.add("profile-picture"); // Add rounded and border classes
                        window.innerHTML = "";
                        sessionStorage.setItem("room_exist", false);
                    }
                })
                .catch((error) => console.log(error));
        } else {
            console.error("View profile button not found in the DOM"); // Debugging output
        }
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
              msg = `<p class="m-0 px-3 py-1 bg-pri text-sm me middle-me">${childData.message}</p>`;
            } else {
              msg = `<p class="m-0 px-3 py-1 bg-pri text-sm you middle-you">${childData.message}</p>`;
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
          console.log("Convo:", childData);
          const childKey = snapshot.key; // Get the key of the added child
          const myid = sessionStorage.getItem("profile_id");
          const route = `room_${
            childData.party_one > childData.party_two
              ? childData.party_one
              : childData.party_two
          }_${
            childData.party_one < childData.party_two
              ? childData.party_one
              : childData.party_two
          }`;

          if (childData.party_one == myid || childData.party_two == myid) {
            const find = childData.party_one == myid ? childData.party_two : childData.party_one; // prettier-ignore

            results.map((result, index) => {
              if (result.id == find) {
                const windowElement = document.getElementById("convo-list");
                const existingListItems = Array.from(windowElement.querySelectorAll("li")); // prettier-ignore
                console.log(result);

                const listItem = document.createElement("li");
                listItem.classList.add( "list-group-item", "list-convos", "text-truncate", "d-flex", "align-items-center", "px-2", "py-2", "gap-2", "rounded" ); // prettier-ignore
                listItem.setAttribute("id", childData.last_update);

                const avatarDiv = document.createElement("div");
                avatarDiv.classList.add("rounded");
                avatarDiv.style.height = "48px";
                avatarDiv.style.width = "48px";
                avatarDiv.style.flexShrink = "0";
                
                const imgSrc = data.photo ? data.photo : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg';
                const img = document.createElement("img");
                img.src = imgSrc;
                img.className = "w-10 h-10 rounded-full border border-gray-300"; // Apply additional classes if needed
                img.alt = "Avatar";
                
                avatarDiv.appendChild(img);
                
                const contentDiv = document.createElement("div");
                contentDiv.classList.add("w-full", "rounded");
                
                const nameElement = document.createElement("div");
                nameElement.classList.add("font-semibold", "text-truncate"); // Add padding on the right
                nameElement.style.width = "250px";
                nameElement.style.paddingRight = "1rem"; // Adjust padding
                nameElement.style.marginRight = "0.5rem"; // Adjust margin
                nameElement.textContent = result.name;
                
                const messageElement = document.createElement("div");
                messageElement.classList.add("text-muted", "text-xs", "text-truncate");
                messageElement.id = `last-message-${childData.last_update}`;
                messageElement.style.width = "200px";
                messageElement.classList.add(route);
                messageElement.textContent = `${
                  childData.sender == sessionStorage.getItem("profile_id")
                    ? "You:"
                    : ""
                } ${childData.last_message} ${childData.last_update}`;
                
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

      onValue(convoRefListener, (snapshot) => {
        const childData = snapshot.val();
        const window = document.getElementById("msg-window");
        window.scrollTop = window.scrollHeight;
    
        Object.keys(childData).map((item, data) => {
            const result = childData[item];
            const route = `room_${result.party_one > result.party_two ? result.party_one : result.party_two}_${ result.party_one < result.party_two ? result.party_one : result.party_two }`; // prettier-ignore
            const splitted = route.split("_");
            const myid = sessionStorage.getItem("profile_id");
    
            if (splitted.includes(myid)) {
                const div = document.querySelector(`.${route}`); // prettier-ignore
                const message = `${myid == result.sender ? "You:" : ""} ${result.last_message}`;
                const isConversationOpen = isElementInViewport(div); // Check if the conversation container is in view
    
                // Create the message element
                const messageElement = document.createElement("div");
                messageElement.classList.add("text-muted", "text-xs", "text-truncate"); // Add padding on the right
                messageElement.textContent = message;
    
                // Add a span element for the last update text
                const lastUpdateSpan = document.createElement("span");
                lastUpdateSpan.classList.add("absolute", "top-15", "right-1", "text-xs", "bottom-1", "text-gray-400");
                lastUpdateSpan.textContent = formatTime(result.last_update);
    
                // Apply bold styling if the conversation is not open
                if (!isConversationOpen) {
                    messageElement.classList.add("bold-last-message");
                }
    
                // Append the message element and last update span to the container
                div.innerHTML = ''; // Clear previous content
                div.appendChild(messageElement);
                div.appendChild(lastUpdateSpan);
            }
        });
    });

    
    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    

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
                img.src = data.photo ? data.photo : "../img/user_default.jpg"; // prettier-ignore
                img.className = "image_24";
                img.className = "w-25";
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

      //FOR LARGE SCREENS

      const convoRefListener1 = ref(db, `chats/rooms`);
      onChildAdded(
        convoRefListener1,
        (snapshot) => {
          const childData = snapshot.val();
          console.log("Convo:", childData);
          const childKey = snapshot.key; // Get the key of the added child
          const myid = sessionStorage.getItem("profile_id");

          if (childData.party_one == myid || childData.party_two == myid) {
            const find = childData.party_one == myid ? childData.party_two : childData.party_one; // prettier-ignore

            results.map((result, index) => {
              if (result.id == find) {
                const windowElement = document.getElementById("convo-list1");
                const existingListItems = Array.from(windowElement.querySelectorAll("li")); // prettier-ignore

                const listItem = document.createElement("li");
                listItem.classList.add( "list-group-item", "list-convos", "text-truncate", "d-flex", "align-items-center", "px-2", "py-2", "gap-2", "rounded","clickable" ); // prettier-ignore
                listItem.setAttribute("id", childData.last_update);

                const avatarDiv = document.createElement("div");
                avatarDiv.classList.add("border", "border-full");
                avatarDiv.style.height = "48px";
                avatarDiv.style.width = "48px";
                avatarDiv.style.flexShrink = "0";

                const avatarImage = document.createElement("img");
                avatarImage.src = data.photo ? data.photo : "../img/user_default.jpg"; // prettier-ignore
                avatarImage.classList.add("rounded-circle", "h-100", "w-100"); // prettier-ignore
                avatarImage.alt = "Avatar";

                avatarDiv.appendChild(avatarImage);

                const contentDiv = document.createElement("div");
                contentDiv.classList.add("w-full", "rounded");

                const nameElement = document.createElement("div");
                nameElement.classList.add("fw-bold", "text-truncate");
                nameElement.style.width = "285px";
                nameElement.textContent = result.name;

                let identify;
                const name = sessionStorage.getItem("profile_id");

                if (childData.sender === name) {
                  identify = "You: ";
                } else {
                  identify = result.name;
                }

                const messageElement = document.createElement("div");
                messageElement.classList.add("text-muted", "text-xs");
                messageElement.id = "last-message";
                messageElement.textContent =
                  identify + ": " + childData.last_message;

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
        const results_box = document.getElementById("results-box1");
      
        if (e.target.id === "search-for-person-messenger1") {
          results_box.innerText = "";
          const filtered_results = results.filter((item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
      
          if (e.target.value.length > 0) {
            document.getElementById("search-results1").classList.remove("hidden");
      
            if (filtered_results.length > 0) {
              document.getElementById("no-results1").classList.add("hidden");
      
              filtered_results.forEach((data) => {
                const button = document.createElement("button");
                const p = document.createElement("p");
                p.innerText = data.name;
                button.className =
                "w-full py-2 gap-4 text-left bg-white flex items-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200";
              
                button.style.borderTop = "1px solid #E5E7EB";
                button.style.borderBottom = "1px solid #E5E7EB";
              
      
                const img = document.createElement("img");
                img.src = data.photo ? data.photo : "../img/user_default.jpg";
                img.className = "w-10 h-10 rounded-full border border-gray-300";
                button.append(img);
                button.append(p);
      
                button.addEventListener("click", () => {
                  checkIfRoomExists(data.id, data.name, data.photo);
      
                  document.getElementById("search-for-person-messenger1").value = "";
                  document.getElementById("search-results1").classList.add("hidden");
                });
      
                results_box.append(button);
              });
            } else {
              document.getElementById("no-results1").classList.remove("hidden");
            }
          } else {
            document.getElementById("search-results1").classList.add("hidden");
          }
        }
      });
      
      

      document.body.addEventListener("click", (e) => {
        if (e.target.id === "send-message") {
          createNewChat();
          document.getElementById("message-box").value = "";
        }
      });

      // Listen for keypress event on the document body
      document.body.addEventListener("keypress", (e) => {
        // Check if the pressed key is Enter (key code 13)
        if (e.key === "Enter") {
          // Optionally, you can add additional checks here
          createNewChat();
          document.getElementById("message-box").value = "";
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching profiles:", error);
    });
}