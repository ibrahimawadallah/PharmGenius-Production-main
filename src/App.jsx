import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, useColorMode } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Hero from './pages/Hero';
import Features from './pages/Features';
import Services from './pages/Services';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Investors from './pages/Investors';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DrugSearch from './pages/DrugSearch';
import Consultations from './pages/Consultations';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Tools from './pages/Tools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App Component
function AppContent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated } = useAuth();

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Header onToggleColorMode={toggleColorMode} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/features" element={<Features />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Alias so the “Forgot Password?” link works */}
        <Route path="/forgot-password" element={<ResetPassword />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/drug-search" element={
          <ProtectedRoute>
            <Layout>
              <DrugSearch />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/tools" element={
          <ProtectedRoute>
            <Layout>
              <Tools />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/consultations" element={
          <ProtectedRoute>
            <Layout>
              <Consultations />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/consultations/:id" element={
          <ProtectedRoute>
            <Layout>
              <Consultations />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
          <ProtectedRoute>
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;