export default function ShoppingCartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img
      className={className}
      src="/shopping-cart.svg"
      alt="Kundvagn"
    />
  )
}