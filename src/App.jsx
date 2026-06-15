import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Home from './pages/Home'
import Category from './pages/Category'
import SubCategory from './pages/SubCategory'
import Brand from './pages/Brand'
import ProductListing from './pages/ProductListing'
import ProductDetails from './pages/ProductDetails'
import Shop from './pages/Shop'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderTracking from './pages/OrderTracking'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import ProfileSettings from './pages/ProfileSettings'
import AddressManagement from './pages/AddressManagement'
import OrderHistory from './pages/OrderHistory'
import Reviews from './pages/Reviews'
import Offers from './pages/Offers'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import CustomerSupport from './pages/CustomerSupport'
import { CompareProvider } from './context/CompareContext'
import Returns from './pages/Returns'
import Shipping from './pages/Shipping'
import Careers from './pages/Careers'
import Press from './pages/Press'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Compare from './pages/Compare'
import NotificationCenter from './pages/NotificationCenter'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <CompareProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/category/:slug/:subSlug" element={<SubCategory />} />
                    <Route path="/brand/:slug" element={<Brand />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<ProductListing />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/addresses" element={<AddressManagement />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetails />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/customer-support" element={<CustomerSupport />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/notifications" element={<NotificationCenter />} />
                  </Routes>
                </CompareProvider>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
