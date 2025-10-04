import { LogOut, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { User } from '../types'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: User
}

export function Header({ activeTab, onTabChange, user }: HeaderProps) {
  const { logout } = useAuthStore()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'add', label: 'Add Expense' },
    { id: 'expenses', label: 'My Expenses' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">FinXpense</h1>
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{user.first_name} {user.last_name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{user.role}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
