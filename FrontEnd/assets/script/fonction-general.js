/**Ce script contient les fonctions generale***/

//Fonction pour générer les projets

function genererWorks(works) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryName = works[i].category.name;
        // Création des sous balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerHTML = figure.title;

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}


// Fonction pour les Filtres
function filterItems(categoryName) {

    let filteredWorks;
    if (categoryName === 'all') {
        genererWorks(works)
    } else {
        filteredWorks = works.filter(work => work.category.name == categoryName);
        genererWorks(filteredWorks)
    }
}
//Recuperer les buttons filtres et écouter le click

function listenFiltre(){
 const liElements = document.querySelectorAll('#portfolio li');

 liElements.forEach(function (li) {
     li.addEventListener('click', function () {
         //Changer le CSS
         const activeLi = document.querySelector(".li-active");
         if (activeLi) {
             activeLi.classList.remove("li-active");
         }
         li.classList.add("li-active");

         //Appliquer le filtre
         const categoryName = li.getAttribute('data-category-name');
         filterItems(categoryName);

     });
 });

}


//Verifie en parralle si l'api est egal au localStorage
async function updateLocalStorage() {
    try {
        const response = await fetch("http://localhost:5678/api/works"); 
        const worksApi = await response.json(); 

        if (JSON.stringify(worksApi) !== worksLocal) {
            localStorage.setItem('works', JSON.stringify(worksApi));//met a jour le local Storage
            console.log('Données de works on etait mises à jour.');
        } else {
            console.log('Les données de works correspondent a celle de l\'api.');
        }
        
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}