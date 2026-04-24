'use client'

import { 
  FaHome, 
  FaInfoCircle, 
  FaUserGraduate, 
  FaImages, 
  FaPhone, 
  FaEdit,
  FaChartLine,
  FaCogs,
  FaBullhorn
} from 'react-icons/fa'
import Link from 'next/link'

export default function AdminDashboard() {
  const sections = [
    {
      title: 'Hero Section',
      icon: FaHome,
      description: 'Manage homepage hero banner',
      link: '/admin/dashboard/hero',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      count: '1 item'
    },
    {
      title: 'About Section',
      icon: FaInfoCircle,
      description: 'Update about school information',
      link: '/admin/dashboard/about',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      count: '1 item'
    },
    {
      title: 'Our Services',
      icon: FaCogs,
      description: 'Manage school services',
      link: '/admin/dashboard/services',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      count: 'Multiple items'
    },
    {
      title: 'Admissions',
      icon: FaUserGraduate,
      description: 'Manage admission process',
      link: '/admin/dashboard/admissions',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      count: 'Multiple steps'
    },
    {
      title: 'Gallery',
      icon: FaImages,
      description: 'Manage school gallery',
      link: '/admin/dashboard/gallery',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      count: 'Multiple items'
    },
    {
      title: 'Notices',
      icon: FaBullhorn,
      description: 'Manage school notices',
      link: '/admin/dashboard/notice',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      count: 'Multiple items'
    },
    {
      title: 'Contact Info',
      icon: FaPhone,
      description: 'Update contact details',
      link: '/admin/dashboard/contact',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      count: '1 item'
    }
  ]

  return (
    <div>
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back, Admin! 👋</h2>
            <p className="text-blue-100 text-sm sm:text-base">Manage all your school website content from here</p>
          </div>
          <div className="hidden sm:flex w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl items-center justify-center">
            <FaChartLine className="text-3xl" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className={`${section.bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow`}
            >
              <Icon className={`text-2xl ${section.textColor} mb-2`} />
              <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate mb-1">{section.title}</p>
              <p className="text-xs text-gray-500">{section.count}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.title}
                href={section.link}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="text-xl text-white" />
                    </div>
                    <FaEdit className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                  <div className="flex items-center text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Content
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Click on any section card above to edit its content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Changes are saved immediately and reflected on the website</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Use high-quality images for better visual appeal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
