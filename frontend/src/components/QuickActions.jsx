import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, BookTemplate, Zap, Settings, HelpCircle, Download,
  Terminal, Code, Database, Shield, Cpu, GitBranch,
  Command, Layers, Box
} from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      title: 'Initialize Story',
      description: 'Launch new story project',
      icon: Plus,
      href: '/create',
      command: 'story --init',
      primary: true
    },
    {
      title: 'Deploy Templates',
      description: 'Pre-configured templates',
      icon: BookTemplate,
      href: '/templates',
      command: 'deploy --template'
    },
    {
      title: 'AI Generator',
      description: 'Neural story generation',
      icon: Cpu,
      href: '/ai-generate',
      command: 'ai --generate'
    },
    {
      title: 'Export Module',
      description: 'Build & export stories',
      icon: Box,
      href: '/export',
      command: 'build --export'
    }
  ]

  const systemLinks = [
    {
      title: 'System Config',
      description: 'Environment settings',
      icon: Settings,
      href: '/settings',
      status: 'active'
    },
    {
      title: 'Documentation',
      description: 'Technical guides',
      icon: Terminal,
      href: '/docs',
      status: 'beta'
    },
    {
      title: 'API Console',
      description: 'Endpoint testing',
      icon: Code,
      href: '/api-console',
      status: 'new'
    },
    {
      title: 'Security Center',
      description: 'Access control',
      icon: Shield,
      href: '/security',
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Command Center */}
      <div className="tech-border rounded-xl p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100 flex items-center">
            <Command className="h-5 w-5 mr-2 text-primary-400" />
            Command Center
          </h3>
          <span className="text-xs font-mono text-dark-400">CMD+K</span>
        </div>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`
                  block relative overflow-hidden rounded-lg transition-all duration-300
                  ${action.primary 
                    ? 'tech-button' 
                    : 'p-4 glass hover:bg-dark-800/50 hover:shadow-neon-blue group'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2.5 rounded-lg
                      ${action.primary 
                        ? 'bg-white/20' 
                        : 'bg-dark-800/50 group-hover:bg-primary-500/20 transition-colors'
                      }
                    `}>
                      <Icon className={`
                        h-5 w-5
                        ${action.primary ? 'text-white' : 'text-primary-400'}
                      `} />
                    </div>
                    <div>
                      <h4 className={`
                        font-medium
                        ${action.primary ? 'text-white' : 'text-dark-100 group-hover:text-white'}
                      `}>
                        {action.title}
                      </h4>
                      <p className={`
                        text-sm
                        ${action.primary ? 'text-blue-100' : 'text-dark-400'}
                      `}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <code className={`
                    text-xs font-mono
                    ${action.primary ? 'text-blue-100' : 'text-dark-500'}
                  `}>
                    {action.command}
                  </code>
                </div>
                {!action.primary && (
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* System Resources */}
      <div className="tech-border rounded-xl p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100 flex items-center">
            <Layers className="h-5 w-5 mr-2 text-accent-400" />
            System Resources
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {systemLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                to={link.href}
                className="p-3 rounded-lg bg-dark-900/30 hover:bg-dark-800/50 transition-all duration-300 group border border-dark-700/50 hover:border-primary-500/30"
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 text-accent-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-dark-100 text-sm group-hover:text-white transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs text-dark-400 mt-0.5">{link.description}</p>
                    {link.status && (
                      <span className={`
                        inline-block mt-2 px-2 py-0.5 text-xs font-mono rounded-full
                        ${link.status === 'active' ? 'bg-tech-green-400/10 text-tech-green-400' :
                          link.status === 'beta' ? 'bg-tech-yellow-400/10 text-tech-yellow-400' :
                          'bg-primary-400/10 text-primary-400'}
                      `}>
                        {link.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* System Alert */}
      <div className="tech-border rounded-xl p-4 glass bg-gradient-to-r from-primary-500/5 to-accent-500/5">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-primary-500/20">
            <GitBranch className="h-4 w-4 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-dark-100 mb-1">Latest Update</h3>
            <p className="text-xs text-dark-300 leading-relaxed">
              Version 2.4.1 deployed successfully. New AI model integration improves story generation by 34%.
            </p>
            <Link
              to="/changelog"
              className="text-xs text-primary-400 hover:text-primary-300 font-mono mt-2 inline-block"
            >
              VIEW_CHANGELOG →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickActions