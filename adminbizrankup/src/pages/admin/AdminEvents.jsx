import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminModal } from '../../components/admin/Shared'
import {
  FiPlus, FiCalendar, FiMapPin, FiUser, FiExternalLink,
  FiEdit2, FiTrash2, FiSearch, FiCalendar as FiCal,
  FiActivity, FiFacebook, FiBarChart2, FiMusic,
  FiClock, FiGlobe,
} from 'react-icons/fi'

const statusColors = {
  upcoming: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  ongoing: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  completed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

const typeColors = {
  promotion: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  workshop: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  webinar: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  launch: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  sale: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
}

const sourceConfig = {
  facebook: { label: 'Facebook', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', icon: FiFacebook },
  ga4: { label: 'Google Analytics', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400', icon: FiBarChart2 },
  tiktok: { label: 'TikTok', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400', icon: FiMusic },
}

const eventIcons = {
  PageView: FiGlobe,
  ViewContent: FiGlobe,
  Purchase: FiCalendar,
  AddToCart: FiCalendar,
  InitiateCheckout: FiCalendar,
  Lead: FiUser,
  CompleteRegistration: FiUser,
  Search: FiSearch,
}

export default function AdminEvents() {
  const { events, setEvents, addItem, updateItem, deleteItem, trackingEvents, setTrackingEvents } = useAdmin()
  const [tab, setTab] = useState('tracking')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', image: '', startDate: '', endDate: '',
    location: '', organizer: '', status: 'upcoming', type: 'promotion', link: '',
  })

  const [sourceFilter, setSourceFilter] = useState('')
  const [trackingSearch, setTrackingSearch] = useState('')
  const [viewingTrack, setViewingTrack] = useState(null)

  const totalEvents = events.length
  const upcomingCount = events.filter(e => e.status === 'upcoming').length
  const ongoingCount = events.filter(e => e.status === 'ongoing').length
  const completedCount = events.filter(e => e.status === 'completed').length

  const filtered = events.filter(e => {
    if (statusFilter && e.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q) ||
        e.type?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const fbCount = trackingEvents.filter(e => e.source === 'facebook').length
  const ga4Count = trackingEvents.filter(e => e.source === 'ga4').length
  const tiktokCount = trackingEvents.filter(e => e.source === 'tiktok').length

  const filteredTracking = trackingEvents.filter(e => {
    if (sourceFilter && e.source !== sourceFilter) return false
    if (trackingSearch) {
      const q = trackingSearch.toLowerCase()
      return (
        e.event_name?.toLowerCase().includes(q) ||
        e.source?.toLowerCase().includes(q) ||
        e.page_url?.toLowerCase().includes(q) ||
        JSON.stringify(e.event_data || {}).toLowerCase().includes(q)
      )
    }
    return true
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', description: '', image: '', startDate: '', endDate: '', location: '', organizer: '', status: 'upcoming', type: 'promotion', link: '' })
    setShowForm(true)
  }

  const openEdit = (e) => {
    setEditing(e)
    setForm({
      title: e.title, description: e.description, image: e.image,
      startDate: e.startDate, endDate: e.endDate, location: e.location,
      organizer: e.organizer, status: e.status, type: e.type, link: e.link,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.startDate) return
    if (editing) {
      await updateItem('events', setEvents, editing.id, form)
    } else {
      await addItem('events', setEvents, form)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteItem('events', setEvents, id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-sm text-gray-500 mt-1">Manage events & monitor tracking activity</p>
        </div>
        {tab === 'events' && (
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
            <FiPlus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => setTab('tracking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'tracking'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FiActivity className="w-4 h-4" />
          Tracking Log
          {trackingEvents.length > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FF4F8B]/10 text-[#FF4F8B]">
              {trackingEvents.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'events'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FiCalendar className="w-4 h-4" />
          Events
          {events.length > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300">
              {events.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'tracking' ? (
        <>
          {/* Tracking Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{trackingEvents.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiFacebook className="w-3 h-3 text-blue-600" />
                <p className="text-xs text-gray-500 uppercase font-semibold">Facebook</p>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{fbCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiBarChart2 className="w-3 h-3 text-orange-500" />
                <p className="text-xs text-gray-500 uppercase font-semibold">GA4</p>
              </div>
              <p className="text-2xl font-bold text-orange-500 mt-1">{ga4Count}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMusic className="w-3 h-3 text-purple-500" />
                <p className="text-xs text-gray-500 uppercase font-semibold">TikTok</p>
              </div>
              <p className="text-2xl font-bold text-purple-500 mt-1">{tiktokCount}</p>
            </div>
          </div>

          {/* Tracking Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={trackingSearch}
              onChange={e => setTrackingSearch(e.target.value)}
              placeholder="Search events..."
              className="w-48 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors"
            />
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            <button onClick={() => setSourceFilter('')} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${!sourceFilter ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'}`}>All</button>
            {[
              { key: 'facebook', label: 'Facebook', color: 'text-blue-600' },
              { key: 'ga4', label: 'GA4', color: 'text-orange-500' },
              { key: 'tiktok', label: 'TikTok', color: 'text-purple-500' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSourceFilter(s.key)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  sourceFilter === s.key
                    ? 'bg-[#FF4F8B] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className={sourceFilter === s.key ? 'text-white' : s.color}>●</span>
                {s.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => setTrackingEvents([])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <FiTrash2 className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Tracking Event List */}
          {filteredTracking.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <FiActivity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No tracking events yet.</p>
              <p className="text-xs text-gray-400 mt-1">Events from Facebook Pixel, GA4, and TikTok will appear here in real-time.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredTracking.map((ev, i) => {
                  const cfg = sourceConfig[ev.source] || sourceConfig.facebook
                  const Icon = cfg.icon
                  const EventIcon = eventIcons[ev.event_name] || FiActivity
                  const time = ev.created_at
                    ? new Date(ev.created_at).toLocaleTimeString()
                    : ''

                  return (
                    <div
                      key={ev.id || i}
                      className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => setViewingTrack(ev)}
                    >
                      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color.split(' ').slice(0, 2).join(' ')}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ev.event_name}</span>
                        </div>
                        {ev.page_url && (
                          <p className="text-xs text-gray-400 truncate">{ev.page_url}</p>
                        )}
                        {ev.event_data && Object.keys(ev.event_data).length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
                            {JSON.stringify(ev.event_data).substring(0, 100)}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
                        <FiClock className="w-3 h-3" />
                        <span>{time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* View Tracking Event Modal */}
          <AdminModal open={!!viewingTrack} onClose={() => setViewingTrack(null)} title="Tracking Event Details" size="lg">
            {viewingTrack && (() => {
              const cfg = sourceConfig[viewingTrack.source]
              const TrackIcon = cfg?.icon || FiActivity
              const colorClass = cfg?.color || 'bg-gray-100 text-gray-600'
              return (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass.split(' ').slice(0, 2).join(' ') || 'bg-gray-100'}`}>
                    <TrackIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${cfg?.color || 'bg-gray-100 text-gray-600'}`}>
                        {cfg?.label || viewingTrack.source}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{viewingTrack.event_name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {viewingTrack.created_at ? new Date(viewingTrack.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                </div>

                {viewingTrack.page_url && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Page URL</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{viewingTrack.page_url}</p>
                  </div>
                )}

                {viewingTrack.session_id && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Session ID</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{viewingTrack.session_id}</p>
                  </div>
                )}

                {viewingTrack.event_data && Object.keys(viewingTrack.event_data).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Event Data</p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(viewingTrack.event_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
          </AdminModal>
        </>
      ) : (
        <>
          {/* CMS Events Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalEvents}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-xs text-gray-500 uppercase font-semibold">Upcoming</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{upcomingCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-gray-500 uppercase font-semibold">Ongoing</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{ongoingCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <p className="text-xs text-gray-500 uppercase font-semibold">Completed</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="w-48 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            <button onClick={() => setStatusFilter('')} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${!statusFilter ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'}`}>All</button>
            {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'}`}>{s}</button>
            ))}
          </div>

          {/* Event Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No events found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(event => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all group cursor-pointer"
                  onClick={() => setViewing(event)}
                >
                  {event.image ? (
                    <div className="h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 flex items-center justify-center">
                      <FiCal className="w-10 h-10 text-[#FF4F8B]/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">{event.title}</h3>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${statusColors[event.status] || statusColors.upcoming}`}>{event.status}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FiCal className="w-3 h-3 shrink-0" />
                        <span>{event.startDate}{event.endDate ? ` - ${event.endDate}` : ''}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FiMapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FiUser className="w-3 h-3 shrink-0" />
                          <span className="truncate">{event.organizer}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${typeColors[event.type] || typeColors.promotion}`}>{event.type}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(event)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#FF4F8B] hover:bg-[#FF4F8B]/10 transition-all"><FiEdit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(event.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FiTrash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Modal */}
          <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title || 'Event Details'} size="lg">
            {viewing && (
              <div className="space-y-5">
                {viewing.image && (
                  <div className="h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={viewing.image} alt={viewing.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg capitalize ${statusColors[viewing.status] || statusColors.upcoming}`}>{viewing.status}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg capitalize ${typeColors[viewing.type] || typeColors.promotion}`}>{viewing.type}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</p>
                    <p className="text-gray-900 dark:text-white">{viewing.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">End Date</p>
                    <p className="text-gray-900 dark:text-white">{viewing.endDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Location</p>
                    <p className="text-gray-900 dark:text-white">{viewing.location || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Organizer</p>
                    <p className="text-gray-900 dark:text-white">{viewing.organizer || '-'}</p>
                  </div>
                </div>
                {viewing.description && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewing.description}</p>
                  </div>
                )}
                {viewing.link && (
                  <a href={viewing.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#FF4F8B] hover:underline font-medium">
                    <FiExternalLink className="w-3.5 h-3.5" /> Event Link
                  </a>
                )}
              </div>
            )}
          </AdminModal>

          {/* Add/Edit Modal */}
          <AdminModal open={showForm} onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit Event' : 'Add Event'} size="lg">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date *</label>
                  <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                  <input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                    <option value="promotion">Promotion</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="launch">Launch</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Event location" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Organizer</label>
                  <input type="text" value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))} placeholder="Organizer name" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
                  <input type="url" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Link (Registration)</label>
                  <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Event description" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors resize-none" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="px-5 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update Event' : 'Create Event'}</button>
                <button onClick={() => { setShowForm(false); setEditing(null) }} className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
              </div>
            </div>
          </AdminModal>
        </>
      )}
    </div>
  )
}
