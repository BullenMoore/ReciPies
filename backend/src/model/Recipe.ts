import type {RecipeSection} from "./RecipeSection";

export class Recipe {
    // Metadata
    title?: string;
    alternatives?: string[];
    description?: string;
    category?: string;
    difficulty?: string;
    image?: string;
    servings?: number;
    cuisine?: string;
    diet?: string;
    time: RecipeTime;
    source: RecipeSource;
    tags?: string[];
    // Section(s)
    sections?: RecipeSection[];

    constructor() {
        this.alternatives = [];
        this.time = {};
        this.source = {};
        this.tags = [];
        this.sections = [];
    }
}

export interface RecipeTime {
    prep?: string;
    cook?: string;
    required?: string;
}

export interface RecipeSource {
    url?: string;
    name?: string;
    author?: string;
}
