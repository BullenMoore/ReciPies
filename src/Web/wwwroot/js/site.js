// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

console.log("✅ recipes.js loaded!");

let recipes = [];

fetch('/recipes/index.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;

        // Sort by title initially
        recipes.sort((a, b) => a.Title.localeCompare(b.Title));

        // Render them to the page
        renderRecipes(recipes);
    });

function renderRecipes(recipes) {
    const container = document.querySelector(".flex-container");
    container.innerHTML = ""; // Clear any placeholder content

    recipes.forEach(recipe => {
        // Create the anchor (clickable area)
        const a = document.createElement("a");
        a.href = `/recipe/${recipe.Id}`;
        a.className = "recipe-card";

        // Create the inner structure exactly like your Razor HTML
        a.innerHTML = `
            <div class="container-img">
                <img src="${recipe.ImagePath}" alt="${recipe.Title}"/>
            </div>
            <div class="container-heading"><b>${recipe.Title}</b></div>
            <div class="container-description">${recipe.Description}</div>
        `;

        container.appendChild(a);
    });
}

function sortByTitle() {
    recipes.sort((a, b) => a.title.localeCompare(b.title));
    renderRecipes(recipes);
}

function filterByTag(tag) {
    const filtered = recipes.filter(r => r.tags.includes(tag));
    renderRecipes(filtered);
}