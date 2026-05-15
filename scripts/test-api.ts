// Test API endpoint locally
async function testOrderAPI() {
  console.log('🧪 Testing Order API...\n');

  const testOrder = {
    customerId: null,
    customerData: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'Testsson',
      phone: '+46701234567',
      address: 'Testgatan 123',
      city: 'Stockholm',
      zip: '123 45',
      country: 'Sverige'
    },
    orderData: {
      total_amount: 299,
      payment_method: 'card',
      notes: 'Testorder - Standard frakt',
      items: [
        {
          product_id: 'test-1',
          product_name: 'Testprodukt',
          quantity: 1,
          unit_price: 299
        }
      ]
    }
  };

  try {
    console.log('📤 Sending request to http://localhost:3000/api/orders');
    console.log('Data:', JSON.stringify(testOrder, null, 2));

    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    console.log('\n📥 Response status:', response.status);
    
    const result = await response.json();
    console.log('Response data:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('\n✅ Order created successfully!');
      console.log('Order ID:', result.orderId);
      console.log('Customer ID:', result.customerId);
    } else {
      console.log('\n❌ Order failed!');
      console.log('Error:', result.error);
      if (result.details) {
        console.log('Details:', result.details);
      }
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error);
  }
}

// Run if server is running on localhost:3000
testOrderAPI();
