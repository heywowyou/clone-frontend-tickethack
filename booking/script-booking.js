const url = "https://clone-backend-tickethack.vercel.app";
const bookingContainer = document.querySelector(".booking");

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

async function getBookings() {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      bookingContainer.innerHTML =
        "<h2>Please log in to view your bookings.</h2>";
      return;
    }

    const response = await fetch(`${url}/users/${sessionId}/bookings`);
    const data = await response.json();

    console.log("Fetched Bookings:", data);

    if (!data.bookings || data.bookings.length === 0) {
      bookingContainer.innerHTML = `
                <h2>No bookings yet.</h2>
                <h2>Why not plan a trip?</h2>
            `;
      return;
    }

    bookingContainer.innerHTML = "<h2>Your Bookings:</h2>";

    data.bookings.forEach((trip) => {
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
                </div>
            `;

      bookingContainer.appendChild(tripElement);
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    bookingContainer.innerHTML =
      "<h2>Error loading bookings. Please try again.</h2>";
  }
}

getBookings();
