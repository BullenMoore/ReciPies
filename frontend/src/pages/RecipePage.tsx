import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../utils/api";
import { normalizePath } from "../utils/paths";

function RecipePage() {
    const { "*": routePath = "" } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadRecipe() {
            try {
                setLoading(true);
                setError(null);

                const path = normalizePath(routePath);
                const data = await getRecipe(path);

                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadRecipe();
    }, [routePath]);

    if (loading) return <p>Loading recipe...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main>
            <h1>Recipe data</h1>
            <pre>{JSON.stringify(recipe, null, 2)}</pre>
        </main>
    );
}

export default RecipePage;