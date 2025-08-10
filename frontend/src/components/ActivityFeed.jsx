import React from 'react'
import {
  GitCommit, UserPlus, FileText, CheckCircle,
  AlertCircle, Upload, Download, Edit3,
  Play, Pause, Share2, Heart
} from 'lucide-react'

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'deploy',
      icon: CheckCircle,
      color: 'text-tech-green-400',
      title: 'Story deployed successfully',
      description: 'The Perfect Gift v2.3.1',
      timestamp: '2 min ago',
      user: 'system'
    },
    {
      id: 2,
      type: 'user',
      icon: UserPlus,
      color: 'text-primary-400',
      title: 'New user registration',
      description: 'user_892 joined the platform',
      timestamp: '5 min ago',
      user: 'auth'
    },
    {
      id: 3,
      type: 'edit',
      icon: Edit3,
      color: 'text-accent-400',
      title: 'Story updated',
      description: 'Adventure Island - Chapter 5 modified',
      timestamp: '12 min ago',
      user: 'editor'
    },
    {
      id: 4,
      type: 'commit',
      icon: GitCommit,
      color: 'text-tech-purple-400',
      title: 'Version control update',
      description: 'Commit: Fix choice logic in scene 3',
      timestamp: '18 min ago',
      user: 'git'
    },
    {
      id: 5,
      type: 'analytics',
      icon: Heart,
      color: 'text-tech-red-400',
      title: 'Milestone reached',
      description: '1000+ reads on Mystery at School',
      timestamp: '25 min ago',
      user: 'analytics'
    },
    {
      id: 6,
      type: 'upload',
      icon: Upload,
      color: 'text-tech-yellow-400',
      title: 'Asset uploaded',
      description: 'New cover image for draft story',
      timestamp: '32 min ago',
      user: 'storage'
    }
  ]

  const getActivityBadge = (type) => {
    const badges = {
      deploy: { bg: 'bg-tech-green-400/10', border: 'border-tech-green-500/30' },
      user: { bg: 'bg-primary-400/10', border: 'border-primary-500/30' },
      edit: { bg: 'bg-accent-400/10', border: 'border-accent-500/30' },
      commit: { bg: 'bg-tech-purple-400/10', border: 'border-tech-purple-500/30' },
      analytics: { bg: 'bg-tech-red-400/10', border: 'border-tech-red-500/30' },
      upload: { bg: 'bg-tech-yellow-400/10', border: 'border-tech-yellow-500/30' }
    }
    return badges[type] || { bg: 'bg-dark-400/10', border: 'border-dark-500/30' }
  }

  return (
    <div className="tech-border rounded-xl p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-100 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-accent-400" />
          Activity Feed
        </h3>
        <button className="text-xs font-mono text-dark-400 hover:text-dark-200 transition-colors">
          VIEW_ALL
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity) => {
          const Icon = activity.icon
          const badge = getActivityBadge(activity.type)
          
          return (
            <div
              key={activity.id}
              className="group relative flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-800/30 transition-all duration-200"
            >
              <div className={`
                p-2 rounded-lg ${badge.bg} ${badge.border} border
                group-hover:scale-110 transition-transform
              `}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark-100 group-hover:text-white transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 space-x-3 text-xs">
                  <span className="font-mono text-dark-500">{activity.timestamp}</span>
                  <span className="text-dark-600">•</span>
                  <span className={`font-mono ${activity.color}`}>{activity.user}</span>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-dark-400">Events today:</span>
            <span className="font-mono text-primary-400">47</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-dark-400">Active users:</span>
            <span className="font-mono text-accent-400">12</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityFeed