import Layout from '../components/layout/Layout'
import HeroBannerSlider from '../components/home/HeroBannerSlider'
import PromotionalBanner from '../components/home/PromotionalBanner'
import TrendingStatsBar from '../components/home/TrendingStatsBar'
import FlashSaleSection from '../components/home/FlashSaleSection'
import ProductTabsShowcase from '../components/home/ProductTabsShowcase'
import CategoryGrid from '../components/home/CategoryGrid'
import BundleDealsSection from '../components/home/BundleDealsSection'
import BrandCarousel from '../components/home/BrandCarousel'
import TestimonialsCarousel from '../components/home/TestimonialsCarousel'
import BeautyQuizSection from '../components/home/BeautyQuizSection'
import NewsletterSection from '../components/home/NewsletterSection'

export default function Home() {
  return (
    <Layout>
      <HeroBannerSlider />
      <PromotionalBanner />
      <TrendingStatsBar />
      <FlashSaleSection />
      <ProductTabsShowcase />
      <CategoryGrid />
      <BundleDealsSection />
      <BrandCarousel />
      <TestimonialsCarousel />
      <BeautyQuizSection />
      <NewsletterSection />
    </Layout>
  )
}
