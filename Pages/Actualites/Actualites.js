//Requête vers la liste des actualités
fetch('actus.json')
    .then(reponse => reponse.json())
    .then(data => {
        for (let i = 0; i < data.length; ++i) {
            let div = document.createElement("div");
            div.id = i.toString();
            div.className = "blocActu";
            document.getElementById("liste").appendChild(div);
            document.getElementById(i.toString()).innerHTML = `<h2>${data[i].titre}</h2> <p>${data[i].extrait}</p><a href='DetailsActus.html?id=${i}'><button type="button" class="btnConsulter">Consulter l'article</button></a>`;
        }
    })
