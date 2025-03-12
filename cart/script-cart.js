const url = "https://clone-backend-tickethack.vercel.app";
const cartContainer = document.querySelector(".cart");
const mainContainer = document.querySelector(".mainContainer");

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

    // Si le panier est vide
    if (!data.cart || data.cart.length === 0) {
      cartContainer.innerHTML = `
        <h2>No Tickets in your cart.</h2>
        <h2>Why not plan a trip?</h2>
      `;
      // S'assurer que l'ancienne div `.purchase` disparaît
      document.querySelector(".purchase")?.remove();
      return;
    }

    cartContainer.innerHTML = "<h2 id='title'>Your Cart:</h2>";
    let totalPrice = 0;

    data.cart.forEach((trip) => {
      const tripDate = new Date(trip.date);
      totalPrice += trip.price; // Calcul du total

      const tripElement = document.createElement("div");
      tripElement.classList.add("trip");

      tripElement.innerHTML = `
        <div class="para">
          <p>${trip.departure}</p>
          <p>→</p>
          <p>${trip.arrival}</p>
        </div>
        <div class="date">
          <p>${tripDate.getHours().toString().padStart(2, "0")}:${tripDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}</p>
        </div>
        <div id="price">
          <p>${trip.price} €</p>
        </div>
        <button class="remove-btn" data-trip-id="${trip._id}">Remove</button>
      `;

      cartContainer.appendChild(tripElement);
    });

    // Supprimer l'ancienne div `.purchase` si elle existe
    document.querySelector(".purchase")?.remove();

    // Ajouter le total et le bouton achat dans `.mainContainer`
    const purchaseDiv = document.createElement("div");
    purchaseDiv.classList.add("purchase");
    purchaseDiv.innerHTML = `
      <div class="total"><p>Total: ${totalPrice} €</p></div>
      <button class="purchase-btn">Checkout</button>
    `;

    mainContainer.appendChild(purchaseDiv);

    // Ajouter les events listeners
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const tripId = this.getAttribute("data-trip-id");
        removeFromCart(tripId);
      });
    });

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

    getCartItems(); // Rafraîchir le panier après suppression
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
