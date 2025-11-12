"use strict";

const LANGS = {
    "Any":"any",
    "Czech":"cs",
    "German":"de",
    "English":"en",
    "Spanish":"es",
    "Basque":"eu",
    "French":"fr",
    "Galician":"gl",
    "Hungarian":"hu",
    "Italian":"it",
    "Lithuanian":"lt",
    "Polish":"pl",
    "Swedish":"sv",
};

const TYPES = {
    "Any":"any",
    "Neutral":"neutral",
    "Chuck":"chuck"
};

function fillSelects(){
    let langSelect = document.querySelector("#selLang");
    let catSelect = document.querySelector("#selCat");
    let numSelect = document.querySelector("#selNum");

    for(let lang of Object.keys(LANGS)){
        let option = document.createElement("option");
        option.innerHTML = lang;
        option.setAttribute("value", LANGS[lang]);
        langSelect.appendChild(option);
    }

    for(let cat of Object.keys(TYPES)){
        let option = document.createElement("option");
        option.innerHTML = cat;
        option.setAttribute("value", TYPES[cat]);
        catSelect.appendChild(option);
    }

    for(let i = 1; i <= 10; i++){
        let option = document.createElement("option");
        option.innerHTML = i;
        numSelect.appendChild(option);
    }
    let option = document.createElement("option");
    option.innerHTML = "All";
    option.setAttribute("selected", "true");
    option.setAttribute("value", "all")
    numSelect.appendChild(option);
}

function addJokes(jokes){
    let jokesArea = document.querySelector("#jokes");
    jokesArea.innerHTML = "";

    if(jokes.length == 0){
        let jokeP = document.createElement("article");
        jokeP.classList.add("box");
        jokeP.innerHTML = "There are no jokes in the chosen combination of languages and categories";
        jokesArea.appendChild(jokeP);
    }

    for(let joke of jokes){
        let jokeP = document.createElement("article");
        jokeP.classList.add("box");
        jokeP.innerHTML = joke;
        jokesArea.appendChild(jokeP);
    }
}

async function queryAPI(apiQuery){
    const BASE_URL = "https://jokes-api-server-65re.onrender.com/api/v1/jokes/";
    return await fetch(`${BASE_URL}${apiQuery}`).then(response => response.json());
}

async function getJokes(){
    let id = document.querySelector("#jokeId").value;
    if(id != ""){
        let jokesJSON = await queryAPI(id);

        if("error" in jokesJSON){
            addJokes([jokesJSON.error])
        }
        else{
            if(jokesJSON.joke.text == undefined){
                addJokes([jokesJSON.joke]);
            }
            else{
                addJokes([jokesJSON.joke.text]);
            }
        }
    }
    else{
        let lang = document.querySelector("#selLang").value;
        let cat = document.querySelector("#selCat").value;
        let num = document.querySelector("#selNum").value;

        let jokesJSON = await queryAPI(`${lang}/${cat}/${num}`);
        addJokes(jokesJSON.jokes);
    }
}

window.onload = function(){
    fillSelects();
}

document.querySelector("#btnAmuse").addEventListener("click", await getJokes);
