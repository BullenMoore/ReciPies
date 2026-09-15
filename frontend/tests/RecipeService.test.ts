import { describe, expect, it } from "vitest";
import {RecipeService} from "../src/service/RecipeService";

describe("RecipeService", () => {
    it("getDirectoryContent", async () => {

        const recipeService = new RecipeService();

        const result = await recipeService.getDirectoryContent("recipes/Fika");

        expect(result).toEqual(

        )
    })

    it("getFileContent", async () => {

        const recipeService = new RecipeService();

        const result = await recipeService.getRecipe("recipes/Fika/Banana bread.cook");

        expect(result).toEqual(

        )
    })
})