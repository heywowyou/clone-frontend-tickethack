const url = "https://backend-ticket-hack-seven.vercel.app";
let cart = []; // Initialisation

async function getSessionId() {
  try {
    const response = await fetch(`${url}/users/session`);
    const data = await response.json();

    if (data && data.sessionId) {
      return data.sessionId;
    } else {
      console.error("No session ID found.");
      return null;
    }
  } catch (error) {
    console.error("Error getting session ID:", error);
    return null;
  }
}

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
    document.querySelector(".mainContainer").appendChild(purchaseDiv);
  }
}

document
  .querySelector(".remove-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const tripId = event.target.dataset.tripId;
    const sessionId = await getSessionId();

    if (!sessionId) return;

    try {
      const response = await fetch(`${url}/users/${sessionId}/cart/${tripId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Données de la réponse : ", data);

      if (data.message === "Trip removed from cart") {
        console.log("Trip supprimé avec succès !");
        // Tu peux rediriger ou afficher un message de succès ici
      } else {
        console.error("Erreur : ", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du trip", error);
    }
  });
