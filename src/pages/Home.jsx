import Layout from '../components/layout/Layout'
import HeroBannerSlider from '../components/home/HeroBannerSlider'
import PromotionalBanner from '../components/home/PromotionalBanner'
import FlashSaleSection from '../components/home/FlashSaleSection'
import ProductTabsShowcase from '../components/home/ProductTabsShowcase'
import CategoryGrid from '../components/home/CategoryGrid'
import BrandCarousel from '../components/home/BrandCarousel'
import TestimonialsCarousel from '../components/home/TestimonialsCarousel'
import NewsletterSection from '../components/home/NewsletterSection'

export default function Home() {
  return (
    <Layout>
      <HeroBannerSlider />
      <PromotionalBanner />
      <FlashSaleSection />
      <ProductTabsShowcase />
      <CategoryGrid />
      <BrandCarousel />
      <TestimonialsCarousel />
      <NewsletterSection />
    </Layout>
  )
}
