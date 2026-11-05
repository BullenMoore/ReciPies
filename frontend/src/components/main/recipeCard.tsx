import { Link } from "react-router";

import type { RecipeEntry } from "../../api/recipeApi";
import {routeHelper} from "../../helpers.tsx";

interface Props {
    recipe: RecipeEntry;
}

export function RecipeCard({ recipe }: Props) {
    return (
        <Link
            to={`/recipe/${recipe.path}`}
            className="card recipe-card"
        >
            <span className="card-icon">📖</span>
            <span>{recipe.name}</span>
        </Link>
    );
}