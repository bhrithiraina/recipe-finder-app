const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeFinder = document.querySelector('.recipe-finder');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');


//Function to get recipes
const fetchRecipes = async (query) => {
    recipeFinder.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`http://localhost:5000/api/recipes/search?q=${query}`);
        const response = await data.json();

        recipeFinder.innerHTML = "";
        response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
           ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="youtube-btn"><i class="fab fa-youtube"></i> Watch on YouTube</a>` : ''}
        `
        const button = document.createElement('button');
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        // Adding EventListener to recipe button
        button.addEventListener('click', ()=> {
            openRecipePopup(meal);
        });

        recipeFinder.appendChild(recipeDiv);
        });

        // Scroll to result section
        document.querySelector('.recipe-finder').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        recipeFinder.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
}

// Function to fetch ingredients and measurements 
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML= `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p >${meal.strInstructions}</p>
        </div>
        ${meal.strYoutube ? `<div style="text-align:center; margin-top:20px;">
    <a href="${meal.strYoutube}" target="_blank" class="youtube-btn"><i class="fab fa-youtube"></i> Watch on YouTube</a>
</div>` : ''}
    `

    recipeDetailsContent.parentElement.style.display = "block";
    
}

recipeCloseBtn.addEventListener('click', () =>{
    recipeDetailsContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeFinder.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});  

