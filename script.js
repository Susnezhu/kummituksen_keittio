
//aineksen numero ja sen määrä
const ingredients = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,}

//funktio saa aineksen arvon ja ostaa sen
function buyIngredient(num) {
    let quantity_text = document.getElementById("ingredient_quantity_" + num);
    ingredients[num] += 1;
    let quantity = ingredients[num];
    quantity_text.textContent = quantity + " kpl";
}

//functio saa aineksen arvon ja lisää sen sekoitus alueelle
function addIngredient(num) {
    let quantity_text = document.getElementById("ingredient_quantity_" + num)
    ingredients[num] -= 1;
    let quantity = ingredients[num];
    quantity_text.textContent = quantity + " kpl";
}