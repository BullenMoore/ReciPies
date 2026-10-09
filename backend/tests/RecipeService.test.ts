import { describe, expect, it } from "vitest";
import {RecipeService} from "../src/service/RecipeService";

describe("RecipeService - correct path usage", () => {
    const recipeService = new RecipeService();

    it("getDirectoryContent", async () => {

        //TODO: Add test for directory content and recipes content

    })

    it("getFileContent", async () => {

        const result = await recipeService.getRecipe("Fika/Banana bread.cook");

        expect(result).toMatchObject({
            type: "recipe",
        });
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