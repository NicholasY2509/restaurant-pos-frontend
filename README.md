# Restaurant POS System - Frontend

A modern React frontend for the multi-tenant Restaurant Point of Sale System with comprehensive role-based access control.

## 🚀 Features

### ✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes and components
- User profile management

### ✅ **Role Management System**
- **4 User Roles**: Admin, Manager, Waiter, Kitchen Staff
- **Role-based Navigation**: Different menu items based on user role
- **User Management**: Create, edit, and deactivate users (Admin/Manager only)
- **Profile Management**: Users can edit their own profile information
- **Role Guards**: Component-level access control

### ✅ **User Interface**
- Modern, responsive design with Tailwind CSS
- Role-specific dashboards
- User management interface with statistics
- Profile editing capabilities
- Toast notifications for user feedback

### ✅ **Multi-tenant Support**
- Tenant-specific data isolation
- Restaurant-specific branding and settings

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API communication

## 📋 User Roles & Permissions

### 👑 **Administrator (Admin)**
- Full system access
- User management (create, edit, deactivate)
- Tenant settings management
- Menu and table management
- Order management
- System settings

### 👨‍💼 **Manager**
- User management (view, edit)
- Menu and table management
- Order management
- Limited tenant settings

### 👨‍💼 **Waiter**
- Order management
- Table management
- Profile management
- Dashboard access

### 👨‍🍳 **Kitchen Staff**
- Order viewing and management
- Profile management
- Dashboard access

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── RoleGuard.tsx   # Role-based access control
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/             # Page components
│   ├── Dashboard.tsx  # Role-based dashboard
│   ├── UserManagement.tsx # User management interface
│   ├── Profile.tsx    # User profile management
│   └── ...
├── services/          # API services
│   └── api.ts        # API communication
├── types/            # TypeScript type definitions
│   └── index.ts      # User roles and interfaces
└── utils/            # Utility functions
```

## 🔐 Role Management Features

### **User Management Interface**
- View all users in the tenant
- Create new users (Admin only)
- Edit user information
- Deactivate users (Admin only)
- Role assignment and management
- User count tracking (max 5 users per tenant)

### **Profile Management**
- View personal information
- Edit profile details
- Change password
- View role and account status
- Member since information

### **Role-based Navigation**
- Dynamic sidebar based on user role
- Protected routes and components
- Role-specific dashboard content
- Access control at component level

## 🎨 UI Components

### **RoleGuard Component**
```tsx
<RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
  <UserManagement />
</RoleGuard>
```

### **Role-based Sidebar**
- Automatically shows/hides navigation items based on user role
- Displays user role and name
- Role-specific icons and colors

### **User Management Table**
- Comprehensive user listing
- Role badges with colors
- Status indicators
- Action buttons (edit, deactivate)

## 🔧 API Integration

The frontend integrates with the backend role management system:

- **GET /users** - List all users (Admin/Manager)
- **POST /users** - Create new user (Admin only)
- **PATCH /users/:id** - Update user (Admin or self)
- **DELETE /users/:id** - Deactivate user (Admin only)
- **GET /users/count** - Get user count (Admin)
- **GET /users/profile/me** - Get own profile

## 🎯 Usage Examples

### **Creating a New User (Admin)**
1. Navigate to User Management
2. Click "Add User" button
3. Fill in user details and select role
4. Submit form

### **Editing Profile**
1. Navigate to Profile
2. Click "Edit" button
3. Modify information
4. Save changes

### **Role-based Access**
- Admins see all navigation items
- Managers see limited management options
- Waiters see order and table management
- Kitchen staff see order management only

## 🚨 Security Features

- **JWT Token Management**: Automatic token refresh and storage
- **Role-based Route Protection**: Routes protected by user role
- **Component-level Guards**: Individual components protected
- **API Error Handling**: Proper error messages and redirects
- **Session Management**: Automatic logout on token expiration

## 🔄 State Management

- **AuthContext**: Manages authentication state and user information
- **Local Storage**: Persists user session and preferences
- **API Service**: Centralized API communication with error handling

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Touch-friendly interfaces
- Optimized for various screen sizes

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Role-based Colors**: Different colors for different roles
- **Consistent Design**: Unified design system

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement role-based access control
4. Add proper error handling
5. Test with different user roles

## 📄 License

This project is part of the Restaurant POS System.

---

**Note**: This frontend is designed to work with the NestJS backend. Make sure the backend is running and properly configured before using the frontend. 