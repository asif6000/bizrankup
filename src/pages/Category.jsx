import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AllProductsSection from '../components/product/AllProductsSection'
import { useData } from '../context/DataContext'
import { FiChevronRight } from 'react-icons/fi'

export default function Category() {
  const { slug } = useParams()
  const { categories, products } = useData()
  const category = categories.find(c => c.slug === slug) || categories[0]
  const categoryProducts = products.filter(p => p.category.slug === slug)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#FF4F8B] transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
        </nav>

        {category.subcategories && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-2 scrollbar-hide">
            {category.subcategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${category.slug}/${sub.slug}`}
                className="shrink-0 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-[#FF4F8B] hover:text-white rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <AllProductsSection
        title={category.name}
        subtitle={`${category.productCount} products available`}
        products={categoryProducts}
        categorySlug={slug}
        showCategoryTabs={false}
        showSort
        showViewToggle
        itemsPerPage={12}
      />
    </Layout>
  )
}
