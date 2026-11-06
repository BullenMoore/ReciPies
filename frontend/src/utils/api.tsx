const API_URL = "/api"

export async function getDirectories(path = "") {
    const response = await fetch(
        `${API_URL}/directories?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) throw new Error("Failed to fetch directories");

    return response.json();
}

export async function getRecipes(path = "") {
    const response = await fetch(
        `${API_URL}/recipes?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) throw new Error("Failed to fetch recipes");

    return response.json();
}

export async function getRecipe(path: string) {
    const response = await fetch(
        `${API_URL}/recipe?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) throw new Error("Failed to fetch recipe");

    return response.json();
}
