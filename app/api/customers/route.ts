import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, getCustomerByEmail, getAllCustomers } from '@/lib/customerDb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name, firstName, lastName, phone } = body;

    // Support both {name} and {firstName, lastName} formats
    const fName = firstName || (name ? name.split(' ')[0] : '');
    const lName = lastName || (name ? name.split(' ').slice(1).join(' ') : '');

    if (!email || !fName) {
      return NextResponse.json(
        { error: 'Email och namn krävs' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await getCustomerByEmail(email);
    if (existingCustomer) {
      return NextResponse.json({
        success: true,
        customer: existingCustomer,
        message: 'Kund finns redan'
      });
    }

    // Create new customer (pass id if provided from registration)
    const customer = await createCustomer(email, fName, lName || fName, phone, id);

    if (!customer) {
      return NextResponse.json(
        { error: 'Kunde inte skapa kund' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    // Om email parameter finns, hämta specifik kund
    if (email) {
      const customer = await getCustomerByEmail(email);
      
      // Return 200 with customer: null instead of 404 to avoid noisy browser console errors.
      // Callers check data.success && data.customer to determine if the customer exists.
      return NextResponse.json({
        success: !!customer,
        customer: customer ?? null
      });
    }
    
    // Annars hämta alla kunder
    const customers = await getAllCustomers();
    return NextResponse.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
