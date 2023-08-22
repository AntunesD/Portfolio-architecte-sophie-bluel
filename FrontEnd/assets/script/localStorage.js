/***Ce script s'occupe des informtaion dans le localStorage */

//Charge le localStorage 
const worksLocal = localStorage.getItem('works')
const works = JSON.parse(worksLocal)

const isLoggedIn = localStorage.getItem('isLoggedIn');

let localEditWorks = localStorage.getItem('editWorks')

const token = localStorage.getItem('Token')


//Créer editWorks s'il n'existe pas
if (!localEditWorks) {
    localEditWorks = worksLocal; 
    localStorage.setItem('editWorks', localEditWorks);
}

const editWorks = JSON.parse(localEditWorks)

//Met le storage a jour 
updateLocalStorage();

// Mettre info en console pour pouvoir travailler simplement dessus 
console.log("l'ulisateur est il connecté ?", isLoggedIn);
console.log("Le token est:", token);
console.log("La valeur de works :", works)
console.log("La valeur de editWorks :", editWorks);

