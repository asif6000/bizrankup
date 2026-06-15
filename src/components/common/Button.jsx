import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white hover:shadow-lg hover:shadow-pink-500/25 active:scale-95',
  secondary: 'bg-white text-gray-800 border-2 border-gray-200 hover:border-[#FF4F8B] hover:text-[#FF4F8B] active:scale-95',
  outline: 'bg-transparent text-[#FF4F8B] border-2 border-[#FF4F8B] hover:bg-[#FF4F8B] hover:text-white active:scale-95',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
  dark: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 active:scale-95',
  glass: 'bg-white/70 backdrop-blur-xl text-gray-800 border border-white/20 hover:bg-white/90 active:scale-95',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-10 py-4 text-lg',
}

export default function Button({ children, variant = 'primary', size = 'md', to, href, className = '', loading, icon, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 ${variants[variant]} ${sizes[size]} ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${className}`

  if (to) return <Link to={to} className={classes} {...props}>{icon && <span className="text-lg">{icon}</span>}{loading ? 'Loading...' : children}</Link>
  if (href) return <a href={href} className={classes} {...props}>{icon && <span className="text-lg">{icon}</span>}{children}</a>
  return <button className={classes} disabled={loading} {...props}>{icon && <span className="text-lg">{icon}</span>}{loading ? 'Loading...' : children}</button>
}
