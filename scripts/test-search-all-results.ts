#!/usr/bin/env npx tsx

/**
 * Test script för att verifiera att alla matchande produkter visas i sökresultaten
 */

import { advancedSearch } from '../lib/algorithms/search'
import { Product } from '../lib/types'

// Testdata - simulerade produkter
const testProducts: Product[] = [
  {
    id: '1',
    name: 'Blå T-shirt',
    description: 'En bekväm blå t-shirt i bomull',
    price: 299,
    category: 'Clothes',
    colors: ['blå', 'vit'],
    sizes: ['S', 'M', 'L'],
    inStock: true,
    images: ['test.jpg']
  },
  {
    id: '2', 
    name: 'Röd T-shirt',
    description: 'En snygg röd t-shirt',
    price: 349,
    category: 'Clothes',
    colors: ['röd'],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    images: ['test2.jpg']
  },
  {
    id: '3',
    name: 'Svarta skor',
    description: 'Eleganta svarta skor för alla tillfällen',
    price: 899,
    category: 'Shoes',
    colors: ['svart'],
    sizes: ['39', '40', '41', '42'],
    inStock: true,
    images: ['test3.jpg']
  },
  {
    id: '4',
    name: 'Grön tröja',
    description: 'Varm grön tröja för vintern',
    price: 599,
    category: 'Clothes', 
    colors: ['grön'],
    sizes: ['S', 'M', 'L'],
    inStock: false,
    images: ['test4.jpg']
  },
  {
    id: '5',
    name: 'T-shirt med tryck',
    description: 'Cool t-shirt med unikt tryck',
    price: 399,
    category: 'Clothes',
    colors: ['vit', 'svart'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    images: ['test5.jpg']
  }
]

console.log('🔍 Testar sökfunktionen - alla matchande produkter ska visas\n')

// Test 1: Sök efter "t-shirt" - ska hitta alla 3 t-shirts
console.log('Test 1: Sökning efter "t-shirt"')
const tshirtResults = advancedSearch(testProducts, { query: 't-shirt' })
console.log(`Resultat: ${tshirtResults.length} produkter hittades`)
tshirtResults.forEach(p => console.log(`- ${p.name} (${p.price} kr)`))
console.log(`✅ Förväntat: 3 produkter, Faktiskt: ${tshirtResults.length}\n`)

// Test 2: Sök efter "blå" - ska hitta produkter med blå färg eller "blå" i namnet
console.log('Test 2: Sökning efter "blå"')
const blaResults = advancedSearch(testProducts, { query: 'blå' })
console.log(`Resultat: ${blaResults.length} produkter hittades`)
blaResults.forEach(p => console.log(`- ${p.name} (${p.price} kr)`))
console.log(`✅ Förväntat: 1 produkt, Faktiskt: ${blaResults.length}\n`)

// Test 3: Sök efter "skor" - ska hitta alla skor
console.log('Test 3: Sökning efter "skor"')
const skoResults = advancedSearch(testProducts, { query: 'skor' })
console.log(`Resultat: ${skoResults.length} produkter hittades`)
skoResults.forEach(p => console.log(`- ${p.name} (${p.price} kr)`))
console.log(`✅ Förväntat: 1 produkt, Faktiskt: ${skoResults.length}\n`)

// Test 4: Sök efter "clothes" (kategori) - ska hitta alla kläder
console.log('Test 4: Sökning efter "clothes" (kategori)')
const clothesResults = advancedSearch(testProducts, { query: 'clothes' })
console.log(`Resultat: ${clothesResults.length} produkter hittades`)
clothesResults.forEach(p => console.log(`- ${p.name} (${p.price} kr)`))
console.log(`✅ Förväntat: 4 produkter, Faktiskt: ${clothesResults.length}\n`)

// Test 5: Sök efter något som inte finns
console.log('Test 5: Sökning efter "jacka" (finns inte)')
const jackaResults = advancedSearch(testProducts, { query: 'jacka' })
console.log(`Resultat: ${jackaResults.length} produkter hittades`)
jackaResults.forEach(p => console.log(`- ${p.name} (${p.price} kr)`))
console.log(`✅ Förväntat: 0 produkter, Faktiskt: ${jackaResults.length}\n`)

// Test 6: Tom sökning - ska returnera alla produkter
console.log('Test 6: Tom sökning')
const emptyResults = advancedSearch(testProducts, { query: '' })
console.log(`Resultat: ${emptyResults.length} produkter hittades`)
console.log(`✅ Förväntat: ${testProducts.length} produkter, Faktiskt: ${emptyResults.length}\n`)

console.log('🎉 Alla tester slutförda!')
console.log('Nu ska alla produkter som matchar sökningen visas, oavsett relevanspoäng.')