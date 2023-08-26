/*------------------------
--------- Modal ----------  //Ce script s'occupe de toute la partie modal
------------------------*/

//Fonction initialiser le modal 

function initModal() {
    createModal()
    openCloseModal()
    moveInModal()
    genererModalWorks(editWorks)
    ListenTrash();
    deleteGalerie()
    inputChange()
    ajouterPhoto()
}

//Fonction création de modal 

function createModal() {

    const modal = document.createElement("div");
    modal.id = "myModal"
    modal.classList.add("modal")
    modal.innerHTML =
        `	
    <div class="modal-content">
        <span class="precedent"><i class="fa-solid fa-arrow-left"></i></span>
        <span id="closeModal" class="close">&times;</span>
        <h2>Galerie Photo</h2>
        <div class="pour-la-bar">
            <ul class="edit-gallery"></ul>
                    
            <form id="photoForm" action="traitement.php" method="post" enctype="multipart/form-data">
                <div class="emplacement-image">
                    <div class="img-ajoutee">
                        <img id="imageDisplay" src="" alt="Image affichée">
                        <span id="closeImage" class="close-image">&times;</span>
                    </div>
                    <i class="fa-regular fa-image"></i>
                    <label for="photo" class="custom-file-input">
                        <span id="custom-text">+ Ajouter photo</span>
                        <input type="file" id="photo" name="photo" accept="image/*" required>
                    </label>
                    <p>jpg, png : 4mo max<p>
                </div>
                <label for="titre">Titre</label>
                <input type="text" id="titre" name="titre" required>
            
                <label for="categorie">Catégorie</label>
                <select id="categorie" name="categorie">
                    <option value="1">Objets</option>
                    <option value="2">Appartements</option>
                    <option value="3">Hôtels & restaurants</option>
                </select> 
            </form>
        </div>
        <input id="ajoutPhoto" class="btn-type" type="submit" value="Ajouter une photo">                <input id="validerPhoto" class="btn-type" type="submit" value="valider">                   
        <a>Supprimer la galerie</a>
    </div> `
    document.body.appendChild(modal);
}

/*----------------------------------------------
******Gestion des dépacement dans le modal******
----------------------------------------------*/

//Fonction pour ouvrir et fermer la modal 

function openCloseModal() {

    // Sélectionnez les éléments du DOM
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('#closeModal');

    // Ouvrir le modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fermer le modal en cliquant sur le bouton de fermeture
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer le modal en cliquant en dehors du contenu du modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

//Fonction de déplacement dans la modal 

function moveInModal() {

    //Ecouteur du bouton pour aller dans le formulaire nouvelle photo
    const ajoutPhoto = document.getElementById('ajoutPhoto')

    ajoutPhoto.addEventListener('click', () => {
        ajoutPhoto.style.display = "none"
        document.querySelector('.modal a').style.display = "none"
        document.querySelector(".edit-gallery").style.display = "none"
        document.querySelector('.modal h2').innerText = "Ajout photo"
        document.querySelector('.precedent').style.display = "block"
        document.getElementById('validerPhoto').style.display = "block"
        document.getElementById('photoForm').style.display = 'flex'
        updateButtonSubmit();
    })

    //Ecouteur de la fleche retour dans le modal 
    const precedent = document.querySelector(".precedent")

    precedent.addEventListener('click', () => {
        document.querySelector('.precedent').style.display = "none"
        document.getElementById('photoForm').style.display = "none"
        document.getElementById('validerPhoto').style.display = "none"
        document.querySelector('.modal h2').innerText = "Galerie Photo"
        document.getElementById('ajoutPhoto').style.display = "block"
        document.querySelector('.modal a').style.display = "block"
        document.querySelector(".edit-gallery").style.display = "block"
    })
}

/*------------------------------------
******Gestion du mode suppresion******
------------------------------------*/

//Fonction pour générer les projet

function genererModalWorks(works) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".edit-gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const li = works[i];
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("li");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryId = works[i].categoryId;
        // Création des sous balises 
        const imageElement = document.createElement("img");
        imageElement.src = li.imageUrl;
        const editerElement = document.createElement("p")
        editerElement.innerText = `Editer`
        const trashElement = document.createElement("div")
        trashElement.innerHTML = `<i class="fa-solid fa-trash-can"></i>`


        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(editerElement)
        workElement.appendChild(trashElement)
    }
}

//Function pour ecouter la corbeille 

function ListenTrash() {
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach((icon, index) => {
        icon.addEventListener("click", () => {
            removeElement(index);
            updatetrash();
        });
    });
}

// Fonction pour supprimer un projet et regenerer les projets
function removeElement(index) {

    // Supprimer 1 élément à l'index donné
    editWorks.splice(index, 1);

    // Mettre à jour le tableau dans le localStorage
    localStorage.setItem("editWorks", JSON.stringify(editWorks));

    // Mettre à jour l'affichage de la liste
    genererModalWorks(editWorks);
    genererWorks(editWorks);
}

//Function pour pouvoir réutiliser plusieurs fois la corbeille
function updatetrash() {
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach(icon => {
        icon.removeEventListener("click", removeElement);
    });
    ListenTrash();
}


//Fonction pour supprimer toute la gallerie 

function deleteGalerie() {
    const supGalerie = document.querySelector(".modal a")
    supGalerie.addEventListener('click', () => {
        editWorks.splice(0, editWorks.length);
        genererModalWorks(editWorks)
        genererWorks(editWorks)
    })
}

/*-----------------------------------------------------------
******Gestion de la partie "ajouter une photo" du modal******
-----------------------------------------------------------*/

//Création d'un tableau pour acceuillir les formdata

const tableauDonnees = [];

// Creer une variable pour afficher les images

let imageUrl = null;

// Fonction pour mettre à jour l'état du bouton valider 

function updateButtonSubmit() {
    const photoInput = document.getElementById("photo");
    const titreInput = document.getElementById("titre");
    const validerPhoto = document.getElementById('validerPhoto')

    if (photoInput.value.trim() !== '' && titreInput.value.trim() !== '') {
        validerPhoto.disabled = false;
        validerPhoto.style.backgroundColor = "#1D6154"
    } else {
        validerPhoto.disabled = true;
        validerPhoto.style.backgroundColor = "grey"
    }
}

//Fonction pour mettre a jour le formulaire a chaque changement 

function inputChange() {
    const imageDisplay = document.getElementById("imageDisplay");
    const photoInput = document.getElementById("photo");
    const photoForm = document.getElementById('photoForm')

    // Écouteur inputs pour changer button valider
    photoForm.addEventListener('input', () => {
        updateButtonSubmit();
    });

    // Ecouteur pour verifier et afficher l'image dans linput 

    photoInput.addEventListener("change", function (event) {
        const selectedImage = event.target.files[0];

        // Vérifier si le type MIME de l'image est valide
        const validImageMimeTypes = ["image/jpeg", "image/png"]; // Types MIME valides
        if (!validImageMimeTypes.some(type => selectedImage.type === type)) {
            alert("Le format de l'image n'est pas valide. Veuillez sélectionner une image au format JPEG ou PNG.");
            event.target.value = ""; // Effacer le contenu de l'input
            return;
        }

        // Vérifier si la taille de l'image est inférieure à 4 Mo (4 000 000 octets)
        else if (selectedImage.size <= 4000000) {
            imageUrl = URL.createObjectURL(selectedImage);
            imageDisplay.src = imageUrl;
            document.querySelector('.img-ajoutee').style.display = "block"
            document.querySelector('#photoForm div i').style.display = "none"
            document.querySelector('#photoForm div label').style.display = "none"
            document.querySelector('#photoForm div p').style.display = "none"

        } else {
            alert("L'image est trop grande. Veuillez sélectionner une image de taille inférieure à 4 Mo.");
            event.target.value = ""; // Effacer le contenu de l'input
        }
        //Pouvoir effacer l'image 
        closeNewImage()
    });
}

//Fonction pour effacer la photo de l'input

function closeNewImage() {
    const image = document.getElementById("imageDisplay");
    const inputImage = document.getElementById("photo");
    const croix = document.getElementById("closeImage");

    croix.addEventListener('click', () => {
        // Supprimez l'élément contenant l'image (et la croix)
        image.src = '';
        // Réinitialisez la valeur de l'input file pour vider le contenu
        inputImage.value = '';

        //Faire réapparaitre les elements au niveau de l'image 
        document.querySelector('.img-ajoutee').style.display = "none"
        document.querySelector('#photoForm div i').style.display = "block"
        document.querySelector('#photoForm div label').style.display = "flex"
        document.querySelector('#photoForm div p').style.display = "block"
    });
}


//fonction valider un ajoute de projet 

function ajouterPhoto() {
    // recupere le boutons pour valider les photo et le formulaire 
    const validerPhoto = document.getElementById('validerPhoto')
    const photoForm = document.getElementById('photoForm')
    const photoInput = document.getElementById("photo");
    const titreInput = document.getElementById("titre");
    const categorieSelect = document.getElementById("categorie");

    //Ecouteur d'evenement pour valider le formulaire et récuperer les donnés 

    validerPhoto.addEventListener('click', (event) => {
        event.preventDefault();

        // Créez un nouvel objet FormData
        const formData = new FormData();

        // Ajoutez les valeurs des champs au FormData
        formData.append("image", photoInput.files[0]);
        formData.append("title", titreInput.value);
        formData.append("category", categorieSelect.value);


        //ajouter les donnée dans tableaux de données et  dans editworks
        const imageArray = { "imageUrl": imageUrl, "title": titreInput.value }

        editWorks.push(imageArray)
        tableauDonnees.push(formData);

        //Réafficher les images dans la gallerie

        genererModalWorks(editWorks)
        genererWorks(editWorks)

        //Rappeler trash pour pouvoir le réutiliser si besoin  
        ListenTrash();

        //Vider le formulaire 
        photoForm.reset();

        //Faire réapparaitre les elements au niveau de l'image 
        document.querySelector('.img-ajoutee').style.display = "none"
        document.querySelector('#photoForm div i').style.display = "block"
        document.querySelector('#photoForm div label').style.display = "flex"
        document.querySelector('#photoForm div p').style.display = "block"


        //Mettre a jour le button valider
        updateButtonSubmit()

        /***rectangle de validation***/

        // Créez l'élément pour le rectangle vert avec le texte
        const rectangle = document.createElement('div');
        rectangle.textContent = 'Photo ajoutée';
        rectangle.className = "photo-ajoute"

        // Ajoutez l'élément à la page
        document.body.appendChild(rectangle);

        // Délayez la mise à jour de la position pour déclencher l'effet d'animation
        setTimeout(() => {
            rectangle.style.left = '10px';  // Faites glisser le rectangle vers la position souhaitée
        }, 10);  // Un petit délai pour que la transition soit appliquée

        setTimeout(() => {
            rectangle.style.left = '-300px';  // Retourne à la position initiale pour la sortie
            rectangle.addEventListener('transitionend', () => {
                rectangle.remove();  // Supprimez l'élément après l'animation de sortie
            }, { once: true });
        }, 2000);
    });
}