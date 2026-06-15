import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiUser, FiArrowUpRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { categories, products } from '../../data'

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
  const navigate = useNavigate()

  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF4F87] transition-colors">
        <FiUser className="w-[19px] h-[19px]" strokeWidth={1.5} />
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
        <img src={user.avatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-gray-200 dark:ring-gray-700" />
        {user.name.split(' ')[0]}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-1.5 animate-fade-in z-50">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/orders', label: 'Orders' },
            { to: '/wishlist', label: 'Wishlist' },
          ].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#FF4F87] transition-all">{item.label}</Link>
          ))}
          <hr className="my-1 border-gray-100 dark:border-gray-800" />
          <button onClick={() => { logout(); setOpen(false) }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">Sign Out</button>
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
      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm' : 'top-0 bg-white dark:bg-gray-950'}`}>
        {/* Promo */}
        {!scrolled && (
          <div className="h-7 flex items-center justify-center bg-[#0A0A0A]">
            <p className="text-[9px] text-white/50 tracking-[0.2em] uppercase font-medium">
              Free shipping over $50 &nbsp;&#9679;&nbsp; 30-day returns &nbsp;&#9679;&nbsp; Code: <span className="text-white font-semibold">WELCOME20</span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 lg:px-12 h-16 max-w-[1440px] mx-auto">
          {/* Left */}
          <div className="flex items-center gap-14">
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF4F87] transition-colors"
              onClick={() => setMobileMenu(true)}
            >
              <FiMenu className="w-[19px] h-[19px]" strokeWidth={1.5} />
            </button>
            <Link to="/" className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold tracking-[-0.04em] leading-none text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>SHAJGOJ</span>
              <span className="w-1 h-1 rounded-full bg-[#FF4F87]" />
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-6">
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
                      className={`text-[12px] font-medium tracking-wide transition-colors duration-200 ${
                        isActive
                          ? 'text-[#FF4F87]'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>

                    {activeMega === item.slug && subs?.length > 0 && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-5 z-50"
                        onMouseEnter={() => handleMegaEnter(item.slug)}
                        onMouseLeave={handleMegaLeave}
                      >
                        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-50 dark:border-gray-800 animate-fade-in overflow-hidden">
                          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-gray-950 border-l border-t border-gray-50 dark:border-gray-800 rotate-45" />
                          <div className="grid grid-cols-3 gap-6 p-5 min-w-[540px]">
                            {isDemo ? (
                              <>
                                <div className="col-span-2">
                                  <span className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">Collections</span>
                                  <div className="grid grid-cols-2 gap-1">
                                    {subs.map(sub => (
                                      <Link
                                        key={sub.id}
                                        to={`/shop?tag=${sub.slug}`}
                                        className="group/sub flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#FF4F87] transition-all"
                                      >
                                        <span className="flex items-center gap-2.5">
                                          <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 group-hover/sub:bg-[#FF4F87] transition-colors" />
                                          {sub.name}
                                        </span>
                                        <span className="text-[9px] text-gray-300 dark:text-gray-600 group-hover/sub:text-[#FF4F87] transition-colors">{sub.productCount}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">Quick Links</span>
                                  <div className="space-y-1">
                                    <Link to="/shop" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#FF4F87] transition-all">Shop All</Link>
                                    <Link to="/offers" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#FF4F87] transition-all">Offers</Link>
                                    <Link to="/new-arrivals" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#FF4F87] transition-all">New Arrivals</Link>
                                  </div>
                                </div>
                              </>
                            ) : (
                              categories.slice(0, 3).map(cat => (
                                <div key={cat.id}>
                                  <Link
                                    to={`/category/${cat.slug}`}
                                    className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-[#FF4F87] mb-2.5 hover:underline"
                                  >
                                    {cat.name}
                                  </Link>
                                  {cat.subcategories?.length > 0 && (
                                    <div className="space-y-0.5">
                                      {cat.subcategories.map(sub => (
                                        <Link
                                          key={sub.id}
                                          to={`/category/${cat.slug}/${sub.slug}`}
                                          className="group/sub flex items-center justify-between px-2 py-1.5 rounded-lg text-[12px] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all"
                                        >
                                          <span>{sub.name}</span>
                                          <span className="text-[8px] text-gray-300 dark:text-gray-600 group-hover/sub:text-[#FF4F87] transition-colors">{sub.productCount}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                          <div className="px-5 pb-4 flex items-center gap-4 border-t border-gray-50 dark:border-gray-800/50 pt-3">
                            <Link to="/shop" className="text-[11px] font-medium text-[#FF4F87] hover:underline flex items-center gap-1">
                              Shop All <FiArrowUpRight className="w-3 h-3" strokeWidth={2} />
                            </Link>
                            <Link to="/offers" className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              Offers
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              <Link to="/shop" className="text-[12px] font-medium text-[#FF4F87] hover:underline transition-all">
                Shop All
              </Link>
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:block">
              <div className={`relative flex items-center transition-all duration-300 ${searchFocused || searchQuery ? 'w-72 lg:w-80' : 'w-10'}`}>
                <FiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors cursor-pointer z-10 ${searchFocused || searchQuery ? 'text-[#FF4F87]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  strokeWidth={1.5}
                  onClick={() => {
                    if (!searchFocused && !searchQuery) {
                      document.getElementById('header-search-input')?.focus()
                    }
                  }}
                />
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery) navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                    if (e.key === 'Escape') { setSearchQuery(''); setSearchFocused(false); e.target.blur() }
                  }}
                  placeholder="Search products..."
                  className="w-full h-10 pl-9 pr-4 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-[13px] text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#FF4F87] focus:ring-1 focus:ring-[#FF4F87]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); document.getElementById('header-search-input')?.focus() }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
                {/* Search suggestions */}
                {searchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 animate-fade-in max-h-80 overflow-y-auto">
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 6)
                      .map(product => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[#FF4F87] transition-colors">{product.name}</p>
                            <p className="text-xs text-gray-400">${product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-400">No products found</p>
                      </div>
                    )}
                    <Link
                      to={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-sm font-medium text-[#FF4F87] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <FiSearch className="w-3.5 h-3.5" /> See all results for &ldquo;{searchQuery}&rdquo;
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF4F87] transition-colors" onClick={() => navigate('/wishlist')}>
              <FiHeart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#FF4F87] text-white text-[5px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </button>

            <AccountDropdown user={user} logout={logout} />

            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[12px] font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-[0.97] ml-1">
              <FiShoppingBag className="w-[14px] h-[14px]" strokeWidth={1.5} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4F87] text-white text-[6px] font-bold rounded-full flex items-center justify-center shadow-sm">{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </button>

            <button className="md:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF4F87] transition-colors" onClick={() => navigate('/search')}>
              <FiSearch className="w-[19px] h-[19px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenu(false)} />
        <div className={`absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-950 shadow-2xl transition-all duration-300 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-bold tracking-[-0.03em] text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>SHAJGOJ</span>
            <button onClick={() => setMobileMenu(false)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <FiX className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="relative mb-5">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800/50 border-0 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4F87] transition-colors"
                onFocus={() => { setMobileMenu(false); navigate('/search') }}
              />
            </div>
            <Link to="/" onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Home
            </Link>
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
              <p className="px-4 pb-2 text-[8px] font-semibold text-gray-400 uppercase tracking-[0.15em]">Shop</p>
              {navItems.map(item => (
                <Link key={item.slug} to={`/category/${item.slug}`} onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#FF4F87] transition-all">
                  {item.label}
                </Link>
              ))}
              <Link to="/shop" onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-[#FF4F87] hover:bg-[#FF4F87]/5 transition-all">
                Shop All
              </Link>
            </div>
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
              <p className="px-4 pb-2 text-[8px] font-semibold text-gray-400 uppercase tracking-[0.15em]">Account</p>
              <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
              </Link>
              <Link to="/orders" onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Orders
              </Link>
              <Link to="/login" onClick={() => setMobileMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
