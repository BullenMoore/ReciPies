using System.Diagnostics;
using Contracts;
using Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;
using Security;
using Web.Models;
using Web.ViewModels;

namespace Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly RecipeSecurity _security;

    public HomeController(ILogger<HomeController> logger, RecipeSecurity security)
    {
        _logger = logger;
        _security = security;
    }

    public IActionResult Index()
    {
        var response = _security.GetIndexContent();
        return View(response.Content);
    }
    
    [Route("recipe/{id}")]
    public IActionResult Recipe(Guid id)
    {
        // Load a recipe by ID into view mode
        var response = _security.GetRecipeViewById(id);

        if (response.Status == Status.NotFound)
        {
            return NotFound();
        }
        return View(response);
    }

    [Route("edit/{id}")]
    public IActionResult Edit(Guid id)
    {
        var response = _security.GetRecipeEditById(id);
        // Load recipe by ID into edit mode

        if (response.Status == Status.NotFound)
        {
            return NotFound();
        }
        if (response.Status == Status.Forbidden)
        {
            return Forbid();
        }
        
        var images = new List<ImageEditItem>();

        foreach (var image in recipe.Images)
        {
            images.Add(new ImageEditItem
            {
                Id = image.Id,
                Path = image.Path,
                IsMain = image.IsMain,
            });
        }
        
        var vm = new EditRecipeDto
        {
            Recipe = recipe,
            AllTags = _service.GetTags(),
            Images = images
        };
        return View(vm);
    }

    public IActionResult New()
    {
        var response = _security.CreateRecipe();
        
        if (response.Status == Status.Forbidden)
        {
            return Forbid();
        }
        
        return RedirectToAction("Edit", "Home", new { id = response.Id });
    }

    public IActionResult Save(EditRecipeDto model)
    {
        
        var imagesToSave = new List<SaveImageItem>();
        for (int i = 0; i < model.NewImages.Count; i++)
        {
            var file = model.NewImages[i];
            var clientId = model.NewImageClientIds[i];

            var imageModel = model.Images
                .First(x => x.ClientId == clientId);

            using var ms = new MemoryStream();
            file.CopyTo(ms);

            /*
            var savedPath = _service.SaveNewImageToStorage(file.FileName, ms.ToArray());

            imageModel.Path = savedPath;
            */
            
            imagesToSave.Add(new SaveImageItem
            {
                FileName = file.FileName,
                FileContent = ms.ToArray(),
            });
        }
        
        var uploads = new List<ImageUpload>();

        foreach (var image in model.Images)
        {
            uploads.Add(new ImageUpload
                { 
                    RelationId = image.Id,
                    Path = image.Path,
                    IsMain = image.IsMain,
                }
            );
        }
        
        _service.Update(model.Recipe, model.SelectedTagNames, uploads); // Response object?
        
        
        
        
        
        var response = _security.UpdateRecipe();
        
        if (response == Status.Forbidden)
        {
            return Forbid();
        }
        
        return RedirectToAction("Recipe", "Home", new { id = model.Recipe.Id });
    }

    public IActionResult Delete(Guid id)
    {
        var status = _security.DeleteRecipe(id); // Check if the user have permission to delete, loginCreds instead of id?
        
        if (status == Status.Forbidden)
        {
            return Forbid();
        }
        
        return RedirectToAction("Index", "Home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}