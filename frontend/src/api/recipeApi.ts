// src/api/recipeApi.ts

export interface DirectoryEntry {
    name: string;
    path: string;
}

export interface RecipeEntry {
    name: string;
    path: string;
}

const API_URL = "/api";

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json() as Promise<T>;
}

export function getDirectories(path = ""): Promise<DirectoryEntry[]> {
    return fetchJson(
        `${API_URL}/directories?path=${encodeURIComponent(path)}`
    );
}

export function getRecipes(path = ""): Promise<RecipeEntry[]> {
    return fetchJson(
        `${API_URL}/recipes?path=${encodeURIComponent(path)}`
    );
}

export async function getRecipe(path: string): Promise<unknown> {
    return fetchJson(
        `${API_URL}/recipe?path=${encodeURIComponent(path)}`
    );
}
