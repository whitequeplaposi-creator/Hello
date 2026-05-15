'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  currency: string
  created_at: string
  customer_id: string
  customer_name?: string
  customer_email?: string
  items?: any[]
}

interface Shipment {
  id: string
  order_id: string
  tracking_number: string
  carrier: string
  status: string
  shipped_date?: string
  estimated_delivery_date?: string
  actual_delivery_date?: string
}

interface OrderTracking {
  id: string
  order_id: string
  order_number?: string
  confirmed: number
  confirmed_date?: string
  packing: number
  packing_date?: string
  transport: number
  transport_date?: string
  delivered: number
  delivered_date?: string
  products?: string
}

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [shipments, setShipments] = useState<Record<string, Shipment>>({})
  const [orderTracking, setOrderTracking] = useState<Record<string, OrderTracking>>({})
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingTracking, setEditingTracking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [trackingData, setTrackingData] = useState({
    confirmed: { completed: false, date: '' },
    packing: { completed: false, date: '' },
    transport: { completed: false, date: '' },
    delivered: { completed: false, date: '' }
  })
  const [confirmOrderNumber, setConfirmOrderNumber] = useState('')
  const [confirmingStep, setConfirmingStep] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success && data.orders) {
        setOrders(data.orders)
        
        // Load shipments for each order
        const shipmentPromises = data.orders.map(async (order: Order) => {
          try {
            const shipmentResponse = await fetch(`/api/shipments/order/${order.id}`)
            const shipmentData = await shipmentResponse.json()
            
            if (shipmentData.success && shipmentData.shipment) {
              return { orderId: order.id, shipment: shipmentData.shipment }
            }
          } catch (error) {
            console.error('Error loading shipment for order:', order.id, error)
          }
          return null
        })

        // Load order tracking for each order
        const trackingPromises = data.orders.map(async (order: Order) => {
          try {
            const trackingResponse = await fetch(`/api/order-tracking/${order.id}`)
            const trackingData = await trackingResponse.json()
            
            if (trackingData.success && trackingData.tracking) {
              return { orderId: order.id, tracking: trackingData.tracking }
            }
          } catch (error) {
            console.error('Error loading tracking for order:', order.id, error)
          }
          return null
        })

        const [shipmentResults, trackingResults] = await Promise.all([
          Promise.all(shipmentPromises),
          Promise.all(trackingPromises)
        ])
        
        const shipmentsMap: Record<string, Shipment> = {}
        shipmentResults.forEach(result => {
          if (result) {
            shipmentsMap[result.orderId] = result.shipment
          }
        })
        setShipments(shipmentsMap)

        const trackingMap: Record<string, OrderTracking> = {}
        trackingResults.forEach(result => {
          if (result) {
            trackingMap[result.orderId] = result.tracking
          }
        })
        setOrderTracking(trackingMap)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTracking = (order: Order) => {
    setSelectedOrder(order)
    const tracking = orderTracking[order.id]
    
    // Initialize tracking data from existing record
    const initialData = {
      confirmed: { completed: false, date: '' },
      packing: { completed: false, date: '' },
      transport: { completed: false, date: '' },
      delivered: { completed: false, date: '' }
    }

    if (tracking) {
      initialData.confirmed = { completed: tracking.confirmed === 1, date: tracking.confirmed_date || '' }
      initialData.packing = { completed: tracking.packing === 1, date: tracking.packing_date || '' }
      initialData.transport = { completed: tracking.transport === 1, date: tracking.transport_date || '' }
      initialData.delivered = { completed: tracking.delivered === 1, date: tracking.delivered_date || '' }
    }

    setTrackingData(initialData)
    setConfirmOrderNumber('')
    setConfirmingStep(null)
    setEditingTracking(true)
  }

  const handleStepChange = (step: string, field: string, value: any) => {
    setTrackingData(prev => ({
      ...prev,
      [step]: { ...(prev as any)[step], [field]: value }
    }))
  }

  const handleConfirmStep = (step: string) => {
    if (!selectedOrder) return
    if (confirmOrderNumber !== selectedOrder.order_number) {
      alert('Ordernumret matchar inte. Försök igen.')
      return
    }
    setConfirmingStep(null)
    setConfirmOrderNumber('')
  }

  const handleSaveTracking = async () => {
    if (!selectedOrder) return

    setSaving(true)
    try {
      // Format products as a JSON string for storage
      const productsString = selectedOrder.items 
        ? JSON.stringify(selectedOrder.items.map((item: any) => ({
            name: item.name || item.product_name,
            quantity: item.quantity,
            price: item.price
          })))
        : null

      const response = await fetch(`/api/order-tracking/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trackingData,
          products: productsString,
          order_number: selectedOrder.order_number
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Reload order tracking data
        const trackingResponse = await fetch(`/api/order-tracking/${selectedOrder.id}`)
        const trackingDataResponse = await trackingResponse.json()
        
        if (trackingDataResponse.success) {
          setOrderTracking(prev => ({
            ...prev,
            [selectedOrder.id]: trackingDataResponse.tracking
          }))
        }
        
        setEditingTracking(false)
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('Error updating tracking:', error)
      alert('Kunde inte uppdatera spårning. Försök igen.')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_transit':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled':
      case 'returned':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Väntar',
      processing: 'Behandlas',
      shipped: 'Skickad',
      in_transit: 'På väg',
      out_for_delivery: 'Ute för leverans',
      delivered: 'Levererad',
      cancelled: 'Avbruten',
      returned: 'Returnerad',
    }
    return statusMap[status] || status
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Orderhantering</h1>
              </div>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Tillbaka till startsidan
              </Link>
            </div>
            <p className="text-gray-500">Hantera orderstatus och leveransinformation</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Ordernummer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Kund</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Spårning</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Belopp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Beställd</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Åtgärder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const tracking = orderTracking[order.id]
                    const getTrackingStatus = () => {
                      if (!tracking) return '0/4'
                      const completed = (tracking.confirmed ? 1 : 0) + 
                                       (tracking.packing ? 1 : 0) + 
                                       (tracking.transport ? 1 : 0) + 
                                       (tracking.delivered ? 1 : 0)
                      return `${completed}/4`
                    }
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer_name || '-'}</div>
                          <div className="text-xs text-gray-500">{order.customer_email || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{getTrackingStatus()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.total_amount} {order.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEditTracking(order)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Hantera spårning
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inga beställningar</h3>
                <p className="text-gray-500">Det finns inga beställningar att visa.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Tracking Edit Modal */}
      {editingTracking && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Hantera orderstatus</h2>
              <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.order_number}</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Products Section */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Produkter i beställning</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        )}
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900">{item.name || item.product_name}</p>
                          <p className="text-xs text-gray-500">Antal: {item.quantity} × {item.price} {item.currency || 'USD'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="confirmed"
                    checked={trackingData.confirmed.completed}
                    onChange={(e) => handleStepChange('confirmed', 'completed', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-grow">
                    <label htmlFor="confirmed" className="font-medium text-gray-900">Orderbekräftad</label>
                    <input
                      type="date"
                      value={trackingData.confirmed.date}
                      onChange={(e) => handleStepChange('confirmed', 'date', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="packing"
                    checked={trackingData.packing.completed}
                    onChange={(e) => handleStepChange('packing', 'completed', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-grow">
                    <label htmlFor="packing" className="font-medium text-gray-900">Packning</label>
                    <input
                      type="date"
                      value={trackingData.packing.date}
                      onChange={(e) => handleStepChange('packing', 'date', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {confirmingStep === 'packing' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ange ordernummer"
                        value={confirmOrderNumber}
                        onChange={(e) => setConfirmOrderNumber(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                      />
                      <button
                        onClick={() => handleConfirmStep('packing')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setConfirmingStep(null)
                          setConfirmOrderNumber('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  )}
                  {!confirmingStep && (
                    <button
                      onClick={() => setConfirmingStep('packing')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Bekräfta
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="transport"
                    checked={trackingData.transport.completed}
                    onChange={(e) => handleStepChange('transport', 'completed', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-grow">
                    <label htmlFor="transport" className="font-medium text-gray-900">Transport</label>
                    <input
                      type="date"
                      value={trackingData.transport.date}
                      onChange={(e) => handleStepChange('transport', 'date', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {confirmingStep === 'transport' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ange ordernummer"
                        value={confirmOrderNumber}
                        onChange={(e) => setConfirmOrderNumber(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                      />
                      <button
                        onClick={() => handleConfirmStep('transport')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setConfirmingStep(null)
                          setConfirmOrderNumber('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  )}
                  {!confirmingStep && (
                    <button
                      onClick={() => setConfirmingStep('transport')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Bekräfta
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="delivered"
                    checked={trackingData.delivered.completed}
                    onChange={(e) => handleStepChange('delivered', 'completed', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-grow">
                    <label htmlFor="delivered" className="font-medium text-gray-900">Levererad</label>
                    <input
                      type="date"
                      value={trackingData.delivered.date}
                      onChange={(e) => handleStepChange('delivered', 'date', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {confirmingStep === 'delivered' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ange ordernummer"
                        value={confirmOrderNumber}
                        onChange={(e) => setConfirmOrderNumber(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                      />
                      <button
                        onClick={() => handleConfirmStep('delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setConfirmingStep(null)
                          setConfirmOrderNumber('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  )}
                  {!confirmingStep && (
                    <button
                      onClick={() => setConfirmingStep('delivered')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Bekräfta
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setEditingTracking(false)
                  setSelectedOrder(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveTracking}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sparar...' : 'Spara'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
