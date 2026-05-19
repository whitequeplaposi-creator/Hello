/**
 * Test script för sökprestandaoptimering
 * 
 * Detta skript testar:
 * 1. API-sökning fungerar korrekt
 * 2. Caching fungerar
 * 3. Sökhastighet är acceptabel
 * 4. Relevanssortering fungerar
 */

async function testSearchPerformance() {
  console.log('🔍 Testar sökprestandaoptimering...\n')

  const baseUrl = 'http://localhost:3000'
  const testQueries = [
    'shirt',
    't-shirt',
    'jeans',
    'shoes',
    'jacket',
    'dress'
  ]

  // Test 1: API-sökning fungerar
  console.log('📋 Test 1: API-sökning fungerar')
  try {
    const response = await fetch(`${baseUrl}/api/products/search?q=shirt`)
    const data = await response.json()
    
    if (response.ok && data.products) {
      console.log(`✅ API-sökning fungerar - ${data.count} produkter hittades`)
    } else {
      console.log('❌ API-sökning misslyckades')
      return
    }
  } catch (error) {
    console.log('❌ Kunde inte ansluta till API:', error)
    return
  }

  // Test 2: Sökhastighet (första sökningen)
  console.log('\n⏱️  Test 2: Sökhastighet (första sökningen)')
  const timings: { query: string; time: number; count: number }[] = []
  
  for (const query of testQueries) {
    const start = Date.now()
    const response = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    const time = Date.now() - start
    
    timings.push({ query, time, count: data.count })
    console.log(`  ${query}: ${time}ms (${data.count} resultat)`)
  }

  const avgTime = timings.reduce((sum, t) => sum + t.time, 0) / timings.length
  console.log(`\n  Genomsnittlig tid: ${avgTime.toFixed(0)}ms`)
  
  if (avgTime < 500) {
    console.log('✅ Sökhastighet är bra (<500ms)')
  } else if (avgTime < 1000) {
    console.log('⚠️  Sökhastighet är acceptabel (500-1000ms)')
  } else {
    console.log('❌ Sökhastighet är för långsam (>1000ms)')
  }

  // Test 3: Caching (upprepade sökningar)
  console.log('\n💾 Test 3: Caching (upprepade sökningar)')
  const cachedTimings: { query: string; time: number; cached: boolean }[] = []
  
  for (const query of testQueries.slice(0, 3)) {
    const start = Date.now()
    const response = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    const time = Date.now() - start
    
    cachedTimings.push({ query, time, cached: data.cached || false })
    console.log(`  ${query}: ${time}ms ${data.cached ? '(cachad)' : '(ej cachad)'}`)
  }

  const avgCachedTime = cachedTimings.reduce((sum, t) => sum + t.time, 0) / cachedTimings.length
  console.log(`\n  Genomsnittlig cachad tid: ${avgCachedTime.toFixed(0)}ms`)
  
  if (avgCachedTime < avgTime * 0.7) {
    console.log('✅ Caching ger betydande prestandaförbättring')
  } else {
    console.log('⚠️  Caching ger mindre prestandaförbättring än förväntat')
  }

  // Test 4: Relevanssortering
  console.log('\n🎯 Test 4: Relevanssortering')
  const response = await fetch(`${baseUrl}/api/products/search?q=shirt`)
  const data = await response.json()
  
  if (data.products && data.products.length > 0) {
    const topResults = data.products.slice(0, 5)
    console.log('  Top 5 resultat för "shirt":')
    topResults.forEach((p: any, i: number) => {
      const name = p.name.toLowerCase()
      const relevance = name === 'shirt' ? '⭐⭐⭐' : 
                       name.startsWith('shirt') ? '⭐⭐' :
                       name.includes('shirt') ? '⭐' : ''
      console.log(`    ${i + 1}. ${p.name} ${relevance}`)
    })
    
    // Kontrollera att exakta matchningar kommer först
    const firstProduct = topResults[0].name.toLowerCase()
    if (firstProduct === 'shirt' || firstProduct.startsWith('shirt')) {
      console.log('✅ Relevanssortering fungerar korrekt')
    } else {
      console.log('⚠️  Relevanssortering kan förbättras')
    }
  }

  // Test 5: Tom sökning
  console.log('\n🔍 Test 5: Tom sökning')
  const emptyResponse = await fetch(`${baseUrl}/api/products/search?q=`)
  const emptyData = await emptyResponse.json()
  
  if (emptyData.products && emptyData.products.length === 0) {
    console.log('✅ Tom sökning returnerar inga resultat')
  } else {
    console.log('❌ Tom sökning borde returnera inga resultat')
  }

  // Test 6: Kort sökning (1 tecken)
  console.log('\n🔍 Test 6: Kort sökning (1 tecken)')
  const shortResponse = await fetch(`${baseUrl}/api/products/search?q=a`)
  const shortData = await shortResponse.json()
  
  if (shortData.products && shortData.products.length === 0) {
    console.log('✅ Kort sökning (<2 tecken) returnerar inga resultat')
  } else {
    console.log('❌ Kort sökning borde returnera inga resultat')
  }

  // Test 7: Sökning med specialtecken
  console.log('\n🔍 Test 7: Sökning med specialtecken')
  const specialResponse = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent('t-shirt')}`)
  const specialData = await specialResponse.json()
  
  if (specialData.products && specialData.products.length > 0) {
    console.log(`✅ Sökning med specialtecken fungerar (${specialData.count} resultat)`)
  } else {
    console.log('⚠️  Sökning med specialtecken returnerade inga resultat')
  }

  // Test 8: Case-insensitive sökning
  console.log('\n🔍 Test 8: Case-insensitive sökning')
  const lowerResponse = await fetch(`${baseUrl}/api/products/search?q=shirt`)
  const upperResponse = await fetch(`${baseUrl}/api/products/search?q=SHIRT`)
  const lowerData = await lowerResponse.json()
  const upperData = await upperResponse.json()
  
  if (lowerData.count === upperData.count) {
    console.log('✅ Case-insensitive sökning fungerar')
  } else {
    console.log('❌ Case-insensitive sökning fungerar inte korrekt')
  }

  // Sammanfattning
  console.log('\n' + '='.repeat(50))
  console.log('📊 SAMMANFATTNING')
  console.log('='.repeat(50))
  console.log(`Genomsnittlig söktid (första): ${avgTime.toFixed(0)}ms`)
  console.log(`Genomsnittlig söktid (cachad): ${avgCachedTime.toFixed(0)}ms`)
  console.log(`Prestandaförbättring: ${((1 - avgCachedTime / avgTime) * 100).toFixed(0)}%`)
  console.log(`Totalt antal tester: 8`)
  console.log('\n✅ Alla tester slutförda!')
}

// Kör testerna
testSearchPerformance().catch(console.error)
