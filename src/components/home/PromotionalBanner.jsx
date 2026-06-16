import { useData } from '../../context/DataContext'

export default function PromotionalBanner() {
  const { promoBanners } = useData()
  return (
    <section className="px-4 md:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {promoBanners.map(banner => (
          <div key={banner.id} className={`${banner.bg} rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5 duration-300 cursor-pointer`}>
            <span className="text-2xl md:text-3xl">{banner.icon}</span>
            <div>
              <h3 className={`font-semibold text-sm md:text-base ${banner.textColor}`}>{banner.title}</h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
