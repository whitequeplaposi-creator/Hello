import { createClient } from '@libsql/client';
import { filterJpgImages } from './utils';
import { validateAndDeduplicateProducts } from './productUtils';
import type { Product } from './types';

// Function to categorize products based on their names.
// IMPORTANT: Product-type keywords are checked BEFORE gender keywords so that
// e.g. "Women Floral Dress" is categorised as 'dress', not 'women'.
function categorizeProduct(productName: string): string {
  const name = productName.toLowerCase();

  // --- Product-type checks (highest priority) ---
  if (name.includes('dress') || name.includes('klänning') || name.includes('gown') || name.includes('maxi dress')) {
    return 'dress';
  }
  if (name.includes('skirt') || name.includes('kjol')) {
    return 'skirt';
  }
  if (name.includes('blouse') || name.includes('blus')) {
    return 'blouse';
  }
  if (name.includes('jacket') || name.includes('jacka') || name.includes('blazer') || name.includes('cardigan')) {
    return 'jacket';
  }
  if (name.includes('coat') || name.includes('kappa') || name.includes('overcoat') || name.includes('trench')) {
    return 'coat';
  }
  if (name.includes('hoodie') || name.includes('sweatshirt')) {
    return 'hoodie';
  }
  if (name.includes('sweater') || name.includes('tröja') || name.includes('pullover') || name.includes('knit')) {
    return 'sweater';
  }
  if (name.includes('t-shirt') || name.includes('tshirt') || name.includes('t shirt') || name.includes(' tee ') || name.includes(' tee,') || name.match(/\btee\b/)) {
    return 't-shirt';
  }
  if (name.includes('shirt') || name.includes('skjorta') || name.includes('blouse')) {
    return 'shirt';
  }
  if (name.includes('jeans')) {
    return 'jeans';
  }
  if (name.includes('shorts')) {
    return 'shorts';
  }
  if (name.includes('leggings')) {
    return 'leggings';
  }
  if (name.includes('trousers') || name.includes('pants') || name.includes('byxa') || name.includes('chinos') || name.includes('slacks')) {
    return 'trousers';
  }
  if (name.includes('swimsuit') || name.includes('bikini') || name.includes('swimwear') || name.includes('badkläder') || name.includes('baddräkt')) {
    return 'swimwear';
  }
  if (name.includes('lingerie') || name.includes('bra ') || name.includes('underwear') || name.includes('underkläder') || name.includes('panties') || name.includes('briefs')) {
    return 'underwear';
  }
  if (name.includes('socks') || name.includes('strumpor') || name.includes('stockings') || name.includes('tights')) {
    return 'socks';
  }
  if (name.includes('shoes') || name.includes('skor') || name.includes('sneakers') || name.includes('boots') || name.includes('sandals') || name.includes('heels') || name.includes('loafers') || name.includes('pumps') || name.includes('flats')) {
    return 'shoes';
  }
  if (name.includes('bag') || name.includes('väska') || name.includes('purse') || name.includes('handbag') || name.includes('backpack') || name.includes('tote')) {
    return 'bag';
  }
  if (name.includes('belt') || name.includes('bälte') || name.includes('waist belt')) {
    return 'belt';
  }
  if (name.includes('hat') || name.includes('cap') || name.includes('mössa') || name.includes('beanie') || name.includes('scarf') || name.includes('halsduk') || name.includes('gloves') || name.includes('handskar')) {
    return 'accessories';
  }
  if (name.includes('jewelry') || name.includes('necklace') || name.includes('bracelet') || name.includes('earring') || name.includes('ring ') || name.includes('smycke')) {
    return 'jewelry';
  }
  if (name.includes('jumpsuit') || name.includes('romper') || name.includes('overall')) {
    return 'jumpsuit';
  }
  // 'suit' must come AFTER jumpsuit/swimsuit/swimwear checks
  if ((name.includes('suit') && !name.includes('swimsuit') && !name.includes('jumpsuit')) || name.includes('kostym') || name.includes('tuxedo')) {
    return 'suit';
  }
  if (name.includes('top ') || name.includes(' top') || name.includes('crop') || name.includes('tank') || name.includes('camisole') || name.includes('vest top')) {
    return 'top';
  }

  // --- Gender fallback (only when no product type matched) ---
  if (name.includes('women') || name.includes('woman') || name.includes('womens') || name.includes('ladies') ||
      name.includes('dam') || name.includes('female') || name.includes('kvinna') || name.includes('kvinnor')) {
    return 'women';
  }
  if (name.includes('men') || name.includes('man') || name.includes('herr') || name.includes('male')) {
    return 'men';
  }

  // Default
  return 'clothing';
}

if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL environment variable is not set');
}
if (!process.env.DATABASE_AUTH_TOKEN) {
  console.warn('WARNING: DATABASE_AUTH_TOKEN environment variable is not set');
}

const client = createClient({
  url: process.env.DATABASE_URL || 'libsql://placeholder',
  authToken: process.env.DATABASE_AUTH_TOKEN || '',
});

// Initialize database schema - ensure all tables and columns exist
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;

  try {
    // Check if customers table exists
    const tablesResult = await client.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='customers'
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('Creating customer tables...');
      
      // Create customers table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
          total_orders INTEGER DEFAULT 0,
          total_spent REAL DEFAULT 0.0,
          last_order_date DATETIME,
          notes TEXT
        )
      `);
      
      // Create customer_addresses table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS customer_addresses (
          id TEXT PRIMARY KEY,
          customer_id TEXT NOT NULL,
          address_type TEXT NOT NULL CHECK(address_type IN ('billing', 'shipping')),
          name TEXT NOT NULL,
          street TEXT NOT NULL,
          postal_code TEXT NOT NULL,
          city TEXT NOT NULL,
          country TEXT DEFAULT 'Sverige',
          phone TEXT,
          is_default INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
        )
      `);
      
      // Create customer_payment_methods table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS customer_payment_methods (
          id TEXT PRIMARY KEY,
          customer_id TEXT NOT NULL,
          payment_type TEXT NOT NULL CHECK(payment_type IN ('card', 'invoice', 'other')),
          card_brand TEXT,
          card_last_four TEXT,
          card_expiry TEXT,
          is_default INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
        )
      `);
      
      // Create orders table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          customer_id TEXT NOT NULL,
          order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
          total_amount REAL NOT NULL,
          currency TEXT DEFAULT 'SEK',
          payment_method TEXT,
          payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
          payment_intent_id TEXT,
          shipping_address_id TEXT,
          billing_address_id TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
          FOREIGN KEY (shipping_address_id) REFERENCES customer_addresses(id),
          FOREIGN KEY (billing_address_id) REFERENCES customer_addresses(id)
        )
      `);
      
      // Create order_items table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS order_items (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          product_id TEXT NOT NULL,
          product_name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price REAL NOT NULL,
          total_price REAL NOT NULL,
          size TEXT,
          color TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      
      // Create shipments table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS shipments (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          tracking_number TEXT UNIQUE,
          carrier TEXT NOT NULL CHECK(carrier IN ('PostNord', 'DHL', 'DB Schenker', 'Bring', 'Other')),
          status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
          shipped_date DATETIME,
          estimated_delivery_date DATETIME,
          actual_delivery_date DATETIME,
          shipping_address TEXT NOT NULL,
          weight_kg REAL,
          dimensions TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      
      // Create shipment_events table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS shipment_events (
          id TEXT PRIMARY KEY,
          shipment_id TEXT NOT NULL,
          status TEXT NOT NULL,
          location TEXT,
          description TEXT NOT NULL,
          event_date DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
        )
      `);
      
      // Create order_tracking table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS order_tracking (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL UNIQUE,
          order_number TEXT,
          confirmed INTEGER DEFAULT 0,
          confirmed_date TEXT,
          packing INTEGER DEFAULT 0,
          packing_date TEXT,
          transport INTEGER DEFAULT 0,
          transport_date TEXT,
          delivered INTEGER DEFAULT 0,
          delivered_date TEXT,
          products TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      
      // Create indexes
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON customer_payment_methods(customer_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_order_tracking_order_number ON order_tracking(order_number)`);

      // Create recensioner table
      await client.execute(`
        CREATE TABLE IF NOT EXISTS recensioner (
          id TEXT PRIMARY KEY,
          produkt_id TEXT NOT NULL,
          kund_id TEXT,
          anvandare_namn TEXT NOT NULL,
          betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
          titel TEXT,
          kommentar TEXT NOT NULL,
          verifierad_kop INTEGER DEFAULT 0,
          status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status)`);

      console.log('Database schema initialized successfully');
    } else {
      // Check if payment_intent_id column exists in orders table
      const columnsResult = await client.execute(`PRAGMA table_info(orders)`);
      const hasPaymentIntentId = columnsResult.rows.some(row => row.name === 'payment_intent_id');
      
      if (!hasPaymentIntentId) {
        console.log('Adding payment_intent_id column to orders table...');
        try {
          await client.execute(`ALTER TABLE orders ADD COLUMN payment_intent_id TEXT`);
          await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_intent_unique ON orders(payment_intent_id) WHERE payment_intent_id IS NOT NULL`);
          console.log('payment_intent_id column added successfully');
        } catch (e) {
          console.log('payment_intent_id column already exists or error:', e);
        }
      }
      
      // Check if order_tracking table exists
      const trackingTableResult = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='order_tracking'
      `);
      
      if (trackingTableResult.rows.length === 0) {
        console.log('Creating order_tracking table...');
        await client.execute(`
          CREATE TABLE IF NOT EXISTS order_tracking (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL UNIQUE,
            order_number TEXT,
            confirmed INTEGER DEFAULT 0,
            confirmed_date TEXT,
            packing INTEGER DEFAULT 0,
            packing_date TEXT,
            transport INTEGER DEFAULT 0,
            transport_date TEXT,
            delivered INTEGER DEFAULT 0,
            delivered_date TEXT,
            products TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
          )
        `);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_order_tracking_order_number ON order_tracking(order_number)`);
        console.log('order_tracking table created successfully');
      }

      // Ensure recensioner table exists
      const recensionerTableResult = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='recensioner'
      `);

      if (recensionerTableResult.rows.length === 0) {
        console.log('Creating recensioner table...');
        await client.execute(`
          CREATE TABLE IF NOT EXISTS recensioner (
            id TEXT PRIMARY KEY,
            produkt_id TEXT NOT NULL,
            kund_id TEXT,
            anvandare_namn TEXT NOT NULL,
            betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
            titel TEXT,
            kommentar TEXT NOT NULL,
            verifierad_kop INTEGER DEFAULT 0,
            status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
          )
        `);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status)`);
        console.log('recensioner table created successfully');
      }
    }
    
    dbInitialized = true;
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw - allow app to continue even if initialization fails
  }
}

// Initialize database on first use
initializeDatabase().catch(console.error);

// In-memory cache to avoid Next.js 2MB cache limit (dataset is ~25MB)
let productsCache: Product[] | null = null;
let productsCacheTime = 0;
const CACHE_TTL = 3600 * 1000; // 1 hour in ms

function mapRow(row: Record<string, unknown>): Product {
  const imageUrls = row.Image ? row.Image.toString().split(', ') : [];
  const filteredImages = filterJpgImages(imageUrls);
  const firstImage = filteredImages.length > 0 ? filteredImages[0] : '';

  const productId = row.id?.toString() || '';
  const productName = row.namn?.toString() || '';
  const productCategory = categorizeProduct(productName);

  const colorString = row.color?.toString() || '';
  const productColors = colorString
    ? colorString.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
    : [];

  const sizeString = row.size?.toString() || '';
  const productSizes = sizeString
    ? sizeString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [];

  return {
    id: productId,
    name: productName,
    description: productName,
    price: parseFloat(row.price?.toString() || '0'),
    category: productCategory,
    inStock: true,
    image: firstImage || undefined,
    images: filteredImages.length > 0 ? filteredImages : firstImage ? [firstImage] : [],
    colors: productColors.length > 0 ? productColors : undefined,
    sizes: productSizes,
  };
}

export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    const now = Date.now();

    // Return cached data if still fresh and no limit requested
    if (!limit && productsCache && (now - productsCacheTime) < CACHE_TTL) {
      console.log(`Returning ${productsCache.length} cached products`);
      return productsCache;
    }

    console.log('Fetching products from database...');
    const query = limit ? `SELECT * FROM Eprolo LIMIT ${limit}` : `SELECT * FROM Eprolo`;
    const result = await client.execute(query);
    console.log(`Fetched ${result.rows.length} products from database`);

    const mappedProducts = result.rows.map(row => mapRow(row as Record<string, unknown>));
    console.log(`Mapped ${mappedProducts.length} products successfully`);

    const deduplicatedProducts = validateAndDeduplicateProducts(mappedProducts);
    console.log(`After deduplication: ${deduplicatedProducts.length} unique products`);

    // Store in memory cache (no size limit)
    if (!limit) {
      productsCache = deduplicatedProducts;
      productsCacheTime = now;
    }

    return deduplicatedProducts;
  } catch (error) {
    console.error('Error fetching products from Eprolo table:', error);
    return productsCache ?? []; // Fall back to stale cache if available
  }
}

// Cache individual product for 1 hour
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM Eprolo WHERE id = ?',
      args: [id]
    });
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    const imageUrls = row.Image ? row.Image.toString().split(', ') : [];
    const filteredImages = filterJpgImages(imageUrls);
    
    const colorString = row.color?.toString() || '';
    const productColors = colorString
      ? colorString.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
      : [];

    const sizeString = row.size?.toString() || '';
    const productSizes = sizeString
      ? sizeString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : [];

    const productName = row.namn?.toString() || '';
    return {
      id: row.id?.toString() || '',
      name: productName,
      description: row.namn?.toString() || '',
      price: parseFloat(row.price?.toString() || '0'),
      category: categorizeProduct(productName),
      inStock: true,
      image: filteredImages[0] || undefined,
      images: filteredImages.length > 0 ? filteredImages : filteredImages[0] ? [filteredImages[0]] : [],
      colors: productColors.length > 0 ? productColors : undefined,
      sizes: productSizes,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get related products — same product type only, deduplicated by ID, varied.
// Only used on the product detail page; does not affect the home page.
export async function getRelatedProducts(productId: string, _category?: string): Promise<Product[]> {
  try {
    // Fetch the current product's name so we can determine its exact type
    const currentProductResult = await client.execute({
      sql: 'SELECT namn FROM Eprolo WHERE id = ?',
      args: [productId]
    });

    const currentProductName = currentProductResult.rows[0]?.namn?.toString() || '';
    const productType = categorizeProduct(currentProductName);

    // Fetch ALL products except the current one.
    // ORDER BY RANDOM() at the DB level ensures variety on every page load.
    const result = await client.execute({
      sql: 'SELECT * FROM Eprolo WHERE id != ? ORDER BY RANDOM()',
      args: [productId]
    });

    // Deduplicate strictly by ID only — name-based dedup is intentionally
    // skipped here because products with similar names (e.g. same dress in
    // different colours) are genuinely distinct and should all be shown.
    const seenIds = new Set<string>();
    const allMapped: Product[] = [];
    for (const row of result.rows) {
      const p = mapRow(row as Record<string, unknown>);
      if (
        p.id &&
        !seenIds.has(p.id) &&
        p.name &&
        p.price > 0 &&
        p.category
      ) {
        seenIds.add(p.id);
        allMapped.push(p);
      }
    }

    // --- Strict same-type filter ---
    // For a dress page we only show dresses; for a jacket page only jackets, etc.
    const sameType = allMapped.filter(p => p.category === productType && p.inStock);

    if (sameType.length >= 4) {
      // Return all matching products — no artificial cap.
      // The UI handles pagination / "load more".
      return sameType;
    }

    // Fallback for very rare product types: widen to the same broad group
    // (e.g. all "tops" when the specific type has fewer than 4 results).
    const broadGroup = getBroadGroup(productType);
    if (broadGroup) {
      const broadMatch = allMapped.filter(
        p => p.inStock && getBroadGroup(p.category) === broadGroup
      );
      if (broadMatch.length >= 4) {
        return broadMatch;
      }
    }

    // Last resort: return all in-stock products (still ID-deduplicated).
    return allMapped.filter(p => p.inStock);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

/**
 * Maps a specific product type to a broad gender/lifestyle group so we can
 * widen the fallback search without mixing completely unrelated categories.
 */
function getBroadGroup(productType: string): string | null {
  const womenTypes = new Set(['dress', 'skirt', 'blouse', 'jumpsuit', 'swimwear', 'lingerie', 'underwear', 'women']);
  const menTypes = new Set(['suit', 'men']);
  const topTypes = new Set(['t-shirt', 'shirt', 'top', 'hoodie', 'sweater', 'jacket', 'coat', 'blouse']);
  const bottomTypes = new Set(['trousers', 'jeans', 'shorts', 'leggings', 'skirt']);
  const footwearTypes = new Set(['shoes', 'socks']);
  const accessoryTypes = new Set(['bag', 'belt', 'accessories', 'jewelry']);

  if (womenTypes.has(productType)) return 'women_specific';
  if (menTypes.has(productType)) return 'men_specific';
  if (topTypes.has(productType)) return 'tops';
  if (bottomTypes.has(productType)) return 'bottoms';
  if (footwearTypes.has(productType)) return 'footwear';
  if (accessoryTypes.has(productType)) return 'accessories';
  return null;
}
export default client;
