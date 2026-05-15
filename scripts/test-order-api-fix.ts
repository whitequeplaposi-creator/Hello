// Test the order API fix by simulating the exact request from the frontend

async function testOrderAPI() {
  try {
    console.log('🧪 Testing order API with frontend data...');
    
    const requestBody = {
      customerId: "1776888910825", // This ID doesn't exist in DB
      customerData: {
        email: "paradoxapiko@gmail.com",
        firstName: "Paradoxa",
        lastName: "Piko",
        phone: "0735624552",
        address: "strogatan 1",
        city: "stockholm",
        zip: "2345",
        country: "Sverige"
      },
      orderData: {
        totalAmount: 84.56,
        paymentMethod: "card",
        items: [{
          productId: "31003079023",
          productName: "Elastic slim fit drawstring hooded zipper top -",
          quantity: 1,
          unitPrice: 45.56
        }],
        createBeforePayment: true
      }
    };
    
    console.log('📤 Sending request to http://localhost:3000/api/orders');
    
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', data.orderId);
      console.log('   Order Number:', data.orderNumber);
      console.log('   Customer ID:', data.customerId);
    } else {
      console.error('❌ Order creation failed:', data.error);
      if (data.details) {
        console.error('   Details:', data.details);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrderAPI();
