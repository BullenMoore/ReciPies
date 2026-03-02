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
        Guid id = _service.Create();
        
        return RedirectToAction("Edit", "Home", new { id = id });
    }

    public IActionResult Save(EditRecipeDto model)
    {

        
        var newImageCount = model.NewImages.Count;
        
        
        /*
        // New strat
        
        // Remove all Images that have Guid == null
        
        int index = 0;
        while (index < model.Images.Count)
        {
            if (model.Images[index].Id == null)
                model.Images.RemoveAt(index);
            else
                index++;
        }
        
        // Add all NewImages to the model
        
        foreach (var file in model.NewImages)
        {
            if (file.Length == 0)
                continue;
            
            using var ms = new MemoryStream();
            file.CopyTo(ms);

            var savedPath = _service.SaveNewImageToStorage(file.FileName, ms.ToArray());

            model.Images.Add(new ImageEditItem
            {
                Id = null,
                Path = savedPath,
                IsMain = false // Is set later to correct value later
            });
        }
        
        // Set that main image with MainImageIndex

        if (model.MainImageIndex != null)
        {
            model.Images.ElementAt(model.MainImageIndex.Value).IsMain = true;
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
        
        _service.Update(model.Recipe, model.SelectedTagNames, uploads);
       
        
        */
        // Ends here
        /*
        // Store all new images in the storage directory first
        foreach (var file in model.NewImages)
        {
            if (file.Length == 0)
                continue;
            
            using var ms = new MemoryStream();
            file.CopyTo(ms);

            var savedPath = _service.SaveNewImageToStorage(file.FileName, ms.ToArray());
            
            var imagePlaceholder = model.Images.FirstOrDefault(img => img.Id == null);

            model.Images.Add(new ImageEditItem
            {
                Id = null,
                Path = savedPath,
                IsMain = imagePlaceholder?.IsMain ?? false
            });
        }

        // Remove loop here
        int index = 0;
        while (index < model.Images.Count)
        {
            if (model.Images[index].Id == null)
                model.Images.RemoveAt(index);
            else
                index++;
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
        */
        
        for (int i = 0; i < model.NewImages.Count; i++)
        {
            var file = model.NewImages[i];
            var clientId = model.NewImageClientIds[i];

            var imageModel = model.Images
                .First(x => x.ClientId == clientId);

            using var ms = new MemoryStream();
            file.CopyTo(ms);

            var savedPath = _service.SaveNewImageToStorage(file.FileName, ms.ToArray());

            imageModel.Path = savedPath;
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