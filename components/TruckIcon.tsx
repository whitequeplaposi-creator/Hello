export default function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img
      className={className}
      src="/truck.svg"
      alt="Leverans"
    />
  )
}