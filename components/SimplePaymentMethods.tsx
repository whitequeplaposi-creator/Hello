'use client'

import paymentMethods from '@/betlaningsmetod'

export default function SimplePaymentMethods() {
  return (
    <div className="flex gap-1">
      {paymentMethods.map((method) => (
        <img 
          key={method.name}
          src={method.icon} 
          alt={method.name} 
          className="w-6 h-4"
          title={method.name}
        />
      ))}
    </div>
  )
}