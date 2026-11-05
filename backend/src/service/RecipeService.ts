import type { RecipeDirectory, RecipeFile } from "./DirectoryEntry";

import {parseRecipe} from "../parser/parseRecipe.ts";

// @ts-ignore
import { promises as fs } from "node:fs";
// @ts-ignore
import path from "node:path";


export class RecipeService {

    private readonly root = "recipes";

    async getDirectories (givenPath: string): Promise<RecipeDirectory[]> {

        const { requestedPath, relativePath } = this.resolveAndValidatePath(givenPath);

        const files = await fs.readdir(requestedPath, {
            withFileTypes: true
        });

        const directories: RecipeDirectory[] = [];

        for (const file of files) {

            const dirRequestedPath = `${requestedPath}/${file.name}`;
            const dirRelativePath = `${relativePath}/${file.name}`;

            // Directories
            if (file.isDirectory()) {

                const directory: RecipeDirectory = {
                    type: "directory",
                    name: file.name,
                    path: dirRelativePath
                }
                directories.push(directory);
            }
        }
        return directories;
    }

    async getRecipes(givenPath: string): Promise<RecipeFile[]> {

        const { requestedPath, relativePath } = this.resolveAndValidatePath(givenPath);

        const files = await fs.readdir(requestedPath, {
            withFileTypes: true
        });

        const recipes: RecipeFile[] = [];

        for (const file of files) {

            const fileRequestedPath = `${requestedPath}/${file.name}`;
            const fileRelativePath = `${relativePath}/${file.name}`;

            // .cook files
            if (file.isFile() && file.name.endsWith(".cook")) {

                const text = await fs.readFile(fileRequestedPath, "utf-8");

                const recipe: RecipeFile = {
                    type: "recipe",
                    path: fileRelativePath,
                    recipe: parseRecipe(text, true)
                }
                recipes.push(recipe);
            }
        }
        return recipes;
    }

    async getRecipe(filePath: string): Promise<RecipeFile> {

        const { requestedPath, relativePath } = this.resolveAndValidatePath(filePath);

        const text = await fs.readFile(requestedPath, "utf-8");

        return {
            type: "recipe",
            path: relativePath,
            recipe: parseRecipe(text, false)
        }
    }

    //TODO: Do we have test that try edge cases for resolved paths?

    // Check if the request is within the /recipes folder and returns a relative path
    private resolveAndValidatePath(relativePath: string = ""): {
        requestedPath: string;
        relativePath: string;
    } {
        const rootPath = path.resolve(this.root);
        const requestedPath = path.resolve(rootPath, relativePath);

        if (
            requestedPath !== rootPath &&
            !requestedPath.startsWith(rootPath + path.sep)
        ) {
            throw new Error(
                `Cannot access files outside the recipes directory: ${requestedPath}`
            );
        }

        return {
            requestedPath,
            relativePath: path.relative(rootPath, requestedPath).split(path.sep).join("/")
        };
    }
}
