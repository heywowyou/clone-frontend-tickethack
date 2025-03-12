const departureInput = document.getElementById("departureInput");
const arrivalInput = document.getElementById("arrivalInput");
const dateInput = document.getElementById("dateInput");
const searchButton = document.getElementById("search");
const infoBox = document.querySelector(".info-box");
const url = "https://backend-ticket-hack-seven.vercel.app";

function getTrips() {
  if (
    departureInput.value === "" ||
    arrivalInput.value === "" ||
    dateInput.value === ""
  ) {
    if (infoBox) {
      infoBox.innerHTML = `<img src="images/notFound.png" alt="Not Found Icon" />
             <div id="info-divider"></div>
                                <p>No trips found.</p>`;
    }
    return;
  }

  fetch(
    `${url}/trips/${departureInput.value}/${arrivalInput.value}/${dateInput.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message === "No trips found.") {
        infoBox.innerHTML = `
            <img src="images/notFound.png" alt="Not Found Icon" />
            <div id="info-divider"></div>
            <p>No trips found.</p>
        `;
      } else {
        infoBox.innerHTML = "";
        document.querySelector(".info-box").scrollTop = 0;
        data.trips.forEach((trip) => {
          const tripDate = new Date(trip.date);
          infoBox.innerHTML += `
                    <div class="trip">
                    <div class="trip-infos">
                        <p> ${trip.departure}  </p>
                        <p> > </p>
                        <p> ${trip.arrival} </p>
                    </div>

                    <div class="trip-infos">
                       <p>${tripDate.getHours()}:${tripDate.getMinutes()}</p>
                     </div> 
                    <div class="trip-infos">
                        <p> ${trip.price}€</p>
                    </div>
                        <button class="book-btn">Book</button>
                    </div>
                `;
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Get user session id
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

// Add trip to user cart
async function addToCart(tripId) {
  const sessionId = await getSessionId();
  if (!sessionId) {
    alert("No active session found.");
    return;
  }

  const response = await fetch(`${url}/${sessionId}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId }),
  });

  const data = await response.json();
}

searchButton.addEventListener("click", getTrips);
