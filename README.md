# Restaurant POS System - Frontend

A modern React frontend for the multi-tenant Restaurant Point of Sale System.

## Features

- ✅ **Authentication System**
  - User login/logout
  - Restaurant registration with tenant creation
  - JWT token management
  - Protected routes

- ✅ **Dashboard**
  - Overview of restaurant statistics
  - Quick actions and recent activity
  - Multi-tenant data isolation

- ✅ **User Management**
  - View all users in the restaurant
  - Search and filter users
  - Delete users (with confirmation)
  - Role-based access (admin/staff)

- ✅ **Restaurant Management**
  - View and edit restaurant information
  - Update restaurant name and subdomain
  - View account status and creation date

- ✅ **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful icons with Lucide React
  - Toast notifications
  - Loading states and error handling

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running (see backend README)

## Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── App.tsx            # Main app component
└── index.tsx          # Entry point
```

## API Integration

The frontend connects to the NestJS backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Restaurant registration
- `GET /api/auth/profile` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tenants
- `GET /api/tenants/current` - Get current tenant
- `PATCH /api/tenants/:id` - Update tenant

## Features in Development

The following features are planned and will be implemented as the backend modules are completed:

- **Menu Management** - Add, edit, and organize menu items
- **Table Management** - Manage restaurant tables and seating
- **Order Processing** - Process orders and track sales
- **User Profile** - User profile management
- **Settings** - System configuration

## Authentication Flow

1. **Registration**: New restaurants can register with admin user creation
2. **Login**: Users authenticate with email/password
3. **Token Management**: JWT tokens are stored in localStorage
4. **Protected Routes**: All dashboard routes require authentication
5. **Auto-logout**: Invalid tokens automatically redirect to login

## Multi-tenancy

The system supports multiple restaurants (tenants) with:
- Isolated data per tenant
- Unique subdomains
- Tenant-specific user management
- Secure data separation

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test all new features
5. Update documentation as needed

## Troubleshooting

1. **CORS Issues**: Ensure backend CORS is configured for frontend origin
2. **API Connection**: Verify backend is running on correct port
3. **Build Issues**: Clear node_modules and reinstall dependencies
4. **Type Errors**: Ensure all dependencies are properly installed

## License

MIT License - see LICENSE file for details 