// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Filtering

const recipes = JSON.parse(
    document.getElementById("recipe-data").dataset.recipes
);

const filterText = document.getElementById("filter-text");
const filterTags = document.getElementById("filter-tags");

document.addEventListener("DOMContentLoaded", () => {

    applyFilters(); // Initial render

    filterText.addEventListener("input", applyFilters);
    filterTags.addEventListener("change", applyFilters);
});

function renderRecipes(recipesToRender) {
    const container = document.querySelector(".recipes-container");
    container.innerHTML = "";

    /*
    if (recipesToRender.length === 0) {
        container.innerHTML = "<p>No recipes found</p>";
        return;
    }
    */

    recipesToRender.forEach(recipe => {
        const a = document.createElement("a");
        a.href = `/recipe/${recipe.Id}`;
        a.className = "recipe-card";
        a.innerHTML = `
            <div class="container-img">
                <img src="${recipe.ImagePath}" alt="${recipe.Title}"/>
            </div>
            <div class="container-heading"><b>${recipe.Title}</b></div>
            <div class="container-description">${recipe.Description}</div>
        `;

        container.appendChild(a);

        // Double request to guarantee show of animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                a.classList.add("show");
            });
        });
    });
}

function applyFilters() {

    const textValue = filterText.value.toLowerCase().trim();

    const selectedTags = Array.from(
        filterTags.querySelectorAll("input:checked")
        ).map(cb => cb.value);

    const filtered = recipes.filter(recipe => {

        // Text filter

        // maybe can be deleted later
        if (recipe.Title == null) {
            recipe.Title = "";
        }
        
        const matchesText =
            recipe.Title.toLowerCase().includes(textValue);

        // Tag filter
        const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every(tagId => recipe.TagIds.includes(tagId));
        
        // add more filters here if needed

        return matchesText && matchesTags;
    });

    renderRecipes(filtered);
}

// Modal

const panel = document.getElementById("filter-panel");
const toggleBtn = document.getElementById("toggle-filter");

toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("open");
});