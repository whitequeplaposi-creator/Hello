'use client'

import paymentMethods from '@/betlaningsmetod'
import dynamic from 'next/dynamic'

// Dynamically import icon components
const iconComponents: Record<string, React.ComponentType<any>> = {
  MastercardIcon: dynamic(() => import('./MastercardIcon')),
  VisaIcon: dynamic(() => import('./VisaIcon')),
  PaypalIcon: dynamic(() => import('./PaypalIcon')),
}

export default function PaymentMethods({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {paymentMethods.map((method) => {
        const IconComponent = iconComponents[method.component]
        if (!IconComponent) return null
        
        return (
          <div key={method.name} className="relative group" title={method.name}>
            <IconComponent className={className} />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {method.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}