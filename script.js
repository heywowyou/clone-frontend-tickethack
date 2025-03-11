const departureInput = document.getElementById('departureInput');
const arrivalInput = document.getElementById('arrivalInput');
const dateInput = document.getElementById('dateInput');
const searchButton = document.getElementById('search');

searchButton.addEventListener('click', () => {
    console.log('bonjour');

    if (departureInput.value === '' || arrivalInput.value === '' || dateInput.value === '') {
        const infoBox = document.querySelector('.info-box'); // Sélectionne le premier élément avec la classe "info-box"
        if (infoBox) {
            infoBox.innerHTML = `<img src="images/notFound.png" alt="Not Found Icon" />
                                <p>No trips found.</p>`;
        }
    }
});












function getTrips() {
  fetch('http://localhost:3000/trips')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

        



    })
    .catch((error) => {
      console.error(error);
    });
}