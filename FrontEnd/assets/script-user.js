document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('Token')


    console.log("l'ulisateur est il connecté ?", isLoggedIn);
console.log("Le token est:", token);

    if (isLoggedIn) {
        logout()
        headerEdition()
        profilImg()
        editWorks()
        deleteFilter()
    }
});

//Fonction header mode edition 


function headerEdition() {
    // Créer un nouvel élément div
    const newDiv = document.createElement("div");

    newDiv.className = "Header-edition";
    newDiv.innerHTML = `<a><i class="fa-regular fa-pen-to-square"></i>Mode edition<a>
                        <button>publier les changements</button>`

    // Insérer le nouvel élément div avant le header

    const bodyElement = document.querySelector("body");
    bodyElement.parentNode.insertBefore(newDiv, bodyElement);

}

//Fonction logout

function logout() {

    const loginElement = document.getElementById("login");
    loginElement.innerText = "logout";
    loginElement.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("Token")
        window.location.reload()
    })
}

//Fonction modifier photo 


function profilImg() {
    const figure = document.querySelector('#introduction figure');
modifier = document.createElement("a");
modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`

figure.appendChild(modifier)

};

//Fonction modifier projet 

function editWorks(){
const title = document.querySelector("#portfolio h2")
modifier = document.createElement("a");
modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`
title.appendChild(modifier)
}

//fonction suprimer les buttons filtre

function deleteFilter() {

    const ulElement = document.querySelector('#portfolio ul');
    const parentElement = ulElement.parentNode; // Obtenez le parent de l'élément ul

    parentElement.removeChild(ulElement); // Supprimez l'élément ul du parent
}