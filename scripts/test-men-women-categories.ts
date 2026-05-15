#!/usr/bin/env npx tsx

/**
 * Test script för att verifiera att endast Men och Women kategorier genereras
 */

import { generateCategoriesFromProducts, getAllCategoryNames } from '../lib/categoryGenerator'

console.log('🔍 Testar att endast Men och Women kategorier är tillgängliga\n')

// Test 1: Kontrollera alla tillgängliga kategorier
console.log('Test 1: Kontrollera alla tillgängliga kategorier')
const allCategories = getAllCategoryNames()
console.log(`Tillgängliga kategorier: ${allCategories.join(', ')}`)
console.log(`Antal kategorier: ${allCategories.length}`)
console.log(`✅ Förväntat: 2 kategorier (Men, Women), Faktiskt: ${allCategories.length}\n`)

// Test 2: Testa med exempel produktnamn
console.log('Test 2: Testa kategorigenerering med exempel produktnamn')
const testProducts = [
  'Herr T-shirt blå',
  'Dam klänning röd', 
  'Men jeans svarta',
  'Women blus vit',
  'Herrmode jacka',
  'Dammode kjol',
  'Sneakers vita', // Ska inte matcha någon kategori
  'Väska läder', // Ska inte matcha någon kategori
  'Smycke guld' // Ska inte matcha någon kategori
]

const generatedCategories = generateCategoriesFromProducts(testProducts)
console.log('Genererade kategorier:')
generatedCategories.forEach(cat => {
  console.log(`- ${cat.name}: ${cat.count} produkter`)
  console.log(`  Nyckelord: ${cat.keywords.join(', ')}`)
})

console.log(`\n✅ Antal genererade kategorier: ${generatedCategories.length}`)
console.log(`✅ Kategorier: ${generatedCategories.map(c => c.name).join(', ')}`)

// Test 3: Verifiera att inga andra kategorier finns
const expectedCategories = ['Men', 'Women']
const actualCategories = generatedCategories.map(c => c.name)
const hasOnlyExpectedCategories = actualCategories.every(cat => expectedCategories.includes(cat))

console.log(`\n✅ Endast förväntade kategorier: ${hasOnlyExpectedCategories}`)

if (hasOnlyExpectedCategories && actualCategories.length <= 2) {
  console.log('\n🎉 Test lyckades! Endast Men och Women kategorier är tillgängliga.')
} else {
  console.log('\n❌ Test misslyckades! Oväntade kategorier hittades.')
  process.exit(1)
}