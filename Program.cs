using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ReciPies.App_Data;
using ReciPies.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<RecipeDbContext>(options =>
{
    options.UseSqlite("Data Source=App_Data/recipes.db");
});

builder.Services.AddScoped<RecipeService>();

var app = builder.Build();

app.UseStaticFiles();

// TODO: Create a backup function that runs everytime the service is started and saves to Backup folder

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

// Fun fact: The name ReciPies doesn't come from my comedian of a brain, but rather from that I can't spell "Recipes"