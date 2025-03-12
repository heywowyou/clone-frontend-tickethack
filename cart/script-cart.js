const url = "https://clone-backend-tickethack.vercel.app";
const cartContainer = document.querySelector(".cart");

// Function to get session ID
async function getSessionId() {
  const response = await fetch(`${url}/users/session`);
  const data = await response.json();

  if (data && data.sessionId) {
    return data.sessionId;
  } else {
    console.error("No session ID found.");
    return null;
  }
}

// Function to get cart items
async function getCartItems() {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      cartContainer.innerHTML = "<h2>Please log in to view your cart.</h2>";
      return;
    }

    const response = await fetch(`${url}/users/${sessionId}/cart`);
    const data = await response.json();

    console.log("Fetched Cart Items:", data); // Debugging log

    // If the cart is empty
    if (!data.cart || data.cart.length === 0) {
      cartContainer.innerHTML = `
                <h2>No Tickets in your cart.</h2>
                <h2>Why not plan a trip?</h2>
            `;
      return;
    }

    cartContainer.innerHTML = "<h2 id='title'>Your Cart:</h2>";

    let totalPrice = 0;

    data.cart.forEach((trip) => {
      const tripDate = new Date(trip.date);
      totalPrice += trip.price; // Calculate total price

      const tripElement = document.createElement("div");
      tripElement.classList.add("trip");

      tripElement.innerHTML = `
                <div class="para">
                    <p>${trip.departure}</p>
                    <p>→</p>
                    <p>${trip.arrival}</p>
                </div>
                <div class="date">
                    <p>${tripDate
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${tripDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}</p>
                </div>
                <div id="price">
                    <p>${trip.price} €</p>
                </div>
                <button class="remove-btn" data-trip-id="${
                  trip._id
                }">Remove</button>
            `;

      cartContainer.appendChild(".mainContainer");
    });

    // Add total price and checkout button
    cartContainer.innerHTML += `
            <div class="purchase">
                <div class="total"><p>Total: ${totalPrice} €</p></div>
                <button class="purchase-btn">Checkout</button>
            </div>
        `;

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const tripId = this.getAttribute("data-trip-id");
        removeFromCart(tripId);
      });
    });

    // Add event listener to checkout button
    document
      .querySelector(".purchase-btn")
      .addEventListener("click", checkoutCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    cartContainer.innerHTML = "<h2>Error loading cart. Please try again.</h2>";
  }
}

// Function to remove a trip from the cart
async function removeFromCart(tripId) {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) return;

    const response = await fetch(`${url}/users/${sessionId}/cart/${tripId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("Trip Removed:", data);

    getCartItems(); // Refresh cart after removal
  } catch (error) {
    console.error("Error removing trip:", error);
  }
}

// Function to checkout and move cart items to bookings
async function checkoutCart() {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) return;

    const response = await fetch(`${url}/users/${sessionId}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("Checkout Complete:", data);

    alert("Checkout successful!");
    getCartItems();
  } catch (error) {
    console.error("Error during checkout:", error);
  }
}

getCartItems();

function previousCode() {
  async function getTrips() {
    try {
      console.log("Fetching trips...");
      const sessionId = await getSessionId();

      if (!sessionId) return null;

      const fetchUser = await fetch(`${url}/users/${sessionId}/cart`);
      const user = await fetchUser.json();
      console.log("User data:", user);

      cart = user.user.cart || []; // Stocke le panier
      console.log("nv tableau; ", cart);
      displayCart(); // Met à jour l'affichage
      return cart;
    } catch (error) {
      console.error("Error fetching trips:", error);
      return null;
    }
  }

  getTrips();

  {
    /* <div class="mainContainer">
      <div class="cart">
        <h2>No Tickets In your cart.</h2>
        <h2>Why not plan a trip?</h2>
      </div>
    </div> */
  }

  function displayCart() {
    if (cart.length === 0) {
      console.log("Cart is empty");
      document.querySelector(".mainContainer").innerHTML = `<div class="cart">
        <h2>No Tickets In your cart.</h2>
        <h2>Why not plan a trip?</h2>
      </div>`;
    } else {
      // Vider le contenu actuel
      document.querySelector(".cart").innerHTML = "";
      document.querySelector(".mainContainer").innerHTML = `
      <div class="cart"> 
        <h1 id="title">My cart</h1>
      </div>`;

      let totalPrice = 0; // Variable pour stocker le total du panier

      // Créer les éléments du panier et calculer le total
      cart.forEach((trip) => {
        const tripDate = new Date(trip.date);

        // Créer un élément div pour chaque voyage
        const tripDiv = document.createElement("div");
        tripDiv.classList.add("trip");

        tripDiv.innerHTML = `
        <div class="para">
          <p> ${trip.departure}</p>
          <p>→</p>
          <p>${trip.arrival}</p>
        </div>
  
        <div class="date">
          <p>${tripDate.getHours().toString().padStart(2, "0")}:${tripDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}</p>
        </div>
  
        <p id="price">${trip.price}€</p>
        <button class="remove-btn" data-trip-id="${trip._id}">X</button>
      `;

        // Ajouter l'élément div au DOM
        document.querySelector(".cart").appendChild(tripDiv);

        // Ajouter le prix au total
        totalPrice += trip.price;
      });

      // Ajouter le total et le bouton de commande
      const purchaseDiv = document.createElement("div");
      purchaseDiv.classList.add("purchase");

      purchaseDiv.innerHTML = `
      <div class="total">
        <p>Total:</p>
        <p id="total">${totalPrice}€</p>
      </div>
  
      <button class="purchase-btn">Purchase</button>
    `;

      // Ajouter l'élément du total au DOM
      document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", async function () {
          console.log("Bouton supprimé cliqué !");
          const tripId = button.dataset.tripId; // Récupérer l'ID du voyage depuis le bouton
          const sessionId = await getSessionId();

          if (!sessionId) return;

          try {
            const response = await fetch(
              `${url}/users/${sessionId}/cart/${tripId}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const data = await response.json();
            console.log("Données de la réponse : ", data);

            if (data.message === "Trip removed from cart") {
              console.log("Trip supprimé avec succès !");
              // Mettre à jour localement le panier sans faire une nouvelle requête
              cart = cart.filter((trip) => trip._id !== tripId); // Supprime le trip du tableau
              displayCart(); // Met à jour l'affichage
            } else {
              console.error("Erreur : ", data.message);
            }
          } catch (error) {
            console.error("Erreur lors de la suppression du trip", error);
          }
        });
      });
    }
  }
}
