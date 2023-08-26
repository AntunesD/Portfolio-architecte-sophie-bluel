/***Script general***/


// Attendre que le DOM soit bien charger avant de lancé les fonctions
// Verifie egalement si l'utilisateur est connecté

document.addEventListener("DOMContentLoaded", function () {
    //Savoir si l'utilisateur est connecté 
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    //Le generations des projet dependent du storage 
    storage()

    if (isLoggedIn) {
        adminStorage()
        setAdminView()
        callApi()
        dontQuite()
        // Fonction dans modal.js
        initModal()

    } else {
        createFilter()
    }

});


/*-----------------------------------------------
---------- Partie Utilisateur Non-connecté ----------
-----------------------------------------------*/

/******Gestion du localStorage******/

const URLAPI = "http://localhost:5678/api/works"

let worksLocal;
let works;

function storage() {
    // Vérification de l'existence de 'works' dans le localStorage
    if (localStorage.getItem('works')) {
        // Charge le localStorage
        worksLocal = localStorage.getItem('works');
        works = JSON.parse(worksLocal);

        genererWorks(works)

        // Met le storage à jour
        updateLocalStorage();
    } else {
        //Met directement le storage est à jour
        updateLocalStorage();
    }
}


//Verifie en parralle si l'api est egal au localStorage
async function updateLocalStorage() {
    try {
        const response = await fetch(URLAPI);
        const worksApi = await response.json();

        if (JSON.stringify(worksApi) !== worksLocal) {
            worksLocal = JSON.stringify(worksApi)
            works = JSON.parse(worksLocal);
            localStorage.setItem('works', worksLocal);
            console.log('Données on etait mises à jour.');
            genererWorks(works)
        } else {
            console.log('Les données correspondent a celle de l\'api.');
            genererWorks(works)
        }

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}

/*******/

//Fonction pour générer les projets dans la galery principal

function genererWorks(works) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryId = works[i].categoryId;
        // Création des sous balises 
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerHTML = works[i].title;

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}

//Fonction de créations des filtres 

function createFilter() {
    // Requête Fetch pour récupérer les données depuis l'API
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            // Sélectionnez l'élément ul du portfolio
            const ulElement = document.querySelector('#portfolio ul');

            // Parcourez les données récupérées et créez les éléments li
            data.forEach(category => {
                const liElement = document.createElement('li');
                liElement.setAttribute('data-category-id', category.id);
                liElement.textContent = category.name;
                ulElement.appendChild(liElement);
            });
            listenFilter()
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        });
}

//Fonction d'écoute des filtres 

function listenFilter() {
    const liElements = document.querySelectorAll('#portfolio li');

    liElements.forEach(function (li) {
        li.addEventListener('click', function () {
            //Changer le CSS
            document.querySelector(".li-active").classList.remove("li-active");
            li.classList.add("li-active");

            //Récupere l'id du li 
            const categoryId = li.getAttribute('data-category-id');

            //Apliquer le filtre
            if (categoryId === '0') {
                genererWorks(works)
            } else {
                let filteredWorks;
                filteredWorks = works.filter(work => work.categoryId == categoryId);
                genererWorks(filteredWorks)
            }

        });
    });
}


/*-----------------------------------------------
---------- Partie Utilisateur connecté ----------
-----------------------------------------------*/

/******Gestion du localStorage******/

let editWorks;
let token;

function adminStorage() {

    //localStorage.setItem('editWorks', works);
    token = localStorage.getItem('token')
    editWorks = [...works]
}


//Fonction changement d'apparence de la page utilisateur 

function setAdminView() {

    // Créer le nouveau header
    const newHeader = document.createElement("div");

    newHeader.className = "Header-edition";
    newHeader.innerHTML = `<a id="ajout"><i class="fa-regular fa-pen-to-square"></i>Mode edition<a>
                        <button id="callApi">publier les changements</button>`

    // Insérer le nouvel header avant le body 

    const bodyElement = document.querySelector("body");
    bodyElement.parentNode.insertBefore(newHeader, bodyElement);

    //Cacher les buttons filtres 
    document.querySelector('#portfolio ul').style.display = "none"

    //Ajouter un bouton modifier en dessous de la photo de profil 
    const figure = document.querySelector('#introduction figure');
    modifier = document.createElement("a");
    modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`

    figure.appendChild(modifier)

    //Ajout d'un bouton modifier pour modifier les projets

    const title = document.querySelector("#portfolio h2")
    modifier = document.createElement("a");
    modifier.id = "openModalBtn"
    modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`
    title.appendChild(modifier)

    //Remplacer le loging et le donner un ecouteur d'evenements 
    const loginElement = document.getElementById("login");
    loginElement.innerText = "logout";
    loginElement.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token")
        window.location.reload()
    })
}


// Fonction du bouton de publication des changements 

function callApi() {

    // Récuperer le button callApi 
    const btnCallApi = document.getElementById('callApi')

    btnCallApi.addEventListener('click', async (event) => {
        event.preventDefault();

        //Desactiver le don't quite
        disableDontQuite();

        //Enregistré les changement dans le local storage 
        localStorage.setItem('works', JSON.stringify(editWorks));


        // Identifier les suppressions
        const deletions = works.filter(work => !editWorks.some(editWork => editWork.id === work.id));

        //Envoyer tout les element supprimer a l'api 
        for (const deletion of deletions) {
            const deleteURL = `${URLAPI}/${deletion.id}`;

            fetch(deleteURL, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log(`Élément avec l'ID ${deletion.id} supprimé avec succès.`);
                    } else {
                        console.error(`Échec de la suppression de l'élément avec l'ID ${deletion.id}.`);
                    }
                })
                .catch(error => {
                    console.error(`Erreur lors de la suppression de l'élément avec l'ID ${deletion.id}:`, error);
                });
        }

        //Envoyer, a l'api, toutes les nouvelles images present dans le tableau de données 

        async function processFormDataArray() {
            try {
                for (const formData of tableauDonnees) {
                    const response = await fetch(URLAPI, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });

                    const data = await response.json();
                    console.log("Réponse de l'API :", data);
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        }

        processFormDataArray();
    });
}

/******Gestion du don't quite******/

// Variable pour contrôler l'activation de dontQuite()
let isDontQuiteActive = true;

// Fonction pour avertir que les changements ne sont pas enregistrés
function dontQuite() {
    window.addEventListener("beforeunload", function (event) {
        if (isDontQuiteActive && (editWorks !== works || tableauDonnees.length !== 0)) {
            event.preventDefault();
            event.returnValue = "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter la page?";
        }
    });
}

// Appeler cette fonction pour désactiver temporairement dontQuite()
function disableDontQuite() {
    isDontQuiteActive = false;
}

// Appeler cette fonction pour réactiver dontQuite()
function enableDontQuite() {
    isDontQuiteActive = true;
}