import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
    getDirectories,
    getRecipes,
} from "../api/recipeApi";

import type {
    DirectoryEntry,
    RecipeEntry,
} from "../api/recipeApi";

import { DirectoryCard } from "../components/main/directoryCard";
import { RecipeCard } from "../components/main/recipeCard";

export function BrowsePage() {
    const params = useParams();
    const path = params["*"] ?? "";

    const [directories, setDirectories] = useState<DirectoryEntry[]>([]);
    const [recipes, setRecipes] = useState<RecipeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDirectory() {
            setLoading(true);
            setError(null);

            try {
                const [directoryData, recipeData] = await Promise.all([
                    getDirectories(path),
                    getRecipes(path),
                ]);

                setDirectories(directoryData);
                setRecipes(recipeData);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        }

        loadDirectory();
    }, [path]);

    if (loading) {
        return <p>Loading recipes...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main>
            <header>
                <h1>ReciPies</h1>
                <p>Browse your recipes</p>
                <Link to="/">Home</Link>
            </header>

            <h2>{path || "All recipes"}</h2>

            <section>
                <h3>Directories</h3>

                <div className="card-grid">
                    {directories.map((directory) => (
                        <DirectoryCard
                            key={directory.path}
                            directory={directory}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h3>Recipes</h3>

                <div className="card-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.path}
                            recipe={recipe}
                        />
                    ))}
                </div>
            </section>

            {directories.length === 0 && recipes.length === 0 && (
                <p>This directory is empty.</p>
            )}
        </main>
    );
}