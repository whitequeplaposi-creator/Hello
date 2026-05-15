// Test script för att verifiera dubbletthantering av produkter
import { Product } from '@/lib/types'
import { 
  removeDuplicateProducts, 
  removeDuplicateProductsAdvanced, 
  removeDuplicateProductsKeepLatest,
  validateAndDeduplicateProducts 
} from '@/lib/productUtils'

// Skapa testdata med dubbletter
const testProducts: Product[] = [
  {
    id: '1',
    name: 'Test T-shirt',
    description: 'En basic t-shirt',
    price: 199,
    category: 'clothing',
    inStock: true,
    image: 'test1.jpg',
    colors: ['red', 'blue'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: '1', // Samma ID - dubblett
    name: 'Test T-shirt',
    description: 'En basic t-shirt med mer information',
    price: 199,
    category: 'clothing',
    inStock: true,
    image: 'test1.jpg',
    images: ['test1.jpg', 'test1-2.jpg'], // Mer bilder
    colors: ['red', 'blue', 'green'], // Fler färger
    sizes: ['S', 'M', 'L', 'XL'] // Fler storlekar
  },
  {
    id: '2',
    name: 'Jeans',
    description: 'Blå jeans',
    price: 599,
    category: 'trousers',
    inStock: true,
    image: 'jeans.jpg'
  },
  {
    id: '3',
    name: 'Hoodie',
    description: 'Varm hoodie',
    price: 399,
    category: 'sweater',
    inStock: false,
    image: 'hoodie.jpg'
  },
  {
    id: '2', // Samma ID som jeans - dubblett
    name: 'Jeans',
    description: 'Blå jeans',
    price: 599,
    category: 'trousers',
    inStock: true,
    image: 'jeans.jpg'
  },
  {
    id: '4',
    name: '', // Ofullständig produkt
    description: '',
    price: 0,
    category: '',
    inStock: true
  }
]

async function testDuplicateRemoval() {
  console.log('🧪 Testar dubbletthantering av produkter\n')
  
  console.log(`📊 Ursprungliga produkter: ${testProducts.length}`)
  console.log('Produkter:', testProducts.map(p => `${p.id}: ${p.name}`).join(', '))
  
  // Test 1: Basic dubblettborttagning
  console.log('\n1️⃣ Test: Basic dubblettborttagning (baserat på ID)')
  const basicDeduped = removeDuplicateProducts(testProducts)
  console.log(`Resultat: ${basicDeduped.length} unika produkter`)
  console.log('Produkter:', basicDeduped.map(p => `${p.id}: ${p.name}`).join(', '))
  
  // Test 2: Avancerad dubblettborttagning
  console.log('\n2️⃣ Test: Avancerad dubblettborttagning (ID + namn + pris)')
  const advancedDeduped = removeDuplicateProductsAdvanced(testProducts)
  console.log(`Resultat: ${advancedDeduped.length} unika produkter`)
  console.log('Produkter:', advancedDeduped.map(p => `${p.id}: ${p.name}`).join(', '))
  
  // Test 3: Behåll senaste version
  console.log('\n3️⃣ Test: Behåll senaste/mest kompletta version')
  const latestDeduped = removeDuplicateProductsKeepLatest(testProducts)
  console.log(`Resultat: ${latestDeduped.length} unika produkter`)
  latestDeduped.forEach(p => {
    console.log(`${p.id}: ${p.name} - Färger: ${p.colors?.length || 0}, Storlekar: ${p.sizes?.length || 0}, Bilder: ${p.images?.length || 0}`)
  })
  
  // Test 4: Validering och dubblettborttagning
  console.log('\n4️⃣ Test: Validering + dubblettborttagning')
  const validatedDeduped = validateAndDeduplicateProducts(testProducts)
  console.log(`Resultat: ${validatedDeduped.length} giltiga och unika produkter`)
  console.log('Produkter:', validatedDeduped.map(p => `${p.id}: ${p.name}`).join(', '))
  
  // Kontrollera att ofullständiga produkter filtreras bort
  const hasInvalidProduct = validatedDeduped.some(p => !p.name || !p.description || p.price <= 0)
  console.log(`Ofullständiga produkter borttagna: ${!hasInvalidProduct ? '✅' : '❌'}`)
  
  console.log('\n🎉 Alla tester slutförda!')
  
  // Visa exempel på hur funktionen används i praktiken
  console.log('\n📝 Exempel på användning:')
  console.log('```typescript')
  console.log('import { validateAndDeduplicateProducts } from "@/lib/productUtils"')
  console.log('')
  console.log('// I ProductGrid-komponenten:')
  console.log('const deduplicatedProducts = validateAndDeduplicateProducts(initialProducts)')
  console.log('')
  console.log('// I db.ts:')
  console.log('return validateAndDeduplicateProducts(mappedProducts)')
  console.log('```')
}

// Kör testet
testDuplicateRemoval().catch(console.error)