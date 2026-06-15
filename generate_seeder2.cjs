const fs = require('fs');

const content = fs.readFileSync('./src/data/products.js', 'utf8');

// Extract the PRODUCTS array using a simple regex since we know the structure
const match = content.match(/export const PRODUCTS = (\[[\s\S]*?^\])/m);
if (!match) {
    console.error("Could not find PRODUCTS array");
    process.exit(1);
}

let productsText = match[1];

// Use a regex to find all { ... } blocks
let products = [];
const productRegex = /\{[^{}]*name:\s*'([^']+)'[^{}]*category:\s*'([^']+)'[^{}]*price:\s*(\d+)[^{}]*\}/g;
let m;
while ((m = productRegex.exec(productsText)) !== null) {
    products.push({
        name: m[1],
        category: m[2],
        price: m[3],
        description: "Mock description"
    });
}

let csCode = `using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public static class MockProductsSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            var categoriesList = new List<Category>();
            var existingCategories = await context.Categories.ToDictionaryAsync(c => c.Name.ToLower(), c => c);
`;

const categoriesSet = new Set(products.map(p => p.category));

for (const catName of categoriesSet) {
    if(!catName) continue;
    const titleCase = catName.charAt(0).toUpperCase() + catName.slice(1);
    csCode += `
            if (!existingCategories.ContainsKey("${catName.toLowerCase()}"))
            {
                var newCat = new Category { Id = Guid.NewGuid(), Name = "${titleCase}", Description = "${titleCase} category" };
                context.Categories.Add(newCat);
                existingCategories["${catName.toLowerCase()}"] = newCat;
            }
`;
}

csCode += `            await context.SaveChangesAsync();\n\n`;

csCode += `            var existingProducts = await context.Products.Select(p => p.Name).ToListAsync();\n`;
csCode += `            var productsToAdd = new List<Product>();\n`;

for (const p of products) {
    if(!p.name || !p.category) continue;
    csCode += `
            if (!existingProducts.Contains("${p.name}"))
            {
                productsToAdd.Add(new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "${p.name}",
                    Description = "${(p.description || '').replace(/"/g, '\\"')}",
                    Price = ${parseInt(p.price || 0) + 1000}m,
                    DiscountPrice = ${parseInt(p.price || 0)}m,
                    StockQuantity = 100,
                    ImageUrl = "hero_headphones.png",
                    CategoryId = existingCategories["${p.category.toLowerCase()}"].Id,
                    Brand = "BeatBox",
                    Rating = 4.5,
                    BatteryLife = "N/A",
                    Color = "Black",
                    Connectivity = "N/A",
                    IsFeatured = true,
                    SoldCount = ${Math.floor(Math.random() * 500)},
                    DeliveryDays = 3
                });
            }
`;
}

csCode += `
            if (productsToAdd.Any())
            {
                await context.Products.AddRangeAsync(productsToAdd);
                await context.SaveChangesAsync();
                
                // Add Inventory for them
                foreach(var p in productsToAdd) {
                    var inv = new Inventory { Id = Guid.NewGuid(), ProductId = p.Id, AvailableStock = 100, ReservedStock = 0, WarehouseLocation = "Main", LastUpdated = DateTime.UtcNow };
                    context.Inventories.Add(inv);
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
`;

fs.writeFileSync('C:\\Users\\Mhari\\source\\repos\\OfficeProject_BeatBox_BackEnd\\Infrastructure\\Data\\MockProductsSeeder.cs', csCode);
console.log('Seeder generated successfully!');
