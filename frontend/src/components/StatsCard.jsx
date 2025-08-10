import React from 'react'

const StatsCard = ({ title, value, icon: Icon, color, trend, sparklineData = [] }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-primary-400 bg-primary-400/10 border-primary-500/30',
    accent: 'from-accent-500 to-accent-600 text-accent-400 bg-accent-400/10 border-accent-500/30',
    'tech-green': 'from-tech-green-500 to-tech-green-600 text-tech-green-400 bg-tech-green-400/10 border-tech-green-500/30',
    'tech-purple': 'from-tech-purple-500 to-tech-purple-600 text-tech-purple-400 bg-tech-purple-400/10 border-tech-purple-500/30',
    'tech-yellow': 'from-tech-yellow-500 to-tech-yellow-600 text-tech-yellow-400 bg-tech-yellow-400/10 border-tech-yellow-500/30',
  }

  const classes = colorClasses[color] || colorClasses.primary
  const maxValue = Math.max(...sparklineData)
  const minValue = Math.min(...sparklineData)
  const range = maxValue - minValue || 1

  return (
    <div className="tech-border rounded-xl p-6 glass hover:shadow-tech transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${classes.split(' ').slice(2).join(' ')} backdrop-blur-sm`}>
          <Icon className={`h-6 w-6 ${classes.split(' ')[2]}`} />
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-dark-400 uppercase">{title}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl font-bold font-mono text-dark-100 group-hover:text-white transition-colors">
            {value}
          </h3>
          {trend && (
            <span className={`text-sm font-medium ${classes.split(' ')[2]}`}>
              {trend}
            </span>
          )}
        </div>
        
        {sparklineData.length > 0 && (
          <div className="h-12 flex items-end space-x-1">
            {sparklineData.map((value, index) => {
              const height = ((value - minValue) / range) * 100
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t opacity-60 rounded-t transition-all duration-300 hover:opacity-100"
                  style={{
                    height: `${height}%`,
                    backgroundImage: `linear-gradient(to top, ${
                      color === 'primary' ? '#0967d2' :
                      color === 'accent' ? '#2cb1bc' :
                      color === 'tech-green' ? '#15b79e' :
                      color === 'tech-purple' ? '#a855f7' :
                      '#f59e0b'
                    }, transparent)`
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
    </div>
  )
}

export default StatsCard
