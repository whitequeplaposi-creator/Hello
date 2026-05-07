export default function ProductPageCartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img
      className={className}
      src="/shopping-cart-simple-thin.svg"
      alt="Kundvagn"
    />
  )
}
