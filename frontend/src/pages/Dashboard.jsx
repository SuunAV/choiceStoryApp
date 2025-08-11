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
    activeUsers: 0,
    uptime: 0,
    throughput: 0
  })

  const [recentProjects, setRecentProjects] = useState([])
  const [systemMetrics, setSystemMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate loading time with progress
        await new Promise(resolve => setTimeout(resolve, 1200))
        
        setStats({
          totalProjects: 247,
          activeProjects: 12,
          completedStories: 235,
          totalReads: 15847,
          systemHealth: 99.2,
          apiCalls: 428519,
          storageUsed: 73.8,
          activeUsers: 156,
          uptime: 99.97,
          throughput: 2847
        })

        setRecentProjects([
          {
            id: 'PRJ-2024-001',
            title: 'The Quantum Garden Chronicles',
            status: 'deployment',
            lastModified: '2024-08-09T14:30:00Z',
            chapters: 15,
            choices: 47,
            performance: 96.8,
            engagement: 92.4,
            version: 'v2.1.3',
            buildStatus: 'passed'
          },
          {
            id: 'PRJ-2024-002', 
            title: 'Neural Network Adventures',
            status: 'testing',
            lastModified: '2024-08-09T11:15:00Z',
            chapters: 8,
            choices: 24,
            performance: 94.2,
            engagement: 88.7,
            version: 'v1.8.1',
            buildStatus: 'building'
          },
          {
            id: 'PRJ-2024-003',
            title: 'Cybersecurity Quest Academy',
            status: 'active',
            lastModified: '2024-08-08T16:45:00Z',
            chapters: 22,
            choices: 73,
            performance: 97.9,
            engagement: 94.3,
            version: 'v3.2.0',
            buildStatus: 'passed'
          }
        ])

        setSystemMetrics([
          { timestamp: '14:25', cpu: 23.4, memory: 67.8, network: 45.2 },
          { timestamp: '14:26', cpu: 28.1, memory: 69.1, network: 52.7 },
          { timestamp: '14:27', cpu: 19.7, memory: 65.3, network: 38.9 },
          { timestamp: '14:28', cpu: 31.2, memory: 71.2, network: 48.5 },
          { timestamp: '14:29', cpu: 25.8, memory: 68.9, network: 44.1 }
        ])

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    // Real-time updates simulation
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        throughput: 2800 + Math.floor(Math.random() * 100)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      deployment: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
      testing: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30',
      active: 'text-green-400 bg-green-400/20 border-green-400/30',
      maintenance: 'text-orange-400 bg-orange-400/20 border-orange-400/30',
      error: 'text-red-400 bg-red-400/20 border-red-400/30'
    }
    return colors[status] || colors.active
  }

  const getBuildStatusIcon = (status) => {
    switch (status) {
      case 'passed': return '✓'
      case 'building': return '⟳'
      case 'failed': return '✗'
      default: return '●'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin absolute top-2 left-2"></div>
          </div>
          <div className="space-y-2">
            <div className="text-blue-400 font-mono text-sm">INITIALIZING SYSTEMS...</div>
            <div className="text-slate-400 font-mono text-xs">Loading dashboard modules</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
      
      {/* Scanning line animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 animate-[scan_4s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                STORY_ENGINE_v2.4.1
              </h1>
              <div className="flex items-center space-x-4 text-sm font-mono">
                <span className="text-green-400">● OPERATIONAL</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-400">UPTIME: {stats.uptime}%</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-400">THROUGHPUT: {stats.throughput} ops/sec</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-slate-400 text-xs font-mono">SYSTEM STATUS</div>
                <div className="text-green-400 text-sm font-mono font-bold">ALL_SYSTEMS_NOMINAL</div>
              </div>
              <div className="w-2 h-8 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </div>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primary Metrics */}
          <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-400 text-sm font-mono font-bold">PROJECTS</div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-sm">📊</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-white">{stats.totalProjects}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-400 font-mono">↗ +{stats.activeProjects} active</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-cyan-400 text-sm font-mono font-bold">STORIES</div>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 text-sm">📚</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-white">{stats.completedStories}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-cyan-400 font-mono">{stats.totalReads.toLocaleString()} reads</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-purple-400 text-sm font-mono font-bold">API_CALLS</div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 text-sm">⚡</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-white">{stats.apiCalls.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-purple-400 font-mono">Real-time</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-green-400 text-sm font-mono font-bold">HEALTH</div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">💚</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-white">{stats.systemHealth}%</div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full transition-all duration-300" style={{width: `${stats.systemHealth}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Enhanced */}
          <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-mono">COMMAND_CENTER</h2>
              <div className="text-green-400 text-xs font-mono">READY</div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/create-story'}
                className="w-full group relative overflow-hidden border border-blue-500/50 rounded-lg p-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 transition-all duration-300 hover:border-blue-400"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 group-hover:via-blue-400/10 transition-all duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-lg">⚡</span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-mono font-bold">INITIALIZE_STORY</div>
                    <div className="text-blue-400 text-xs font-mono">Launch new project</div>
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="border border-slate-700 rounded-lg p-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
                  <div className="text-slate-400 group-hover:text-cyan-400 text-sm font-mono">DEPLOY</div>
                </button>
                <button className="border border-slate-700 rounded-lg p-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
                  <div className="text-slate-400 group-hover:text-purple-400 text-sm font-mono">ANALYZE</div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Projects - Enhanced */}
          <div className="lg:col-span-2 border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-mono">PROJECT_REGISTRY</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-mono">LIVE</span>
              </div>
            </div>

            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="border border-slate-700 rounded-lg p-4 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-slate-400 font-mono text-sm">{project.id}</div>
                      <div className="w-px h-6 bg-slate-700"></div>
                      <div>
                        <div className="text-white font-mono font-bold">{project.title}</div>
                        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-1">
                          <span>v{project.version}</span>
                          <span>•</span>
                          <span>{project.chapters} chapters</span>
                          <span>•</span>
                          <span>{project.choices} choices</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-mono border ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </div>
                      <div className="text-lg">
                        {getBuildStatusIcon(project.buildStatus)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-6 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">PERF:</span>
                      <span className="text-green-400">{project.performance}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">ENG:</span>
                      <span className="text-cyan-400">{project.engagement}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">MODIFIED:</span>
                      <span className="text-slate-400">{new Date(project.lastModified).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Analytics */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-mono">SYSTEM_TELEMETRY</h2>
            <div className="flex items-center space-x-4">
              <div className="text-xs font-mono text-slate-400">Real-time metrics</div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-400">CPU_USAGE</span>
                <span className="text-sm font-mono text-blue-400">25.8%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full transition-all duration-300" style={{width: '25.8%'}}></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-400">MEMORY</span>
                <span className="text-sm font-mono text-cyan-400">68.9%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-cyan-400 h-2 rounded-full transition-all duration-300" style={{width: '68.9%'}}></div>
              </div>
            </div>

            {/* Network I/O */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-400">NETWORK_IO</span>
                <span className="text-sm font-mono text-purple-400">44.1%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full transition-all duration-300" style={{width: '44.1%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard