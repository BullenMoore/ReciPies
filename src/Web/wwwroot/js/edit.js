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
    const tagModal = document.getElementById("tag-modal");
    const tagModalOpenButton = document.getElementById("open-tag-modal");
    const tagModalDoneButton = document.getElementById("done-tags");
    const tagModalAddButton = document.getElementById("add-new-tag");
    const modalTagList = document.getElementById("modal-tag-list");
    const tagContainer = document.getElementById("tags");
    const newTagField = document.getElementById("new-tag-input");
    const form = document.querySelector("form");

    tagModalOpenButton.addEventListener("click", function () {
        tagModal.style.display = "block";
    })
    tagModalDoneButton.addEventListener("click", function () {
        tagModal.style.display = "none";
        rebuildTagsFromModal();
    })
    tagModalAddButton.addEventListener("click", function () {
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
    
    // Images
    const imageModal = document.getElementById("image-modal");
    const imageModalOpenButton = document.getElementById("open-images-modal");
    const imageModalDoneButton = document.getElementById("done-images");

    imageModalOpenButton.addEventListener("click", function () {
        imageModal.style.display = "block";
    })
    imageModalDoneButton.addEventListener("click", function () {
        imageModal.style.display = "none";
        
        // And more
        
        
    })

    const imageList = document.getElementById("modal-image-list");
    const fileInput = document.querySelector('input[type="file"][name="NewImages"]');

    /* -------------------- */
    /* DELETE IMAGE         */
    /* -------------------- */
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-image")) return;

        const imageEl = e.target.closest(".image");
        if (imageEl) {
            const imageClientId = imageEl.getAttribute("data-client-id");
            const clientIdEl = document.querySelector(
                `input[name="NewImageClientIds"][value="${imageClientId}"]`);
            
            imageEl.remove();
            if (clientIdEl) {
                clientIdEl.remove();
            }
            updateMainIndexes();
        }
    });

    /* -------------------- */
    /* SELECT MAIN IMAGE    */
    /* -------------------- */
    document.addEventListener("change", (e) => {
        if (e.target.name !== "MainImageIndex") return;

        const selectedIndex = parseInt(e.target.value);

        document.querySelectorAll("#modal-image-list .image")
            .forEach((imgEl, index) => {

                const isMainInput = imgEl.querySelector('input[name$=".IsMain"]');

                if (isMainInput) {
                    isMainInput.value = (index == selectedIndex);
                }
            });
    });

    /* -------------------- */
    /* IMAGE UPLOAD PREVIEW */
    /* -------------------- */
    if (fileInput) {
        fileInput.addEventListener("change", () => {

            Array.from(fileInput.files).forEach(file => {
                if (!file.type.startsWith("image/")) return;

                const clientId = crypto.randomUUID();

                const reader = new FileReader();
                reader.onload = (e) => {
                    addImagePreview(e.target.result, clientId);
                };
                reader.readAsDataURL(file);

                const hidden = document.createElement("input");
                hidden.type = "hidden";
                hidden.name = "NewImageClientIds";
                hidden.value = clientId;

                form.appendChild(hidden);
            });

            // Reset input so same file can be selected again if needed
            //fileInput.value = ""; Maybe not
        });
    }

    /* -------------------- */
    /* ADD IMAGE PREVIEW    */
    /* -------------------- */
    function addImagePreview(src, clientId) {
        
        const index = imageList.querySelectorAll(".image").length;

        const html = `
            <div class="image" data-client-id="${clientId}">
                <img src="${src}" alt="">

                <button type="button" class="delete-image">✖</button>

                <input type="radio" 
                       name="MainImageIndex" 
                       value="${index}">

                <input type="hidden" name="Images[${index}].Id" value="">
                <input type="hidden" name="Images[${index}].Path" value="${src}">
                <input type="hidden" name="Images[${index}].IsMain" value="false">
                <input type="hidden" name="Images[${index}].ClientId" value="${clientId}">
            </div>
        `;

        imageList.insertAdjacentHTML("beforeend", html);
        updateMainIndexes();
    }

    /* -------------------- */
    /* FIX INDEXES AFTER    */
    /* DELETE               */
    /* -------------------- */
    function updateMainIndexes() {

        document.querySelectorAll("#modal-image-list .image")
            .forEach((imgEl, index) => {

                const radio = imgEl.querySelector('input[type="radio"]');
                if (radio) radio.value = index;

                const idInput = imgEl.querySelector('input[name$=".Id"]');
                const pathInput = imgEl.querySelector('input[name$=".Path"]');
                const isMainInput = imgEl.querySelector('input[name$=".IsMain"]');
                const clientIdInput = imgEl.querySelector('input[name$=".ClientId"]');

                if (idInput) idInput.name = `Images[${index}].Id`;
                if (pathInput) pathInput.name = `Images[${index}].Path`;
                if (isMainInput) isMainInput.name = `Images[${index}].IsMain`;
                if (clientIdInput) clientIdInput.name = `Images[${index}].ClientId`;
            });
        
    }

});