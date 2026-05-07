import React from 'react'

// British flag (Union Jack) for language selection - minimal recognizable version
export const EnglishFlag = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 12"
    className={className}
  >
    {/* Blue background */}
    <rect width="16" height="12" fill="#012169" />
    
    {/* White diagonal cross (wide) */}
    <rect x="6" y="-3" width="4" height="18" fill="#FFFFFF" transform="rotate(45 8 6)" />
    <rect x="-1" y="3" width="18" height="4" fill="#FFFFFF" transform="rotate(45 8 6)" />
    
    {/* Red diagonal cross (narrow) */}
    <rect x="7" y="-3" width="2" height="18" fill="#C8102E" transform="rotate(45 8 6)" />
    <rect x="0" y="4" width="18" height="2" fill="#C8102E" transform="rotate(45 8 6)" />
    
    {/* White cross (wide) */}
    <rect x="6.5" y="0" width="3" height="12" fill="#FFFFFF" />
    <rect x="0" y="4.5" width="16" height="3" fill="#FFFFFF" />
    
    {/* Red cross (narrow) */}
    <rect x="7" y="0" width="2" height="12" fill="#C8102E" />
    <rect x="0" y="5" width="16" height="2" fill="#C8102E" />
  </svg>
)