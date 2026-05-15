import client from '../lib/db';
import * as customerDb from '../lib/customerDb';

async function testOrderCreation() {
  try {
    console.log('🧪 Testing order creation...');
    
    const testCustomerData = {
      email: 'paradoxapiko@gmail.com',
      firstName: 'Paradoxa',
      lastName: 'Piko',
      phone: '0735624552',
      address: 'strogatan 1',
      city: 'stockholm',
      zip: '2345',
      country: 'Sverige'
    };
    
    const testOrderData = {
      totalAmount: 84.56,
      paymentMethod: 'card',
      items: [{
        productId: '31003079023',
        productName: 'Elastic slim fit drawstring hooded zipper top -',
        quantity: 1,
        unitPrice: 45.56
      }],
      createBeforePayment: true,
      paymentStatus: 'pending'
    };
    
    // Check if customer exists
    let customer = await customerDb.getCustomerByEmail(testCustomerData.email);
    let customerId: string;
    
    if (customer) {
      console.log('✅ Customer exists:', customer.id);
      customerId = customer.id;
    } else {
      console.log('👤 Creating customer...');
      const newCustomer = await customerDb.createCustomer(
        testCustomerData.email,
        testCustomerData.firstName,
        testCustomerData.lastName,
        testCustomerData.phone
      );
      
      if (!newCustomer) {
        console.error('❌ Failed to create customer');
        return;
      }
      
      customerId = newCustomer.id;
      console.log('✅ Customer created:', customerId);
    }
    
    // Verify customer exists in DB
    const verifyCustomer = await customerDb.getCustomer(customerId);
    if (!verifyCustomer) {
      console.error('❌ Customer not found in DB after creation');
      return;
    }
    console.log('✅ Customer verified in DB');
    
    // Create order
    console.log('📦 Creating order...');
    const order = await customerDb.createOrder(
      customerId,
      testCustomerData,
      testOrderData
    );
    
    if (!order) {
      console.error('❌ Order creation failed');
      return;
    }
    
    console.log('✅ Order created successfully:', order);
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testOrderCreation();
