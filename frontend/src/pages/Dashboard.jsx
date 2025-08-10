import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, BookOpen, Zap, Users, TrendingUp, Clock, 
  Activity, Database, Shield, Code, Terminal, Cpu,
  BarChart3, LineChart, PieChart, Server, Cloud,
  GitBranch, FileCode, Layers, Box, Monitor
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RecentProjects from '../components/RecentProjects'
import QuickActions from '../components/QuickActions'
import SystemStatus from '../components/SystemStatus'
import AnalyticsChart from '../components/AnalyticsChart'
import ActivityFeed from '../components/ActivityFeed'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedStories: 0,
    totalReads: 0,
    systemHealth: 0,
    apiCalls: 0,
    storageUsed: 0,
    activeUsers: 0
  })

  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalProjects: 12,
          activeProjects: 3,
          completedStories: 9,
          totalReads: 1247,
          systemHealth: 98.5,
          apiCalls: 3847,
          storageUsed: 67.3,
          activeUsers: 89
        })

        setRecentProjects([
          {
            id: 1,
            title: 'The Perfect Gift',
            status: 'completed',
            lastModified: '2024-08-07',
            chapters: 9,
            choices: 23,
            performance: 94,
            engagement: 87
          },
          {
            id: 2,
            title: 'Adventure Island',
            status: 'in-progress',
            lastModified: '2024-08-06',
            chapters: 5,
            choices: 12,
            performance: 89,
            engagement: 92
          },
          {
            id: 3,
            title: 'Mystery at School',
            status: 'draft',
            lastModified: '2024-08-05',
            chapters: 2,
            choices: 4,
            performance: 76,
            engagement: 68
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="tech-loader"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8 relative">
      {/* Background Grid */}
      <div className="fixed inset-0 tech-grid opacity-10 pointer-events-none"></div>

      {/* Command Center Header */}
      <div className="relative">
        <div className="tech-border rounded-xl p-8 glass">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">
                Story Command Center
              </h1>
              <p className="text-dark-300 text-lg font-mono">
                System Status: <span className="text-tech-green-400">OPERATIONAL</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-tech-green-400 animate-pulse"></div>
                <span className="text-sm font-mono text-dark-400">LIVE</span>
              </div>
              <Terminal className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          
          {/* Quick Access Toolbar */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/create"
              className="tech-button rounded-lg inline-flex items-center group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
              Initialize New Story
            </Link>
            <button
              onClick={() => setActiveView('analytics')}
              className="px-4 py-2 glass rounded-lg font-medium text-dark-200 hover:text-white hover:bg-dark-800/50 transition-all"
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveView('system')}
              className="px-4 py-2 glass rounded-lg font-medium text-dark-200 hover:text-white hover:bg-dark-800/50 transition-all"
            >
              <Server className="h-5 w-5 inline mr-2" />
              System Monitor
            </button>
          </div>
        </div>

        {/* Scanning Line Animation */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan"></div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Database}
          color="primary"
          trend="+12.5%"
          sparklineData={[5, 7, 6, 9, 8, 10, 12]}
        />
        <StatsCard
          title="Active Stories"
          value={stats.activeProjects}
          icon={Activity}
          color="accent"
          trend="3 running"
          sparklineData={[2, 3, 2, 3, 4, 3, 3]}
        />
        <StatsCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          icon={Shield}
          color="tech-green"
          trend="Optimal"
          sparklineData={[95, 96, 98, 97, 99, 98, 98.5]}
        />
        <StatsCard
          title="API Calls"
          value={stats.apiCalls.toLocaleString()}
          icon={Zap}
          color="tech-purple"
          trend="+278 today"
          sparklineData={[3200, 3400, 3500, 3600, 3700, 3800, 3847]}
        />
      </div>

      {/* System Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="tech-border rounded-lg p-6 glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-100 flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-primary-400" />
              Performance Metrics
            </h3>
            <span className="text-xs font-mono text-dark-400">REAL-TIME</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-300">CPU Usage</span>
              <span className="text-sm font-mono text-tech-green-400">23.4%</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{width: '23.4%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-300">Memory</span>
              <span className="text-sm font-mono text-tech-yellow-400">67.3%</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-tech-yellow-500 to-tech-yellow-400 h-2 rounded-full" style={{width: '67.3%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-300">Storage</span>
              <span className="text-sm font-mono text-accent-400">45.8 GB</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full" style={{width: '45.8%'}}></div>
            </div>
          </div>
        </div>

        <div className="tech-border rounded-lg p-6 glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-100 flex items-center">
              <GitBranch className="h-5 w-5 mr-2 text-accent-400" />
              Version Control
            </h3>
            <span className="tech-badge">v2.4.1</span>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Latest Deploy:</span>
              <span className="text-tech-green-400">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Build Status:</span>
              <span className="text-tech-green-400">SUCCESS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Active Branch:</span>
              <span className="text-primary-400">main</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Commits Today:</span>
              <span className="text-accent-400">14</span>
            </div>
          </div>
        </div>

        <div className="tech-border rounded-lg p-6 glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-100 flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-tech-purple-400" />
              Cloud Services
            </h3>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-tech-green-400"></div>
              <div className="w-2 h-2 rounded-full bg-tech-green-400"></div>
              <div className="w-2 h-2 rounded-full bg-tech-green-400"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">99.9%</div>
              <div className="text-xs text-dark-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400">42ms</div>
              <div className="text-xs text-dark-400">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tech-purple-400">CDN</div>
              <div className="text-xs text-dark-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tech-green-400">SSL</div>
              <div className="text-xs text-dark-400">Secured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {activeView === 'overview' && (
            <>
              <div className="tech-border rounded-xl p-6 glass">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-dark-100 flex items-center">
                    <FileCode className="h-6 w-6 mr-2 text-primary-400" />
                    Active Story Projects
                  </h3>
                  <Link to="/projects" className="text-sm text-primary-400 hover:text-primary-300 font-mono">
                    VIEW ALL →
                  </Link>
                </div>
                <RecentProjects projects={recentProjects} />
              </div>

              <AnalyticsChart />
            </>
          )}

          {activeView === 'analytics' && (
            <div className="tech-border rounded-xl p-6 glass">
              <h3 className="text-xl font-semibold text-dark-100 mb-6">Deep Analytics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-dark-900/50 rounded-lg">
                    <LineChart className="h-6 w-6 text-primary-400 mb-2" />
                    <div className="text-2xl font-bold text-dark-100">1,247</div>
                    <div className="text-sm text-dark-400">Total Story Reads</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-lg">
                    <PieChart className="h-6 w-6 text-accent-400 mb-2" />
                    <div className="text-2xl font-bold text-dark-100">87%</div>
                    <div className="text-sm text-dark-400">Completion Rate</div>
                  </div>
                </div>
                <div className="h-64 bg-dark-900/50 rounded-lg flex items-center justify-center">
                  <span className="text-dark-500 font-mono">CHART_PLACEHOLDER</span>
                </div>
              </div>
            </div>
          )}

          {activeView === 'system' && (
            <SystemStatus />
          )}
        </div>

        {/* Command Panel & Activity */}
        <div className="space-y-6">
          <QuickActions />
          <ActivityFeed />
          
          {/* Terminal Output */}
          <div className="terminal">
            <div className="flex items-center justify-between mb-3">
              <span className="text-tech-green-400 font-mono text-xs">SYSTEM_LOG</span>
              <span className="text-dark-500 text-xs">auto-refresh</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-tech-green-400">
                <span className="text-dark-500">[12:34:56]</span> Story build completed successfully
              </div>
              <div className="text-primary-400">
                <span className="text-dark-500">[12:34:12]</span> New user registration: user_892
              </div>
              <div className="text-accent-400">
                <span className="text-dark-500">[12:33:45]</span> API endpoint health check: OK
              </div>
              <div className="text-tech-yellow-400">
                <span className="text-dark-500">[12:33:01]</span> Cache cleared: 127MB freed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="glass rounded-lg p-4 flex items-center justify-between text-sm font-mono">
        <div className="flex items-center space-x-6">
          <span className="text-dark-400">Server: <span className="text-tech-green-400">us-west-2</span></span>
          <span className="text-dark-400">Load: <span className="text-primary-400">0.42</span></span>
          <span className="text-dark-400">Queue: <span className="text-accent-400">3 jobs</span></span>
        </div>
        <div className="flex items-center space-x-2">
          <Monitor className="h-4 w-4 text-dark-400" />
          <span className="text-dark-400">Dashboard v2.4.1</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard