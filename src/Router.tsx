import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

// Layouts
import GuestLayout from './layouts/GuestLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProfileLayout from './layouts/ProfileLayout';

// Public pages
import HomePage from './pages/HomePage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import ServicesPage from './pages/ServicesPage';
import ProfilePage from './pages/ProfilePage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import CycleTrackingPage from './pages/CycleTrackingPage';
import PurchasedServicesPage from './pages/PurchasedServicesPage';

// Define routes with their corresponding layouts
const router = createBrowserRouter([
  // Guest/Public routes
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <UnderDevelopmentPage /> },
      { path: 'register', element: <UnderDevelopmentPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'blog', element: <UnderDevelopmentPage /> },
      { path: 'contact', element: <UnderDevelopmentPage /> },
      {
        element: <ProfileLayout />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'consultation-history', element: <ConsultationHistoryPage /> },
          { path: 'cycle-tracking', element: <CycleTrackingPage /> },
          { path: 'purchased-services', element: <PurchasedServicesPage /> },
        ],
      },
    ],
  },
  
  // Customer routes
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: 'cycle-tracking', element: <UnderDevelopmentPage /> },
      { path: 'appointment', element: <UnderDevelopmentPage /> },
      { path: '*', element: <UnderDevelopmentPage /> },
    ],
  },
  
  // Consultant routes
  {
    path: '/consultant',
    element: <AdminLayout role="Consultant" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: '*', element: <UnderDevelopmentPage /> },
    ],
  },
  
  // Staff routes
  {
    path: '/staff',
    element: <AdminLayout role="Staff" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: '*', element: <UnderDevelopmentPage /> },
    ],
  },
  
  // Manager routes
  {
    path: '/manager',
    element: <AdminLayout role="Manager" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: '*', element: <UnderDevelopmentPage /> },
    ],
  },
  
  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout role="Admin" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: '*', element: <UnderDevelopmentPage /> },
    ],
  },
  
  // Catch-all route for any undefined routes
  {
    path: '*',
    element: <UnderDevelopmentPage />
  },
]);

export default router;