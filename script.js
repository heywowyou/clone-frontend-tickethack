const departureInput = document.getElementById("departureInput");
const arrivalInput = document.getElementById("arrivalInput");
const dateInput = document.getElementById("dateInput");
const searchButton = document.getElementById("search");
const infoBox = document.querySelector(".info-box");
const url = "https://backend-ticket-hack-seven.vercel.app";

async function getTrips() {
  try {
    const response = await fetch(
      `${url}/trips/${departureInput.value}/${arrivalInput.value}/${dateInput.value}`
    );
    const data = await response.json();

    console.log("Fetched Data:", data); // Debugging log

    if (data.message === "No trips found.") {
      infoBox.innerHTML = `
              <img src="images/notfound.png" alt="Not Found Icon" />
              <div id="info-divider"></div>
              <p>No trips found.</p>
          `;
    } else {
      infoBox.innerHTML = "";
      infoBox.scrollTop = 0;

      data.trips.forEach((trip) => {
        const tripDate = new Date(trip.date);
        const tripElement = document.createElement("div");
        tripElement.classList.add("trip");
        tripElement.style.display = "flex";
        tripElement.style.justifyContent = "space-between";
        tripElement.style.alignItems = "center";
        tripElement.style.marginBottom = "10px";
        tripElement.style.padding = "10px";
        tripElement.style.border = "1px solid #ccc";
        tripElement.style.borderRadius = "5px";
        tripElement.style.backgroundColor = "#fff";

        tripElement.innerHTML = `
                  <div class="trip-infos">
                      <p>${trip.departure}</p>
                      <p>→</p>
                      <p>${trip.arrival}</p>
                  </div>
                  <div class="trip-infos">
                      <p>${tripDate
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${tripDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}</p>
                  </div>
                  <div class="trip-infos">
                      <p>${trip.price} €</p>
                      <button class="book-btn" data-trip-id="${
                        trip._id
                      }">Book</button>
                  </div>
              `;

        infoBox.appendChild(tripElement);
      });

      infoBox.style.display = "block";
      infoBox.scrollTop = 0;

      // Add event listeners to book buttons
      document.querySelectorAll(".book-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const tripId = this.getAttribute("data-trip-id");
          console.log(`Booking trip ID: ${tripId}`);
          addToCart(tripId);
        });
      });
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
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

  console.log(`Session ID: ${sessionId}`);
  console.log(`Adding trip ID: ${tripId} to cart`);

  const response = await fetch(`${url}/users/${sessionId}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId }),
  });

  console.log(`Response status: ${response.status}`);

  const data = await response.json();
  console.log("Response data:", data);
}

searchButton.addEventListener("click", getTrips);
