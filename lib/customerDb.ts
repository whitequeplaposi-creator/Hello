import client from './db';

// Types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  type: 'shipping' | 'billing';
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'confirmed' | 'packing' | 'transport' | 'delivered';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  color?: string;
  createdAt: Date;
}

// Customer functions
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const result = await client.execute('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: row.id?.toString() || '',
      email: row.email?.toString() || '',
      name: row.name?.toString() || '',
      phone: row.phone?.toString(),
      totalOrders: parseInt(row.total_orders?.toString() || '0'),
      totalSpent: parseFloat(row.total_spent?.toString() || '0'),
      lastOrderDate: row.last_order_date ? new Date(row.last_order_date.toString()) : undefined,
      createdAt: new Date(row.created_at?.toString() || ''),
      updatedAt: new Date(row.updated_at?.toString() || '')
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM customers WHERE id = ?',
      args: [customerId]
    });
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id?.toString() || '',
      email: row.email?.toString() || '',
      name: row.name?.toString() || '',
      phone: row.phone?.toString(),
      totalOrders: parseInt(row.total_orders?.toString() || '0'),
      totalSpent: parseFloat(row.total_spent?.toString() || '0'),
      lastOrderDate: row.last_order_date ? new Date(row.last_order_date.toString()) : undefined,
      createdAt: new Date(row.created_at?.toString() || ''),
      updatedAt: new Date(row.updated_at?.toString() || '')
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM customers WHERE email = ?',
      args: [email]
    });
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id?.toString() || '',
      email: row.email?.toString() || '',
      name: row.name?.toString() || '',
      phone: row.phone?.toString(),
      totalOrders: parseInt(row.total_orders?.toString() || '0'),
      totalSpent: parseFloat(row.total_spent?.toString() || '0'),
      lastOrderDate: row.last_order_date ? new Date(row.last_order_date.toString()) : undefined,
      createdAt: new Date(row.created_at?.toString() || ''),
      updatedAt: new Date(row.updated_at?.toString() || '')
    };
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    return null;
  }
}

export async function createCustomer(
  email: string, 
  firstName: string, 
  lastName: string, 
  phone?: string,
  existingId?: string
): Promise<Customer | null> {
  // Validate customer input data
  if (!email || !email.trim()) {
    throw new Error('E-post krävs för att skapa kund');
  }
  
  if (!firstName || !firstName.trim()) {
    throw new Error('Förnamn krävs för att skapa kund');
  }

  // Kontrollera om kunden redan finns
  const existing = await getCustomerByEmail(email);
  if (existing) {
    console.log('✅ Customer already exists:', existing.id);
    return existing;
  }

  // Generate a safe ID — never reuse a numeric-only frontend ID as the DB key
  const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const fullName = `${firstName.trim()} ${(lastName || '').trim()}`.trim();

  if (!fullName) {
    throw new Error('Fullständigt namn kan inte vara tomt');
  }

  console.log('👤 Creating customer:', { id, email, fullName });

  try {
    await client.execute({
      sql: `
        INSERT INTO customers (id, email, name, phone, total_orders, total_spent, created_at, updated_at)
        VALUES (?, ?, ?, ?, 0, 0, ?, ?)
      `,
      args: [id, email, fullName, phone || null, now.toISOString(), now.toISOString()]
    });
  } catch (error: any) {
    console.error('❌ Error inserting customer:', error.message || error);
    // Om det är ett UNIQUE constraint fel på email, hämta befintlig kund
    if (error.message?.includes('UNIQUE') || error.message?.includes('unique')) {
      console.log('⚠️ Duplicate email detected, fetching existing customer');
      return await getCustomerByEmail(email);
    }
    // Re-throw so the caller gets the real error message
    throw error;
  }

  const created = await getCustomer(id);
  if (created) {
    console.log('✅ Customer created successfully:', created.id);
  }
  return created;
}

export async function updateCustomer(customerId: string, updates: Partial<Customer>): Promise<boolean> {
  try {
    const fields = [];
    const values: any[] = [];
    
    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.totalOrders !== undefined) {
      fields.push('total_orders = ?');
      values.push(updates.totalOrders);
    }
    if (updates.totalSpent !== undefined) {
      fields.push('total_spent = ?');
      values.push(updates.totalSpent);
    }
    if (updates.lastOrderDate) {
      fields.push('last_order_date = ?');
      values.push(updates.lastOrderDate.toISOString());
    }
    
    if (fields.length === 0) return true;
    
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(customerId);
    
    await client.execute({
      sql: `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
      args: values
    });
    
    return true;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
}

// Address functions
export async function getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      args: [customerId]
    });
    
    return result.rows.map(row => ({
      id: row.id?.toString() || '',
      customerId: row.customer_id?.toString() || '',
      type: row.address_type?.toString() as 'shipping' | 'billing',
      name: row.name?.toString() || '',
      address: row.street?.toString() || '',
      city: row.city?.toString() || '',
      zip: row.postal_code?.toString() || '',
      country: row.country?.toString() || '',
      isDefault: Boolean(row.is_default)
    }));
  } catch (error) {
    console.error('Error fetching customer addresses:', error);
    return [];
  }
}

export async function addCustomerAddress(
  customerId: string,
  addressData: Omit<CustomerAddress, 'id' | 'customerId' | 'isDefault'>
): Promise<CustomerAddress | null> {
  try {
    const id = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await client.execute({
      sql: `
        INSERT INTO customer_addresses (id, customer_id, address_type, name, street, postal_code, city, country, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        customerId,
        addressData.type,
        addressData.name,
        addressData.address,
        addressData.zip,
        addressData.city,
        addressData.country,
        0
      ]
    });
    
    return {
      id,
      customerId,
      type: addressData.type,
      name: addressData.name,
      address: addressData.address,
      city: addressData.city,
      zip: addressData.zip,
      country: addressData.country,
      isDefault: false
    };
  } catch (error) {
    console.error('Error adding customer address:', error);
    return null;
  }
}

// Order functions
export async function getCustomerOrders(customerId: string): Promise<any[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      args: [customerId]
    });
    
    const orders = [];
    for (const row of result.rows) {
      const orderId = row.id?.toString() || '';
      
      // Fetch items for each order
      const itemsResult = await client.execute({
        sql: 'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
        args: [orderId]
      });

      const items = [];
      for (const itemRow of itemsResult.rows) {
        const productId = itemRow.product_id?.toString() || '';
        let image = undefined;
        try {
          const productResult = await client.execute({
            sql: 'SELECT Image FROM Eprolo WHERE id = ?',
            args: [productId]
          });
          if (productResult.rows.length > 0 && productResult.rows[0].Image) {
            const imageUrls = productResult.rows[0].Image.toString().split(', ');
            const filtered = imageUrls.filter((url: string) => url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg'));
            image = filtered.length > 0 ? filtered[0] : imageUrls[0];
          }
        } catch (e) {
          console.error('Error fetching product image', e);
        }

        items.push({
          id: itemRow.id?.toString() || '',
          order_id: itemRow.order_id?.toString() || '',
          product_id: productId,
          product_name: itemRow.product_name?.toString() || '',
          quantity: parseInt(itemRow.quantity?.toString() || '0'),
          unit_price: parseFloat(itemRow.unit_price?.toString() || '0'),
          total_price: parseFloat(itemRow.total_price?.toString() || '0'),
          size: itemRow.size?.toString(),
          color: itemRow.color?.toString(),
          image: image,
          created_at: itemRow.created_at?.toString() || ''
        });
      }

      orders.push({
        id: orderId,
        customer_id: row.customer_id?.toString() || '',
        order_number: row.order_number?.toString() || '',
        status: row.status?.toString() || 'confirmed',
        total_amount: parseFloat(row.total_amount?.toString() || '0'),
        currency: row.currency?.toString() || 'SEK',
        payment_method: row.payment_method?.toString() || '',
        payment_status: row.payment_status?.toString() || 'pending',
        notes: row.notes?.toString(),
        created_at: row.created_at?.toString() || '',
        updated_at: row.updated_at?.toString() || '',
        items
      });
    }
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}

export async function createOrder(
  customerId: string,
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  },
  orderData: {
    totalAmount: number;
    paymentMethod: string;
    notes?: string;
    paymentIntentId?: string;
    paymentStatus?: string; // Lägg till paymentStatus parameter
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      size?: string;
      color?: string;
    }>;
  }
): Promise<any | null> {
  try {
    // Validera input
    if (!customerId || !customerId.trim()) {
      console.error('❌ Customer ID is required for order creation');
      return null;
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      console.error('❌ Order must have at least one item');
      return null;
    }
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const now = new Date();
    
    // Använd paymentStatus från orderData, eller 'paid' som standard
    const paymentStatus = orderData.paymentStatus || 'paid';
    
    // Tillåtna värden i orders-tabellens CHECK constraint:
    // 'confirmed', 'packing', 'transport', 'delivered'
    const orderStatus = 'confirmed';
    
    console.log('📦 Creating order:', { orderId, orderNumber, status: orderStatus, paymentStatus });
    
    // Create order using correct snake_case column names
    // Note: payment_intent_id column does not exist in the schema, so it is stored in notes if provided
    await client.execute({
      sql: `
        INSERT INTO orders (
          id, customer_id, order_number, status, total_amount, currency,
          payment_method, payment_status, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'SEK', ?, ?, ?, ?, ?)
      `,
      args: [
        orderId,
        customerId,
        orderNumber,
        orderStatus,
        orderData.totalAmount,
        orderData.paymentMethod,
        paymentStatus,
        orderData.notes || (orderData.paymentIntentId ? `payment_intent:${orderData.paymentIntentId}` : null),
        now.toISOString(),
        now.toISOString()
      ]
    });
    
    // Create order items using correct snake_case column names
    console.log(`📦 Creating ${orderData.items.length} order items...`);
    for (const item of orderData.items) {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const totalPrice = item.unitPrice * item.quantity;
      
      console.log('  - Item:', { 
        productId: item.productId, 
        name: item.productName.substring(0, 30), 
        quantity: item.quantity 
      });
      
      await client.execute({
        sql: `
          INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, total_price, size, color, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          itemId,
          orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice,
          totalPrice,
          item.size || null,
          item.color || null,
          now.toISOString()
        ]
      });
    }
    
    console.log('✅ Order items created');
    
    // Update customer statistics
    const customer = await getCustomer(customerId);
    if (customer) {
      await updateCustomer(customerId, {
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + orderData.totalAmount,
        lastOrderDate: now
      });
      console.log('✅ Customer statistics updated');
    }
    
    console.log('✅ Order created successfully:', orderNumber);
    return { id: orderId, order_number: orderNumber };
  } catch (error: any) {
    console.error('❌ Error creating order:', error.message || error);
    // Logga mer detaljer om felet
    if (error.message) {
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
    }
    // Logga input data för debugging
    console.error('Order creation failed with input:', {
      customerId,
      customerData: {
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName
      },
      orderData: {
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        itemsCount: orderData.items?.length,
        paymentStatus: orderData.paymentStatus
      }
    });
    // Re-throw so the caller gets the real error message
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<any | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [orderId]
    });
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id?.toString() || '',
      customer_id: row.customer_id?.toString() || '',
      order_number: row.order_number?.toString() || '',
      status: row.status?.toString() || 'confirmed',
      total_amount: parseFloat(row.total_amount?.toString() || '0'),
      currency: row.currency?.toString() || 'SEK',
      payment_method: row.payment_method?.toString() || '',
      payment_status: row.payment_status?.toString() || 'pending',
      notes: row.notes?.toString(),
      created_at: row.created_at?.toString() || '',
      updated_at: row.updated_at?.toString() || ''
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
      args: [orderId]
    });
    
    const items = [];
    for (const row of result.rows) {
      const productId = row.product_id?.toString() || '';
      let image = undefined;
      try {
        const productResult = await client.execute({
          sql: 'SELECT Image FROM Eprolo WHERE id = ?',
          args: [productId]
        });
        if (productResult.rows.length > 0 && productResult.rows[0].Image) {
          const imageUrls = productResult.rows[0].Image.toString().split(', ');
          const filtered = imageUrls.filter((url: string) => url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg'));
          image = filtered.length > 0 ? filtered[0] : imageUrls[0];
        }
      } catch (e) {
        console.error('Error fetching product image', e);
      }

      items.push({
        id: row.id?.toString() || '',
        orderId: row.order_id?.toString() || '',
        productId: productId,
        productName: row.product_name?.toString() || '',
        quantity: parseInt(row.quantity?.toString() || '0'),
        unitPrice: parseFloat(row.unit_price?.toString() || '0'),
        totalPrice: parseFloat(row.total_price?.toString() || '0'),
        size: row.size?.toString(),
        color: row.color?.toString(),
        image: image,
        createdAt: new Date(row.created_at?.toString() || '')
      });
    }
    return items;
  } catch (error) {
    console.error('Error fetching order items:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
): Promise<boolean> {
  try {
    const fields = ['status = ?', 'updated_at = ?'];
    const values: any[] = [status, new Date().toISOString()];
    
    if (paymentStatus) {
      fields.push('payment_status = ?');
      values.push(paymentStatus);
    }
    
    values.push(orderId);
    
    await client.execute({
      sql: `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      args: values
    });
    
    // Automatisk synkronisering till order_tracking
    await syncOrderToTracking(orderId, status);
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

/**
 * Synkroniserar orders.status till order_tracking automatiskt
 */
async function syncOrderToTracking(orderId: string, status: string): Promise<void> {
  const STATUS_MAPPINGS: Record<string, { confirmed: number; packing: number; transport: number; delivered: number }> = {
    'processing': { confirmed: 1, packing: 0, transport: 0, delivered: 0 },
    'pending':    { confirmed: 0, packing: 0, transport: 0, delivered: 0 },
    'shipped':    { confirmed: 1, packing: 1, transport: 1, delivered: 0 },
    'delivered':  { confirmed: 1, packing: 1, transport: 1, delivered: 1 },
    'cancelled':  { confirmed: 0, packing: 0, transport: 0, delivered: 0 },
    // Legacy aliases kept for backwards compatibility
    'confirmed':  { confirmed: 1, packing: 0, transport: 0, delivered: 0 },
    'packing':    { confirmed: 1, packing: 1, transport: 0, delivered: 0 },
    'transport':  { confirmed: 1, packing: 1, transport: 1, delivered: 0 },
  };

  try {
    // Hämta order_number
    const orderResult = await client.execute({
      sql: 'SELECT order_number FROM orders WHERE id = ?',
      args: [orderId]
    });

    if (orderResult.rows.length === 0) return;

    const orderNumber = orderResult.rows[0].order_number as string;
    const mapping = STATUS_MAPPINGS[status] || STATUS_MAPPINGS['confirmed']; // Använd 'confirmed' som fallback
    const now = new Date().toISOString();

    // Kontrollera om tracking finns
    const existingTracking = await client.execute({
      sql: 'SELECT id FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (existingTracking.rows.length > 0) {
      // Hämta befintliga datum
      const existing = existingTracking.rows[0];
      const existingData = await client.execute({
        sql: 'SELECT confirmed_date, packing_date, transport_date, delivered_date FROM order_tracking WHERE order_id = ?',
        args: [orderId]
      });
      
      const existingDates = existingData.rows[0];
      
      // Uppdatera befintlig tracking - behåll befintliga datum
      await client.execute({
        sql: `
          UPDATE order_tracking 
          SET 
            confirmed = ?,
            confirmed_date = ?,
            packing = ?,
            packing_date = ?,
            transport = ?,
            transport_date = ?,
            delivered = ?,
            delivered_date = ?,
            updated_at = ?
          WHERE order_id = ?
        `,
        args: [
          mapping.confirmed,
          mapping.confirmed === 1 && !existingDates.confirmed_date ? now : existingDates.confirmed_date,
          mapping.packing,
          mapping.packing === 1 && !existingDates.packing_date ? now : existingDates.packing_date,
          mapping.transport,
          mapping.transport === 1 && !existingDates.transport_date ? now : existingDates.transport_date,
          mapping.delivered,
          mapping.delivered === 1 && !existingDates.delivered_date ? now : existingDates.delivered_date,
          now,
          orderId
        ]
      });
    } else {
      // Skapa ny tracking
      const trackingId = `track_${orderId}_${Date.now()}`;
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, transport, transport_date, delivered, delivered_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          orderId,
          orderNumber,
          mapping.confirmed,
          mapping.confirmed === 1 ? now : null,
          mapping.packing,
          mapping.packing === 1 ? now : null,
          mapping.transport,
          mapping.transport === 1 ? now : null,
          mapping.delivered,
          mapping.delivered === 1 ? now : null,
          now,
          now
        ]
      });
    }
  } catch (error) {
    console.error('Error syncing order to tracking:', error);
    // Inte kritiskt, så vi kastar inte fel
  }
}

// Payment methods
export async function getCustomerPaymentMethods(customerId: string): Promise<any[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM customer_payment_methods WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      args: [customerId]
    });
    
    return result.rows.map(row => ({
      id: row.id?.toString() || '',
      customerId: row.customer_id?.toString() || '',
      type: row.payment_type?.toString() || '',
      last4: row.card_last_four?.toString(),
      brand: row.card_brand?.toString(),
      expiry: row.card_expiry?.toString(),
      isDefault: Boolean(row.is_default),
      createdAt: new Date(row.created_at?.toString() || '')
    }));
  } catch (error) {
    console.error('Error fetching customer payment methods:', error);
    return [];
  }
}