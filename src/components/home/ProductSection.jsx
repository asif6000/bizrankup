import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import ProductCard from '../product/ProductCard'

export default function ProductSection({ title, subtitle, products, link, linkText = 'View All' }) {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
            {linkText} <FiChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
