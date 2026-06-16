import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { useData } from '../context/DataContext'
import { FiChevronRight, FiStar } from 'react-icons/fi'

export default function Brand() {
  const { slug } = useParams()
  const { brands, products } = useData()
  const brand = brands.find(b => b.slug === slug)
  const brandProducts = products.filter(p => p.brand.slug === slug)

  if (!brand) return <Layout><div className="text-center py-20"><p className="text-gray-400 text-lg">Brand not found</p></div></Layout>

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#FF4F8B]">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{brand.name}</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{brand.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <div className="flex items-center gap-1"><FiStar className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-900 dark:text-white">{brand.rating}</span></div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">{brand.productCount} Products</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {brandProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
