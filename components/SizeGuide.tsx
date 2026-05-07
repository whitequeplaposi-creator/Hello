'use client'

import { useState } from 'react'

export default function SizeGuide() {
  const [isOpen, setIsOpen] = useState(false)

  const sizeChart = [
    { size: 'XS', chest: '84-88', waist: '66-70', hips: '90-94' },
    { size: 'S', chest: '88-92', waist: '70-74', hips: '94-98' },
    { size: 'M', chest: '92-96', waist: '74-78', hips: '98-102' },
    { size: 'L', chest: '96-100', waist: '78-82', hips: '102-106' },
    { size: 'XL', chest: '100-104', waist: '82-86', hips: '106-110' },
    { size: 'XXL', chest: '104-108', waist: '86-90', hips: '110-114' }
  ]

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
      >
        Storleksguide
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-3">Storleksguide</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Storlek</th>
                  <th className="text-left py-2">Bröst (cm)</th>
                  <th className="text-left py-2">Midja (cm)</th>
                  <th className="text-left py-2">Höft (cm)</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size} className="border-b">
                    <td className="py-2 font-medium">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.waist}</td>
                    <td className="py-2">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Måtten är i centimeter. För bästa passform, välj den storlek som motsvarar dina mått.
          </p>
        </div>
      )}
    </div>
  )
}
