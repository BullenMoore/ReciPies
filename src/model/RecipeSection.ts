import type {RecipeStep} from "./RecipeStep";

export interface RecipeSection {
    title?: string;
    steps: RecipeStep[];
}