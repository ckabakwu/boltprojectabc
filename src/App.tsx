import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProSignupPage from './pages/ProSignupPage';
import ProApplicationPage from './pages/ProApplicationPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProDashboard from './pages/ProDashboard';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminAutomationsPage from './pages/admin/AdminAutomationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminBookingDetailsPage from './pages/admin/AdminBookingDetailsPage';

// Admin CRM imports
import AdminLeadsPage from './pages/admin/crm/AdminLeadsPage';
import AdminIncompleteBookingsPage from './pages/admin/crm/AdminIncompleteBookingsPage';
import AdminCustomersPage from './pages/admin/crm/AdminCustomersPage';

// Pro Dashboard imports
import ProAvailabilityPage from './pages/ProAvailabilityPage';
import ProEarningsPage from './pages/ProEarningsPage';
import ProMessagesPage from './pages/ProMessagesPage';
import ProSettingsPage from './pages/ProSettingsPage';

// Customer Dashboard imports
import BookingsPage from './pages/dashboard/BookingsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import BookingDetailsPage from './pages/dashboard/BookingDetailsPage';

import { Toaster } from 'react-hot-toast';

import SupabaseConnectionTest from './components/SupabaseConnectionTest';

const App = () => {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <SupabaseConnectionTest />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/pro-signup" element={<ProSignupPage />} />
            <Route path="/pro-application" element={<ProApplicationPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/service-areas" element={<ServiceAreasPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Customer Dashboard Routes */}
            <Route 
              path="/customer-dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Pro Dashboard Routes */}
            <Route path="/pro-dashboard" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pro/availability" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProAvailabilityPage />
              </ProtectedRoute>
            } />
            <Route path="/pro/earnings" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProEarningsPage />
              </ProtectedRoute>
            } />
            <Route path="/pro/messages" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProMessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/pro/settings" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProSettingsPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bookings/:bookingId" element={<AdminBookingDetailsPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="promotions" element={<AdminPromotionsPage />} />
              <Route path="automations" element={<AdminAutomationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              
              {/* CRM Routes */}
              <Route path="crm/leads" element={<AdminLeadsPage />} />
              <Route path="crm/incomplete-bookings" element={<AdminIncompleteBookingsPage />} />
              <Route path="crm/customers" element={<AdminCustomersPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;