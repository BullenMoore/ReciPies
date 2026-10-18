import express, { type Express, type Request, type Response } from 'express';
import {RecipeService} from "./service/RecipeService.ts";

const recipeService = new RecipeService();
const app: Express = express();

app.get('/api/directories', async (req: Request, res: Response) => {

  const folder = req.query.path as string;

  const result = await recipeService.getDirectories(folder);

  res.json(result);
});

app.get('/api/recipes', async (req: Request, res: Response) => {

  const folder = req.query.path as string;

  const result = await recipeService.getRecipes(folder);

  res.json(result);
});

app.get('/api/recipe', async (req: Request, res: Response) => {

  const folder = req.query.path as string;

  const result = await recipeService.getRecipe(folder);

  res.json(result);
});

app.listen(3000);
