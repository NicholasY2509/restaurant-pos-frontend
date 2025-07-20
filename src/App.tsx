import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import TenantPage from './pages/Tenant';
import LogsViewer from './components/debug/LogsViewer';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { TenantProvider } from './contexts/TenantContext';
import TenantTitle from './components/TenantTitle';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
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
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <UserManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tenant" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TenantPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/menu" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="text-center py-12">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">Menu Management</h1>
                          <p className="text-gray-600">Coming soon! This feature is under development.</p>
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tables" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="text-center py-12">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">Table Management</h1>
                          <p className="text-gray-600">Coming soon! This feature is under development.</p>
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="text-center py-12">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Management</h1>
                          <p className="text-gray-600">Coming soon! This feature is under development.</p>
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div className="text-center py-12">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
                          <p className="text-gray-600">Coming soon! This feature is under development.</p>
                        </div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Debug Routes */}
                <Route path="/debug/logs" element={<LogsViewer />} />
                
                {/* Default Route */}
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