/**
 * Genererar kategorier dynamiskt baserat på produktnamn
 * Analyserar produktnamn och extraherar relevanta kategorier
 */

export interface GeneratedCategory {
  name: string;
  count: number;
  keywords: string[];
}

/**
 * Keywords used to identify categories in product names
 */
const categoryKeywords: Record<string, string[]> = {
  'Men': ['herr', 'män', 'man', 'men', 'mens', 'herrmode', 'herrkläder'],
  'Women': ['dam', 'kvinna', 'kvinnor', 'women', 'womens', 'dammode', 'damkläder', 'ladies'],
  'Sweater': ['sweater', 'tröja', 'pullover', 'hoodie', 'sweatshirt'],
  'Jacket': ['jacket', 'jacka', 'coat', 'rock', 'blazer', 'cardigan'],
  'Dress': ['dress', 'klänning', 'gown', 'maxi'],
  'T-shirt': ['t-shirt', 'tshirt', 't shirt', 'skjorta', 'tee'],
  'Trousers': ['trousers', 'pants', 'byxa', 'jeans', 'leggings', 'shorts'],
  'Belt': ['belt', 'bälte', 'waist belt'],
  'Shoes': ['shoes', 'skor', 'sneakers', 'boots', 'sandals', 'heels', 'loafers'],
};

/**
 * Analyserar ett produktnamn och returnerar matchande kategorier
 */
function analyzeProductName(productName: string): string[] {
  const nameLower = productName.toLowerCase();
  const matchedCategories: string[] = [];

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        matchedCategories.push(category);
        break; // Lägg bara till kategorin en gång
      }
    }
  }

  return matchedCategories;
}

/**
 * Genererar kategorier från en lista av produktnamn
 */
export function generateCategoriesFromProducts(productNames: string[]): GeneratedCategory[] {
  const categoryMap = new Map<string, { count: number; keywords: Set<string> }>();

  // Analysera alla produktnamn
  for (const productName of productNames) {
    const categories = analyzeProductName(productName);
    
    for (const category of categories) {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, keywords: new Set() });
      }
      
      const data = categoryMap.get(category)!;
      data.count++;
      
      // Spara nyckelord som matchade
      const nameLower = productName.toLowerCase();
      for (const keyword of categoryKeywords[category]) {
        if (nameLower.includes(keyword)) {
          data.keywords.add(keyword);
        }
      }
    }
  }

  // Konvertera till array och sortera efter antal produkter
  const categories: GeneratedCategory[] = Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      keywords: Array.from(data.keywords),
    }))
    .sort((a, b) => b.count - a.count);

  return categories;
}

/**
 * Legacy translation function - now returns English names only
 * Categories are always in English in the system
 */
export function translateCategory(categoryName: string, language: 'sv' | 'en'): string {
  // All categories are now in English, no translation needed
  return categoryName;
}

/**
 * Legacy translation function - now returns categories as-is (already in English)
 */
export function translateCategories(categories: string[], language: 'sv' | 'en'): string[] {
  return categories;
}

/**
 * Maps URL or UI category string to canonical generated category key (e.g. "women" → "Women").
 */
export function resolveGeneratedCategoryName(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const hit = Object.keys(categoryKeywords).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase()
  )
  return hit ?? null
}

/**
 * Filtrerar produkter baserat på en genererad kategori
 */
export function filterProductsByCategory(
  products: Array<{ id: string; name: string }>,
  categoryName: string
): Array<{ id: string; name: string }> {
  if (!categoryKeywords[categoryName]) {
    return [];
  }

  const keywords = categoryKeywords[categoryName];
  
  return products.filter(product => {
    const nameLower = product.name.toLowerCase();
    return keywords.some(keyword => nameLower.includes(keyword));
  });
}

/**
 * Hämtar alla tillgängliga kategorier (för referens)
 */
export function getAllCategoryNames(): string[] {
  return Object.keys(categoryKeywords);
}
