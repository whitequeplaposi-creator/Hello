'use client'

export default function TestPage() {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Systemdiagnostik</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Stripe Publishable Key:</h2>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {stripeKey ? `${stripeKey.substring(0, 20)}...` : '❌ SAKNAS'}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Node Environment:</h2>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {process.env.NODE_ENV}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Test Status:</h2>
            <p className="text-green-600">✅ Sidan laddas korrekt</p>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← Tillbaka till startsidan</a>
        </div>
      </div>
    </div>
  )
}
