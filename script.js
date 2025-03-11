const departureInput = document.getElementById("departureInput");
const arrivalInput = document.getElementById("arrivalInput");
const dateInput = document.getElementById("dateInput");
const searchButton = document.getElementById("search");
const infoBox = document.querySelector(".info-box");

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
    `http://localhost:3000/trips/${departureInput.value}/${arrivalInput.value}/${dateInput.value}`
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
                        <button class="btn">Book</button>
                    </div>
                `;
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

searchButton.addEventListener("click", getTrips);
