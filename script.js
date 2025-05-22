
//ainekset: sen määrä, numero, hinta
const ingredients = {
    1: [0,1,1],
    2: [0,2,1],
    3: [0,3,1],
    4: [0,1,1],
    5: [0,1,1],
    6: [0,1,1],
    7: [0,1,1]};

//pelaajan rahat
let money = 50;

//sekoitus kulho
let mixingBowl = [];

//oikeat kombinaatiot resepteille
const rightCombination = {
    settiverho: [1,2],
    hamahakinAurin: [1,6,7],
    meduusanSydan: [3,4,5,7],
    elavaHyytelo: [2,4,5,7],
    KuunPalanen: [2,4,7]
}

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

        //aineksien vähemtäminen
        let quantityText = document.getElementById("ingredient_quantity_" + num)
        ingredients[num][0] -= 1;
        let quantity = ingredients[num][0];
        quantityText.textContent = quantity + " kpl";

        //lisää aineksia kulhoon
        mixingBowl.push(ingredients[num][1]);
    }
}