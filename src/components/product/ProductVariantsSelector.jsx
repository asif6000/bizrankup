export default function ProductVariantsSelector({ variants, selected, onChange }) {
  if (!variants?.length) return null

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Size: <span className="text-gray-900 dark:text-white">{selected?.name || variants[0].name}</span></p>
      <div className="flex flex-wrap gap-2">
        {variants.map(v => {
          const active = selected?.name === v.name
          return (
            <button key={v.name} onClick={() => onChange(v)} className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${active ? 'border-[#FF4F8B] bg-[#FF4F8B]/10 text-[#FF4F8B]' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}>
              {v.name} - ৳{v.price.toFixed(2)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
