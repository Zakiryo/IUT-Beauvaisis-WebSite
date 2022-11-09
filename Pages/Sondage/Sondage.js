/**
 * Algorithme vérifiant le régime alimentaire d'un sondé.
 * Des comparaisons sont faites entre les attributs des aliments saisis et ceux de la liste d'aliments globale.
 * @param aliments Liste de tous les aliments
 * @param sondage Résultats d'un sondé
 * @returns {string} Chaîne de caractère contenant le régime alimentaire du sondé
 */
function regime(aliments, sondage) {
    let alimSondage = [];
    for (let i = 1; i < 11; ++i) {
        alimSondage.push(sondage[`Aliment${i}`]);
    }
    for (let i = 0; i < alimSondage.length; ++i) {
        for (let j = 0; j < aliments.length; ++j) {
            if (alimSondage[i] === aliments[j].alim_code) {
                if ((aliments[j].alim_ssgrp_code >= 401 && aliments[j].alim_ssgrp_code <= 404) ||
                    (aliments[j].alim_nom_fr.includes('viande')) ||
                    (aliments[j].alim_nom_fr.includes('poisson')) ||
                    (aliments[j].alim_grp_nom_fr.includes('viande')) ||
                    (aliments[j].alim_ssssgrp_code >= 10301 && aliments[j].alim_ssssgrp_code <= 10305)) {
                    return "Carnivore";
                }
            }
        }
    }
    return estVegetalien(aliments, alimSondage);
}

/**
 * Fonction appelée par la fonction régime si le sondé n'est pas carnivore.
 * Vérifie les propriétés pour vérifier si le sondé est végétalien ou végétarien.
 * @param aliments Liste de tous les aliments
 * @param alimSondage Liste d'aliments récupérés du sondé
 * @returns {string} Chaîne de caractères contenant le régime alimentaire du sondé
 */
function estVegetalien(aliments, alimSondage) {
    for (let i = 0; i < alimSondage.length; ++i) {
        for (let j = 0; j < aliments.length; ++j) {
            if (alimSondage[i] === aliments[j].alim_code) {
                if ((aliments[j].alim_grp_code === 4) ||
                    (aliments[j].alim_grp_code === 5) ||
                    (aliments[j].alim_ssgrp_code === 410) ||
                    (aliments[j].alim_ssssgrp_code === 10308) ||
                    (aliments[j].alim_nom_fr.includes('fromage')) ||
                    (aliments[j].alim_ssgrp_code === 801) ||
                    (typeof aliments[j].Lactose_g_100_g !== 'string') ||
                    (aliments[j].alim_ssssgrp_nom_fr.includes('fromage'))) {
                    return "Végétarien";
                }
            }
        }
    }
    return "Végétalien";
}

/**
 * Établie un score santé en fonction des aliments sélectionnés par le sondé.
 * L'algorithme initialise un score sur 1000 puis compare plusieurs champs de la liste des aliments afin de soustraire le score en cas de besoin.
 * @param aliments Liste de tous les aliments
 * @param sondage Résultats d'un sondé
 * @returns {number} Le score santé final du sondé passé en paramètre
 */
function scoreSante(aliments, sondage) {
    let score = 1000;
    let alimSondage = [];
    for (let i = 1; i < 11; ++i) {
        alimSondage.push(sondage[`Aliment${i}`]);
    }
    for (let i = 0; i < alimSondage.length; ++i) {
        for (let j = 0; j < aliments.length; ++j) {
            if (alimSondage[i] === aliments[j].alim_code) {
                if (aliments[j].Cholesterol_mg_100_g > 10)
                    score -= parseInt(aliments[j].Cholesterol_mg_100_g / 10);
                if (aliments[j].AG_satures_g_100_g > 5)
                    score -= parseInt(aliments[j].AG_satures_g_100_g / 5);
                if (aliments[j].Energie_Reglement_UE_N_1169_2011_kcal_100_g > 100)
                    score -= parseInt(aliments[j].Energie_Reglement_UE_N_1169_2011_kcal_100_g / 5);
                if (aliments[j].alim_grp_code === 7)
                    score -= parseInt(aliments[j].Sucres_g_100_g / 5);
            }
        }
    }
    if (score < 0)
        score = 0;
    return score;
}

/**
 * Créer puis ajoute les colonnes de résultats des sondages à l'HTML.
 * Appelle également les fonctions régime et ScoreSanté pour remplir les colonnes correspondantes.
 * @param aliments Liste de tous les aliments
 * @param sondage Liste des résultats du sondage
 */
function addColumn(aliments, sondage) {
    for (let i = 0; i < sondage.length; ++i) {
        let tr = document.createElement("tr");
        let tdNom = document.createElement("td");
        let tdPrenom = document.createElement("td");
        let tdDate = document.createElement("td");
        let tdVille = document.createElement("td");
        let tdRegime = document.createElement("td");
        let tdScore = document.createElement("td");
        tdNom.innerHTML = sondage[i].Nom;
        tdPrenom.innerHTML = sondage[i].Prenom;
        tdDate.innerHTML = sondage[i].Naissance;
        tdVille.innerHTML = sondage[i].Ville;
        tdRegime.innerHTML = regime(aliments, sondage[i]);
        tdScore.innerHTML = scoreSante(aliments, sondage[i]) + ' / 1000';
        document.getElementById("tbody").appendChild(tr);
        document.getElementById("tbody").appendChild(tdNom);
        document.getElementById("tbody").appendChild(tdPrenom);
        document.getElementById("tbody").appendChild(tdDate);
        document.getElementById("tbody").appendChild(tdVille);
        document.getElementById("tbody").appendChild(tdRegime);
        document.getElementById("tbody").appendChild(tdScore);
    }
}

//Requête vers les fichiers JSON correspondants à la liste des aliments et celles des résultats de sondage
fetch('Aliments.json')
    .then(reponse => reponse.json())
    .then(aliments => {
        fetch('Sondage.json')
            .then(reponse => reponse.json())
            .then(sondage => {
                addColumn(aliments, sondage);

            })
    })
