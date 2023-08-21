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


async function connexion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log('Connexion réussie');
            const data = await response.json(); // Convertir la réponse JSON en objet JavaScript
            const token = data.token; // Récupérer le token de la réponse
            localStorage.setItem('Token', token)
            localStorage.setItem('isLoggedIn', true);

            window.location.href = "../../index.html";

        } else if (response.status === 404) {
            const emailInput = document.getElementById('email');
            const emailError = document.createElement('div');
            emailError.textContent = 'Adresse e-mail invalide';
            emailError.className = 'error-message';
            emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);
        } else if (response.status === 401) {
            console.error('Mot de passe incorrect');
            const passwordInput = document.getElementById('password');
            const passwordError = document.createElement('div');
            passwordError.textContent = 'Le mot de passe est invalide';
            passwordError.className = 'error-message';
            passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);
        } else {
            console.error('Échec de la connexion');
        }
    } catch (error) {

        console.error('Erreur réseau', error);
    }
}
