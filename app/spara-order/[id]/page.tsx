'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TrackingStatus {
  confirmed: number;
  confirmed_date: string | null;
  packing: number;
  packing_date: string | null;
  transport: number;
  transport_date: string | null;
  delivered: number;
  delivered_date: string | null;
}

interface TrackingData {
  id: string;
  order_id: string;
  order_number: string;
  products: string | null;
  created_at: string;
  updated_at: string;
  confirmed: number;
  confirmed_date: string | null;
  packing: number;
  packing_date: string | null;
  transport: number;
  transport_date: string | null;
  delivered: number;
  delivered_date: string | null;
}

interface TrackingStep {
  key: keyof TrackingStatus;
  dateKey: keyof TrackingStatus;
  title: string;
  description: string;
  subtitle: string;
  icon: React.ReactNode;
}

// Professional SVG Icons for each status
const StatusIcons = {
  Confirmed: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Packing: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Transport: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Delivered: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
};

const trackingSteps: TrackingStep[] = [
  {
    key: 'confirmed',
    dateKey: 'confirmed_date',
    title: 'Confirmed',
    description: 'Your order has been received and confirmed',
    subtitle: 'Order registered in our system',
    icon: StatusIcons.Confirmed
  },
  {
    key: 'packing',
    dateKey: 'packing_date',
    title: 'Packing',
    description: 'Your items are being prepared for shipment',
    subtitle: 'Processing at our warehouse',
    icon: StatusIcons.Packing
  },
  {
    key: 'transport',
    dateKey: 'transport_date',
    title: 'Transport',
    description: 'Your package is on its way to you',
    subtitle: 'Shipped with carrier partner',
    icon: StatusIcons.Transport
  },
  {
    key: 'delivered',
    dateKey: 'delivered_date',
    title: 'Delivered',
    description: 'Your package has been delivered',
    subtitle: 'Order completed',
    icon: StatusIcons.Delivered
  }
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('success') === '1';
  const orderId = params.id as string;
  
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<number>(0);

  const getCurrentStepFromTracking = (trackingData: TrackingData) => {
    if (trackingData.delivered) return 4;
    if (trackingData.transport) return 3;
    if (trackingData.packing) return 2;
    if (trackingData.confirmed) return 1;
    return 0;
  };

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;

    const fetchTracking = async (isAutoRefresh = false) => {
      try {
        if (isAutoRefresh) {
          setIsRefreshing(true);
        }

        // Lägg till timestamp för att undvika cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/order-tracking/${orderId}?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await response.json();

        if (!isMounted) return;

        if (data.success && data.tracking) {
          // Kontrollera om det finns en statusändring
          if (tracking && isAutoRefresh) {
            const currentStep = getCurrentStepFromTracking(data.tracking);
            const oldStep = getCurrentStepFromTracking(tracking);
            
            if (currentStep !== oldStep) {
              setHasNewUpdate(true);
              setPreviousStatus(oldStep);
              // Dölj "ny uppdatering" badge efter 5 sekunder
              setTimeout(() => {
                if (isMounted) setHasNewUpdate(false);
              }, 5000);
            }
          } else if (!tracking) {
            // Första gången, sätt initial status
            setPreviousStatus(getCurrentStepFromTracking(data.tracking));
          }

          setTracking(data.tracking);
          setLastUpdated(new Date());
          setError(null);
        } else {
          setError('Ingen tracking-information hittades för denna order');
        }
      } catch (err) {
        console.error('Error fetching tracking:', err);
        if (!tracking && isMounted) {
          setError('Kunde inte hämta tracking-information');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    // Initial fetch
    fetchTracking(false);
    
    // Uppdatera var 10:e sekund för realtids-tracking
    const interval = setInterval(() => {
      if (isMounted) fetchTracking(true);
    }, 10000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const toDateInput = (value: string | number | null | undefined): string | null => {
    if (value == null) return null
    if (typeof value === 'string') return value
    if (typeof value === 'number' && !Number.isNaN(value)) return new Date(value).toISOString()
    return null
  }

  const formatDate = (value: string | number | null | undefined) => {
    const dateString = toDateInput(value)
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return typeof value === 'string' ? value : ''
    }
  }

  const formatTime = (value: string | number | null | undefined) => {
    const dateString = toDateInput(value)
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return ''
    }
  }

  const formatFullDate = (value: string | number | null | undefined) => {
    const dateString = toDateInput(value)
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return typeof value === 'string' ? value : ''
    }
  }

  const getCurrentStep = () => {
    if (!tracking) return 0;
    if (tracking.delivered) return 4;
    if (tracking.transport) return 3;
    if (tracking.packing) return 2;
    if (tracking.confirmed) return 1;
    return 0;
  };

  const getStatusText = () => {
    const step = getCurrentStep();
    if (step === 4) return 'Delivered';
    if (step === 3) return 'Transport';
    if (step === 2) return 'Packing';
    if (step === 1) return 'Confirmed';
    return 'Pending Confirmation';
  };

  const currentStep = getCurrentStep();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-sky-400 mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to find tracking information for this order'}</p>
          <Link 
            href="/mina-sidor/bestallningar"
            className="inline-block bg-sky-400 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-500 transition-colors"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-3">
              {/* Ny uppdatering badge */}
              {hasNewUpdate && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Status uppdaterad!</span>
                </div>
              )}
              
              {/* Live-indikator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-sky-400 animate-pulse' : 'bg-green-500'}`}></div>
                  {!isRefreshing && (
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {isRefreshing ? 'Uppdaterar...' : 'Live-spårning'}
                </span>
              </div>
              
              {/* Senast uppdaterad */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">{lastUpdated.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment success banner */}
        {isNewOrder && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Tack för din beställning!</p>
              <p className="text-sm text-green-700 mt-0.5">
                Betalningen genomfördes. En betalningsbekräftelse har skickats till din e-post av Stripe.
              </p>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Order #{tracking.order_number || orderId.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Placed on {formatFullDate(tracking.created_at)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-50 border border-sky-200">
                <div className="w-2 h-2 bg-sky-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-sky-900">{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Status</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Uppdateras automatiskt var 10:e sekund</span>
                </div>
              </div>
              
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const isCompleted = tracking[step.key] === 1;
                  const date = tracking[step.dateKey];
                  const isCurrent = index + 1 === currentStep && !tracking.delivered;
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <div key={step.key} className="relative">
                      <div className="flex items-start">
                        {/* Icon */}
                        <div className="flex-shrink-0 relative">
                          <div
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                              ${isCompleted 
                                ? 'bg-sky-400 border-sky-400 text-white' 
                                : isCurrent
                                ? 'bg-sky-50 border-sky-400 text-sky-400'
                                : 'bg-white border-gray-300 text-gray-400'
                              }
                            `}
                          >
                            <div className="w-6 h-6">
                              {step.icon}
                            </div>
                          </div>
                          
                          {/* Connecting Line */}
                          {!isLast && (
                            <div
                              className={`
                                absolute left-6 top-12 w-0.5 h-20 -ml-px
                                ${isCompleted ? 'bg-sky-400' : 'bg-gray-300'}
                              `}
                            ></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1 pb-20">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold text-base ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.title}
                              </h3>
                              <p className={`text-sm mt-1 ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                                {step.description}
                              </p>
                              {isCompleted && date && (
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{formatDate(date)} at {formatTime(date)}</span>
                                </div>
                              )}
                              {isCurrent && !isCompleted && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                                    In Progress
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
              
              <div className="space-y-3">
                {trackingSteps.slice().reverse().map((step) => {
                  const isCompleted = tracking[step.key] === 1;
                  const date = tracking[step.dateKey];

                  if (!isCompleted) return null;

                  return (
                    <div
                      key={step.key}
                      className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{step.subtitle}</p>
                          </div>
                          {date && (
                            <div className="text-right ml-4">
                              <p className="text-sm font-medium text-gray-900">{formatDate(date)}</p>
                              <p className="text-xs text-gray-500">{formatTime(date)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Order Number</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    {tracking.order_number || orderId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-mono text-xs text-gray-900 mt-0.5 break-all">
                    {orderId}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    {formatDate(tracking.created_at)}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    {formatDate(tracking.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our customer service if you have questions about your order.
              </p>
              <div className="space-y-2">
                <Link
                  href="/kontakt"
                  className="block w-full text-center bg-sky-400 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-sky-500 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/mina-sidor/bestallningar"
                  className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  My Orders
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">How long does delivery take?</p>
                  <p className="text-gray-600 mt-1">Normally 2-5 business days from when the order is shipped.</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="font-medium text-gray-900">Can I change my order?</p>
                  <p className="text-gray-600 mt-1">Contact customer service as soon as possible if you want to make changes.</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <Link href="/frakt-leverans" className="font-medium text-sky-600 hover:text-sky-700">
                    Learn more about shipping and delivery →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
