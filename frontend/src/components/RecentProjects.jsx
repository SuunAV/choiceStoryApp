import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MoreVertical, Calendar, BookOpen, GitBranch, 
  Activity, TrendingUp, AlertCircle, CheckCircle,
  Clock, BarChart2
} from 'lucide-react'

const RecentProjects = ({ projects = [] }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-tech-green-400',
          bg: 'bg-tech-green-400/10',
          border: 'border-tech-green-500/30',
          icon: CheckCircle,
          label: 'DEPLOYED'
        }
      case 'in-progress':
        return {
          color: 'text-primary-400',
          bg: 'bg-primary-400/10',
          border: 'border-primary-500/30',
          icon: Activity,
          label: 'ACTIVE'
        }
      case 'draft':
        return {
          color: 'text-dark-400',
          bg: 'bg-dark-400/10',
          border: 'border-dark-500/30',
          icon: AlertCircle,
          label: 'DRAFT'
        }
      default:
        return {
          color: 'text-dark-400',
          bg: 'bg-dark-400/10',
          border: 'border-dark-500/30',
          icon: AlertCircle,
          label: 'UNKNOWN'
        }
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 1) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Unknown'
    }
  }

  if (!projects.length) {
    return (
      <div className="tech-border rounded-xl p-8 glass text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800/50 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-dark-500" />
        </div>
        <p className="text-dark-300 mb-4 font-mono">NO_PROJECTS_FOUND</p>
        <Link
          to="/create"
          className="tech-button rounded-lg inline-flex items-center"
        >
          Initialize First Story
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const statusConfig = getStatusConfig(project.status)
        const StatusIcon = statusConfig.icon
        
        return (
          <div
            key={project.id}
            className="tech-border rounded-lg p-5 glass hover:shadow-neon-blue transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold text-dark-100 group-hover:text-white transition-colors">
                    {project.title}
                  </h4>
                  <div className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-mono
                    ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border
                  `}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-dark-500" />
                    <span className="text-dark-300 font-mono">{formatDate(project.lastModified)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary-400" />
                    <span className="text-dark-300">
                      <span className="font-mono text-primary-400">{project.chapters}</span> chapters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-accent-400" />
                    <span className="text-dark-300">
                      <span className="font-mono text-accent-400">{project.choices}</span> choices
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-tech-green-400" />
                    <span className="text-dark-300">
                      <span className="font-mono text-tech-green-400">{project.engagement}%</span> engage
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-dark-400 font-mono">PERFORMANCE</span>
                      <span className="text-xs font-mono text-tech-green-400">{project.performance}%</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-tech-green-500 to-tech-green-400 h-1.5 rounded-full transition-all duration-500"
                        style={{width: `${project.performance}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {project.status === 'completed' && (
                  <button className="px-3 py-1.5 bg-tech-green-500/20 text-tech-green-400 rounded-lg hover:bg-tech-green-500/30 transition-all text-sm font-medium">
                    <BarChart2 className="h-4 w-4 inline mr-1" />
                    Analytics
                  </button>
                )}
                {project.status === 'in-progress' && (
                  <button className="px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-all text-sm font-medium">
                    Continue
                  </button>
                )}
                <button className="p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 rounded-lg transition-all">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RecentProjects