import { describe, expect, it } from "vitest";
import {RecipeService} from "../src/service/RecipeService";

describe("RecipeService - correct path usage", () => {
    const recipeService = new RecipeService();

    it("getDirectoryContent", async () => {

        const result = await recipeService.getDirectoryContent("recipes/Fika");

        expect(result).toContainEqual(
            expect.objectContaining({
                type: "recipe"
            })
        );

        expect(result).toContainEqual(
            expect.objectContaining({
                type: "directory"
            })
        );
    })

    it("getFileContent", async () => {

        const result = await recipeService.getRecipe("recipes/Fika/Banana bread.cook");

        expect(result).toMatchObject({
            type: "recipe",
        });
    })
})

describe("RecipeService - incorrect path usage / error handling", () => {
    const recipeService = new RecipeService();

    it("throw error when trying to access file outside of root directory", async () => {

        await expect(
            recipeService.getRecipe("recipes/../.env")
        ).rejects.toThrow(
            "Cannot access files outside the recipes directory."
        );
    });
})