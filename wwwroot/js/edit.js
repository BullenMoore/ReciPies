// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("ingredients-container");
    const addButton = document.getElementById("add-ingredient");

    let ingredientIndex = parseInt(container.dataset.initialCount);

    // Add ingredient
    addButton.addEventListener("click", function () {
        addIngredient(container);
    });

    // Remove ingredient (event delegation)
    container.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-ingredient")) {
            removeIngredient(e.target);
        }
    });

    function addIngredient(container) {
        const html = `
            <div class="ingredient">
                <input name="Recipe.Ingredients[${ingredientIndex}].Amount" type="number" step="any" />
                <input name="Recipe.Ingredients[${ingredientIndex}].Unit" />
                <input name="Recipe.Ingredients[${ingredientIndex}].Name" required/>
                <button type="button" class="remove-ingredient">✖</button>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
        ingredientIndex++;
    }

    function removeIngredient(e) {
        e.closest(".ingredient").remove();
        const ingredients = document.querySelectorAll(".ingredient");

        ingredients.forEach((row, index) => {
            row.querySelectorAll("input").forEach(input => {
                input.name = input.name.replace(/\[\d+]/, `[${index}]`);
            });
        });
    }
    
    function addTag() {

    }
    function removeTag() {

    }
});