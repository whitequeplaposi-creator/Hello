export default function KlarnaBlueIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        className="w-full h-full"
        src="/klarna-logo-svgrepo-com.svg"
        alt="Klarna Blue"
      />
      <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full"></div>
    </div>
  )
}