import { createBrowserRouter } from "react-router-dom";
import React from "react";

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


// Public pages
import LoginPage from "./pages/LoginPage";
import ServicePage from "./pages/ServicePage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AppointmentPage from "./pages/admin/AppointmentPage";
import PatientPage from "./pages/admin/PatientPage";
import ServiceManagePage from "./pages/admin/ServicePage";
import SchedulePage from "./pages/admin/SchedulePage";
import DocumentPage from "./pages/admin/DocumentPage";
import BlogPage from "./pages/admin/BlogPage";

// Define routes with their corresponding layouts
const router = createBrowserRouter([
  // Guest/Public routes
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <LoginPage /> },
      { path: 'contact', element: <UnderDevelopmentPage /> },
      { path: "services", element: <ServicePage /> },
      { path: "blog", element: <ServicesPage /> },
      {
        element: <ProfileLayout />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'consultation-history', element: <ConsultationHistoryPage /> },
          { path: 'cycle-tracking', element: <CycleTrackingPage /> },
          { path: 'purchased-services', element: <PurchasedServicesPage /> },
        ],
      }
    ],
  },

  // Admin Login (không sử dụng AdminLayout vì chưa đăng nhập)
  { path: "/admin/login", element: <AdminLoginPage /> },

  // Customer routes
  {
    path: "/customer",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: "cycle-tracking", element: <UnderDevelopmentPage /> },
      { path: "appointment", element: <UnderDevelopmentPage /> },
      { path: "*", element: <UnderDevelopmentPage /> },
    ],
  },

  // Consultant routes
  {
    path: "/consultant",
    element: <AdminLayout role="Consultant" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: "*", element: <UnderDevelopmentPage /> },
    ],
  },

  // Staff routes
  {
    path: "/staff",
    element: <AdminLayout role="Staff" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: "*", element: <UnderDevelopmentPage /> },
    ],
  },

  // Manager routes
  {
    path: "/manager",
    element: <AdminLayout role="Manager" />,
    children: [
      { index: true, element: <UnderDevelopmentPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "*", element: <UnderDevelopmentPage /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout role="Admin" />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "appointments", element: <AppointmentPage /> },
      { path: "patients", element: <PatientPage /> },
      { path: "services", element: <ServiceManagePage /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "documents", element: <DocumentPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "*", element: <UnderDevelopmentPage /> },
    ],
  },

  // Catch-all route for any undefined routes
  {
    path: "*",
    element: <UnderDevelopmentPage />,
  },
]);

export default router;