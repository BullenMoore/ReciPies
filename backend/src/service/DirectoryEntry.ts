import {Recipe} from "../model/Recipe";

export interface RecipeDirectory {
    type: "directory";
    name: string;
    path: string;
}

export interface RecipeFile {
    type: "recipe";
    path: string;
    recipe: Recipe;
}
