/***Script pour connexion***/

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Supprimer l'élément d'erreur existant, s'il y en a
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.parentNode.removeChild(existingError);
        }
        connexion();
    });
});

/**Function de Connexion**/

async function connexion() {
    
    //Récuperer les valeur de l'input Email et Mot de passe
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Les regrouper pour les placer dans le body 
    const requestBody = {
        email: email,
        password: password
    };

    //Appel au server 

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {

            const data = await response.json(); // Convertir la réponse JSON en objet JavaScript
            const token = data.token; // Récupérer le token de la réponse
            
            //Mettre a jour le local storage
            localStorage.setItem('token', token)
            localStorage.setItem('isLoggedIn', true);

            window.location.href = "../../index.html";

        } else if (response.status === 404 || response.status === 401) {

           //Créé un message d'erreur 
           const passwordInput = document.getElementById('password');
           const passwordError = document.createElement('div');
           passwordError.textContent = "Email ou mot de passe incorrect";
           passwordError.className = 'error-message';
           passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);

        } else {
            console.error('Échec de la connexion');
        }
    } catch (error) {

        console.error('Erreur réseau', error);
    }
}
