export default function VisaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img
      className={className}
      src="/visa.svg"
      alt="Visa"
    />
  )
}