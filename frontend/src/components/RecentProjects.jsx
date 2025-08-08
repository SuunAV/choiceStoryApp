import React from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, Calendar, BookOpen, GitBranch } from 'lucide-react'

/**
 * RecentProjects Component - Displays list of recent story projects
 * Shows project status, last modified date, and key metrics
 * Security: All project data is sanitized before display
 */
const RecentProjects = ({ projects = [] }) => {
  /**
   * Sanitizes text content to prevent XSS attacks
   * @param {string} text - Text to sanitize
   * @returns {string} - Sanitized text
   */
  const sanitizeText = (text) => {
    if (!text) return ''
    return String(text)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Unknown date'
    }
  }

  if (!projects.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Projects</h3>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Story
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
        <Link
          to="/projects"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {sanitizeText(project.title)}
                  </h4>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(project.status)}
                  `}>
                    {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Modified {formatDate(project.lastModified)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{project.chapters} chapters</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="h-4 w-4" />
                    <span>{project.choices} choices</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {project.status === 'completed' && (
                  <button className="text-sm bg-success-100 text-success-700 px-3 py-1 rounded-lg hover:bg-success-200 transition-colors">
                    View App
                  </button>
                )}
                {project.status === 'in-progress' && (
                  <button className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-lg hover:bg-primary-200 transition-colors">
                    Continue
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentProjects
