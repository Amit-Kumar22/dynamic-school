'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, logout } from '@/utils/auth'
import { 
  FaHome, 
  FaInfoCircle, 
  FaUserGraduate, 
  FaImages, 
  FaPhone,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUser,
  FaChevronDown,
  FaTachometerAlt,
  FaBell,
  FaCogs,
  FaClock,
  FaExclamationTriangle,
  FaBuilding
} from 'react-icons/fa'
import Link from 'next/link'

export default function AdminDashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin')
    } else {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    {
      title: 'Dashboard',
      icon: FaTachometerAlt,
      link: '/admin/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Hero Section',
      icon: FaHome,
      link: '/admin/dashboard/hero',
      color: 'text-blue-600'
    },
    {
      title: 'About Section',
      icon: FaInfoCircle,
      link: '/admin/dashboard/about',
      color: 'text-green-600'
    },
    {
      title: 'Our Services',
      icon: FaCogs,
      link: '/admin/dashboard/services',
      color: 'text-teal-600'
    },
    {
      title: 'Facilities',
      icon: FaBuilding,
      link: '/admin/dashboard/facilities',
      color: 'text-purple-600'
    },
    {
      title: 'Admissions',
      icon: FaUserGraduate,
      link: '/admin/dashboard/admissions',
      color: 'text-purple-600'
    },
    {
      title: 'Notice Management',
      icon: FaBell,
      link: '/admin/dashboard/notice',
      color: 'text-orange-600'
    },
    {
      title: 'Important Notice',
      icon: FaExclamationTriangle,
      link: '/admin/dashboard/important-notice',
      color: 'text-yellow-600'
    },
    {
      title: 'School Timing',
      icon: FaClock,
      link: '/admin/dashboard/school-timing',
      color: 'text-red-600'
    },
    {
      title: 'Gallery',
      icon: FaImages,
      link: '/admin/dashboard/gallery',
      color: 'text-pink-600'
    },
    {
      title: 'Contact Info',
      icon: FaPhone,
      link: '/admin/dashboard/contact',
      color: 'text-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <FaGraduationCap className="text-xl text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">School Admin</h2>
              <p className="text-xs text-gray-500">CMS Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.link
            return (
              <Link
                key={item.title}
                href={item.link}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`text-lg ${isActive ? item.color : 'text-gray-400'}`} />
                <span className="text-sm">{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30 shadow-sm">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="text-lg text-gray-700" />
              </button>
              <h1 className="text-base font-semibold text-gray-900">Admin Panel</h1>
            </div>

            {/* Right Side - Profile Dropdown */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                View Website →
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    A
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-900">Admin</p>
                  </div>
                  <FaChevronDown className={`text-gray-400 text-xs transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-fade-in">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500 truncate">admin@gmail.com</p>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false)
                            // Add profile logic here
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <FaUser className="text-gray-400 text-xs" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            setProfileOpen(false)
                            handleLogout()
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <FaSignOutAlt className="text-red-500 text-xs" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
