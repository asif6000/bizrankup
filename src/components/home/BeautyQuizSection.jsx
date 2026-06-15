import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiRefreshCw, FiStar, FiCheck, FiRotateCcw } from 'react-icons/fi'
import { products } from '../../data'
import { formatPrice } from '../../utils/formatters'

const steps = [
  {
    question: 'What\'s your skin type?',
    options: [
      { id: 'dry', label: 'Dry', emoji: '🍂', desc: 'Tight, flaky, needs hydration', gradient: 'from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30', icon: '💧' },
      { id: 'oily', label: 'Oily', emoji: '✨', desc: 'Shiny, prone to breakouts', gradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30', icon: '🌟' },
      { id: 'combination', label: 'Combination', emoji: '🌀', desc: 'Oily T-zone, dry cheeks', gradient: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30', icon: '⚖️' },
      { id: 'normal', label: 'Normal', emoji: '🌿', desc: 'Balanced, minimal concerns', gradient: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30', icon: '🌱' },
    ],
  },
  {
    question: 'Your biggest concern?',
    options: [
      { id: 'aging', label: 'Anti-Aging', emoji: '🌟', desc: 'Fine lines, loss of firmness', gradient: 'from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30', icon: '✨' },
      { id: 'acne', label: 'Acne & Blemishes', emoji: '💫', desc: 'Breakouts, dark spots', gradient: 'from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30', icon: '🔬' },
      { id: 'brightening', label: 'Brightening', emoji: '☀️', desc: 'Dullness, uneven tone', gradient: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30', icon: '💡' },
      { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸', desc: 'Redness, irritation', gradient: 'from-teal-100 to-green-100 dark:from-teal-900/30 dark:to-green-900/30', icon: '🌿' },
    ],
  },
]

const results = {
  'dry-aging': { text: 'Hydrating & Firming Routine', desc: 'Deep hydration meets firming actives for mature skin', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-pink-500', products: products.slice(0, 4) },
  'dry-acne': { text: 'Gentle Hydrating + Clarifying', desc: 'Soothing hydration that won\'t clog pores', link: '/category/skincare?concern=acne', gradient: 'from-pink-400 to-purple-500', products: products.slice(2, 6) },
  'dry-brightening': { text: 'Nourishing Glow Routine', desc: 'Rich textures that illuminate and hydrate', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-500', products: products.slice(4, 8) },
  'dry-sensitivity': { text: 'Soothing Calming Routine', desc: 'Gentle, nourishing care for reactive skin', link: '/category/skincare?concern=sensitive', gradient: 'from-green-400 to-teal-500', products: products.slice(6, 10) },
  'oily-aging': { text: 'Lightweight Firming Routine', desc: 'Oil-free actives that firm without heaviness', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-500 to-purple-600', products: products.slice(8, 12) },
  'oily-acne': { text: 'Oil-Control + Clarifying', desc: 'Balance sebum while targeting breakouts', link: '/category/skincare?concern=acne', gradient: 'from-purple-500 to-indigo-600', products: products.slice(10, 14) },
  'oily-brightening': { text: 'Mattifying Brightening Routine', desc: 'Shine-free radiance for oily complexions', link: '/category/skincare?concern=brightening', gradient: 'from-amber-500 to-orange-500', products: products.slice(12, 16) },
  'oily-sensitivity': { text: 'Oil-Free Soothing Routine', desc: 'Calm redness without adding oil', link: '/category/skincare?concern=sensitive', gradient: 'from-teal-400 to-green-500', products: products.slice(14, 18) },
  'combination-aging': { text: 'Balanced Firming Routine', desc: 'Targeted care for combination mature skin', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-purple-500', products: products.slice(0, 4) },
  'combination-acne': { text: 'Balanced Clarifying Routine', desc: 'Treat breakouts without over-drying', link: '/category/skincare?concern=acne', gradient: 'from-pink-500 to-purple-600', products: products.slice(2, 6) },
  'combination-brightening': { text: 'Balanced Glow Routine', desc: 'Even-toned radiance for combination skin', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-500', products: products.slice(4, 8) },
  'combination-sensitivity': { text: 'Balanced Soothing Routine', desc: 'Gentle care that respects oily and dry areas', link: '/category/skincare?concern=sensitive', gradient: 'from-green-400 to-emerald-500', products: products.slice(6, 10) },
  'normal-aging': { text: 'Preventive Firming Routine', desc: 'Early prevention for lasting youthful skin', link: '/category/skincare?concern=anti-aging', gradient: 'from-rose-400 to-indigo-500', products: products.slice(8, 12) },
  'normal-acne': { text: 'Gentle Maintenance Routine', desc: 'Keep clear skin without harsh actives', link: '/category/skincare?concern=acne', gradient: 'from-purple-400 to-pink-500', products: products.slice(10, 14) },
  'normal-brightening': { text: 'Radiance Boost Routine', desc: 'Enhance your natural glow', link: '/category/skincare?concern=brightening', gradient: 'from-amber-400 to-rose-400', products: products.slice(12, 16) },
  'normal-sensitivity': { text: 'Gentle Care Routine', desc: 'Maintain healthy skin with soothing essentials', link: '/category/skincare?concern=sensitive', gradient: 'from-teal-400 to-green-400', products: products.slice(14, 18) },
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500 ${
            i < current
              ? 'bg-[#FF4F8B] text-white shadow-md shadow-pink-500/30 scale-110'
              : i === current
              ? 'bg-white dark:bg-gray-800 text-[#FF4F8B] ring-2 ring-[#FF4F8B] shadow-md shadow-pink-500/20'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          }`}>
            {i < current ? <FiCheck className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-10 h-0.5 rounded-full transition-all duration-500 ${
              i < current ? 'bg-[#FF4F8B]' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BeautyQuizSection() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    setEntering(true)
    const t = setTimeout(() => setEntering(false), 500)
    return () => clearTimeout(t)
  }, [step])

  const handleSelect = (id) => {
    setSelected(id)
    setTimeout(() => {
      const newAnswers = [...answers, id]
      setAnswers(newAnswers)
      setSelected(null)
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        setStep(steps.length)
      }
    }, 500)
  }

  const reset = () => {
    setStep(0)
    setAnswers([])
    setSelected(null)
  }

  const resultKey = answers.length === 2 ? answers.join('-') : null
  const result = resultKey && results[resultKey] ? results[resultKey] : results['normal-brightening']

  return (
    <section className="py-6 md:py-10">
      <div className="relative overflow-hidden rounded-none md:rounded-2xl bg-gradient-to-br from-gray-50 via-white to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-y md:border border-gray-100 dark:border-gray-700/50">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-10 left-10 w-3 h-3 border border-current rounded" />
          <div className="absolute top-20 right-20 w-2 h-2 border border-current rounded" />
          <div className="absolute bottom-16 left-1/4 w-4 h-4 border border-current rounded" />
          <div className="absolute bottom-32 right-1/3 w-2 h-2 border border-current rounded" />
          <div className="absolute top-1/2 left-16 w-2.5 h-2.5 border border-current rounded" />
          <div className="absolute top-1/3 right-12 w-3 h-3 border border-current rounded" />
        </div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-200/20 dark:bg-pink-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-300/50 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-300/30 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10 p-6 md:p-10 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#FF4F8B]/10 to-purple-500/10 dark:from-[#FF4F8B]/20 dark:to-purple-500/20 rounded-full mb-4">
              <FiStar className="w-3 h-3 text-[#FF4F8B] fill-[#FF4F8B]" />
              <span className="text-[10px] font-semibold text-[#FF4F8B] tracking-wider uppercase">Beauty Quiz</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Find Your <span className="bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] bg-clip-text text-transparent">Perfect Routine</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Answer 2 quick questions and we&rsquo;ll curate a routine tailored to your unique beauty profile
            </p>
            {step < steps.length && <StepIndicator current={step} total={steps.length} />}
          </div>

          {step < steps.length ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-7">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 tracking-[0.15em] uppercase">Question {step + 1} of {steps.length}</span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1.5">{steps[step].question}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                {steps[step].options.map((opt, i) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={selected !== null}
                    className={`group relative overflow-hidden text-left p-5 md:p-6 rounded-xl border-2 transition-all duration-400 ${
                      selected === opt.id
                        ? 'border-[#FF4F8B] bg-gradient-to-br ' + opt.gradient + ' shadow-lg shadow-pink-500/20 scale-[0.97]'
                        : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:border-[#FF4F8B]/40 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1'
                    } ${selected !== null && selected !== opt.id ? 'opacity-30 scale-[0.95] pointer-events-none' : ''} ${entering ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/50 dark:bg-white/5 rounded-full blur-xl" />
                    <div className="relative z-10">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm transition-all duration-300 ${
                        selected === opt.id
                          ? 'bg-white dark:bg-gray-800 scale-110'
                          : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm group-hover:scale-105'
                      }`}>
                        <span className="text-xl md:text-2xl">{opt.emoji}</span>
                      </div>
                      {selected === opt.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF4F8B] rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                          <FiCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <h4 className="font-bold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-[#FF4F8B] transition-colors">{opt.label}</h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                    <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] scale-x-0 transition-transform duration-500 ${
                      selected === opt.id ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5">
                <FiStar className="w-7 h-7 text-[#FF4F8B] fill-[#FF4F8B]" />
              </div>
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${result.gradient} text-white text-sm font-bold shadow-lg mb-3`}>
                ✨ {result.text}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">{result.desc}</p>

              {result.products && (
                <div className="mt-7 mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {result.products.slice(0, 4).map((p, i) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="group/product flex flex-col items-center gap-1.5"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                          style={{ transform: `rotate(${(i - 1.5) * 4}deg)` }}
                        >
                          <img src={p.image} alt="" className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[72px] truncate font-medium">{p.name.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="text-[10px] font-semibold text-gray-800 dark:text-gray-200">{formatPrice(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to={result.link} className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all shadow-lg shadow-gray-900/15 hover:shadow-xl">
                  View My Routine <FiArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95 transition-all shadow-sm">
                  <FiRotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>
            </div>
          )}

          {step < steps.length && (
            <div className="text-center mt-6">
              <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FF4F8B] transition-all px-3 py-1.5 rounded-lg hover:bg-[#FF4F8B]/5">
                <FiRotateCcw className="w-3 h-3" /> Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
