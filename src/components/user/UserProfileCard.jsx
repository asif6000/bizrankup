export default function UserProfileCard({ user }) {
  return (
    <div className="bg-gradient-to-br from-[#FF4F8B]/10 to-[#7C3AED]/10 rounded-2xl p-6 border border-[#FF4F8B]/20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={user.avatar || 'https://i.pravatar.cc/80?u=default'} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">{user.tier} Member</span>
            <span className="text-xs text-gray-400">Joined {user.joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
