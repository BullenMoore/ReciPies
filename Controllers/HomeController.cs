using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ReciPies.App_Data;
using ReciPies.Models;
using ReciPies.Services;

namespace ReciPies.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly RecipeService _recipes;

    public HomeController(ILogger<HomeController> logger, RecipeService recipes)
    {
        _logger = logger;
        _recipes = recipes;
    }

    public IActionResult Index()
    {
        var vm = new DTOs.HomeViewmodel
        {
            RecipeCards = _recipes.GetFrontPageRecipes(),
            Tags = _recipes.GetTags()
        };
        return View(vm);
    }
    
    [Route("recipe/{id}")]
    public IActionResult Recipe(string id)
    {
        // Load a recipe by ID into view mode
        var recipe = _recipes.GetById(id);
        return View(recipe);
    }

    [Route("edit/{id}")]
    public IActionResult Edit(string id)
    {
        // Load recipe by ID into edit mode
        
        var vm = new DTOs.EditRecipeDto
        {
            Recipe = _recipes.GetById(id),
            AllTags = _recipes.GetTags()
        };
        return View(vm);
    }

    public IActionResult New()
    {
        string id = _recipes.Create();
        
        return RedirectToAction("Edit", "Home", new { id = id });
    }

    public IActionResult Save(DTOs.EditRecipeDto model)
    {
        _recipes.Update(model.Recipe, model.SelectedTagNames);
        
        return RedirectToAction("Recipe", "Home", new { id = model.Recipe.Id });
    }

    public IActionResult Delete(string id)
    {
        _recipes.Delete(id);
        
        return RedirectToAction("Index", "Home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}