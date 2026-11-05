import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getRecipe } from "../api/recipeApi";

export function RecipePage() {
    const params = useParams();
    const path = params["*"] ?? "";

    const [recipe, setRecipe] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRecipe(path)
            .then(setRecipe)
            .catch((error: Error) => setError(error.message));
    }, [path]);

    if (error) return <p>Error: {error}</p>;
    if (recipe === null) return <p>Loading recipe...</p>;

    return (
        <main>
            <Link to="/">← Back to recipes</Link>
            <h1>{path.split("/").pop()}</h1>
            <pre>{JSON.stringify(recipe, null, 2)}</pre>
        </main>
    );
}