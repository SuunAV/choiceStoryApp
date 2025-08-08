import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookTemplate, Zap, Settings, HelpCircle, Download } from 'lucide-react'

/**
 * QuickActions Component - Provides quick access to common actions
 * Displayed on the dashboard for easy access to key features
 */
const QuickActions = () => {
  const actions = [
    {
      title: 'Create New Story',
      description: 'Start a new interactive story project',
      icon: Plus,
      href: '/create',
      color: 'bg-primary-600 hover:bg-primary-700',
      primary: true
    },
    {
      title: 'Browse Templates',
      description: 'Use pre-built story templates',
      icon: BookTemplate,
      href: '/templates',
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    },
    {
      title: 'AI Story Generator',
      description: 'Generate stories with AI assistance',
      icon: Zap,
      href: '/ai-generate',
      color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
    },
    {
      title: 'Export Tools',
      description: 'Download and export your stories',
      icon: Download,
      href: '/export',
      color: 'bg-green-100 hover:bg-green-200 text-green-700'
    }
  ]

  const helpLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics',
      icon: HelpCircle,
      href: '/help/getting-started'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      href: '/settings'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`
                  block p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md
                  ${action.primary 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600' 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${action.primary 
                      ? 'bg-primary-500' 
                      : 'bg-gray-100'
                    }
                  `}>
                    <Icon className={`
                      h-5 w-5
                      ${action.primary ? 'text-white' : 'text-gray-600'}
                    `} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`
                      font-medium
                      ${action.primary ? 'text-white' : 'text-gray-900'}
                    `}>
                      {action.title}
                    </h4>
                    <p className={`
                      text-sm
                      ${action.primary ? 'text-primary-100' : 'text-gray-500'}
                    `}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Help & Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Settings</h3>
        <div className="space-y-3">
          {helpLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                to={link.href}
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{link.title}</h4>
                    <p className="text-xs text-gray-500">{link.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-800 mb-3">
          Start with a simple story structure. You can always add more complex choices and branches later.
        </p>
        <Link
          to="/help/best-practices"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Learn best practices →
        </Link>
      </div>
    </div>
  )
}

export default QuickActions
