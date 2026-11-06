import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getDirectories, getRecipes } from "../utils/api";

import DirectoryCard from "../components/DirectoryCard";
import RecipeCard from "../components/RecipeCard";

import { normalizePath } from "../utils/paths";

export default function BrowsingPage() {
    const { "*": routePath = "" } = useParams();

    // Convert the URL path into the backend path.
    // /browse/Folder2 becomes /Folder2.
    const path = normalizePath(routePath);

    const [directories, setDirectories] = useState([]);
    const [recipes, setRecipes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContents() {
            setLoading(true);
            setError(null);

            try {
                // Both APIs receive exactly the same path.
                const [directoryData, recipeData] = await Promise.all([
                    getDirectories(path),
                    getRecipes(path)
                ]);

                setDirectories(directoryData);
                setRecipes(recipeData);

            } catch (err) {
                setError(err.message);

            } finally {
                setLoading(false);
            }
        }

        fetchContents();
    }, [path]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className="browsing-page">

            <h1>
                {routePath || "Recipes"}
            </h1>

            <div className="card-grid">

                {/* Display directories */}
                {directories.map((directory) => (
                    <DirectoryCard
                        key={directory.path}
                        directory={directory}
                    />
                ))}

                {/* Display recipes */}
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.path}
                        item={recipe}
                    />
                ))}

            </div>

            {/* Empty directory message */}
            {directories.length === 0 && recipes.length === 0 && (
                <p>This directory is empty.</p>
            )}

        </main>
    );
}