import { useState } from 'react'

export default function ProductGallery({ images }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img src={images[selected]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-crosshair" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setSelected(i)} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === selected ? 'border-[#FF4F8B] shadow-md shadow-pink-500/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
