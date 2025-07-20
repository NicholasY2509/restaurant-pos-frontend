import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import TenantPage from './pages/Tenant';
import LogsViewer from './components/debug/LogsViewer';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tenant" 
        element={
          <ProtectedRoute>
            <TenantPage />
          </ProtectedRoute>
        } 
      />

      {/* Placeholder routes for future features */}
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Menu Management</h1>
              <p className="text-gray-600">Coming soon! This feature is under development.</p>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tables" 
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Table Management</h1>
              <p className="text-gray-600">Coming soon! This feature is under development.</p>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders</h1>
              <p className="text-gray-600">Coming soon! This feature is under development.</p>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
              <p className="text-gray-600">Coming soon! This feature is under development.</p>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
              <p className="text-gray-600">Coming soon! This feature is under development.</p>
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {process.env.NODE_ENV === 'development' && <LogsViewer />}
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 