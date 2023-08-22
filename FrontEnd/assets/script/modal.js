/***Ce script s'occupe de la modal***/

document.addEventListener("DOMContentLoaded", () => {
   
    genererModalWorks(editWorks)
    openCloseModal()
    trash();

});

function genererModalWorks(works) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".edit-gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const li = works[i];
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("li");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryName = works[i].category.name;
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


function openCloseModal(){

// Sélectionnez les éléments du DOM
const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('myModal');
const closeModalBtn = document.querySelector('.close');

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

// Fonction pour supprimer un élément du tableau dans le localStorage
function removeElement(index) {

    let editWorks = JSON.parse(localStorage.getItem("editWorks"));

    // Supprimer l'élément à l'index donné
    editWorks.splice(index, 1);

    // Mettre à jour le tableau dans le localStorage
    localStorage.setItem("editWorks", JSON.stringify(editWorks));

    // Mettre à jour l'affichage de la liste
    genererModalWorks(editWorks);
    genererWorks(editWorks);
}

function trash() {
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach((icon, index) => {
        icon.addEventListener("click", () => {
            removeElement(index);
            updatetrash();
        });
    });
}

function updatetrash() {
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach(icon => {
        icon.removeEventListener("click", removeElement);
    });
    trash();
}
