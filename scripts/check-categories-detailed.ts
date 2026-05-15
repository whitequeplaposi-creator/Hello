import client from '../lib/db'

async function checkCategories() {
  try {
    console.log('Checking categories in database...\n')
    
    // Hämta alla unika kategorier
    const result = await client.execute(
      'SELECT DISTINCT Category FROM Eprolo WHERE Category IS NOT NULL AND Category != "" ORDER BY Category'
    )
    
    console.log(`Found ${result.rows.length} unique categories:`)
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.Category}`)
    })
    
    // Räkna produkter per kategori
    console.log('\nProducts per category:')
    for (const row of result.rows) {
      const countResult = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM Eprolo WHERE Category = ?',
        args: [row.Category]
      })
      console.log(`${row.Category}: ${countResult.rows[0].count} products`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkCategories()
