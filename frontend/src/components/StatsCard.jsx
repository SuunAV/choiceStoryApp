import React from 'react'

/**
 * StatsCard Component - Displays key statistics with icon and trend
 * Used in the dashboard to show project metrics
 * Security: All displayed data is sanitized to prevent XSS
 */
const StatsCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-900'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-900'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  // Sanitize display values to prevent XSS
  const sanitizedTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const sanitizedTrend = trend ? String(trend).replace(/</g, '&lt;').replace(/>/g, '&gt;') : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : String(value)}
          </p>
          {sanitizedTrend && (
            <p className="text-sm text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: sanitizedTrend }} />
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
