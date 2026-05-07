export default function KlarnaWhiteIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        className="w-full h-full filter brightness-0 invert"
        src="/klarna-logo-svgrepo-com.svg"
        alt="Klarna White"
      />
      <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
    </div>
  )
}