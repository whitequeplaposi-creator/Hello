/**
 * Test script för att debugga order creation
 */

import * as customerDb from '../lib/customerDb';

async function testOrderCreation() {
  console.log('🧪 Testing Order Creation\n');

  try {
    // Test 1: Skapa testkund
    console.log('📋 Test 1: Skapa testkund');
    const testEmail = `test_${Date.now()}@example.com`;
    const customer = await customerDb.createCustomer(
      testEmail,
      'Test',
      'Testsson',
      '0701234567'
    );

    if (!customer) {
      console.error('❌ Failed to create customer');
      return;
    }
    console.log('✅ Customer created:', customer.id);
    console.log('   Email:', customer.email);
    console.log('   Name:', customer.name);

    // Test 2: Skapa testorder
    console.log('\n📋 Test 2: Skapa testorder');
    const order = await customerDb.createOrder(
      customer.id,
      {
        email: testEmail,
        firstName: 'Test',
        lastName: 'Testsson',
        phone: '0701234567',
        address: 'Testgatan 123',
        city: 'Stockholm',
        zip: '12345',
        country: 'Sverige'
      },
      {
        totalAmount: 299.99,
        paymentMethod: 'card',
        paymentStatus: 'pending',
        notes: 'Test order',
        items: [
          {
            productId: 'test_product_1',
            productName: 'Test Product 1',
            quantity: 2,
            unitPrice: 99.99
          },
          {
            productId: 'test_product_2',
            productName: 'Test Product 2',
            quantity: 1,
            unitPrice: 100.01
          }
        ]
      }
    );

    if (!order) {
      console.error('❌ Failed to create order');
      return;
    }
    console.log('✅ Order created:', order.id);
    console.log('   Order number:', order.order_number);

    // Test 3: Hämta ordern
    console.log('\n📋 Test 3: Hämta order');
    const fetchedOrder = await customerDb.getOrder(order.id);
    if (!fetchedOrder) {
      console.error('❌ Failed to fetch order');
      return;
    }
    console.log('✅ Order fetched successfully');
    console.log('   Status:', fetchedOrder.status);
    console.log('   Payment status:', fetchedOrder.payment_status);
    console.log('   Total amount:', fetchedOrder.total_amount);

    // Test 4: Hämta order items
    console.log('\n📋 Test 4: Hämta order items');
    const items = await customerDb.getOrderItems(order.id);
    console.log(`✅ Found ${items.length} items`);
    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.productName} x${item.quantity} = ${item.totalPrice} SEK`);
    });

    console.log('\n✅ All tests passed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message || error);
    console.error('Stack:', error.stack);
  }
}

testOrderCreation();
