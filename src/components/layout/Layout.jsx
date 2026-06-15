import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'
import CartDrawer from '../cart/CartDrawer'
import ChatSupportWidget from '../chat/ChatSupportWidget'
import BackToTop from '../common/BackToTop'
import SalePopup from '../common/SalePopup'
import ScrollToTop from '../common/ScrollToTop'

export default function Layout({ children }) {
  const location = useLocation()
  const isCheckout = location.pathname === '/checkout'

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F1117] transition-colors duration-300">
      <Header />
      <main className={`${isCheckout ? 'pt-0 pb-0' : 'pt-[84px] pb-20 md:pb-0'}`}>{children || <Outlet />}</main>
      {!isCheckout && <Footer />}
      {!isCheckout && <MobileBottomNav />}
      <CartDrawer />
      <ChatSupportWidget />
      {!isCheckout && <BackToTop />}
      {!isCheckout && <SalePopup />}
      <ScrollToTop />
    </div>
  )
}
