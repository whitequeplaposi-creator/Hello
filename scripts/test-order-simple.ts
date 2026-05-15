import * as customerDb from '../lib/customerDb';

async function testSimpleOrder() {
  console.log('🧪 Testar enkelt orderflöde...\n');

  try {
    // 1. Skapa kund
    console.log('1️⃣ Skapar kund...');
    const customer = await customerDb.createCustomer(
      'test@example.com',
      'Test',
      'Testsson',
      '+46701234567'
    );

    if (!customer) {
      throw new Error('Kunde inte skapa kund');
    }
    const customerId = customer.id;
    console.log(`   ✅ Kund skapad: ${customerId}\n`);

    // 2. Lägg till adress
    console.log('2️⃣ Lägger till adress...');
    const address = await customerDb.addCustomerAddress(customerId, {
      type: 'shipping',
      name: 'Test Testsson',
      address: 'Testgatan 123',
      zip: '123 45',
      city: 'Stockholm',
      country: 'Sverige'
    });

    if (!address) {
      throw new Error('Kunde inte lägga till adress');
    }
    console.log(`   ✅ Adress tillagd: ${address.id}\n`);

    // 3. Skapa order
    console.log('3️⃣ Skapar order...');
    const order = await customerDb.createOrder(
      customerId,
      {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'Testsson',
        address: 'Testgatan 123',
        city: 'Stockholm',
        zip: '123 45',
        country: 'Sverige'
      },
      {
        totalAmount: 299,
        paymentMethod: 'card',
        notes: 'Testorder',
        items: [
          {
            productId: 'test-1',
            productName: 'Testprodukt',
            quantity: 1,
            unitPrice: 299
          }
        ]
      }
    );

    if (!order) {
      throw new Error('Kunde inte skapa order');
    }
    console.log(`   ✅ Order skapad: ${order.id}\n`);

    console.log('✅ Test lyckades!');

  } catch (error) {
    console.error('❌ Test misslyckades:', error);
    process.exit(1);
  }
}

testSimpleOrder();
