const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// Parse products.js using the sandbox method
const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"][^'"]+['"]/g;
let mockDeclarations = '';
let match;
while ((match = importRegex.exec(content)) !== null) {
  mockDeclarations += `const ${match[1]} = "${match[1]}";\n`;
}
const codeWithoutImports = content.replace(/import\s+[a-zA-Z0-9_,\s{}*]+\s+from\s+['"][^'"]+['"]/g, '');
const cleanedCode = codeWithoutImports.replace(/\bexport\s+/g, '');
const sandboxCode = `
${mockDeclarations}
${cleanedCode}
module.exports = { PRODUCTS };
`;

const tempFilePath = path.join(__dirname, 'temp_products_seeder.cjs');
fs.writeFileSync(tempFilePath, sandboxCode, 'utf8');
const { PRODUCTS } = require(tempFilePath);
fs.unlinkSync(tempFilePath);

console.log(`Loaded ${PRODUCTS.length} products for generating seeder.`);

const escapeCSharp = (str) => {
  return (str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
};

const mapCategoryName = (cat) => {
  if (!cat) return 'Uncategorized';
  const c = cat.toLowerCase().trim();
  if (c === 'tws') return 'TWS Earbuds';
  if (c === 'headphones') return 'Wireless Headphones';
  if (c === 'neckbands') return 'Wireless Neckbands';
  if (c === 'speakers') return 'Bluetooth Speakers';
  if (c === 'smartwatches' || c === 'smart-watch') return 'Smart Watches';
  if (c === 'soundbars') return 'Soundbars';
  if (c === 'gaming') return 'Gaming Headsets';
  if (c === 'cables') return 'Cables & Connectors';
  if (c === 'chargers') return 'Chargers';
  if (c === 'power bank') return 'Power Banks';
  if (c === 'trimmer') return 'Grooming Trimmers';
  
  return c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Build unique categories set
const uniqueCategories = Array.from(new Set(PRODUCTS.map(p => p.category).filter(Boolean))).map(mapCategoryName);
const uniqueCategoriesSet = Array.from(new Set(uniqueCategories));

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
            var categoriesAdded = false;
`;

// Seed Categories
for (const catName of uniqueCategoriesSet) {
    const key = catName.toLowerCase();
    csCode += `
            if (!existingCategories.ContainsKey("${key}"))
            {
                var newCat = new Category { Id = Guid.NewGuid(), Name = "${catName}", Description = "${catName} Category" };
                context.Categories.Add(newCat);
                existingCategories["${key}"] = newCat;
                categoriesAdded = true;
            }
`;
}

csCode += `
            if (categoriesAdded)
            {
                await context.SaveChangesAsync();
            }

            var existingProducts = await context.Products.Select(p => p.Name.ToLower()).ToListAsync();
            var existingProductNames = new HashSet<string>(existingProducts);
            var productsToAdd = new List<Product>();
`;

// Seed Products
for (const p of PRODUCTS) {
    if (!p.name) continue;
    const catName = mapCategoryName(p.category);
    const key = catName.toLowerCase();
    
    const description = p.description || p.usp || 'BeatBox Signature Audio Device';
    const price = p.oldPrice || p.price + 1000;
    const discountPrice = p.price;
    const rating = p.rating || 4.5;
    const batteryLife = p.specs?.Battery || p.specs?.['Battery Life'] || 'N/A';
    const color = p.colors?.[0]?.name || 'Black';
    const connectivity = p.specs?.Connectivity || (p.specs?.Bluetooth ? 'Wireless' : 'Wired');
    const isFeatured = p.isFeatured !== false;
    const soldCount = p.reviewCount * 5 || 120;
    
    // Product Images
    const imageList = [];
    if (p.colors && p.colors.length > 0) {
        p.colors.forEach((col, idx) => {
            const colorImg = col.image || col.imageUrl || p.imageKey || 'hero_headphones';
            imageList.push(`new ProductImage { ImageUrl = "${escapeCSharp(colorImg)}.png", ColorName = "${escapeCSharp(col.name)}", ColorCode = "${escapeCSharp(col.code)}", IsPrimary = ${idx === 0 ? 'true' : 'false'} }`);
        });
    } else {
        imageList.push(`new ProductImage { ImageUrl = "${escapeCSharp(p.imageKey || 'hero_headphones')}.png", ColorName = "${escapeCSharp(color)}", ColorCode = "#111111", IsPrimary = true }`);
    }

    // Product FAQs
    const faqList = [];
    if (p.faqs && p.faqs.length > 0) {
        p.faqs.forEach((faq) => {
            faqList.push(`new ProductFaq { Question = "${escapeCSharp(faq.q)}", Answer = "${escapeCSharp(faq.a)}" }`);
        });
    }

    csCode += `
            if (!existingProductNames.Contains("${escapeCSharp(p.name.toLowerCase())}"))
            {
                productsToAdd.Add(new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "${escapeCSharp(p.name)}",
                    Description = "${escapeCSharp(description)}",
                    Price = ${price}m,
                    DiscountPrice = ${discountPrice}m,
                    StockQuantity = 100,
                    ImageUrl = "${escapeCSharp(p.imageKey || 'hero_headphones')}.png",
                    CategoryId = existingCategories["${key}"].Id,
                    Brand = "BeatBox",
                    Rating = ${rating},
                    BatteryLife = "${escapeCSharp(batteryLife)}",
                    Color = "${escapeCSharp(color)}",
                    Connectivity = "${escapeCSharp(connectivity)}",
                    IsFeatured = ${isFeatured},
                    SoldCount = ${soldCount},
                    DeliveryDays = 3,
                    Images = new List<ProductImage>
                    {
                        ${imageList.join(',\n                        ')}
                    },
                    Faqs = new List<ProductFaq>
                    {
                        ${faqList.join(',\n                        ')}
                    }
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
                    var inv = new Inventory 
                    { 
                        Id = Guid.NewGuid(), 
                        ProductId = p.Id, 
                        AvailableStock = 100, 
                        ReservedStock = 0, 
                        WarehouseLocation = "Main", 
                        LastUpdated = DateTime.UtcNow 
                    };
                    context.Inventories.Add(inv);
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
`;

fs.writeFileSync('C:\\Users\\Mhari\\source\\repos\\OfficeProject_BeatBox_BackEnd\\Infrastructure\\Data\\MockProductsSeeder.cs', csCode);
console.log('Seeder generated successfully at C:\\Users\\Mhari\\source\\repos\\OfficeProject_BeatBox_BackEnd\\Infrastructure\\Data\\MockProductsSeeder.cs!');
