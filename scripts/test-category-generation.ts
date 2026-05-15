/**
 * Test script to verify category generation from product names
 */

import { createClient } from '@libsql/client'
import { generateCategoriesFromProducts, filterProductsByCategory } from '../lib/categoryGenerator'

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
})

async function testCategoryGeneration() {
  console.log('🔍 Testing category generation from product names...\n')
  
  try {
    // Fetch products from database
    console.log('📦 Fetching products from database...')
    const result = await client.execute('SELECT id, namn FROM Eprolo LIMIT 1000')
    const products = result.rows.map(row => ({
      id: row.id?.toString() || '',
      name: row.namn?.toString() || ''
    }))
    console.log(`✅ Fetched ${products.length} products\n`)
    
    // Show some example product names
    console.log('📝 Example product names:')
    products.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name}`)
    })
    console.log()
    
    // Generate categories
    console.log('🏷️  Generating categories from product names...')
    const productNames = products.map(p => p.name).filter(name => name && name.length > 0)
    const categories = generateCategoriesFromProducts(productNames)
    console.log(`✅ Generated ${categories.length} categories (all in English)\n`)
    
    // Show generated categories
    console.log('📊 Generated categories:')
    categories.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.name}`)
      console.log(`     - Number of products: ${cat.count}`)
      console.log(`     - Keywords: ${cat.keywords.slice(0, 5).join(', ')}${cat.keywords.length > 5 ? '...' : ''}`)
    })
    console.log()
    
    // Test filtering for each category
    console.log('🔍 Testing filtering per category:')
    for (const category of categories.slice(0, 5)) {
      const filtered = filterProductsByCategory(products, category.name)
      console.log(`  ${category.name}: ${filtered.length} products`)
      
      // Show some examples
      if (filtered.length > 0) {
        console.log(`    Examples: ${filtered.slice(0, 3).map(p => p.name).join(', ')}`)
      }
    }
    console.log()
    
    // Summary
    console.log('✅ Test completed!')
    console.log(`   - Total products: ${products.length}`)
    console.log(`   - Generated categories: ${categories.length}`)
    if (categories.length > 0) {
      console.log(`   - Category with most products: ${categories[0]?.name} (${categories[0]?.count} products)`)
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error)
    process.exit(1)
  }
}

// Run test
testCategoryGeneration()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
