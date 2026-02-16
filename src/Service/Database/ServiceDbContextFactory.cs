using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Service.Database;

public class ServiceDbContextFactory : IDesignTimeDbContextFactory<ServiceDbContext>
{
    public ServiceDbContext CreateDbContext(string[] args)
    {
        var solutionRoot = Path.GetFullPath(
            Path.Combine(Directory.GetCurrentDirectory(), "..")
        );

        var dbDirectory = Path.Combine(solutionRoot, "Service", "Database");
        Directory.CreateDirectory(dbDirectory);

        var dbPath = Path.Combine(dbDirectory, "recipes.db");

        var optionsBuilder = new DbContextOptionsBuilder<ServiceDbContext>();
        optionsBuilder.UseSqlite($"Data Source={dbPath}");

        Console.WriteLine($"[EF CLI] SQLite DB Path: {dbPath}");

        return new ServiceDbContext(optionsBuilder.Options);
    }
}