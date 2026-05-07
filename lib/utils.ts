/**
 * Utility functions for data processing
 */

import { Product } from './types'

/**
 * Formaterar pris för visning
 * @param price - Priset som nummer
 * @returns Formaterat pris som sträng
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US')}`;
}

/**
 * Kontrollerar om en produkt är i lager
 * @param product - Produktobjektet
 * @returns True om produkten är i lager
 */
export function isInStock(product: Product): boolean {
  return product.inStock;
}

/**
 * Kontrollerar om en sträng är en giltig URL
 * @param str - Strängen som ska kontrolleras
 * @returns True om strängen är en giltig URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Filtrerar bildlänkar och behåller endast .jpg-filer
 * Tar bort alla länkar som slutar med .png
 * @param imageUrls - Array av bildlänkar eller kommaseparerad sträng
 * @returns Array av filtrerade bildlänkar som endast innehåller .jpg-filer
 */
export function filterJpgImages(imageUrls: string[] | string): string[] {
  // Konvertera till array om det är en sträng
  const urlArray = Array.isArray(imageUrls) 
    ? imageUrls 
    : imageUrls.split(',').map(url => url.trim());

  // Filtrera bort .png-filer och behåll endast .jpg-filer
  return urlArray.filter(url => {
    if (!url || typeof url !== 'string') return false;
    
    const cleanUrl = url.trim();
    if (!cleanUrl) return false;
    
    // Kontrollera att URL:en slutar med .jpg (case-insensitive)
    return cleanUrl.toLowerCase().endsWith('.jpg');
  });
}

/**
 * Tar bort 'dropshipping', 'EPROLO' och '--- Övrigt' från text
 * @param text - Texten som ska rensas
 * @returns Rensat text utan dessa ord/mönster
 */
export function cleanText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/\bdropshipping\b/gi, '') // Ta bort 'dropshipping' (case-insensitive)
    .replace(/\bEPROLO\b/gi, '') // Ta bort 'EPROLO' (case-insensitive)
    .replace(/\s*-\s*-\s*Övrigt/gi, '') // Ta bort '- - Övrigt' med mellanslag
    .replace(/\s*-+\s*Övrigt/gi, '') // Ta bort '--- Övrigt', '- Övrigt' osv
    .replace(/\s+/g, ' ') // Ta bort extra mellanslag
    .trim(); // Ta bort ledande och avslutande mellanslag
}

/**
 * Mappar färgnamn till CSS hex-värden för visning av färgprover
 * @param colorName - Färgnamnet (t.ex. "Red", "Navy Blue")
 * @returns CSS hex-värde eller undefined om ingen matchning hittas
 */
export function colorNameToHex(colorName: string): string | undefined {
  const normalized = colorName.toLowerCase().trim()

  const colorMap: Record<string, string> = {
    'red': '#EF4444',
    'blue': '#3B82F6',
    'navy blue': '#1E3A5F',
    'navy': '#1E3A5F',
    'gray': '#9CA3AF',
    'grey': '#9CA3AF',
    'light gray': '#D1D5DB',
    'light grey': '#D1D5DB',
    'dark gray': '#4B5563',
    'dark grey': '#4B5563',
    'black': '#1F2937',
    'white': '#F9FAFB',
    'cheese white': '#FFF8DC',
    'pink': '#EC4899',
    'strawberry pink': '#FF6B81',
    'hot pink': '#FF69B4',
    'apricot': '#FBCEB1',
    'khaki': '#C3B091',
    'camel': '#C19A6B',
    'green': '#22C55E',
    'fluorescent green': '#39FF14',
    'dark green': '#166534',
    'purple': '#A855F7',
    'dark purple': '#581C87',
    'yellow': '#EAB308',
    'orange': '#F97316',
    'brown': '#92400E',
    'beige': '#F5F5DC',
    'blue gray': '#6B7B8D',
    'blue grey': '#6B7B8D',
    'autumn blue': '#4A6FA5',
    'burgundy': '#800020',
    'coral': '#FF7F50',
    'teal': '#14B8A6',
    'turquoise': '#06B6D4',
    'gold': '#D4A017',
    'silver': '#C0C0C0',
    'ivory': '#FFFFF0',
    'reversible': '#9CA3AF',
    'multi': '#9CA3AF',
    'assorted': '#9CA3AF',
  }

  // Direct match
  if (colorMap[normalized]) return colorMap[normalized]

  // Partial match - check if any key is contained in the color name
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  return undefined
}

/**
 * Exempel på användning av filterJpgImages funktionen
 */
export function exampleUsage() {
  // Exempel med kommaseparerad sträng (som i ditt exempel)
  const imageString = "https://shopifyfile.oss-accelerate.aliyuncs.com/attached/image/202405/52E72AE507C6E97DE7D56AABF7E188D4.png, https://example.com/image1.jpg, https://example.com/image2.png, https://example.com/image3.jpg";
  
  const filteredImages = filterJpgImages(imageString);
  console.log('Filtrerade bilder:', filteredImages);
  // Resultat: ['https://example.com/image1.jpg', 'https://example.com/image3.jpg']
  
  // Exempel med array
  const imageArray = [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.png',
    'https://example.com/photo3.JPG', // Fungerar även med stora bokstäver
    'https://example.com/photo4.gif'
  ];
  
  const filteredArray = filterJpgImages(imageArray);
  console.log('Filtrerade array:', filteredArray);
  // Resultat: ['https://example.com/photo1.jpg', 'https://example.com/photo3.JPG']
}