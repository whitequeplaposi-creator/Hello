import { createCustomer, addCustomerAddress, createOrder } from '../lib/customerDb';
import { getCustomerShipments } from '../lib/logisticsDb';

async function testOrderFlow() {
  console.log('🧪 Testar orderflöde...\n');

  try {
    // 1. Skapa testkund
    console.log('1️⃣ Skapar testkund...');
    const customer = await createCustomer(
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
    console.log('2️⃣ Lägger till leveransadress...');
    const address = await addCustomerAddress(customerId, {
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

    // 3. Skapa testorder
    console.log('3️⃣ Skapar testorder...');
    const order = await createOrder(
      customerId,
      {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'Testsson',
        phone: '+46701234567',
        address: 'Testgatan 123',
        city: 'Stockholm',
        zip: '123 45',
        country: 'Sverige'
      },
      {
        totalAmount: 299.99,
        paymentMethod: 'card',
        notes: 'Testorder - Standard frakt',
        items: [
          {
            productId: 'test-prod-1',
            productName: 'Testprodukt 1',
            quantity: 2,
            unitPrice: 99.99,
            size: 'M',
            color: 'Blå'
          },
          {
            productId: 'test-prod-2',
            productName: 'Testprodukt 2',
            quantity: 1,
            unitPrice: 100.01
          }
        ]
      }
    );

    if (!order) {
      throw new Error('Kunde inte skapa order');
    }
    console.log(`   ✅ Order skapad: ${order.id}\n`);

    // 4. Kontrollera leveranser
    console.log('4️⃣ Kontrollerar leveranser...');
    const shipments = await getCustomerShipments(customerId);
    
    if (shipments.length === 0) {
      console.log('   ⚠️  Inga leveranser hittades (måste skapas manuellt via API)\n');
    } else {
      console.log(`   ✅ ${shipments.length} leverans(er) hittad(e):`);
      shipments.forEach(shipment => {
        console.log(`      - ${shipment.tracking_number} (${shipment.carrier})`);
        console.log(`        Status: ${shipment.status}`);
        console.log(`        Händelser: ${shipment.events?.length || 0}`);
      });
      console.log();
    }

    console.log('✅ Orderflöde testat framgångsrikt!\n');
    console.log('📊 Sammanfattning:');
    console.log(`   - Kund-ID: ${customerId}`);
    console.log(`   - Order-ID: ${order.id}`);
    console.log(`   - Adress-ID: ${address.id}`);
    console.log(`   - Leveranser: ${shipments.length}`);

  } catch (error) {
    console.error('❌ Fel vid test:', error);
    process.exit(1);
  }
}

testOrderFlow();
