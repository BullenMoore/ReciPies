import { useNavigate } from "react-router-dom";
import { encodePath } from "../utils/paths";

function RecipeCard({ item }) {
    const navigate = useNavigate();
    const recipe = item.recipe;

    function handleClick() {
        navigate(`/recipe/${encodePath(item.path)}`);
    }

    return (
        <div className="recipe-card" onClick={handleClick}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p>Servings: {recipe.servings}</p>
            <p>Prep time: {recipe.prep_time}</p>
            <p>Cook time: {recipe.cook_time}</p>
        </div>
    );
}

export default RecipeCard;