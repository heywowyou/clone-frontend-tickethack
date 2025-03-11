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
           <input id="btn" type="submit" value="Connexion" />
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
        <p id="newAccount" class"newAccount">Se connecter?</p>`;

    document.querySelector("#newAccount").addEventListener("click", toggleForm);
    check = !check;
  }

  document.querySelector("#newAccount").addEventListener("click", toggleForm);
});
