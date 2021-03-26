let previousBtn = document.getElementById('previous-btn');
let nextBtn = document.getElementById('next-btn');
let numberOfResults = 0;
let from = 0;
let to = 10;
let recipesOnPage = 10;

const params = new URLSearchParams(document.location.search);

const search = document.querySelector(".search-input");
const searchInput = search.querySelector("input");
const searchBtn = document.getElementById('search-btn');

let searchValue = '';

let path = window.location.pathname;
let page = path.split("/").pop();
let labels = '';
let navlinks = document.querySelectorAll('.nav-link');

for (const a of navlinks) {
     if(a.href.split("/").pop() === page){
        a.classList.add('active');
    }
}

switch (page){
    case 'dairyFreePage.html' : 
        labels = '&health=dairy-free';
        searchValue = params.get("search") !== null ? params.get("search") : 'dairy-free';
        break;
    case 'glutenFreePage.html' : 
        labels = '&health=gluten-free'; 
        searchValue = params.get("search") !== null ? params.get("search") : 'gluten-free';
        break;
    case 'lowCarbPage.html' : 
        labels = '&diet=low-carb';
        searchValue = params.get("search") !== null ? params.get("search") : 'low-carb';
        break;
    case 'searchPage.html':
        labels = '';
        searchValue = params.get("search") !== null ? params.get("search") : 'easter';
        break;
    default : 
        labels = '';
        searchValue = 'easter';
}

window.addEventListener('load', fetchData);

function fetchData(){
    fetchRecipes('banner', 0, 7);
    
    if(page === 'index.html' || page === ''){
        labels = '&health=dairy-free';
        fetchRecipes('dairyfree', from, to);
        labels = '&health=gluten-free';
        fetchRecipes('glutenfree', from, to);
        labels = '&diet=low-carb';
        fetchRecipes('lowcarb', from, to);
    }else{
        fetchRecipes('search', from, to);
    }
}

searchBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    searchValue = searchInput.value;
    console.log(searchValue);
    const params = new URLSearchParams(document.location.search);
    params.set("search", searchValue);
    
    if(page === 'index.html' || page === ''){
        window.location.href=`searchPage.html?${params}`;
    }else{
        window.location.href=`${page}?${params}`;

        from = 0;
        to = 10;
        previousBtn.style.visibility = 'hidden';
    }
});

function fetchRecipes(section, from, to){
    let resultsSection = document.querySelector(`.${section}-results`);
    resultsSection.innerHTML = '';

    let endpoint = `https://api.edamam.com/search?`;
    //defining the search parameters
    let queryParams = {
        q : searchValue,
        app_id : api_keys.APP_ID,
        app_key : api_keys.APP_KEY,
        from : from,
        to : to
    };

    fetch(endpoint + new URLSearchParams(queryParams) + labels)
    .then(response => {
        if(response.status !== 200){
            getNoResult(resultsSection);
            return;
        }
        return response.json()})
    .then(data => {
        //if the section is the banner then the getBanner function is called else for each recipe the getRecipe function is executed 
        if(section === 'banner'){
            getBanner(resultsSection, data.hits);
        }else{
            console.log(data);
            //for each main page, except home page, the result title and the pagination buttons have to be set
            if(page !== '' && page !== 'index.html'){
                numberOfResults = data.count;
                let resultTitle = document.querySelector('.results-title');
                resultTitle.textContent = `${numberOfResults} results for '${searchValue}'`;
                if(numberOfResults > recipesOnPage){
                    nextBtn.style.visibility = 'visible';
                }
            }
            const map = data.hits.map((d) => getRecipe(resultsSection, d.recipe));
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        getNoResult(resultsSection);
    });   

}

function getBanner(banner, hits){
    const bannerRecipes = hits.map(recipes => recipes.recipe);

    banner.innerHTML = ` <div class="row">
                            <div class="fill col-5">
                                <a href="recipe.html?recipe=${bannerRecipes[0].uri.split('#').pop()}">
                                <img class="img-fluid" src="${bannerRecipes[0].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[0].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[0].label}</h3>
                                </div>
                                </a>
                            </div>
                            <div class="fill col-3">
                                <a href="recipe.html?recipe=${bannerRecipes[1].uri.split('#').pop()}">
                                <img class="img-fluid" src="${bannerRecipes[1].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[1].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[1].label}</h3>
                                </div>
                                </a>
                            </div>
                            <div class="fill col-4">
                                <a href="recipe.html?recipe=${bannerRecipes[2].uri.split('#').pop()}">
                                <img class="img-fluid" src="${bannerRecipes[2].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[2].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[2].label}</h3>
                                </div>
                                </a>
                            </div>
                         </div>
                         <div class="row">
                            <div class="fill col-2">
                                    <a href="recipe.html?recipe=${bannerRecipes[3].uri.split('#').pop()}">
                                    <img class="img-fluid" src="${bannerRecipes[3].image}" alt="">
                                    <div class="text">
                                        <div class="banner-labels">
                                        ${getBannerDietLabels(bannerRecipes[3].dietLabels)}
                                        </div>
                                        <h3 class="banner-title">${bannerRecipes[3].label}</h3>
                                    </div>
                                    </a>
                                </div>
                            <div class="fill col-3">
                                <a href="recipe.html?recipe=${bannerRecipes[4].uri.split('#').pop()}">
                                <img class="img-fluid" src="${bannerRecipes[4].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[4].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[4].label}</h3>
                                </div>
                                </a>
                            </div>
                            <div class="fill col-5">
                                <a href="recipe.html?recipe=${bannerRecipes[5].uri.split('#').pop()}">
                                <img class="img-fluid" src="${bannerRecipes[5].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[5].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[5].label}</h3>
                                </div>
                                </a>
                            </div>
                            <div class="fill col-2">
                                <a href="recipe.html?recipe=${bannerRecipes[6].uri.split('#').pop()}}">
                                <img class="img-fluid" src="${bannerRecipes[6].image}" alt="">
                                <div class="text">
                                    <div class="banner-labels">
                                    ${getBannerDietLabels(bannerRecipes[6].dietLabels)}
                                    </div>
                                    <h3 class="banner-title">${bannerRecipes[6].label}</h3>
                                </div>
                                </a>
                            </div>
                        </div>`;
}

function getBannerDietLabels(dietLabels){
    let bannerDietLabels = '';
    for (const key in dietLabels) {
        if (Object.hasOwnProperty.call(dietLabels, key)) {
            bannerDietLabels += `<span class="banner-label">${dietLabels[key]}</span>`
        }
    }
    return bannerDietLabels;
}

function getNoResult(section){
    if(section === document.querySelector('.banner-results')){
        let div = document.createElement('div');
        div.style.textAlign = 'center';
        let imageBanner = document.createElement('img');
        imageBanner.src = ('sbTransp2.png');
        imageBanner.style.margin = 'auto';
        div.appendChild(imageBanner);
        section.appendChild(div);
    }else{
        let h = document.createElement('h1');
        h.textContent = 'Sorry no result...';
        section.appendChild(h);
    }
}

function getRecipe(searchResults, data){
    const {uri, label, image, dietLabels} = data;

    let card = document.createElement('div');
    card.classList.add('recipe-card');

    let recipeImage = document.createElement('img');
    recipeImage.src = image;
    recipeImage.alt = label;
    recipeImage.classList.add('card-img-top');
    card.appendChild(recipeImage);

    let labels = document.createElement('div');
    labels.classList.add('diet-labels');

    for (const key in dietLabels) {
        if (Object.hasOwnProperty.call(dietLabels, key)) {
            let dietLabel = document.createElement('span');
            dietLabel.classList.add('diet-label');
            dietLabel.textContent = dietLabels[key];
            labels.appendChild(dietLabel);
        }
    }

    card.appendChild(labels);

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = label;
    cardBody.appendChild(cardTitle);

    let link = document.createElement('a');
    link.classList.add('btn');
    link.classList.add('btn-dark');
    link.href = `recipe.html?recipe=${uri.split('#').pop()}`;
    link.textContent = 'Check the recipe';
    cardBody.appendChild(link);

    card.appendChild(cardBody);

    searchResults.appendChild(card);
}

if(nextBtn){
    nextBtn.addEventListener('click', () => {
        previousBtn.style.visibility = 'visible';
        if(numberOfResults > from+recipesOnPage){
            from += recipesOnPage;
            to += recipesOnPage;
            fetchRecipes('search', from,to);
        }else{
            nextBtn.style.visibility = 'hidden';
        }
    })
}
if(previousBtn){
    previousBtn.addEventListener('click', () => {
        nextBtn.style.visibility = 'visible';
        if(from - recipesOnPage >= 0){
            from -= recipesOnPage;
            to -= recipesOnPage;
            fetchRecipes('search', from,to);
        }else{
            previousBtn.style.visibility = 'hidden';
        }
    })
}
