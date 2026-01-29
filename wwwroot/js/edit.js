// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {

    // Ingredients
    const ingredientContainer = document.getElementById("ingredients");
    const ingredientAddButton = document.getElementById("add-ingredient");
    

    let ingredientIndex = ingredientContainer.querySelectorAll(".ingredient").length;

    // Add ingredient
    ingredientAddButton.addEventListener("click", function () {
        addIngredient(ingredientContainer);
    });

    // Remove ingredient (event delegation)
    ingredientContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-ingredient")) {
            removeIngredient(e.target);
        }
    });
    
    function addIngredient(ingredientContainer) {
        const html = `
            <div class="ingredient">
                <input name="Recipe.Ingredients[${ingredientIndex}].Amount" type="number" step="any" />
                <input name="Recipe.Ingredients[${ingredientIndex}].Unit" />
                <input name="Recipe.Ingredients[${ingredientIndex}].Name"/>
                <button type="button" class="remove-ingredient">✖</button>
            </div>
        `;
        ingredientContainer.insertAdjacentHTML("beforeend", html);
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

    // Tags
    const modal = document.getElementById("tag-modal");
    const modalOpenButton = document.getElementById("open-tag-modal");
    const modalDoneButton = document.getElementById("done-tags");
    const modalAddButton = document.getElementById("add-new-tag");
    const modalTagList = document.getElementById("modal-tag-list");
    const tagContainer = document.getElementById("tags");
    const newTagField = document.getElementById("new-tag-input");

    modalOpenButton.addEventListener("click", function () {
        modal.style.display = "block";
    })
    modalDoneButton.addEventListener("click", function () {
        modal.style.display = "none";
        rebuildTagsFromModal();
    })
    modalAddButton.addEventListener("click", function () {
        const newTagName = newTagField.value.trim();
        if (!newTagName) return;

        // Prevent duplicates (case-insensitive)
        const exists = Array.from(
            modalTagList.querySelectorAll("input[data-tag-name]")
        ).some(cb => cb.dataset.tagName.toLowerCase() === newTagName.toLowerCase());

        if (exists) {
            alert("Tag already exists");
            return;
        }

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "tag-checkbox";
        checkbox.dataset.tagName = newTagName;
        checkbox.checked = true; // auto-select new tag

        label.appendChild(checkbox);
        label.append(" " + newTagName);

        modalTagList.appendChild(label);

        newTagField.value = "";
    });

    function rebuildTagsFromModal() {

        // Clear all existing tags
        tagContainer.innerHTML = "";

        // Collect checked tags
        const checkedTags = document.querySelectorAll(
            "#modal-tag-list input:checked"
        );

        // Render them
        checkedTags.forEach(cb => {
            const tagName = cb.dataset.tagName;
            addTag(tagName);
        });
    }
    function addTag(name) {
        const html = `
        <span class="tag">
            ${name}
            <input type="hidden" name="SelectedTagNames" value="${name}" />
        </span>
    `;
        tagContainer.insertAdjacentHTML("beforeend", html);
    }

});