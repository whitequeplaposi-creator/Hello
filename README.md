# Hello - E-commerce Application

A modern e-commerce application built with Next.js, featuring a comprehensive product catalog, shopping cart, user authentication, and order management system.

## Features

- 🛍️ Product catalog with categories and search functionality
- 🛒 Shopping cart with persistent storage
- 👤 User authentication and account management
- 📦 Order tracking and management
- 💳 Payment integration with Stripe
- 🌐 Multi-language support (Swedish)
- 📱 Responsive design
- 🍪 Cookie consent management
- ⭐ Product reviews and recommendations
- 📊 Analytics and user behavior tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Neon
- **Payment**: Stripe
- **Authentication**: Custom implementation
- **State Management**: React Context API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/whitequeplaposi-creator/Hello.git
cd Hello
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your configuration (see `.env.local` for required variables)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions, database connections, and business logic
- `/scripts` - Database migration and utility scripts
- `/docs` - Project documentation
- `/public` - Static assets

## Key Components

- **Product Management**: Dynamic product catalog with categories
- **Order System**: Complete order lifecycle management
- **User Accounts**: Customer profiles and order history
- **Payment Processing**: Secure payment handling with Stripe
- **Admin Panel**: Order management and tracking
- **Analytics**: User behavior and product interaction tracking

## API Routes

- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/customers` - Customer management
- `/api/categories` - Category management
- `/api/search` - Product search functionality
- `/api/payments` - Payment processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.