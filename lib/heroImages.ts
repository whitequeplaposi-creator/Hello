// Hero images data and functions

export interface HeroImage {
  id: string
  url: string
  alt: string
  title?: string
  description?: string
}

// Mock database function - replace with actual database call
export async function getHeroImages(): Promise<HeroImage[]> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock data - replace with actual database query
  return [
    {
      id: '1',
      url: '/hero-slide-1.jpg',
      alt: 'Hero bild 1',
      title: 'Kvalitetsprodukter',
      description: 'Upptäck vårt breda sortiment av kvalitetsprodukter'
    },
    {
      id: '2', 
      url: '/hero-slide-2.jpg',
      alt: 'Hero bild 2',
      title: 'Snabb leverans',
      description: 'Snabb och säker leverans direkt till din dörr'
    },
    {
      id: '3',
      url: '/hero-slide-3.jpg', 
      alt: 'Hero bild 3',
      title: 'Bästa priser',
      description: 'Konkurrenskraftiga priser på alla produkter'
    }
  ]
}

// Function to get a single hero image by ID
export async function getHeroImageById(id: string): Promise<HeroImage | null> {
  const images = await getHeroImages()
  return images.find(img => img.id === id) || null
}
