import { Link } from 'react-router-dom'
import { brands } from '../../data'

export default function BrandCarousel() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Shop by Brand</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Premium brands you love</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {brands.map(brand => (
          <Link key={brand.id} to={`/brand/${brand.slug}`} className="group">
            <div className="aspect-square rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-4 flex items-center justify-center hover:border-[#FF4F8B] hover:shadow-lg transition-all duration-300">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-semibold text-xs text-center text-gray-900 dark:text-white mt-2 group-hover:text-[#FF4F8B] transition-colors">{brand.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
