import Layout from '../components/layout/Layout'
import AllProductsSection from '../components/product/AllProductsSection'
import { useData } from '../context/DataContext'

export default function ProductListing() {
  const { products } = useData()
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse our complete collection of premium beauty products</p>
        </div>
      </div>
      <AllProductsSection
        products={products}
        itemsPerPage={12}
        showCategoryTabs
        showSort
        showViewToggle
        link="/products"
        linkText="Browse All"
      />
    </Layout>
  )
}
