'use client'

import { useFavorites } from '@/lib/FavoritesContext'
import { useAuth } from '@/lib/AuthContext'

interface FavoriteButtonProps {
  productId: string
  className?: string
}

export default function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { user } = useAuth()
  const favorite = isFavorite(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Redirect to login or show a message
      alert('Du måste vara inloggad för att spara favoriter')
      return
    }

    if (favorite) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all ${
        favorite
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
      } ${className}`}
      title={favorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
      aria-label={favorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
    >
      <svg
        className="w-5 h-5"
        fill={favorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
