# Dynamic Category Generation - Quick Guide

## What is it?

A system that automatically creates categories in the category menu based on product names, without needing a separate category column in the database.

## How does it work?

1. **Product names are analyzed**: The system reads product names from the database
2. **Keywords are matched**: Product names are matched against predefined keywords
3. **Categories are generated**: Categories are created automatically based on matches
4. **Menu is updated**: The category menu in the header displays the generated categories

## Example

**Product name:** "Stand Collar Jacket Women Autumn Loose Couple Casual Baseball Coat"

**Generated categories:**
- ✅ Clothes (contains "jacket", "coat")
- ✅ Women (contains "women")

## Usage

### For developers

#### Test category generation
```bash
npx tsx scripts/test-category-generation.ts
```

#### Fetch categories via API
```bash
curl http://localhost:3000/api/categories
```

#### Filter products by category
```bash
curl http://localhost:3000/api/categories/filter?category=Clothes
```

### For users

1. Open the website
2. Click on "Categories" in the header
3. Select a category from the menu
4. Products are filtered automatically

## Available categories

The system generates the following categories automatically:

- 👕 **Clothes** - Shirts, pants, jackets, skirts, etc.
- 👞 **Shoes** - Sneakers, boots, sandals, etc.
- 👜 **Accessories** - Bags, belts, hats, etc.
- 💍 **Jewelry** - Necklaces, bracelets, earrings, rings
- 💻 **Electronics** - Phones, computers, headphones, etc.
- 🏠 **Home & Decor** - Pillows, blankets, lamps, etc.
- ⚽ **Sports & Fitness** - Workout clothes, sports equipment
- 💄 **Beauty** - Makeup, perfume, skincare
- 👶 **Kids** - Children's clothes, toys
- 👔 **Men** - Men's clothing and fashion
- 👗 **Women** - Women's clothing and fashion

## Customize categories

### Add new keywords

Edit `lib/categoryGenerator.ts`:

```typescript
const categoryKeywords: Record<string, string[]> = {
  'Clothes': [
    'tröja', 'byxa', 'jacka', 
    'your-new-keyword' // Add here
  ],
  // ...
}
```

### Create new category

```typescript
const categoryKeywords: Record<string, string[]> = {
  // Existing categories...
  'Your New Category': [
    'keyword1',
    'keyword2',
    'keyword3',
    'keyword4'
  ]
}
```

## Files included

```
lib/
  └── categoryGenerator.ts          # Main logic for category generation

app/api/
  └── categories/
      ├── route.ts                  # API to fetch categories
      └── filter/
          └── route.ts              # API to filter products

components/
  ├── Header.tsx                    # Displays category menu
  └── ProductGrid.tsx               # Filters products

scripts/
  └── test-category-generation.ts   # Test script

docs/
  └── DYNAMIC_CATEGORY_GENERATION.md # Detailed documentation
```

## FAQ

### How often are categories updated?

Categories are cached for 1 hour. After that, they are automatically regenerated from product data.

### Can a product belong to multiple categories?

Yes! A product can match multiple categories. For example, "Women's Running Shoes" can belong to "Shoes", "Women" and "Sports & Fitness".

### What happens if a product doesn't match any category?

The product will still be displayed when the user selects "All" (all products), but it won't appear in any specific category.

### Can I use both Swedish and English keywords?

Yes! The system supports both Swedish and English keywords in the same category.

## Support

For more detailed information, see [DYNAMIC_CATEGORY_GENERATION.md](docs/DYNAMIC_CATEGORY_GENERATION.md)

## License

This system is part of the e-commerce platform and follows the same license as the main project.
