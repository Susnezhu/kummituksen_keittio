
//ainekset: sen määrä, numero, hinta, nimi, kuva
const ingredients = {
    1: [0,1,1, "Oranssi Hämäkäkin seitti"],
    2: [0,2,2, "Kovakuoriaisen jalka"],
    3: [0,3,3, "Paisunut mustesieni"],
    4: [0,4,4, "Harmaa meduusa"],
    5: [0,5,5, "Anacondan muna"],
    6: [0,6,2, "Auringonkukka"],
    7: [0,7,3, "Tuikkiva jauho"]};

//pelaajan rahat
let money = 20;

//sekoitus kulho
let mixingBowl = [];

//oikeat kombinaatiot resepteille
const rightCombination = [
    {name: "Settiverho", combo: [1,2], price: 8, locked: false, pic: "kuvat/r1.png"},
    {name: "Hämähäkin auringonsäde", combo: [1, 6, 7], price: 7, locked: true, pic: "kuvat/r2.png"},
    {name: "Meduusan sydän", combo: [3, 4, 5, 7], price: 12, locked: true, pic: "kuvat/r3.png"},
    {name: "Elävä hyytelö", combo: [2, 4, 5, 7], price: 13, locked: true, pic: "kuvat/r4.png"},
    {name: "Kuun palanen", combo: [2, 4 ,7],price: 10, locked: true, pic: "kuvat/r5.png"}
];

//mikä resepti nyt auki
let recipeNow = 0

//funktio saa aineksen arvon ja ostaa sen
function buyIngredient(num) {
    if (money >= ingredients[num][2]) {

        //rahojen vähentäminen
        money -= ingredients[num][2];
        let moneyText = document.getElementById("money_text");
        let showMinus = document.getElementById("show_minus");
        moneyText.textContent = money + "€";
        showMinus.textContent = "-" + ingredients[num][2] + "€";
        showMinus.style.display = "block";


        //aineksien lisääminen
        let quantityText = document.getElementById("ingredient_quantity_" + num);
        ingredients[num][0] += 1;
        let quantity = ingredients[num][0];
        quantityText.textContent = quantity + " kpl";

        setTimeout(function() {
            showMinus.style.display = "none";
        }, 1000)
    }
}

//functio saa aineksen arvon ja lisää sen sekoitus alueelle
function addIngredient(num) {
    //Lisää aineksia kulhoon, jos niitä on 0 enemmän ja kulhossa ei ole vielä 10 kpl
    if (ingredients[num][0] > 0 && mixingBowl.length < 10) {
        new Audio("sounds/boiling.mp3").play();

        //aineksien vähemtäminen
        let quantityText = document.getElementById("ingredient_quantity_" + num);
        ingredients[num][0] -= 1;
        let quantity = ingredients[num][0];
        quantityText.textContent = quantity + " kpl";

        //lisää aineksia kulhoon
        mixingBowl.push(ingredients[num][1]);

        showAddedIngredients();
    }
}

const choosedIngredients = document.getElementById("choosed_ingredients"); //tähän lisätään kuvia

// Funktio näyttää kaikki valitut ainekset kuvina
function showAddedIngredients() {
    choosedIngredients.innerHTML = ""; //puhdistaa näytön

    for (let ing of mixingBowl) {
        const img = document.createElement("img"); //Luo uuden <img>-elementin
        img.src = "/kuvat/" + ing + ".png";
        img.alt = "ingredient";
        img.style.width = "100px";
        img.style.margin = "10px";
        img.style.cursor = "pointer";

        img.onclick = function() {
            const index = mixingBowl.indexOf(ing);

            if (index !== -1) {
                for (let i in ingredients) {
                    if (ingredients[i][1] === ing) {
                        ingredients[i][0] += 1; // lisää 1 aineksen takaisin
                        let quantityText = document.getElementById("ingredient_quantity_" + i);
                        quantityText.textContent = ingredients[i][0] + " kpl";
                        break;
                    }
                }

                mixingBowl.splice(index, 1); //poistaa indeksillä kuvan taulukosta

                showAddedIngredients();      //päivittää näkymän
            }
        };

        choosedIngredients.appendChild(img);
    }
}



//resepti kirjan näppäimillä selailu
function changeRecipe(value) {

    if (value === "minus") {
        if (recipeNow <= 0) {
            recipeNow = 4;
        } else {
            recipeNow -= 1;}
    } else if (value === "plus") {
        if (recipeNow >= 4) {
            recipeNow = 0;
        } else {
            recipeNow += 1
        }
    }

    showRecipe()
}

//näyttää reseptin näytöllä
function showRecipe() {
    let recipeNameText = document.getElementById("recipe_name_text");
    let recipeText = document.getElementById("recipe_text");
    let recipeCostText = document.getElementById("recipe_cost_text");
    let recipePic = document.getElementById("recipe_pic");

    recipePic.src = rightCombination[recipeNow].pic; //näytttää reseptin kuvan

    let ingredientLines = [] //tähän tulee aineksien nimet

    //jos resepti on tiedossa:
    if (!rightCombination[recipeNow].locked) {
        recipeNameText.textContent = rightCombination[recipeNow].name; //näyttää valitun reseptin nimen
        recipeCostText.textContent = "hinta: " + rightCombination[recipeNow].price + "€"; //näyttää valitun reseptin hinnan

        //Lisää aineksien nimet nimet taulukkoon
        for (let now of rightCombination[recipeNow].combo) {
        ingredientLines.push("- " + ingredients[now][3]);
        }
    } else { //jos resepti ei ole tiedossa
        recipeNameText.textContent = ""; //tyhjentää nimen
        recipeCostText.textContent = ""; //tyhjentää reseptin
        ingredientLines.push("Resepti ei vielä tiedossa");
    }

    recipeText.innerText = ingredientLines.join("\n"); //näyttää reseptien ainekset
}
//Avaa aloitus reseptin, kun sivu avautuu
showRecipe()


//tehdyn reseptin kuva animaatio
function showRecipeResultImage(imgSrc) {
    const resultImg = document.getElementById("recipeResultImg");

    resultImg.src = imgSrc;
    resultImg.style.display = "block";

    setTimeout(function() {
        resultImg.classList.add("show");
    }, 10);

    new Audio("sounds/recipewin.mp3").play();

    setTimeout(function() {
        resultImg.classList.remove("show");
        setTimeout(function() {
            resultImg.style.display = "none";
        }, 500);
    }, 2500);
}


function reviewRecipe() {
    //järjestää ja kopion kattilan sisällön
    const bowlCopy = mixingBowl.slice();
    const sortedBowl = bowlCopy.slice().sort(function(a, b) {
        return a - b;
    });
    let matchedRecipe = null;

    for (let i = 0; i < rightCombination.length; i++) { //tarkistaa vuorotellen jokaisen reseptin combon
        const recipe = rightCombination[i];
        const sortedCombo = recipe.combo.slice().sort(function(a, b) {
            return a - b;
        });

        if (sortedCombo.length !== sortedBowl.length) { //jos reseptillä ei pituus, kuin combolla
            continue;
        }

        let match = true;
        for (let j = 0; j < sortedCombo.length; j++) { //tarkistaa indeksillä onko samat
            if (sortedCombo[j] !== sortedBowl[j]) {
                match = false;
                break;
            }
        }

        if (match) {
            matchedRecipe = recipe;
            break;
        }
    }

    if (matchedRecipe) { //jos resepti on oikea

        //lisää tiedot reseptistä resepti reseptikirjaan
        if (matchedRecipe.locked) {
            matchedRecipe.locked = false;
            showRecipe()
        }

        money += matchedRecipe.price;
        document.getElementById("money_text").textContent = money + "€"; //lisää rahat

        setTimeout(function() {
            showRecipeResultImage(matchedRecipe.pic); //kuvan animaatio
            new Audio("sounds/recipewin.mp3").play();
        }, 1100);
    }

    mixingBowl = [];
}


