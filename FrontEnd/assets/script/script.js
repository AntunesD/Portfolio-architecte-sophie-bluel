/***Script general***/

// Attendre que le DOM soit bien charger avant de lancé les fonctions
document.addEventListener("DOMContentLoaded", function () {

    //Générer les projets

    if (isLoggedIn) {
        //fonction dans fonction-MAJ-user-acceuil.js
        logout()
        headerEdition()
        profilImg()
        modifWorks()
        deleteFilter()

        //fonction dans fonction-general.js
        genererWorks(editWorks)
    } else {
        genererWorks(works)
    }
    //Ecouter les filtres 
    listenFiltre()
});

