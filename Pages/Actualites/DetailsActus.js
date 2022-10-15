let url_string = window.location.href;
let url = new URL(url_string);
let c = parseInt(url.searchParams.get("id"));

fetch('actus.json')
    .then(reponse => reponse.json())
    .then(data => {
        document.getElementById('title').innerHTML = data[c].titre;
        document.getElementById('extrait').innerHTML = data[c].extrait;
        document.getElementById('description').innerHTML = data[c].description;
        document.getElementById('imageActu').src = data[c].image;

    })
