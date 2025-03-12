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
    document.querySelector(".cart").innerHTML = "";
    document.querySelector(".mainContainer").innerHTML = `
    
    
    <div class="cart"> 
    <h1 id="title">My cart</h1>
    </div>`;
    cart.forEach((trip) => {
      const tripDate = new Date(trip.date);
      document.querySelector(".cart").innerHTML += `  
            
             <div class="trip">

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
            </div>

            <div class="purchase">
            <div class="total">
              <p>Total:</p>
              <p id="total">${trip.price}</p>
            </div>
            
            <button class="purchase-btn">Purchase</button>  

            </div>
            
            
            
            `;
    });
  }
}
