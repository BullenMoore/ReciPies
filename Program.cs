using Microsoft.Extensions.FileProviders;
using ReciPies.Services;
using ReciPies.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<RecipeService>();

// Activate the system functions
builder.Services.AddSingleton<SystemFunctions>();

var app = builder.Build();



// TODO: Call for some system functions here

using (var scope1 = app.Services.CreateScope())
{
    var systemFunctions = scope1.ServiceProvider.GetRequiredService<SystemFunctions>();
    systemFunctions.CleanupFiles();
}

// Generate the index when the app starts
using (var scope2 = app.Services.CreateScope())
{
    var recipeService = scope2.ServiceProvider.GetRequiredService<RecipeService>();
    recipeService.GenerateRecipeIndex();
    recipeService.GenerateTagFile();
}

// Expose the /Recipes folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "Recipes")),
    RequestPath = "/Recipes"
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();