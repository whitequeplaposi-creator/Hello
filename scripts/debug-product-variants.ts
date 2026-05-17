import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN || '',
})

async function debugProductVariants() {
  try {
    // Hämta en produkt med flera färger
    const result = await client.execute(`
      SELECT id, namn, color, Image, price 
      FROM Eprolo 
      WHERE color IS NOT NULL AND color != '' 
      LIMIT 5
    `)

    console.log('\n=== PRODUKTVARIANT DEBUG ===\n')

    for (const row of result.rows) {
      console.log(`\nProdukt ID: ${row.id}`)
      console.log(`Namn: ${row.namn}`)
      console.log(`Pris: ${row.price}`)
      
      const colors = row.color?.toString().split(',').map(c => c.trim()) || []
      console.log(`\nFärger (${colors.length}):`)
      colors.forEach((color, idx) => {
        console.log(`  [${idx}] ${color}`)
      })

      const images = row.Image?.toString().split(', ') || []
      console.log(`\nBilder (${images.length}):`)
      images.forEach((img, idx) => {
        const filename = img.split('/').pop() || img
        console.log(`  [${idx}] ${filename}`)
      })

      console.log('\n' + '='.repeat(80))
    }
  } catch (error) {
    console.error('Fel:', error)
  }
}

debugProductVariants()
