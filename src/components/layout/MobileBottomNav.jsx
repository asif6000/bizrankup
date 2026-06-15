import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function MobileBottomNav() {
  const location = useLocation()
  const { totalItems, setIsOpen: setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()

  const links = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/shop', icon: FiGrid, label: 'Shop' },
    { to: '/wishlist', icon: FiHeart, label: 'Wishlist', badge: wishlistCount },
    { icon: FiShoppingBag, label: 'Cart', badge: totalItems, onClick: () => setCartOpen(true) },
    { to: '/login', icon: FiUser, label: 'Account' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(link => {
          const isActive = link.to ? location.pathname === link.to : false
          if (link.onClick) {
            return (
              <button key={link.label} onClick={link.onClick} className="relative flex flex-col items-center justify-center w-14 h-full">
                <link.icon className={`w-5 h-5 ${isActive ? 'text-[#FF4F8B]' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="text-[10px] mt-0.5 font-medium text-gray-400 dark:text-gray-500">{link.label}</span>
                {link.badge > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4F8B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{link.badge}</span>}
              </button>
            )
          }
          return (
            <Link key={link.to} to={link.to} className="relative flex flex-col items-center justify-center w-14 h-full">
              <link.icon className={`w-5 h-5 ${isActive ? 'text-[#FF4F8B]' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-[#FF4F8B]' : 'text-gray-400 dark:text-gray-500'}`}>{link.label}</span>
              {link.badge > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4F8B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{link.badge}</span>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
