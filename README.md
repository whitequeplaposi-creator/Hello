# Hello - E-commerce Application

A modern e-commerce application built with Next.js, featuring a comprehensive product catalog, shopping cart, user authentication, and order management system.

## Features

- 🛍️ Product catalog with categories and search functionality
- 🔍 **Optimized search** with API-based queries, caching, and debouncing
- 🛒 Shopping cart with persistent storage
- 👤 User authentication and account management
- 📦 Order tracking and management
- 💳 Payment integration with Stripe
- 🌐 Multi-language support (Swedish)
- 📱 Responsive design
- 🍪 Cookie consent management
- ⭐ Product reviews and recommendations
- 📊 Analytics and user behavior tracking
- ⚡ **High-performance search** with <500ms response time

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
- `/api/products/search` - **Optimized product search** with caching
- `/api/orders` - Order processing
- `/api/customers` - Customer management
- `/api/categories` - Category management
- `/api/search/popular` - Popular search queries
- `/api/payments` - Payment processing

## Performance Optimizations

### Search Performance
The application features a highly optimized search system:

- **API-based search**: Server-side processing for faster results
- **Debouncing**: 150ms delay for search suggestions to reduce unnecessary requests
- **Caching**: Both client-side (20 queries) and server-side (50 queries) caching
- **Response time**: <500ms for most searches, <50ms for cached results
- **Smart suggestions**: Category-based and popular search suggestions

See [Search Performance Documentation](./docs/SEARCH_PERFORMANCE_OPTIMIZATION.md) for details.

### Testing Search Performance
Run the search performance test:
```bash
npm run dev  # Start the development server first
npx tsx scripts/test-search-performance.ts
```

## Documentation

- [Search Performance Optimization](./docs/SEARCH_PERFORMANCE_OPTIMIZATION.md)
- [Search Functionality](./docs/SEARCH_FUNCTIONALITY.md)
- [Category System](./docs/CATEGORY_SYSTEM_OVERVIEW.md)
- [Order Tracking System](./docs/ORDER_TRACKING_SYSTEM.md)
- [Translation System](./docs/TRANSLATION_SYSTEM.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.