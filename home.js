const featuredContainer = document.getElementById('featuredRecipes');

// Fetch and display 4 random meals
async function fetchRandomMeals(count = 4) {
  featuredContainer.innerHTML = "<p>Loading featured recipes...</p>";

  const meals = [];

  for (let i = 0; i < count; i++) {
    try {
      const res = await fetch('http://localhost:5000/api/recipes/search?q=${query}');
      const data = await res.json();
      meals.push(data.meals[0]);
    } catch (err) {
      console.error("Error fetching random meal:", err);
    }
  }

  renderMeals(meals);
}

function renderMeals(meals) {
  featuredContainer.innerHTML = '';

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
    `;

    // Adding click event to trigger a detailed search
    card.addEventListener('click', () => {
      document.querySelector('.searchBox').value = meal.strMeal;
      fetchRecipes(meal.strMeal);
    });

    featuredContainer.appendChild(card);
  });
}

fetchRandomMeals();

