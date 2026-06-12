import re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    content = f.read()

products_str = content.split('export const PRODUCTS = [')[1].rsplit(']', 1)[0]
products = []

current = {}
for line in products_str.split('\n'):
    line = line.strip()
    if '{' in line and 'id:' in line:
        current = {}
    if 'name:' in line:
        m = re.search(r"name:\s*'([^']+)'", line)
        if m: current['name'] = m.group(1)
    if 'description:' in line:
        m = re.search(r"description:\s*'([^']+)'", line)
        if m: current['desc'] = m.group(1)
    if 'price:' in line:
        m = re.search(r"price:\s*(\d+)", line)
        if m: current['price'] = m.group(1)
    if 'category:' in line:
        m = re.search(r"category:\s*'([^']+)'", line)
        if m: current['category'] = m.group(1)
    if '},' in line and current.get('name'):
        products.append(current)
        current = {}

cs_code = """using Domain.Entities;
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
"""

categories = set([p.get('category') for p in products if p.get('category')])
for cat in categories:
    cs_code += f"""
            if (!existingCategories.ContainsKey("{cat.lower()}"))
            {{
                var newCat = new Category {{ Id = Guid.NewGuid(), Name = "{cat.title()}", Description = "{cat.title()} category" }};
                context.Categories.Add(newCat);
                existingCategories["{cat.lower()}"] = newCat;
            }}
"""

cs_code += "            await context.SaveChangesAsync();\n\n"
cs_code += "            var existingProducts = await context.Products.Select(p => p.Name).ToListAsync();\n"
cs_code += "            var productsToAdd = new List<Product>();\n"

for p in products:
    name = p.get('name')
    desc = p.get('desc', name).replace('"', '\\"')
    price = p.get('price', '1999')
    cat = p.get('category', '').lower()
    cs_code += f"""
            if (!existingProducts.Contains("{name}"))
            {{
                productsToAdd.Add(new Product
                {{
                    Id = Guid.NewGuid(),
                    Name = "{name}",
                    Description = "{desc}",
                    Price = {int(price) + 1000}m,
                    DiscountPrice = {price}m,
                    StockQuantity = 100,
                    ImageUrl = "hero_headphones.png",
                    CategoryId = existingCategories["{cat}"].Id,
                    Brand = "BeatBox",
                    Rating = 4.5,
                    BatteryLife = "N/A",
                    Color = "Black",
                    Connectivity = "N/A",
                    IsFeatured = true,
                    SoldCount = new Random().Next(10, 500),
                    DeliveryDays = 3
                }});
            }}
"""

cs_code += """
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
"""

with open('C:\\Users\\Mhari\\source\\repos\\OfficeProject_BeatBox_BackEnd\\Infrastructure\\Data\\MockProductsSeeder.cs', 'w', encoding='utf-8') as f:
    f.write(cs_code)

print("Generated!")
