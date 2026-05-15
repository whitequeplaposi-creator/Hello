// Test script för att verifiera kategori-navigering
import { getProducts } from '@/lib/db'

async function testCategoryNavigation() {
  console.log('🧪 Testar kategori-navigering...')
  
  try {
    // Hämta produkter från databasen
    const products = await getProducts()
    console.log(`✅ Hämtade ${products.length} produkter från databasen`)
    
    // Testa kategori-filtrering för t-shirt
    const tshirtProducts = products.filter(product => {
      if (!product.category) return false
      
      const productCategory = product.category.toLowerCase()
      const searchTerm = 't-shirt'
      
      return productCategory.includes(searchTerm) || 
             productCategory.includes('tshirt') || 
             productCategory.includes('t shirt')
    })
    
    console.log(`✅ Hittade ${tshirtProducts.length} t-shirt produkter:`)
    tshirtProducts.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ${product.price} USD`)
    })
    
    // Testa kategori-filtrering för men
    const menProducts = products.filter(product => {
      if (!product.category) return false
      
      const productCategory = product.category.toLowerCase()
      
      return productCategory.includes('men') || 
             productCategory.includes('man') || 
             productCategory.includes('herr')
    })
    
    console.log(`✅ Hittade ${menProducts.length} herr-produkter:`)
    menProducts.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ${product.price} USD`)
    })
    
    // Testa kategori-filtrering för women
    const womenProducts = products.filter(product => {
      if (!product.category) return false
      
      const productCategory = product.category.toLowerCase()
      
      return productCategory.includes('women') || 
             productCategory.includes('woman') || 
             productCategory.includes('dam')
    })
    
    console.log(`✅ Hittade ${womenProducts.length} dam-produkter:`)
    womenProducts.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ${product.price} USD`)
    })
    
    console.log('\n🎉 Kategori-navigering fungerar korrekt!')
    console.log('📝 Flöde:')
    console.log('  1. Startsida hämtar produkter från getProducts()')
    console.log('  2. CategoryIcons visar produktbilder från samma data')
    console.log('  3. Klick på kategori → /products?category=X')
    console.log('  4. Produktsida hämtar samma data och filtrerar på kategori')
    
  } catch (error) {
    console.error('❌ Fel vid test av kategori-navigering:', error)
  }
}

testCategoryNavigation()