import Layout from '../components/layout/Layout'
import HeroBannerSlider from '../components/home/HeroBannerSlider'
import PromotionalBanner from '../components/home/PromotionalBanner'
import FlashSaleSection from '../components/home/FlashSaleSection'
import ProductSection from '../components/home/ProductSection'
import CategoryGrid from '../components/home/CategoryGrid'
import BrandCarousel from '../components/home/BrandCarousel'
import { products } from '../data'

export default function Home() {
  const visibleProducts = products

  return (
    <Layout>
      <HeroBannerSlider />
      <PromotionalBanner />
      <FlashSaleSection />
      <ProductSection title="Featured Products" subtitle="Handpicked just for you" products={visibleProducts.slice(0, 8)} link="/search?sort=popular" />
      <ProductSection title="New Arrivals" subtitle="The latest additions to our collection" products={visibleProducts.filter(p => p.isNew).slice(0, 8)} link="/search?sort=newest" />
      <ProductSection title="Trending Now" subtitle="Most popular products this week" products={visibleProducts.filter(p => p.isTrending).slice(0, 8)} link="/search?sort=popular" />
      <ProductSection title="Best Sellers" subtitle="Our customers' favorites" products={visibleProducts.filter(p => p.isBestSeller).slice(0, 8)} link="/search?sort=popular" />
      <CategoryGrid />
      <BrandCarousel />
      <section className="px-4 md:px-8 py-10 md:py-16">
        <div className="bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] rounded-2xl p-8 md:p-16 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Join Our Beauty Community</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">Subscribe to receive exclusive offers, beauty tips, and early access to new collections.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl text-sm text-gray-900 outline-none" />
            <button className="px-8 py-3.5 bg-white text-[#FF4F8B] rounded-xl font-semibold hover:shadow-xl active:scale-95 transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
