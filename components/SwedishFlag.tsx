export default function SwedishFlag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 12"
      className={className}
    >
      <rect width="16" height="12" fill="#006AA7" />
      <rect x="5" y="0" width="2" height="12" fill="#FECC02" />
      <rect x="0" y="5" width="16" height="2" fill="#FECC02" />
    </svg>
  )
}