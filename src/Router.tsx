import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { SessionManager } from "./utils/sessionManager";
// import { isAuthorizedRole } from "./service/api/adminloginAPI";

// Layouts
import GuestLayout from "./layouts/GuestLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProfileLayout from "./layouts/ProfileLayout";

// Public pages
import HomePage from "./pages/HomePage";
import UnderDevelopmentPage from "./pages/UnderDevelopmentPage";
import ServicesPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import ConsultationHistoryPage from "./pages/ConsultationHistoryPage";
import CycleTrackingPage from "./pages/CycleTrackingPage";
import PurchasedServicesPage from "./pages/PurchasedServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import BlogDetail from "./pages/BlogDetail";
import ContactPage from "./pages/ContactPage";

// Public pages
import LoginPage from "./pages/LoginPage";
import ServicePage from "./pages/ServicePage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AppointmentPage from "./pages/admin/AppointmentPage";
import AppointmentDetailPage from "./pages/admin/AppointmentDetailPage";
import ServiceManagePage from "./pages/admin/ServicePage";
import ConsultantSchedulePage from "./pages/admin/ConsultantSchedulePage";
import BlogPage from "./pages/admin/BlogPage";
import BlogCategoriesPage from "./pages/admin/BlogCategoriesPage";
import ServiceCategoriesPage from "./pages/admin/ServiceCategoriesPage";
import ConsultantManagement from "./pages/admin/ConsultantManagement";
import ConsultantDetail from "./pages/admin/ConsultantDetail";
import DynamicFormPage from "./pages/admin/DynamicFormPage";
import PushNotificationPage from "./pages/admin/PushNotifiactionPage";
import SubscriptionPage from "./pages/admin/SubscriptionPage";
import ConsultantConsultations from "./components/admin/consultant/ConsultantConsultations";
import ConsultantScheduleBookings from "./components/admin/consultant/ConsultantScheduleBookings";
import ConsultantAvailability from "./components/admin/consultant/ConsultantAvailability";
import ConsultantMessages from "./components/admin/consultant/ConsultantMessages";
import PurchaseSubscriptionPage from "./pages/PurchaseSubscriptionPage";
import SubscriptionDetailPage from "./pages/SubscriptionDetailPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ConsultantFormsPage from "./components/admin/consultant/ConsultantFormsPage";
import BookingManagerPage from "./pages/admin/BookingManagerPage";
import ChatPage from "./pages/admin/ChatPage";
import FeedbackPage from "./pages/admin/FeedbackPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";

// Auth protection với SessionManager
const ProtectedRoute = ({ allowedRoles = ["admin"] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra session có hợp lệ không bằng SessionManager
    if (!SessionManager.isSessionValid()) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Lấy thông tin user từ SessionManager
    try {
      const userRole = SessionManager.getUserRole();
      setUserRole(userRole);
      setIsAuthenticated(true);

      // Gia hạn session khi truy cập protected route
      SessionManager.extendSession();
    } catch (error) {
      console.error("Lỗi khi lấy thông tin session:", error);
      SessionManager.clearSession();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Đang tải
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập hoặc session hết hạn
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Đã đăng nhập nhưng không có quyền
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// User Protected Route - chỉ cho phép user với role "user"
const UserProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra session có hợp lệ không bằng SessionManager
    if (!SessionManager.isSessionValid()) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Lấy thông tin user từ SessionManager
    try {
      const userRole = SessionManager.getUserRole();
      setUserRole(userRole);
      setIsAuthenticated(true);

      // Gia hạn session khi truy cập protected route
      SessionManager.extendSession();
    } catch (error) {
      console.error("Lỗi khi lấy thông tin session:", error);
      SessionManager.clearSession();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Đang tải
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập hoặc session hết hạn
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin/Consultant không được phép truy cập user routes
  if (userRole && userRole !== "user") {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

// Define routes with their corresponding layouts
const router = createBrowserRouter([
  // Guest/Public routes
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <LoginPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "services", element: <ServicePage /> },
      { path: "services/:serviceId", element: <ServiceDetail /> },
      { path: "blog", element: <ServicesPage /> },
      { path: "blog/:blogId", element: <BlogDetail /> },
      { path: "subscriptions", element: <PurchaseSubscriptionPage /> },
      { path: "subscriptions/:id", element: <SubscriptionDetailPage /> },
      { path: "payment/confirm/:id", element: <PaymentConfirmPage /> },
      { path: "payment/success", element: <PaymentSuccessPage /> },
    ],
  },

  // User-only protected routes
  {
    path: "/",
    element: <UserProtectedRoute />,
    children: [
      {
        element: <ProfileLayout />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          {
            path: "consultation-history",
            element: <ConsultationHistoryPage />,
          },
          {
            path: "bookings-history",
            element: <BookingHistoryPage />,
          },
          { path: "cycle-tracking", element: <CycleTrackingPage /> },
          { path: "purchased-services", element: <PurchasedServicesPage /> },
        ],
      },
    ],
  },

  // Admin Login (không sử dụng AdminLayout vì chưa đăng nhập)
  { path: "/admin/login", element: <AdminLoginPage /> },

  // Unauthorized page
  {
    path: "/unauthorized",
    element: (
      <div className="h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Không có quyền truy cập</h1>
        <p className="mb-4">Bạn không có quyền truy cập vào trang này.</p>
        <button
          onClick={() => (window.location.href = "/admin/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    ),
  },

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

  // Consultant routes - Cho phép consultant truy cập các trang admin
  {
    path: "/consultant",
    element: <ProtectedRoute allowedRoles={["consultant"]} />,
    children: [
      {
        element: <AdminLayout role="Consultant" />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "appointments", element: <AppointmentPage /> },
          { path: "appointments/:id", element: <AppointmentDetailPage /> },
          { path: "schedules", element: <ConsultantScheduleBookings /> },
          { path: "consultations", element: <ConsultantConsultations /> },
          { path: "availability", element: <ConsultantAvailability /> },
          { path: "messages", element: <ChatPage /> },
          { path: "forms", element: <ConsultantFormsPage /> },
          { path: "*", element: <UnderDevelopmentPage /> },
        ],
      },
    ],
  },

  // Admin routes - CHỈ cho phép admin
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout role="Admin" />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "appointments", element: <AppointmentPage /> },
          { path: "appointments/:id", element: <AppointmentDetailPage /> },
          { path: "services", element: <ServiceManagePage /> },
          { path: "schedules", element: <ConsultantSchedulePage /> },
          { path: "consultations", element: <ConsultantConsultations /> },
          { path: "consultants", element: <ConsultantManagement /> },
          { path: "consultants/:id", element: <ConsultantDetail /> },
          { path: "consultants/:id/edit", element: <UnderDevelopmentPage /> },
          {
            path: "consultants/:id/schedule",
            element: <UnderDevelopmentPage />,
          },
          { path: "blogs", element: <BlogPage /> },
          { path: "blog-categories", element: <BlogCategoriesPage /> },
          { path: "service-categories", element: <ServiceCategoriesPage /> },
          { path: "dynamic-forms", element: <DynamicFormPage /> },
          { path: "push-notifications", element: <PushNotificationPage /> },
          { path: "subscription", element: <SubscriptionPage /> },
          { path: "availability", element: <ConsultantAvailability /> },
          { path: "messages", element: <ConsultantMessages /> },
          { path: "bookings", element: <BookingManagerPage /> },
          { path: "chat", element: <ChatPage /> },
          { path: "feedback", element: <FeedbackPage /> },
          { path: "*", element: <UnderDevelopmentPage /> },
        ],
      },
    ],
  },

  // Catch-all route for any undefined routes
  {
    path: "*",
    element: <UnderDevelopmentPage />,
  },
]);

export default router;
