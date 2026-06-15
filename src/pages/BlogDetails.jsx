import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { blogPosts } from '../data'
import { FiChevronRight, FiClock, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi'

export default function BlogDetails() {
  const { id } = useParams()
  const post = blogPosts.find(p => p.id === Number(id))

  if (!post) return <Layout><div className="text-center py-20"><p className="text-gray-400 text-lg">Post not found</p></div></Layout>

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#FF4F8B]">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-[#FF4F8B]">Blog</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{post.title}</span>
        </nav>

        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF4F8B] mb-6 transition-colors"><FiArrowLeft className="w-4 h-4" />Back to Blog</Link>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="px-3 py-1 bg-[#FF4F8B]/10 text-[#FF4F8B] rounded-lg font-medium text-xs">{post.category}</span>
          <span className="flex items-center gap-1"><FiUser className="w-3.5 h-3.5" />{post.author}</span>
          <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5" />{post.readTime}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <p className="text-gray-500 text-sm mb-2">{post.date}</p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{post.excerpt}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 my-6 border-l-4 border-[#FF4F8B]">
            <p className="text-gray-700 dark:text-gray-300 italic">"The beauty of a woman is not in a facial mode, but the true beauty in a woman is reflected in her soul."</p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        </div>

        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <FiTag className="w-4 h-4 text-gray-400" />
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">#{tag}</span>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold text-lg">B</div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
            <p className="text-sm text-gray-500">Beauty & Lifestyle Editor</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
