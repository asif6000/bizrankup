import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { FiSave, FiPlus, FiTrash2, FiMove } from 'react-icons/fi'

function LinkEditor({ label, links, onChange, maxItems = 10 }) {
  const addLink = () => {
    if (links.length >= maxItems) return
    onChange([...links, { label: '', href: '' }])
  }
  const updateLink = (i, field, value) => {
    const next = links.map((lnk, idx) => idx === i ? { ...lnk, [field]: value } : lnk)
    onChange(next)
  }
  const removeLink = (i) => onChange(links.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-2">
      {links.map((lnk, i) => (
        <div key={i} className="flex items-center gap-2">
          <FiMove className="w-4 h-4 text-gray-400 shrink-0" />
          <input value={lnk.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          <input value={lnk.href} onChange={e => updateLink(i, 'href', e.target.value)} placeholder="/path" className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono text-xs" />
          <button onClick={() => removeLink(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3 h-3" /></button>
        </div>
      ))}
      {links.length < maxItems && (
        <button onClick={addLink} className="flex items-center gap-1 text-xs text-[#FF4F8B] font-semibold hover:underline">
          <FiPlus className="w-3 h-3" /> Add {label}
        </button>
      )}
    </div>
  )
}

export default function AdminHeaderFooter() {
  const { headerSettings, setHeaderSettings, footerSettings, setFooterSettings } = useAdmin()
  const [tab, setTab] = useState('header')
  const [saved, setSaved] = useState(false)

  const saveHeader = (e) => {
    e.preventDefault()
    setHeaderSettings({ ...headerSettings })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveFooter = (e) => {
    e.preventDefault()
    setFooterSettings({ ...footerSettings })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Header & Footer</h1>
        {saved && <span className="text-sm text-emerald-500 font-semibold">Saved!</span>}
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('header')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'header' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Header Settings</button>
        <button onClick={() => setTab('footer')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'footer' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Footer Settings</button>
      </div>

      {tab === 'header' && (
        <form onSubmit={saveHeader} className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Branding & Top Bar</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Logo Text</label>
                <input value={headerSettings.logoText} onChange={e => setHeaderSettings({...headerSettings, logoText: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search Placeholder</label>
                <input value={headerSettings.searchPlaceholder} onChange={e => setHeaderSettings({...headerSettings, searchPlaceholder: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Promo Bar Text</label>
              <input value={headerSettings.promoBar} onChange={e => setHeaderSettings({...headerSettings, promoBar: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Promo Code Highlight</label>
                <input value={headerSettings.promoCode} onChange={e => setHeaderSettings({...headerSettings, promoCode: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cart Button Label</label>
                <input value={headerSettings.cartLabel} onChange={e => setHeaderSettings({...headerSettings, cartLabel: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Navigation Items</h3>
            <p className="text-xs text-gray-400 mb-3">These appear in the main nav bar.</p>
            <LinkEditor label="nav item" links={headerSettings.navItems} onChange={v => setHeaderSettings({...headerSettings, navItems: v})} maxItems={8} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Collection Subcategories</h3>
            <p className="text-xs text-gray-400 mb-3">Appear in the Collection mega menu dropdown.</p>
            <LinkEditor label="subcategory" links={headerSettings.collectionSubs} onChange={v => setHeaderSettings({...headerSettings, collectionSubs: v})} maxItems={10} />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-1.5 px-6 py-2.5 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
              <FiSave className="w-4 h-4" /> Save Header Settings
            </button>
          </div>
        </form>
      )}

      {tab === 'footer' && (
        <form onSubmit={saveFooter} className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Brand Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Brand Name</label>
                <input value={footerSettings.brandName} onChange={e => setFooterSettings({...footerSettings, brandName: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                <input value={footerSettings.email} onChange={e => setFooterSettings({...footerSettings, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tagline</label>
              <textarea value={footerSettings.brandTagline} onChange={e => setFooterSettings({...footerSettings, brandTagline: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Address</label>
                <input value={footerSettings.address} onChange={e => setFooterSettings({...footerSettings, address: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                <input value={footerSettings.phone} onChange={e => setFooterSettings({...footerSettings, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Newsletter</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Heading</label>
                <input value={footerSettings.newsletterHeading} onChange={e => setFooterSettings({...footerSettings, newsletterHeading: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Placeholder</label>
                <input value={footerSettings.newsletterPlaceholder} onChange={e => setFooterSettings({...footerSettings, newsletterPlaceholder: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subtext</label>
              <input value={footerSettings.newsletterSubtext} onChange={e => setFooterSettings({...footerSettings, newsletterSubtext: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Social Links</h3>
            <div className="space-y-2">
              {footerSettings.socialLinks.map((sl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-24 text-xs font-medium text-gray-500">{sl.platform}</span>
                  <input value={sl.url} onChange={e => {
                    const next = footerSettings.socialLinks.map((s, idx) => idx === i ? { ...s, url: e.target.value } : s)
                    setFooterSettings({...footerSettings, socialLinks: next})
                  }} placeholder="https://..." className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Footer Link Sections</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shop Links</p>
                <LinkEditor label="shop link" links={footerSettings.shopLinks} onChange={v => setFooterSettings({...footerSettings, shopLinks: v})} maxItems={10} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Support Links</p>
                <LinkEditor label="support link" links={footerSettings.supportLinks} onChange={v => setFooterSettings({...footerSettings, supportLinks: v})} maxItems={10} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Company Links</p>
                <LinkEditor label="company link" links={footerSettings.companyLinks} onChange={v => setFooterSettings({...footerSettings, companyLinks: v})} maxItems={10} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bottom Bar Links</p>
                <LinkEditor label="bottom link" links={footerSettings.bottomLinks} onChange={v => setFooterSettings({...footerSettings, bottomLinks: v})} maxItems={6} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Copyright</h3>
            <input value={footerSettings.copyright} onChange={e => setFooterSettings({...footerSettings, copyright: e.target.value})} placeholder="BizRank. All rights reserved." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            <p className="text-xs text-gray-400 mt-1">The year is automatically prepended: &copy; 2026 {footerSettings.copyright}</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-1.5 px-6 py-2.5 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
              <FiSave className="w-4 h-4" /> Save Footer Settings
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
