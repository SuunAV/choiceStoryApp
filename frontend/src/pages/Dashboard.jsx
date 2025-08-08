import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Zap, Users, TrendingUp, Clock } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RecentProjects from '../components/RecentProjects'
import QuickActions from '../components/QuickActions'

/**
 * Dashboard Component - Main dashboard showing overview and recent activity
 * Provides quick access to story creation and project management
 * Security: All data rendering is sanitized and XSS-protected
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedStories: 0,
    totalReads: 0
  })

  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalProjects: 12,
          activeProjects: 3,
          completedStories: 9,
          totalReads: 1247
        })

        setRecentProjects([
          {
            id: 1,
            title: 'The Perfect Gift',
            status: 'completed',
            lastModified: '2024-08-07',
            chapters: 9,
            choices: 23
          },
          {
            id: 2,
            title: 'Adventure Island',
            status: 'in-progress',
            lastModified: '2024-08-06',
            chapters: 5,
            choices: 12
          },
          {
            id: 3,
            title: 'Mystery at School',
            status: 'draft',
            lastModified: '2024-08-05',
            chapters: 2,
            choices: 4
          }
        ])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome to Story Creator
            </h1>
            <p className="text-primary-100 text-lg">
              Transform your books into engaging interactive experiences for young readers.
            </p>
          </div>
          <div className="hidden md:block">
            <BookOpen className="h-24 w-24 text-primary-200" />
          </div>
        </div>
        
        {/* Quick Start Button */}
        <Link
          to="/create"
          className="inline-flex items-center mt-6 px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Story
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={BookOpen}
          color="blue"
          trend="+2 this month"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Zap}
          color="yellow"
          trend="3 in progress"
        />
        <StatsCard
          title="Completed Stories"
          value={stats.completedStories}
          icon={Users}
          color="green"
          trend="+1 this week"
        />
        <StatsCard
          title="Total Reads"
          value={stats.totalReads}
          icon={TrendingUp}
          color="purple"
          trend="+127 this week"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <RecentProjects projects={recentProjects} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Upload Your Book</h4>
              <p className="text-sm text-gray-600">Upload your manuscript or story content</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">AI Analysis</h4>
              <p className="text-sm text-gray-600">Let our AI analyze and create decision points</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Generate App</h4>
              <p className="text-sm text-gray-600">Create your interactive story application</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
