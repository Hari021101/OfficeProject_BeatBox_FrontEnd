const fs = require('fs');

// We need to extract the PRODUCTS array from products.js without executing imports.
// A safe way is to parse the file text or execute it after mocking imports.
const content = fs.readFileSync('C:\\Users\\Mhari\\Desktop\\Office Project\\BeatBox\\src\\data\\products.js', 'utf8');

// Quick and dirty parser: extract everything between 'export const CATEGORIES = [' and ']'
// and 'export const PRODUCTS = [' and the end of file.
// Or just regex replace the imports.
let scriptContent = content.replace(/import .*? from .*?\n/g, '');
scriptContent = scriptContent.replace(/export const IMAGE_MAP = \{[\s\S]*?\}/, 'const IMAGE_MAP = {}');
scriptContent = scriptContent.replace(/export const CATEGORIES/g, 'const CATEGORIES');
scriptContent = scriptContent.replace(/export const PRODUCTS/g, 'const PRODUCTS');

scriptContent += `
const fs = require('fs');
let csCode = \`using Domain.Entities;
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
\`;

const categoriesSet = new Set(PRODUCTS.map(p => p.category));

csCode += \`            var existingCategories = await context.Categories.ToDictionaryAsync(c => c.Name.ToLower(), c => c);\\n\`;

for(const catName of categoriesSet) {
    const titleCase = catName.charAt(0).toUpperCase() + catName.slice(1);
    csCode += \`
            if (!existingCategories.ContainsKey("\${catName.toLowerCase()}"))
            {
                var newCat = new Category { Id = Guid.NewGuid(), Name = "\${titleCase}", Description = "\${titleCase} category" };
                context.Categories.Add(newCat);
                existingCategories["\${catName.toLowerCase()}"] = newCat;
            }
\`;
}

csCode += \`            await context.SaveChangesAsync();\\n\\n\`;

csCode += \`            var existingProducts = await context.Products.Select(p => p.Name).ToListAsync();\\n\`;
csCode += \`            var productsToAdd = new List<Product>();\\n\`;

for(const p of PRODUCTS) {
    csCode += \`
            if (!existingProducts.Contains("\${p.name}"))
            {
                productsToAdd.Add(new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "\${p.name}",
                    Description = "\${(p.description || '').replace(/"/g, '\\"')}",
                    Price = \${p.oldPrice || p.price + 1000}m,
                    DiscountPrice = \${p.price}m,
                    StockQuantity = 100,
                    ImageUrl = "\${p.imageKey}.png",
                    CategoryId = existingCategories["\${p.category.toLowerCase()}"].Id,
                    Brand = "\${p.brand || 'BeatBox'}",
                    Rating = \${p.rating || 4.5},
                    BatteryLife = "\${p.specs && p.specs.Battery ? p.specs.Battery : 'N/A'}",
                    Color = "\${p.colors && p.colors[0] ? p.colors[0].name : 'Black'}",
                    Connectivity = "\${p.specs && p.specs.Bluetooth ? p.specs.Bluetooth : 'N/A'}",
                    IsFeatured = true,
                    SoldCount = \${Math.floor(Math.random() * 500)},
                    DeliveryDays = 3
                });
            }
\`;
}

csCode += \`
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
\`;

fs.writeFileSync('C:\\\\Users\\\\Mhari\\\\source\\\\repos\\\\OfficeProject_BeatBox_BackEnd\\\\Infrastructure\\\\Data\\\\MockProductsSeeder.cs', csCode);
console.log('Seeder generated!');
`;

fs.writeFileSync('C:\\Users\\Mhari\\Desktop\\Office Project\\BeatBox\\generate_seeder.js', scriptContent);
