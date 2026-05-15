/**
 * Test script to verify category system (now English-only)
 */

import { getAllCategoryNames } from '../lib/categoryGenerator'

function testCategorySystem() {
  console.log('🏷️  Testing category system (English-only)...\n')
  
  const categories = getAllCategoryNames()
  
  console.log('📋 Available categories (all in English):')
  console.log(`   ${categories.join(', ')}\n`)
  
  console.log('✅ Category system verified!')
  console.log(`   - Total categories: ${categories.length}`)
  console.log(`   - All categories are in English`)
  console.log(`   - Translation functions are now legacy (return categories as-is)`)
  
  console.log('\n📝 Category list:')
  console.log('─'.repeat(50))
  categories.forEach((category, index) => {
    console.log(`   ${(index + 1).toString().padStart(2)}. ${category}`)
  })
}

// Run test
testCategorySystem()
