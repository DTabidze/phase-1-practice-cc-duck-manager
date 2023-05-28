document.addEventListener("DOMContentLoaded", function () {
    const URL ="http://localhost:3000/ducks";
    fetch(URL)
      .then(response => response.json())
      .then(ducks => ducks.forEach(duck => {
        showDuck(duck);
      }))
    init();
  })
  
  function showDuck(duck) {
    const divShowDuck = document.querySelector("div#duck-nav");
    const image = document.createElement("img");
    image.src = duck["img_url"];
    divShowDuck.appendChild(image);
  
    image.addEventListener("click", displayDuck => {
      const divDuckDisplay = document.querySelector("div#duck-display");
      const name = duck.name;
      divDuckDisplay.querySelector("h2").innerHTML = name;
      divDuckDisplay.querySelector("img").src = duck["img_url"];
      const likeButton = divDuckDisplay.querySelector("button#duck-display-likes");
      likeButton.innerHTML = `${duck["likes"]} Likes`;
  
      // Create a closure to access duck.id
      const duckID = duck.id;
  
      likeButton.addEventListener("click", () => {
        addLike(duckID, name, likeButton);
      });
  
      // Add a cache-busting parameter to the fetch request
      const URL = `http://localhost:3000/ducks/${duck.id}?cache=${Date.now()}`;
  
      fetch(URL)
        .then(response => response.json())
        .then(updatedDuck => {
          likeButton.innerHTML = `${updatedDuck["likes"]} Likes`;
        })
        .catch(error => {
          console.error("Error updating duck:", error);
        });
    });
  }
  
  function addLike(duckID, name, likeButton) {
    event.preventDefault();
  
    // Retrieve the duck ID, name, and image URL from the page
    const imgUrl = document.querySelector("img").src;
  
    // Compute the updated likes count and update the page
    const currentLikes = +likeButton.innerHTML.split(" ")[0] + 1;
    likeButton.innerHTML = `${currentLikes} Likes`;
  
    // Construct the request data and URL
    const data = { name, img_url: imgUrl, likes: currentLikes };
    const URL = `http://localhost:3000/ducks/${duckID}`;
  
    // Send the PUT request to update the duck on the server
    fetch(URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(updatedDuck => {
        console.log("Duck updated successfully:", updatedDuck);
      })
      .catch(error => {
        console.error("Error updating duck:", error);
      });
  }
  
  function addNewDuck(event) {
    const URL = "http://localhost:3000/ducks";
  
    const inputDuckName = event.target.querySelector('input[name="duck-name-input"]').value;
    const inputImgLink = event.target.querySelector('input[name="duck-image-input"]').value;
  
    const data = {
      name: inputDuckName,
      img_url: inputImgLink,
      likes: 0
    };
  
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(updatedDuck => {
        console.log("Duck updated successfully:", updatedDuck);
      })
      .catch(error => {
        console.error("Error updating duck:", error);
      });
  
    event.preventDefault();
  }
  
  function init() {
    const formSubmit = document.querySelector("form#new-duck-form");
    formSubmit.addEventListener("submit", addNewDuck);
  }
  