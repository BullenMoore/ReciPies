import { describe, expect, it } from "vitest";
import { RecipeService } from "../src/service/RecipeService";

describe("RecipeService - correct path usage", () => {
    const recipeService = new RecipeService();

    it("Get content in a directory", async () => {

        // The API calls for directories and recipes (only metadata) separately
        const directories = await recipeService.getDirectories("Folder2");
        const recipes = await recipeService.getRecipes("Folder2");

        expect(directories).toContainEqual(
            expect.objectContaining({
                type: "directory"
            })
        );

        expect(recipes).toContainEqual(
            expect.objectContaining({
                type: "recipe"
            })
        );
    })

    it("Get recipe content", async () => {

        const recipe = await recipeService.getRecipe("Folder2/Banana bread.cook");

        expect(recipe).toMatchObject({
            type: "recipe",
        });
    })

    it("Get directory content from root", async () => {

        // "" is the root folder, "./" also works
        const directories = await recipeService.getDirectories("");
        const recipes = await recipeService.getRecipes("");

        expect(directories).toEqual([
            {
                name: "Folder1",
                path: "/home/tim/GitHub/ReciPies/backend/recipes/Folder1",
                type: "directory",
            },
            {
                name: "Folder2",
                path: "/home/tim/GitHub/ReciPies/backend/recipes/Folder2",
                type: "directory",
            },
            {
                name: "Folder3",
                path: "/home/tim/GitHub/ReciPies/backend/recipes/Folder3",
                type: "directory",
            },
        ]);
        // There is no recipes in the root folder
        expect(recipes).toEqual([]);
    })
})

describe("RecipeService - incorrect path usage / error handling", () => {
    const recipeService = new RecipeService();

    it("throw error when trying to access file outside of root directory", async () => {

        await expect(
            recipeService.getRecipe("../.env")
        ).rejects.toThrow(
            /Cannot access files outside the recipes directory:/
        );
    });
})