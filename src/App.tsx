import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from './integrations/supabase';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import BookingPage from './pages/BookingForm';
import Layout from './components/layout/Layout';

const queryClient = new QueryClient();

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 15px rgba(0, 150, 255, 0.5)',
        },
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        _before: {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent, rgba(0, 150, 255, 0.3), transparent)',
          transform: 'rotate(45deg)',
          transition: 'all 0.3s',
        },
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SupabaseProvider>
            <SupabaseAuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminPanel />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Layout>
              </Router>
            </SupabaseAuthProvider>
          </SupabaseProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;