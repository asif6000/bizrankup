import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiChevronRight, FiRefreshCw } from 'react-icons/fi'

const steps = [
  {
    question: 'What\'s your skin type?',
    options: [
      { id: 'dry', label: 'Dry', emoji: '🍂', desc: 'Tight, flaky, needs hydration' },
      { id: 'oily', label: 'Oily', emoji: '✨', desc: 'Shiny, prone to breakouts' },
      { id: 'combination', label: 'Combination', emoji: '🌀', desc: 'Oily T-zone, dry cheeks' },
      { id: 'normal', label: 'Normal', emoji: '🌿', desc: 'Balanced, minimal concerns' },
    ],
  },
  {
    question: 'Your biggest concern?',
    options: [
      { id: 'aging', label: 'Anti-Aging', emoji: '🌟', desc: 'Fine lines, loss of firmness' },
      { id: 'acne', label: 'Acne & Blemishes', emoji: '💫', desc: 'Breakouts, dark spots' },
      { id: 'brightening', label: 'Brightening', emoji: '☀️', desc: 'Dullness, uneven tone' },
      { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸', desc: 'Redness, irritation' },
    ],
  },
]

const results = {
  'dry-aging': { text: 'Hydrating & Firming Routine', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-pink-500' },
  'dry-acne': { text: 'Gentle Hydrating + Clarifying', link: '/category/skincare?concern=acne', gradient: 'from-pink-400 to-purple-500' },
  'dry-brightening': { text: 'Nourishing Glow Routine', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-500' },
  'dry-sensitivity': { text: 'Soothing Calming Routine', link: '/category/skincare?concern=sensitive', gradient: 'from-green-400 to-teal-500' },
  'oily-aging': { text: 'Lightweight Firming Routine', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-500 to-purple-600' },
  'oily-acne': { text: 'Oil-Control + Clarifying', link: '/category/skincare?concern=acne', gradient: 'from-purple-500 to-indigo-600' },
  'oily-brightening': { text: 'Mattifying Brightening Routine', link: '/category/skincare?concern=brightening', gradient: 'from-amber-500 to-orange-500' },
  'oily-sensitivity': { text: 'Oil-Free Soothing Routine', link: '/category/skincare?concern=sensitive', gradient: 'from-teal-400 to-green-500' },
  'combination-aging': { text: 'Balanced Firming Routine', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-purple-500' },
  'combination-acne': { text: 'Balanced Clarifying Routine', link: '/category/skincare?concern=acne', gradient: 'from-pink-500 to-purple-600' },
  'combination-brightening': { text: 'Balanced Glow Routine', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-500' },
  'combination-sensitivity': { text: 'Balanced Soothing Routine', link: '/category/skincare?concern=sensitive', gradient: 'from-green-400 to-emerald-500' },
  'normal-aging': { text: 'Preventive Firming Routine', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-indigo-500' },
  'normal-acne': { text: 'Gentle Maintenance Routine', link: '/category/skincare?concern=acne', gradient: 'from-purple-400 to-pink-500' },
  'normal-brightening': { text: 'Radiance Boost Routine', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-400' },
  'normal-sensitivity': { text: 'Gentle Care Routine', link: '/category/skincare?concern=sensitive', gradient: 'from-teal-400 to-green-400' },
}

export default function BeautyQuizSection() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const handleSelect = (id) => {
    setSelected(id)
    setTimeout(() => {
      const newAnswers = [...answers, id]
      setAnswers(newAnswers)
      setSelected(null)
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        setStep(steps.length) // show result
      }
    }, 400)
  }

  const reset = () => {
    setStep(0)
    setAnswers([])
    setSelected(null)
  }

  const resultKey = answers.length === 2 ? answers.join('-') : null
  const result = resultKey && results[resultKey] ? results[resultKey] : results['normal-brightening']

  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="bg-gradient-to-br from-gray-50 to-pink-50/50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-[#FF4F8B]/10 text-[#FF4F8B] text-[10px] font-semibold rounded-full mb-3 tracking-wider uppercase">Interactive</span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">Find Your Perfect Routine</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Answer 2 quick questions and we&rsquo;ll curate a routine just for you</p>
          {step < steps.length && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {steps.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-[#FF4F8B]' : 'w-1.5 bg-gray-200 dark:bg-gray-600'}`} />
              ))}
            </div>
          )}
        </div>

        {step < steps.length ? (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">{steps[step].question}</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {steps[step].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={selected !== null}
                  className={`group text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 ${
                    selected === opt.id
                      ? 'border-[#FF4F8B] bg-[#FF4F8B]/5 scale-[0.97]'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#FF4F8B]/50 hover:shadow-md'
                  } ${selected !== null && selected !== opt.id ? 'opacity-50 scale-[0.97]' : ''}`}
                >
                  <span className="text-2xl md:text-3xl block mb-2">{opt.emoji}</span>
                  <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-[#FF4F8B] transition-colors">{opt.label}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${result.gradient} text-white text-sm font-semibold mb-4`}>
              ✨ {result.text}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">We&rsquo;ve found the perfect products for your unique beauty profile</p>
            <div className="flex items-center justify-center gap-3">
              <Link to={result.link} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all">
                View My Routine <FiArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all">
                <FiRefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
            </div>
          </div>
        )}

        {step < steps.length && (
          <div className="text-center mt-6">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Start over
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
