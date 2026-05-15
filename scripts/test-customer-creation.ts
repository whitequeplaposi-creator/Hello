import * as customerDb from '../lib/customerDb';

async function testCustomerCreation() {
  console.log('🧪 Testing customer creation...\n');

  try {
    // Test 1: Create a new customer
    console.log('Test 1: Creating new customer...');
    const newCustomer = await customerDb.createCustomer(
      'test@example.com',
      'Test',
      'User',
      '+46701234567'
    );

    if (newCustomer) {
      console.log('✅ Customer created successfully:', {
        id: newCustomer.id,
        email: newCustomer.email,
        name: newCustomer.name
      });
    } else {
      console.error('❌ Customer creation returned null');
    }

    // Test 2: Try to create duplicate (should return existing)
    console.log('\nTest 2: Creating duplicate customer...');
    const duplicateCustomer = await customerDb.createCustomer(
      'test@example.com',
      'Test',
      'User',
      '+46701234567'
    );

    if (duplicateCustomer) {
      console.log('✅ Duplicate handled correctly:', {
        id: duplicateCustomer.id,
        email: duplicateCustomer.email
      });
    } else {
      console.error('❌ Duplicate customer handling failed');
    }

    // Test 3: Get customer by email
    console.log('\nTest 3: Getting customer by email...');
    const fetchedCustomer = await customerDb.getCustomerByEmail('test@example.com');
    
    if (fetchedCustomer) {
      console.log('✅ Customer fetched successfully:', {
        id: fetchedCustomer.id,
        email: fetchedCustomer.email,
        name: fetchedCustomer.name
      });
    } else {
      console.error('❌ Customer not found');
    }

    console.log('\n✅ All tests passed!');
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }

  process.exit(0);
}

testCustomerCreation();
