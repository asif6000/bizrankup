import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { products } from '../data'
import { FiSearch } from 'react-icons/fi'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)

  const results = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.name.toLowerCase().includes(query.toLowerCase())
      )
    : products

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="relative max-w-2xl mx-auto mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearchParams({ q: searchInput })}
            placeholder="Search products, brands, categories..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors"
          />
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {query ? `Showing ${results.length} results for "${query}"` : 'Showing all products'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products found for "{query}"</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
