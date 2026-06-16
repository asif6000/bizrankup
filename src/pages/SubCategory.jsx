import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AllProductsSection from '../components/product/AllProductsSection'
import { useData } from '../context/DataContext'
import { FiChevronRight } from 'react-icons/fi'

export default function SubCategory() {
  const { slug, subSlug } = useParams()
  const { categories, products } = useData()
  const category = categories.find(c => c.slug === slug)
  const sub = category?.subcategories?.find(s => s.slug === subSlug)
  const filteredProducts = products.filter(p => p.category.slug === slug)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#FF4F8B] transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to={`/category/${slug}`} className="hover:text-[#FF4F8B] transition-colors">{category?.name}</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{sub?.name || subSlug}</span>
        </nav>
      </div>

      <AllProductsSection
        title={sub?.name || subSlug}
        subtitle={`${sub?.productCount || filteredProducts.length} products`}
        products={filteredProducts}
        categorySlug={slug}
        showCategoryTabs={false}
        showSort
        showViewToggle
        itemsPerPage={12}
      />
    </Layout>
  )
}
