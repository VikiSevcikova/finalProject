const params = new URLSearchParams(document.location.search);
recipeUri = params.get("recipe");
console.log(recipeUri);
const recipeSection = document.querySelector('.recipe');
let yield = 0;

let endpoint = `https://api.edamam.com/search?`;
let queryParams = {
    r : 'http://www.edamam.com/ontologies/edamam.owl#'+recipeUri,
    app_id : api_keys.APP_ID,
    app_key : api_keys.APP_KEY
};

console.log(endpoint + new URLSearchParams(queryParams));
fetch(endpoint + new URLSearchParams(queryParams))
.then(response => {
    if(response.status !== 200){
        getNoResult(recipeSection);
        return;
    }
    return response.json()})
.then(data => {
    getRecipeDetails(data[0]);
})
.catch((error) => {
    console.error('Error:', error);
    getNoResult(recipeSection);
});   

function getRecipeDetails(recipe){
    document.title = recipe.label;
    yield = recipe.yield;
    recipeSection.innerHTML = 
    `<h1 class="recipe-title">${recipe.label}</h1>
    <div class="labels">
        ${getLabels(recipe.dietLabels)}
    </div>
    <div class="labels">
        ${getLabels(recipe.healthLabels)}
    </div>
    <div class="labels">
        ${getLabels(recipe.mealType)}
    </div>
    <div class="recipe-image">
        <img src="${recipe.image}" alt="${recipe.label}">
    </div>
    <div class="recipe-details">
        <div class="ingredients">
            <h3><i class="fas fa-shopping-basket"></i> Ingredients</h3>
            <ul class="list-group list-group-flush">
                ${getIngredients(recipe.ingredientLines)}   
            </ul>
            <div class="cook-details">
                <h3><i class="far fa-clock"></i> ${recipe.totalTime} minutes</h3>
                <h3><i class="fas fa-utensils"></i> ${yield} servings</h3>
            </div>
            <a href="${recipe.url}" class="btn btn-warning" target="_blank">Source</a>
        </div>
        ${getNutrients(recipe)}
    </div>`;
}

function getLabels(labels){
    let labelsSection = '';
    for (const key in labels) {
        if (Object.hasOwnProperty.call(labels, key)) {
            labelsSection += `<span class="label">${labels[key]}</span>`
        }
    }
    return labelsSection;
}

function getIngredients(ingredients){
    console.log(ingredients);
    let ingredientList = '';
    let i = 0;
    for (const key in ingredients) {
        if (Object.hasOwnProperty.call(ingredients, key)) {
            ingredientList += ` <li class="list-group-item">
                                    <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="check${i}">
                                    <label class="custom-control-label" for="check${i}">${ingredients[i]}</label>
                                    </div>
                                </li>`;
            i++;
        }
    }
    return ingredientList;
}

function getNutrients(recipe){
    let nutrients = '';
    const {totalWeight, totalNutrients: {ENERC_KCAL, FAT, FASAT, FATRN, CHOLE, NA, CHOCDF, FIBTG, SUGAR, PROCNT}} = recipe;
    console.log(totalWeight);
    nutrients =`<div class="nutritions">
                    <header class="nutritions__header">
                        <h1 class="nutritions__title">Nutrition Facts</h1>
                        <p>Serving Size ${Math.round(totalWeight/yield)} g</p>
                        <p>Amount Per Serving</p>
                    </header>
                    <table class="nutritions__table">
                        <tbody>
                        <tr>
                            <th colspan="2">
                            <b>Calories</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(ENERC_KCAL)}</b>
                            </td>
                        </tr>

                        <tr>
                            <th colspan="2">
                            <b>Total Fat</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(FAT)}</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                            Saturated Fat
                            </th>
                            <td>
                            ${getAmountForServing(FASAT)}
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                            Trans Fat
                            </th>
                            <td>
                            ${getAmountForServing(FATRN)}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                            <b>Cholesterol</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(CHOLE)}</b>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                            <b>Sodium</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(NA)}</b>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                            <b>Total Carbohydrate</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(CHOCDF)}</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                            Fiber
                            </th>
                            <td>
                            ${getAmountForServing(FIBTG)}
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                            Sugars
                            </th>
                            <td>
                            ${getAmountForServing(SUGAR)}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                            <b>Protein</b>
                            </th>
                            <td>
                            <b>${getAmountForServing(PROCNT)}</b>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>`;
    return nutrients;
}

function getAmountForServing(nutrient){
    console.log(nutrient);
    if(nutrient){
        return `${Math.round(nutrient.quantity/yield)} ${nutrient.unit}` ;
    }else{
        return '-';
    }
}

function getNoResult(section){
    let h = document.createElement('h1');
    h.textContent = 'Sorry no result...';
    section.appendChild(h);
}
