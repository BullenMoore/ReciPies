export interface IngredientElement {
    type: "ingredient";
    name: string;
    lowerAmount?: number;
    upperAmount?: number;
    unit?: string;
}

export interface EquipmentElement {
    type: "equipment";
    name: string;
}

export interface TimeElement {
    type: "time";
    minSeconds: number;
    maxSeconds: number;
}

export interface DegreeElement {
    type: "degree";
    degrees: number;
    unit: string;
}


export interface TextElement {
    type: "text";
    value: string;
}

export type RecipeElements =
    | IngredientElement
    | EquipmentElement
    | TimeElement
    | DegreeElement
    | TextElement








