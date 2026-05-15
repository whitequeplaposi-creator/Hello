import * as customerDb from '../lib/customerDb';

async function testOrderCreation() {
  console.log('🧪 Testing order creation...\n');

  try {
    // Test data
    const customerData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '070-123 45 67',
      address: 'Test Street 123',
      city: 'Stockholm',
      zip: '123 45',
      country: 'Sverige'
    };

    const orderData = {
      totalAmount: 100,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      items: [
        {
          productId: 'test_product_1',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: 100
        }
      ]
    };

    // Try to find or create customer
    console.log('1️⃣ Finding or creating customer...');
    let customer = await customerDb.getCustomerByEmail(customerData.email);
    
    if (!customer) {
      console.log('   Creating new customer...');
      customer = await customerDb.createCustomer(
        customerData.email,
        customerData.firstName,
        customerData.lastName,
        customerData.phone
      );
    }

    if (!customer) {
      console.error('❌ Failed to create customer');
      return;
    }

    console.log('✅ Customer:', customer.id);

    // Try to create order
    console.log('\n2️⃣ Creating order...');
    const order = await customerDb.createOrder(
      customer.id,
      customerData,
      orderData
    );

    if (!order) {
      console.error('❌ Failed to create order');
      return;
    }

    console.log('✅ Order created:', order.id, order.order_number);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }

  process.exit(0);
}

testOrderCreation();
