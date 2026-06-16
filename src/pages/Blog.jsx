import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useData } from '../context/DataContext'
import { FiClock, FiUser } from 'react-icons/fi'

export default function Blog() {
  const { blogPosts } = useData()
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Our Blog</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">Beauty tips, trends, and stories from our experts</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="px-2.5 py-1 bg-[#FF4F8B]/10 text-[#FF4F8B] rounded-lg font-medium">{post.category}</span>
                  <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{post.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#FF4F8B] transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><FiUser className="w-3 h-3" />{post.author}</span>
                  <span className="text-xs text-[#FF4F8B] font-medium group-hover:underline">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
