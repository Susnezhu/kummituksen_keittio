
//ainekset: sen määrä, numero, hinta, nimi, kuva
const ingredients = {
    1: [0,1,1, "Oranssi Hämäkäkin seitti"],
    2: [0,2,1, "Kovakuoriaisen jalka"],
    3: [0,3,1, "Paisunut mustesieni"],
    4: [0,4,1, "Harmaa meduusa"],
    5: [0,5,1, "Anacondan muna"],
    6: [0,6,1, "Auringonkukka"],
    7: [0,7,1, "Tuikkiva jauho"]};
    //keskellä alunperin: 1, 2, 3, 1, 1, 1, 1

//pelaajan rahat
let money = 50;

//sekoitus kulho
let mixingBowl = [];

//oikeat kombinaatiot resepteille
const rightCombination = [
    {name: "Settiverho", combo: [1,2], price: 5, locked: false, pic: "kuvat/r1.png"},
    {name: "Hämähäkin auringonsäde", combo: [1, 6, 7], price: 6, locked: true, pic: "kuvat/r2.png"},
    {name: "Meduusan sydän", combo: [3, 4, 7, 5], price: 10, locked: true, pic: "kuvat/r3.png"},
    {name: "Elävä hyytelö", combo: [2, 4, 5, 7], price: 12, locked: true, pic: "kuvat/r4.png"},
    {name: "Kuun palanen", combo: [2, 4 ,7],price: 7, locked: true, pic: "kuvat/r5.png"}
];

//mikä resepti nyt auki
let recipeNow = 0

//funktio saa aineksen arvon ja ostaa sen
function buyIngredient(num) {
    if (money >= ingredients[num][2]) {

        //rahojen vähentäminen
        money -= ingredients[num][2];
        let moneyText = document.getElementById("money_text");
        moneyText.textContent = money + "€";

        //aineksien lisääminen
        let quantityText = document.getElementById("ingredient_quantity_" + num);
        ingredients[num][0] += 1;
        let quantity = ingredients[num][0];
        quantityText.textContent = quantity + " kpl";
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

    recipeNameText.textContent = rightCombination[recipeNow].name; //näyttää valitun reseptin nimen
    recipeCostText.textContent = "hinta: " + rightCombination[recipeNow].price + "€"; //näyttää valitun hinnan
    recipePic.src = rightCombination[recipeNow].pic; //näytttää reseptin kuvan

    let ingredientLines = [] //tähän tulee aineksien nimet

    for (let now of rightCombination[recipeNow].combo) {

        recipeText.textContent = ingredients[now][3];
        ingredientLines.push("- " + ingredients[now][3]);
    }

    recipeText.innerText = ingredientLines.join("\n");
}


//Function, reviewing if recipe can be done
//Antin lisäämä, 26.5.25
function reviewRecipe() {
    
    let earnedMoney = 0;
    let bowlCopy = [...mixingBowl];
    let checkRecipes = true;
    
    while (checkRecipes){
        checkRecipes = false;
        
        for (let recipe of rightCombination){
            
            if (recipe.locked) continue
            
            let recipePossible = true;
            let tempBowl = [...bowlCopy];
            
            for (let id of recipe.combo){
                let index = tempBowl.indexOf(id);
                if (index !== -1) {
                    tempBowl.splice(index, 1);
                } else {
                    recipePossible = false;
                    break;
                }
            }
            if (recipePossible) {
                for (let id of recipe.combo) {
                    let removeIndex = bowlCopy.indexOf(id);
                    if (removeIndex !== -1) bowlCopy.splice(removeIndex, 1);
                }
                
                earnedMoney += recipe.price;
                console.log(`Made ${recipe.name} for $${recipe.price}`);
                checkRecipes = true; // New ingredients may now match another recipe
                break; // Restart loop since we modified bowl
                }
                
                if (earnedMoney > 0){
                    mixingBowl = [...bowlCopy];
                    money += earnedMoney;
                    console.log(money + " total money after playing the minigame and having met conditions to the recipes")
            
                    let moneyText = document.getElementById("money_text");
                    moneyText.textContent = money + "€";
                }
                earnedMoney = 0;
                mixingBowl = []; //Nollataan jos vaikka auttaisi?
                bowlCopy = [];
            }
        }
    }

//Avaa aloitus reseptin, kun sivu avautuu
showRecipe()
