using System.Diagnostics;
using Contracts.DTOs;
using Contracts.Requests;
using Microsoft.AspNetCore.Mvc;
using Service;
using Web.Models;
using Web.ViewModels;

namespace Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly RecipeService _service;

    public HomeController(ILogger<HomeController> logger, RecipeService service)
    {
        _logger = logger;
        _service = service;
    }

    public IActionResult Index()
    {
        var vm = new HomePageRequest
        {
            RecipeCards = _service.GetFrontPageRecipes(),
            Tags = _service.GetTags()
        };
        return View(vm);
    }
    
    [Route("recipe/{id}")]
    public IActionResult Recipe(Guid id)
    {
        // Load a recipe by ID into view mode
        var recipe = _service.GetRecipeById(id);

        if (recipe == null)
        {
            return NotFound();
        }
        return View(new RecipeViewRequest { Recipe = recipe });
    }

    [Route("edit/{id}")]
    public IActionResult Edit(Guid id)
    {
        // Load recipe by ID into edit mode
        var recipe = _service.GetRecipeById(id);

        if (recipe == null)
        {
            return NotFound();
        }
        var vm = new EditRecipeDto
        {
            Recipe = recipe,
            AllTags = _service.GetTags()
        };
        return View(vm);
    }

    public IActionResult New()
    {
        Guid id = _service.Create();
        
        return RedirectToAction("Edit", "Home", new { id = id });
    }

    public IActionResult Save(EditRecipeDto model)
    {
        
        var uploads = new List<ImageUpload>();

        foreach (var file in model.Images)
        {
            if (file.Length == 0)
                continue;

            using var ms = new MemoryStream();
            file.CopyToAsync(ms);

            uploads.Add(new ImageUpload
            {
                FileName = file.FileName,
                IsMain = false,
                Content = ms.ToArray()
            });
        }
        
        _service.Update(model.Recipe, model.SelectedTagNames, uploads);
        
        return RedirectToAction("Recipe", "Home", new { id = model.Recipe.Id });
    }

    public IActionResult Delete(Guid id)
    {
        _service.Delete(id);
        
        return RedirectToAction("Index", "Home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}