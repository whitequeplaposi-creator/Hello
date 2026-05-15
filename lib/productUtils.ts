import { Product } from './types'
import { cleanText } from './utils'

function normCompare(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * Beskrivning för produktkort när den inte duplicerar produktnamnet.
 * Tar bort upprepning där beskrivningen börjar med samma text som namnet.
 */
export function descriptionForProductCard(
  rawName: string,
  rawDescription?: string | null
): string | null {
  if (!rawDescription?.trim()) return null

  const nameKey = normCompare(rawName)
  const descKey = normCompare(rawDescription)
  if (!descKey || descKey === nameKey) return null

  let body = rawDescription.trim()
  if (nameKey.length >= 8 && descKey.startsWith(nameKey)) {
    body = body
      .slice(rawName.trim().length)
      .trim()
      .replace(/^[\s.,;:\-–—…:⋅]+/u, '')
  }
  if (!body) return null
  if (normCompare(body) === nameKey) return null

  const out = cleanText(body)
  if (!out || normCompare(out) === nameKey) return null
  return out
}

/**
 * Tar bort dubbletter av produkter baserat på produkt-ID
 * @param products - Array av produkter som kan innehålla dubbletter
 * @returns Array av unika produkter
 */
export function removeDuplicateProducts(products: Product[]): Product[] {
  const uniqueProducts = new Map<string, Product>()
  
  products.forEach(product => {
    // Använd produkt-ID som nyckel för att identifiera dubbletter
    if (!uniqueProducts.has(product.id)) {
      uniqueProducts.set(product.id, product)
    }
  })
  
  return Array.from(uniqueProducts.values())
}

/**
 * Tar bort dubbletter baserat på flera kriterier (ID, namn och pris)
 * Användbar när produkter kan ha samma innehåll men olika ID:n
 * @param products - Array av produkter som kan innehålla dubbletter
 * @returns Array av unika produkter
 */
export function removeDuplicateProductsAdvanced(products: Product[]): Product[] {
  const uniqueProducts = new Map<string, Product>()
  
  products.forEach(product => {
    // Skapa en unik nyckel baserat på ID, namn och pris
    const uniqueKey = `${product.id}-${product.name.toLowerCase()}-${product.price}`
    
    if (!uniqueProducts.has(uniqueKey)) {
      uniqueProducts.set(uniqueKey, product)
    }
  })
  
  return Array.from(uniqueProducts.values())
}

/**
 * Tar bort dubbletter och behåller den senaste versionen av varje produkt
 * Användbar när samma produkt kan ha uppdaterats
 * @param products - Array av produkter som kan innehålla dubbletter
 * @returns Array av unika produkter med senaste versioner
 */
export function removeDuplicateProductsKeepLatest(products: Product[]): Product[] {
  const productMap = new Map<string, Product>()
  
  products.forEach(product => {
    const existingProduct = productMap.get(product.id)
    
    if (!existingProduct) {
      // Första gången vi ser denna produkt
      productMap.set(product.id, product)
    } else {
      // Produkten finns redan, behåll den som har mer information
      // (fler bilder, färger, storlekar etc.)
      const existingScore = getProductCompletenessScore(existingProduct)
      const currentScore = getProductCompletenessScore(product)
      
      if (currentScore > existingScore) {
        productMap.set(product.id, product)
      }
    }
  })
  
  return Array.from(productMap.values())
}

/**
 * Beräknar en "fullständighetspoäng" för en produkt
 * Högre poäng = mer komplett produktinformation
 */
function getProductCompletenessScore(product: Product): number {
  let score = 0
  
  // Grundläggande information
  if (product.name) score += 1
  if (product.description) score += 1
  if (product.price > 0) score += 1
  if (product.category) score += 1
  
  // Bilder
  if (product.image) score += 1
  if (product.images && product.images.length > 0) score += product.images.length
  
  // Varianter
  if (product.colors && product.colors.length > 0) score += product.colors.length
  if (product.sizes && product.sizes.length > 0) score += product.sizes.length
  
  // Lagerstatus
  if (product.inStock !== undefined) score += 1
  
  return score
}

/**
 * Normaliserar ett produktnamn för jämförelse vid namnbaserad deduplicering.
 * Tar bort extra mellanslag, konverterar till gemener och trimmar.
 */
function normalizeProductName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * Validerar och rensar produktdata.
 * Tar bort dubbletter och produkter med ofullständig information.
 *
 * Deduplicering sker i två steg:
 *  1. ID-baserad: samma produkt-ID → behåll den mest kompletta versionen.
 *  2. Namnbaserad: olika ID men identiskt normaliserat namn → behåll den
 *     med högst fullständighetspoäng. Hanterar fallet där samma produkt
 *     laddats upp flera gånger med nya ID:n.
 *
 * @param products - Array av produkter
 * @returns Array av validerade och unika produkter
 */
export function validateAndDeduplicateProducts(products: Product[]): Product[] {
  // Steg 1: filtrera bort produkter med ofullständig information
  const validProducts = products.filter(product => {
    return (
      product.id &&
      product.name &&
      product.description &&
      product.price > 0 &&
      product.category
    )
  })

  // Steg 2: ID-baserad deduplicering (behåll mest komplett version)
  const byId = removeDuplicateProductsKeepLatest(validProducts)

  // Steg 3: namnbaserad deduplicering (olika ID, samma namn)
  const byName = new Map<string, Product>()
  for (const product of byId) {
    const key = normalizeProductName(product.name)
    const existing = byName.get(key)
    if (!existing) {
      byName.set(key, product)
    } else {
      // Behåll den med högst fullständighetspoäng
      if (getProductCompletenessScore(product) > getProductCompletenessScore(existing)) {
        byName.set(key, product)
      }
    }
  }

  return Array.from(byName.values())
}

// ---------------------------------------------------------------------------
// Position Randomization
// ---------------------------------------------------------------------------

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Ger deterministiska tal i [0, 1) för ett givet frö, vilket gör att
 * ordningen är stabil under en session men varierar mellan sessioner.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Hämtar (eller skapar) ett sessions-frö som lagras i sessionStorage.
 * Fröet är stabilt under hela sessionen men genereras om vid ny session.
 */
function getSessionSeed(): number {
  if (typeof window === 'undefined') {
    // SSR-fallback: använd ett fast frö så att hydreringen inte krockar
    return 42
  }
  const key = 'product_position_seed'
  const stored = sessionStorage.getItem(key)
  if (stored) return parseInt(stored, 10)
  const seed = Math.floor(Math.random() * 2 ** 32)
  sessionStorage.setItem(key, String(seed))
  return seed
}

/**
 * Fisher-Yates shuffle med ett seeded PRNG.
 * Returnerar en ny array — originalet påverkas inte.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  const rand = mulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Position Randomization — appliceras efter Diversity Layer på startsidan.
 *
 * Slumpar om produkternas positioner med ett sessions-stabilt frö så att
 * flödet ser annorlunda ut vid varje ny session men inte hoppar runt under
 * pågående session. Relevans och filtrering påverkas inte — funktionen
 * arbetar enbart på den slutliga visningsordningen.
 *
 * Randomiseringen sker i "block" om `blockSize` produkter: varje block
 * shufflas internt. Det bevarar en grov relevansordning (topp-produkter
 * stannar nära toppen) medan positionen ändå varierar tillräckligt för att
 * startsidan ska kännas dynamisk.
 *
 * OBS: Ska ALDRIG anropas på sökresultat eller kategorifiltrerade listor.
 *
 * @param products  - Produkter som redan passerat Diversity Layer
 * @param blockSize - Antal produkter per block (standard 12 ≈ en rad × 2)
 * @returns Ny array med randomiserade positioner
 */
export function applyPositionRandomization(
  products: Product[],
  blockSize = 12
): Product[] {
  if (products.length <= 1) return products

  const seed = getSessionSeed()
  const result: Product[] = []

  for (let start = 0; start < products.length; start += blockSize) {
    const block = products.slice(start, start + blockSize)
    // Variera fröet per block så att varje block shufflas unikt
    const blockSeed = (seed ^ (start * 2654435761)) >>> 0
    result.push(...seededShuffle(block, blockSeed))
  }

  return result
}

// ---------------------------------------------------------------------------
// Post-Ranking Diversity Layer
// ---------------------------------------------------------------------------

/**
 * Post-Ranking Diversity Layer — endast för startsidan/rekommendationsflödet.
 *
 * Blandar produktlistan så att samma kategori inte upprepas i följd.
 * Algoritmen är en "round-robin interleave": produkterna grupperas per
 * kategori och plockas sedan en i taget från varje grupp i turordning.
 * Det ger en jämn spridning utan att förstöra den ursprungliga
 * relevansordningen inom varje kategori.
 *
 * OBS: Ska ALDRIG anropas på sökresultat — sök ska förbli rent
 * relevansbaserat. Anropa bara denna funktion när searchQuery är tom.
 *
 * @param products - Redan filtrerade och deduplicerade produkter
 * @returns Ny array med diversifierad ordning
 */
export function applyDiversityLayer(products: Product[]): Product[] {
  if (products.length <= 1) return products

  // Gruppera per kategori och bevara intern ordning
  const buckets = new Map<string, Product[]>()
  for (const product of products) {
    const key = product.category
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(product)
  }

  // Sortera bucket-nycklarna efter storlek (störst först) så att stora
  // kategorier inte tar slut för tidigt och lämnar långa enhetliga svansen.
  const sortedKeys = Array.from(buckets.keys()).sort(
    (a, b) => buckets.get(b)!.length - buckets.get(a)!.length
  )

  // Round-robin: plocka ett element från varje bucket i tur och ordning
  const result: Product[] = []
  let hasMore = true
  while (hasMore) {
    hasMore = false
    for (const key of sortedKeys) {
      const bucket = buckets.get(key)!
      if (bucket.length > 0) {
        result.push(bucket.shift()!)
        if (bucket.length > 0) hasMore = true
      }
    }
  }

  return result
}