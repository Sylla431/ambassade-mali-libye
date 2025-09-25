'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  Upload,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image,
  Tag,
  Shield
} from 'lucide-react'

interface AdminSidebarProps {
  user?: {
    name: string
    role: string
  }
  onLogout: () => void
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      title: 'Articles',
      href: '/admin/articles',
      icon: FileText,
      active: pathname.startsWith('/admin/articles'),
      children: [
        { title: 'Tous les articles', href: '/admin/articles' },
        { title: 'Nouvel article', href: '/admin/articles/new' }
      ]
    },
    {
      title: 'Événements',
      href: '/admin/events',
      icon: Calendar,
      active: pathname.startsWith('/admin/events'),
      children: [
        { title: 'Tous les événements', href: '/admin/events' },
        { title: 'Nouvel événement', href: '/admin/events/new' }
      ]
    },
    {
      title: 'Demandes de visa',
      href: '/admin/visa',
      icon: Users,
      active: pathname.startsWith('/admin/visa')
    },
    {
      title: 'Messages',
      href: '/admin/contact',
      icon: MessageSquare,
      active: pathname.startsWith('/admin/contact')
    },
    {
      title: 'Documents',
      href: '/admin/documents',
      icon: Upload,
      active: pathname.startsWith('/admin/documents')
    },
    {
      title: 'Annonces',
      href: '/admin/announcements',
      icon: BarChart3,
      active: pathname.startsWith('/admin/announcements'),
      children: [
        { title: 'Toutes les annonces', href: '/admin/announcements' },
        { title: 'Nouvelle annonce', href: '/admin/announcements/new' }
      ]
    },
    {
      title: 'Galeries',
      href: '/admin/galleries',
      icon: Image,
      active: pathname.startsWith('/admin/galleries')
    },
    {
      title: 'Catégories',
      href: '/admin/categories',
      icon: Tag,
      active: pathname.startsWith('/admin/categories')
    },
    {
      title: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings')
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } h-screen flex flex-col flex-shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">Admin</h1>
              <p className="text-xs text-gray-400">Ambassade du Mali</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user.role?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.active
            
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </button>
                
                {/* Submenu */}
                {!collapsed && item.children && isActive && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <button
                          onClick={() => handleNavigation(child.href)}
                          className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                            pathname === child.href
                              ? 'text-blue-400 bg-blue-900/30'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Déconnexion</span>
          )}
        </button>
      </div>
    </div>
  )
}
