import type {RecipeDirectory, RecipeFile} from "./DirectoryEntry";

import {parseRecipe} from "../parser/parseRecipe.ts";

// @ts-ignore
import { promises as fs } from "node:fs";
// @ts-ignore
import path from "node:path";


export class RecipeService {

    private readonly root = "recipes";

    async getDirectories (givenPath: string): Promise<RecipeDirectory[]> {

        const requestedPath = this.resolveAndValidatePath(givenPath);

        const files = await fs.readdir(requestedPath, {
            withFileTypes: true
        });

        const directories: RecipeDirectory[] = [];

        for (const file of files) {

            const path = `${requestedPath}/${file.name}`;

            // Directories
            if (file.isDirectory()) {

                const directory: RecipeDirectory = {
                    type: "directory",
                    name: file.name,
                    path: path
                }
                directories.push(directory);
            }
        }
        return directories;
    }

    async getRecipes(givenPath: string): Promise<RecipeFile[]> {

        const requestedPath = this.resolveAndValidatePath(givenPath);

        const files = await fs.readdir(requestedPath, {
            withFileTypes: true
        });

        const recipes: RecipeFile[] = [];

        for (const file of files) {

            const path = `${requestedPath}/${file.name}`;

            // .cook files
            if (file.isFile() && file.name.endsWith(".cook")) {

                const text = await fs.readFile(path, "utf-8");

                const recipe: RecipeFile = {
                    type: "recipe",
                    path: path,
                    recipe: parseRecipe(text, true)
                }
                recipes.push(recipe);
            }
        }
        return recipes;
    }

    async getRecipe(filePath: string): Promise<RecipeFile> {

        const requestedPath = this.resolveAndValidatePath(filePath);

        const text = await fs.readFile(requestedPath, "utf-8");

        return {
            type: "recipe",
            path: requestedPath,
            recipe: parseRecipe(text, false)
        }
    }

    //TODO: Do we have test that try edge cases for resolved paths?

    // Check if the request is within the /recipes folder
    private resolveAndValidatePath(searchedPath: string): string {

        const rootPath = path.resolve(this.root);
        const requestedPath = path.resolve(searchedPath);

        if (
            requestedPath !== rootPath &&
            !requestedPath.startsWith(rootPath + path.sep)
        ) {
            throw new Error("Cannot access files outside the recipes directory.");
        }
        return requestedPath;
    }
}
