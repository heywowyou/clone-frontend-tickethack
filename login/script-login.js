const url = "https://backend-ticket-hack-seven.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  let check = true;

  function toggleForm() {
    document.querySelector("#loginForm").innerHTML = check
      ? `<h1 id="title">Login Page</h1>
           <div class="user">
             <label for="username">Nom d'utilisateur</label>
             <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" />
           </div>
           <div class="password">
             <label for="password">Mot de passe</label>
             <input type="password" id="password" name="password" placeholder="Mot de passe" />
           </div>
           <input id="btnConnexion" type="submit" value="Connexion" />
           <p id="newAccount">Créer un compte?</p>`
      : `<h1 id="title">SignUp Page</h1>
           <div class="user">
             <label for="username">Nom d'utilisateur</label>
             <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" />
           </div>
           <div class="password">
             <label for="password">Mot de passe</label>
             <input type="password" id="password" name="password" placeholder="Mot de passe" />
           </div>
           <input id="btn" type="submit" value="Créer un compte" />
           <p id="newAccount" class="newAccount">Se connecter?</p>`;

    // Ajouter l'événement pour basculer entre connexion et création de compte
    document.querySelector("#newAccount").addEventListener("click", toggleForm);
    check = !check;

    // Attacher les événements après chaque mise à jour du formulaire
    attachEventListeners();
  }

  // Lier l'événement au premier clic sur "Créer un compte"
  document.querySelector("#newAccount").addEventListener("click", toggleForm);

  // Fonction pour attacher les événements aux boutons
  function attachEventListeners() {
    // Gérer la soumission du formulaire pour la création d'un compte
    const btn = document.querySelector("#btn");
    const btnConnexion = document.querySelector("#btnConnexion");

    // Si le bouton de connexion est présent
    if (btnConnexion) {
      btnConnexion.addEventListener("click", async (event) => {
        event.preventDefault(); // Empêcher la soumission du formulaire

        const loginData = {
          username: document.querySelector("#username").value,
          password: document.querySelector("#password").value,
        };

        console.log("Connexion en cours...");

        try {
          const fetchData = await fetch(`${url}/users/Login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          });

          const data = await fetchData.json();
          console.log("Données de la réponse : ", data);

          if (data.success) {
            console.log("Connexion réussie !");
            // Tu peux rediriger ou afficher un message de succès ici
          } else {
            console.error("Erreur : ", data.message);
          }
        } catch (error) {
          console.error("Erreur lors de la connexion", error);
        }
      });
    }

    // Si le bouton de création de compte est présent
    if (btn) {
      btn.addEventListener("click", async (event) => {
        event.preventDefault(); // Empêcher la soumission du formulaire

        const accountData = {
          username: document.querySelector("#username").value,
          password: document.querySelector("#password").value,
        };

        console.log("Création du compte en cours...");

        try {
          const fetchData = await fetch(`${url}/users/CreateAccount`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(accountData),
          });

          const data = await fetchData.json();
          console.log("Données de la réponse : ", data);

          if (data) {
            return console.log("Compte créé avec succès !");
            // Tu peux rediriger ou afficher un message
          } else {
            console.error("Erreur : ", data.message);
          }
        } catch (error) {
          console.error("Erreur lors de la création du compte", error);
        }
      });
    }
  }

  // Initialiser le formulaire avec l'état "Connexion"
  toggleForm();
});
