import fs from 'fs';

const content = fs.readFileSync('src/data/products.js', 'utf8');

// We want to extract objects from export const PRODUCTS = [...]
const productsMatch = content.match(/export const PRODUCTS = \[\s*([\s\S]*?)\n\]/);
if (!productsMatch) {
    console.error("Could not find PRODUCTS");
    process.exit(1);
}

const productsText = productsMatch[1];
const products = [];

// Split by objects. Each product starts with "  {" and ends with "  }," or "  }"
const productBlocks = productsText.split(/\n\s*},\n\s*{|\n\s* {2}{\n|\n\s* {2}{ /).filter(b => b.trim().length > 0);

for (let block of productBlocks) {
    // console.log("BLOCK", block.substring(0, 50));
    let nameMatch = block.match(/name:\s*'([^']+)'/);
    let priceMatch = block.match(/price:\s*(\d+)/);
    let catMatch = block.match(/category:\s*'([^']+)'/);
    let descMatch = block.match(/description:\s*'([^']+)'/);
    let imgMatch = block.match(/imageKey:\s*'([^']+)'/);

    if (nameMatch && nameMatch[1] && catMatch) {
        // Skip color names that might get caught if the regex matched inside colors
        // Luckily, our regex matches the FIRST occurrence.
        products.push({
            name: nameMatch[1],
            price: priceMatch ? priceMatch[1] : '1999',
            category: catMatch[1],
            desc: descMatch ? descMatch[1] : nameMatch[1],
            imageKey: imgMatch ? imgMatch[1] : 'hero_headphones'
        });
    }
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
            var existingCategories = await context.Categories.ToDictionaryAsync(c => c.Name.ToLower(), c => c);
`;

const categoriesSet = new Set(products.map(p => p.category).filter(Boolean));

for (const catName of categoriesSet) {
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
    let priceNum = parseInt(p.price || 1999);
    let safeDesc = p.desc.replace(/"/g, '\\"');
    csCode += `
            if (!existingProducts.Contains("${p.name}"))
            {
                productsToAdd.Add(new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "${p.name}",
                    Description = "${safeDesc}",
                    Price = ${priceNum + 1000}m,
                    DiscountPrice = ${priceNum}m,
                    StockQuantity = 100,
                    ImageUrl = "${p.imageKey}",
                    CategoryId = existingCategories["${p.category.toLowerCase()}"].Id,
                    Brand = "BeatBox",
                    Rating = 4.5,
                    BatteryLife = "N/A",
                    Color = "Black",
                    Connectivity = "N/A",
                    IsFeatured = true,
                    SoldCount = 150,
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
console.log('Seeder generated successfully with ' + products.length + ' products!');
