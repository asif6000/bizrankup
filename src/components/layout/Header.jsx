import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiChevronRight, FiUser } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { categories } from '../../data'

const navItems = [
  { label: 'Collection', slug: 'collection' },
  { label: 'Makeup', slug: 'makeup' },
  { label: 'Skin', slug: 'skincare' },
  { label: 'Hair', slug: 'hair-care' },
  { label: 'Body', slug: 'bath-body' },
  { label: 'Fragrance', slug: 'fragrance' },
]

const demoSubs = [
  { id: 901, name: 'New Arrivals', slug: 'new-arrivals', productCount: 48 },
  { id: 902, name: 'Best Sellers', slug: 'best-sellers', productCount: 72 },
  { id: 903, name: 'Limited Edition', slug: 'limited-edition', productCount: 24 },
  { id: 904, name: 'Gift Sets', slug: 'gift-sets', productCount: 36 },
  { id: 905, name: 'Travel Size', slug: 'travel-size', productCount: 55 },
  { id: 906, name: 'Value Packs', slug: 'value-packs', productCount: 41 },
]

function AccountDropdown({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <Link to="/login" className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
        <FiUser className="w-[15px] h-[15px]" />
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
        <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />
        {user.name.split(' ')[0]}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-1.5 animate-fade-in z-50">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/orders', label: 'Orders' },
            { to: '/wishlist', label: 'Wishlist' },
          ].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#FF4F87] transition-all">{item.label}</Link>
          ))}
          <hr className="my-1 border-gray-100 dark:border-gray-800" />
          <button onClick={() => { logout(); setOpen(false) }} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">Sign Out</button>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const { totalItems, setIsOpen: setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const megaTimeout = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileMenu(false); setActiveMega(null) }, [location.pathname])

  if (location.pathname === '/checkout') return null

  const handleMegaEnter = (slug) => {
    clearTimeout(megaTimeout.current)
    setActiveMega(slug)
  }

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 200)
  }

  return (
    <>
      {/* Promo */}
      {!scrolled && (
        <div className="fixed top-0 left-0 right-0 z-[49] h-6 flex items-center justify-center bg-[#0A0A0A] text-[11px] text-white/70 font-medium tracking-wide">
          <span>Free shipping over $50 &mdash; 30-day returns &mdash; Use <span className="text-[#FF4F87] font-semibold">WELCOME20</span></span>
        </div>
      )}

      <header className={`fixed left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100/50 dark:border-gray-800/50' : 'top-6 bg-white dark:bg-gray-950'}`}>
        <div className="flex items-center justify-between px-6 h-14 max-w-screen-2xl mx-auto">
          {/* Left */}
          <div className="flex items-center gap-8">
            <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" onClick={() => setMobileMenu(true)}>
              <FiMenu className="w-[17px] h-[17px]" />
            </button>
            <Link to="/" className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">SHAJGOJ</span>
              <span className="w-1 h-1 rounded-full bg-[#FF4F87]" />
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const itemCat = categories.find(c => c.slug === item.slug)
                const isDemo = item.slug === 'collection'
                const subs = isDemo ? demoSubs : itemCat?.subcategories
                const isActive = location.pathname === `/category/${item.slug}` || (isDemo && location.pathname === '/shop')

                return (
                  <div
                    key={item.slug}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(item.slug)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      to={isDemo ? '/shop' : `/category/${item.slug}`}
                      className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
                        isActive
                          ? 'text-[#FF4F87]'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>

                    {activeMega === item.slug && subs?.length > 0 && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                        onMouseEnter={() => handleMegaEnter(item.slug)}
                        onMouseLeave={handleMegaLeave}
                      >
                        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in overflow-hidden">
                          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-gray-950 border-l border-t border-gray-100 dark:border-gray-800 rotate-45" />

                          <div className="p-1.5 min-w-[440px]">
                            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50">
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</span>
                              <span className="text-[11px] text-gray-400">{subs.length} categories</span>
                            </div>
                            <div className="grid grid-cols-2 p-1 gap-0.5">
                              {subs.map(sub => (
                                <Link
                                  key={sub.id}
                                  to={isDemo ? `/shop?tag=${sub.slug}` : `/category/${itemCat.slug}/${sub.slug}`}
                                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                  <span className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-400 dark:text-gray-500 group-hover:bg-[#FF4F87]/10 group-hover:text-[#FF4F87] transition-all">
                                    {sub.name.charAt(0)}
                                  </span>
                                  <span className="flex-1">{sub.name}</span>
                                  <span className="text-[10px] text-gray-300 dark:text-gray-600 group-hover:text-[#FF4F87] transition-colors">{sub.productCount}</span>
                                </Link>
                              ))}
                            </div>
                            <div className="px-3 py-2 border-t border-gray-50 dark:border-gray-800/50">
                              <Link
                                to={isDemo ? '/shop' : `/category/${itemCat.slug}`}
                                className="flex items-center justify-center gap-1 w-full py-2 rounded-lg text-sm font-semibold text-[#FF4F87] hover:bg-[#FF4F87]/5 transition-all"
                              >
                                Browse All {item.label}
                                <FiChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <div className="relative">
                <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] transition-colors ${searchFocused ? 'text-[#FF4F87]' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && searchQuery && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                  placeholder="Search"
                  className="w-44 lg:w-56 h-9 pl-8 pr-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-[13px] text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 focus:border-[#FF4F87] focus:ring-2 focus:ring-[#FF4F87]/10"
                />
              </div>
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#FF4F87] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" onClick={() => navigate('/wishlist')}>
              <FiHeart className="w-[15px] h-[15px]" />
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] bg-[#FF4F87] text-white text-[7px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </button>

            <AccountDropdown user={user} logout={logout} />

            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-3 py-1.5 bg-[#FF4F87] text-white text-[13px] font-semibold rounded-lg hover:bg-[#e8456e] transition-all active:scale-[0.97]">
              <FiShoppingBag className="w-[14px] h-[14px]" />
              Bag
              {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-white text-[#FF4F87] text-[8px] font-bold rounded-full flex items-center justify-center shadow">{totalItems > 9 ? '9+' : totalItems}</span>}
            </button>

            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" onClick={() => navigate('/search')}>
              <FiSearch className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20" onClick={() => setMobileMenu(false)} />
        <div className={`absolute top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-gray-950 shadow-2xl transition-all duration-300 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">SHAJGOJ</span>
            <button onClick={() => setMobileMenu(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <FiX className="w-[16px] h-[16px]" />
            </button>
          </div>
          <div className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-3.5rem)]">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-9 pl-9 pr-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-[#FF4F87] focus:ring-2 focus:ring-[#FF4F87]/10 transition-all"
                onFocus={() => { setMobileMenu(false); navigate('/search') }}
              />
            </div>
            <Link to="/" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <span>Home</span>
              <FiChevronRight className="w-3 h-3 text-gray-300" />
            </Link>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
              {navItems.map(item => (
                <Link key={item.slug} to={`/category/${item.slug}`} onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#FF4F87] transition-all group">
                  <span>{item.label}</span>
                  <FiChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#FF4F87] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Account</p>
              <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
                <FiChevronRight className="w-3 h-3 text-gray-300" />
              </Link>
              <Link to="/login" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span>Sign In</span>
                <FiChevronRight className="w-3 h-3 text-gray-300" />
              </Link>
              <Link to="/orders" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span>Orders</span>
                <FiChevronRight className="w-3 h-3 text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
