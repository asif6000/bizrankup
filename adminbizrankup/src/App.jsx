import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBrands from './pages/admin/AdminBrands'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReviews from './pages/admin/AdminReviews'
import AdminBlog from './pages/admin/AdminBlog'
import AdminOffers from './pages/admin/AdminOffers'
import AdminSlides from './pages/admin/AdminSlides'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminCouriers from './pages/admin/AdminCouriers'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminFlashSales from './pages/admin/AdminFlashSales'
import AdminBundles from './pages/admin/AdminBundles'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrderStatuses from './pages/admin/AdminOrderStatuses'
import AdminTrendingStats from './pages/admin/AdminTrendingStats'
import AdminAddresses from './pages/admin/AdminAddresses'
import AdminHeaderFooter from './pages/admin/AdminHeaderFooter'
import AdminTracking from './pages/admin/AdminTracking'
import AdminOrderAutomation from './pages/admin/AdminOrderAutomation'
import AdminExpenses from './pages/admin/AdminExpenses'
import AdminPOS from './pages/admin/AdminPOS'
import AdminShippingRates from './pages/admin/AdminShippingRates'
import AdminFraudChecker from './pages/admin/AdminFraudChecker'
import AdminPaymentGateways from './pages/admin/AdminPaymentGateways'
import AdminSocialLogin from './pages/admin/AdminSocialLogin'
import AdminProfile from './pages/admin/AdminProfile'
import AdminEvents from './pages/admin/AdminEvents'
import AdminIncompleteOrders from './pages/admin/AdminIncompleteOrders'
import AdminAdvancePayment from './pages/admin/AdminAdvancePayment'

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="slides" element={<AdminSlides />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="couriers" element={<AdminCouriers />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="flash-sales" element={<AdminFlashSales />} />
            <Route path="bundles" element={<AdminBundles />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="order-statuses" element={<AdminOrderStatuses />} />
            <Route path="trending-stats" element={<AdminTrendingStats />} />
            <Route path="addresses" element={<AdminAddresses />} />
            <Route path="header-footer" element={<AdminHeaderFooter />} />
            <Route path="tracking" element={<AdminTracking />} />
            <Route path="order-automation" element={<AdminOrderAutomation />} />
            <Route path="expenses" element={<AdminExpenses />} />
            <Route path="pos" element={<AdminPOS />} />
            <Route path="shipping-rates" element={<AdminShippingRates />} />
            <Route path="fraud-checker" element={<AdminFraudChecker />} />
            <Route path="payment-gateways" element={<AdminPaymentGateways />} />
            <Route path="social-login" element={<AdminSocialLogin />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="incomplete-orders" element={<AdminIncompleteOrders />} />
            <Route path="advance-payment" element={<AdminAdvancePayment />} />
            <Route path="settings" element={<AdminProfile />} />
          </Route>
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  )
}
