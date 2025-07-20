import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import Profile from './pages/Profile/Profile';
import TenantPage from './pages/Tenant/Tenant';
import MenuItems from './pages/MenuManagement/MenuItems/MenuItems';
import Categories from './pages/MenuManagement/Categories/Categories';
import Modifiers from './pages/MenuManagement/Modifiers/Modifiers';
import LogsViewer from './components/debug/LogsViewer';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { TenantProvider } from './contexts/TenantContext';
import TenantTitle from './components/TenantTitle';

// Route configuration types
interface RouteConfig {
  path: string;
  component?: React.ComponentType;
  element?: React.ReactNode;
  redirect?: string;
  children?: RouteConfig[];
}

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Placeholder component for coming soon pages
const ComingSoonPage: React.FC<{ title: string; description?: string }> = ({ 
  title, 
  description = "Coming soon! This feature is under development." 
}) => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Wrapper for protected routes with dashboard layout
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

// Route configuration
const routes: RouteConfig[] = [
  { path: '/login', component: LoginForm, element: <PublicRoute><LoginForm /></PublicRoute> },
  { path: '/register', component: RegisterForm, element: <PublicRoute><RegisterForm /></PublicRoute> },
  
  { path: '/dashboard', component: Dashboard },
  { path: '/users', component: UserManagement },
  { path: '/profile', component: Profile },
  { path: '/tenant', component: TenantPage },
  
  { path: '/menu', redirect: '/menu/items' },
  { path: '/menu/items', component: MenuItems },
  { path: '/menu/categories', component: Categories },
  { path: '/menu/modifiers', component: Modifiers },
  
  // Coming soon pages
  { 
    path: '/tables', 
    element: <ComingSoonPage title="Table Management" />
  },
  { 
    path: '/orders', 
    element: <ComingSoonPage title="Order Management" />
  },
  { 
    path: '/settings', 
    element: <ComingSoonPage title="Settings" />
  },
];

// Component mapping for dynamic imports
const componentMap: Record<string, React.ComponentType> = {
  Dashboard,
  UserManagement,
  Profile,
  TenantPage,
};

// Render route element
const renderRouteElement = (route: RouteConfig): React.ReactNode => {
  if (route.element) return route.element;
  if (route.component) {
    const Component = route.component;
    return <ProtectedLayout><Component /></ProtectedLayout>;
  }
  if (route.redirect) return <Navigate to={route.redirect} replace />;
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TenantProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <TenantTitle />
              <Routes>
                {/* Generated routes from configuration */}
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={renderRouteElement(route)}
                  />
                ))}
                
                {/* Debug Routes */}
                <Route path="/debug/logs" element={<LogsViewer />} />
                
                {/* Default Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
              {/* LogsViewer - Always available as floating button */}
              <LogsViewer />
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </TenantProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 