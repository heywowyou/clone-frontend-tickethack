const departureInput = document.getElementById('departureInput');
const arrivalInput = document.getElementById('arrivalInput');
const dateInput = document.getElementById('dateInput');
const searchButton = document.getElementById('search');
 const infoBox = document.querySelector('.info-box'); 






function getTrips() {
  
    if (departureInput.value === '' || arrivalInput.value === '' || dateInput.value === '') {
       
        if (infoBox) {
            infoBox.innerHTML = `<img src="images/notFound.png" alt="Not Found Icon" />
             <div id="info-divider"></div>
                                <p>No trips found.</p>`;
        }
        return;
    }
  



    fetch(`http://localhost:3000/trips/${departureInput.value}/${arrivalInput.value}/${dateInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);


      if (data.length === 0) {
        infoBox.innerHTML = `
            <img src="images/notFound.png" alt="Not Found Icon" />
            <div id="info-divider"></div>
            <p>No trips found.</p>
        `;} else {
           
            infoBox.innerHTML = `<h3>Résultats :</h3>`;
            data.forEach(trip => {
                infoBox.innerHTML += `
                    <div class="trip">
                        <p><strong>Départ :</strong> ${trip.departure}</p>
                        <p><strong>Arrivée :</strong> ${trip.arrival}</p>
                        <p><strong>Date :</strong> ${trip.date}</p>
                    </div>
                `;
            });
        }
    



    })
    .catch((error) => {
      console.error(error);
    });
}

searchButton.addEventListener('click', getTrips)