# Kategori-uppdatering: Endast Men och Women

## Ändring
Kategorimenyn har uppdaterats för att endast visa "Men" och "Women" kategorier. Alla andra kategorier (Clothes, Shoes, Accessories, Jewelry, Electronics, Home & Decor, Sports & Fitness, Beauty, Kids) har tagits bort.

## Uppdaterade filer

### 1. `lib/categoryGenerator.ts`
- Begränsade `categoryKeywords` till endast Men och Women
- Behöll alla nyckelord för korrekt produktmatchning

### 2. `components/ProductGrid.tsx` 
- Uppdaterade `categoryKeywords` för filtrering
- Endast Men och Women kategorier stöds nu

### 3. API-endpoints
- `app/api/categories/route.ts` använder automatiskt den uppdaterade kategorigeneratorn
- Returnerar nu endast Men och Women kategorier

## Resultat
- ✅ Kategorimenyn visar endast "Men" och "Women"
- ✅ Produktfiltrering fungerar korrekt för båda kategorierna  
- ✅ API:et returnerar endast de tillgängliga kategorierna
- ✅ Bakåtkompatibilitet bibehållen för befintliga produkter

## Nyckelord som används
- **Men**: herr, män, man, men, mens, herrmode, herrkläder
- **Women**: dam, kvinna, kvinnor, women, womens, dammode, damkläder, ladies