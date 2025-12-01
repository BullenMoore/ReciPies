using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ReciPies.Models;
using ReciPies.Models.ViewModels;
using ReciPies.Services;
using ReciPies.Utilities;

namespace ReciPies.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly RecipeService _recipes;
    private readonly SystemFunctions _systemFunctions;

    public HomeController(ILogger<HomeController> logger, RecipeService recipes,  SystemFunctions systemFunctions)
    {
        _logger = logger;
        _recipes = recipes;
        _systemFunctions = systemFunctions;
    }

    public IActionResult Index()
    {
        // Loads the index.json file
        var allRecipes = _recipes.LoadIndex();
        var allTags = _recipes.LoadTags();

        var viewModel = new IndexViewModel
        {
            Recipes = allRecipes,
            Tags = allTags
        };
        return View(viewModel);
    }
    
    [Route("recipe/{id}")]
    public IActionResult Recipe(string id)
    {
        // Load a recipe by ID
        var recipe = _recipes.LoadRecipeById(id);
        return View(recipe);
    }

    [Route("edit/{id}")]
    public IActionResult Edit(string id)
    {
        // Load recipe by ID into edit mode
        var recipe = _recipes.LoadRecipeById(id);
        return View(recipe);
    }

    public IActionResult New()
    {
        string id = _systemFunctions.GenerateRandomRecipeNumber();
        
        Recipe recipe = new Recipe { Id = id };
        _recipes.NewRecipe(recipe);
        
        return RedirectToAction("Edit", "Home", new { id = id });
    }

    public IActionResult Save(RecipeContent recipe)
    {
        _recipes.SaveRecipe(recipe);
        return RedirectToAction("Recipe", "Home", new { id = recipe.Id });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}