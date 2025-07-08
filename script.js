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

        const favButton = document.createElement('button');
        favButton.textContent = "❤️ Add to Favorites";
        favButton.classList.add('fav-btn');

        favButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please login to save favorites.');
                    return;
                }

                try {
                    const res = await fetch('http://localhost:5000/api/auth/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(meal)
                    });

                    const data = await res.json();
                        if (res.ok) {
                            alert('Added to favorites!');
                        } else {
                            alert(data.message);
                        }
                } catch (err) {
                    alert('Error adding to favorites');
                }
        }); 

        recipeDiv.appendChild(favButton);


        recipeFinder.appendChild(recipeDiv);
        });



        // Scroll to result section
        document.querySelector('.recipe-finder').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        recipeFinder.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
}

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// REGISTER
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! Please login.');
      registerForm.reset();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error registering user');
  }
});

// LOGIN
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      loginForm.reset();
      logoutBtn.style.display = 'inline';
      fetchFavorites();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error logging in');
  }
});

const favoritesSection = document.getElementById('favoritesSection');

const fetchFavorites = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:5000/api/auth/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    favoritesSection.innerHTML = "<h3>Your Favorites:</h3>";
    data.forEach(meal => {
      const favDiv = document.createElement('div');
      favDiv.classList.add('recipe');
      favDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;
      favoritesSection.appendChild(favDiv);
    });

  } catch (err) {
    favoritesSection.innerHTML = "<p>Failed to load favorites</p>";
  }
};


// LOGOUT
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  alert('Logged out');
  logoutBtn.style.display = 'none';
});


// Function to fetch ingredients and measurements 
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else {
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

if (localStorage.getItem('token')) {
  logoutBtn.style.display = 'inline';
  fetchFavorites();
}

