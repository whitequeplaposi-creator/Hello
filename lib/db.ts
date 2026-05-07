import { createClient } from '@libsql/client';
import { filterJpgImages } from './utils';
import { unstable_cache } from 'next/cache';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxMzY3MzcsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.ahQ8U_X0Mbrefkedzbr0eDDqGM7lPtnkM2p0bzh9l_5pl2SFQ8ODOhcECfDZo9qLKy9H58SUVYbF1y2OQjsJBg'
});

// Cache products for 1 hour
export const getProducts = unstable_cache(
  async () => {
    try {
      const result = await client.execute('SELECT * FROM Eprolo');
      
      // Map database products to Product type - filtrera bort .png bilder
      const mappedProducts = result.rows.map(row => {
        // Extract and filter image URLs - endast .jpg bilder behålls
        const imageUrls = row.Image ? row.Image.toString().split(', ') : [];
        const filteredImages = filterJpgImages(imageUrls);
        const firstImage = filteredImages.length > 0 ? filteredImages[0] : '';
        
        // Konvertera alla värden till rätt typer
        const productId = row.id?.toString() || '';
        const productName = row.namn?.toString() || row.name?.toString() || '';
        const productDescription = row.description?.toString() || '';
        const productCategory = row.category?.toString() || row.Category?.toString() || 'Övrigt';
        
        // Parse colors from comma-separated string
        const colorString = row.color?.toString() || '';
        const productColors = colorString
          ? colorString.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
          : [];

        // Parse sizes from comma-separated string - only from database
        const sizeString = row.size?.toString() || '';
        const productSizes = sizeString
          ? sizeString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          : []; // Empty array if no sizes specified in database

        return {
          id: productId,
          name: productName,
          description: productDescription || productName,
          price: parseFloat(row.price?.toString() || row.Price?.toString() || '0'),
          category: productCategory,
          inStock: true, // Default to true since we don't have stock info
          image: firstImage || undefined,
          images: filteredImages.length > 0 ? filteredImages : firstImage ? [firstImage] : [],
          colors: productColors.length > 0 ? productColors : undefined,
          sizes: productSizes,
        };
      });
      
      return mappedProducts;
    } catch (error) {
      console.error('Error fetching products from Eprolo table:', error);
      return [];
    }
  },
  ['all-products'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['products']
  }
);

// Cache individual product for 1 hour
export const getProduct = unstable_cache(
  async (id: string) => {
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM Eprolo WHERE id = ?',
        args: [id]
      });
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      const imageUrls = row.Image ? row.Image.toString().split(', ') : [];
      const filteredImages = filterJpgImages(imageUrls);
      
      // Parse colors from comma-separated string
      const colorString = row.color?.toString() || '';
      const productColors = colorString
        ? colorString.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
        : [];

      // Parse sizes from comma-separated string - only from database
      const sizeString = row.size?.toString() || '';
      const productSizes = sizeString
        ? sizeString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : []; // Empty array if no sizes specified in database

      return {
        id: row.id?.toString() || '',
        name: row.namn?.toString() || row.name?.toString() || '',
        description: row.description?.toString() || '',
        price: parseFloat(row.price?.toString() || row.Price?.toString() || '0'),
        category: row.category?.toString() || row.Category?.toString() || 'Övrigt',
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
  },
  ['product'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['products']
  }
);

// Cache related products for 1 hour
export const getRelatedProducts = unstable_cache(
  async (productId: string, category?: string) => {
    try {
      // If category is provided, use it directly to avoid extra DB call
      let productCategory = category;
      
      if (!productCategory) {
        const product = await getProduct(productId);
        if (!product) return [];
        productCategory = product.category;
      }

      // Query related products from same category
      const result = await client.execute({
        sql: 'SELECT * FROM Eprolo WHERE category = ? AND id != ? LIMIT 10',
        args: [productCategory, productId]
      });
      
      return result.rows.map(row => {
        const imageUrls = row.Image ? row.Image.toString().split(', ') : [];
        const filteredImages = filterJpgImages(imageUrls);
        const firstImage = filteredImages.length > 0 ? filteredImages[0] : '';
        
        const productId = row.id?.toString() || '';
        const productName = row.namn?.toString() || row.name?.toString() || '';
        const productDescription = row.description?.toString() || '';
        const productCategory = row.category?.toString() || row.Category?.toString() || 'Övrigt';
        
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
          description: productDescription || productName,
          price: parseFloat(row.price?.toString() || row.Price?.toString() || '0'),
          category: productCategory,
          inStock: true,
          image: firstImage || undefined,
          images: filteredImages.length > 0 ? filteredImages : firstImage ? [firstImage] : [],
          colors: productColors.length > 0 ? productColors : undefined,
          sizes: productSizes,
        };
      });
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  },
  ['related-products'],
  {
    revalidate: 3600,
    tags: ['products']
  }
);

export default client;
