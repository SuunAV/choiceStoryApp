import React, { useState, useEffect } from 'react'
import {
  Server, Database, Shield, Zap, HardDrive, Cpu,
  Activity, Cloud, Lock, AlertTriangle, CheckCircle
} from 'lucide-react'

const SystemStatus = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { current: 0, avg: 0, max: 0 },
    memory: { used: 0, total: 0, percentage: 0 },
    disk: { used: 0, total: 0, percentage: 0 },
    network: { in: 0, out: 0, latency: 0 }
  })

  const [services, setServices] = useState([
    { name: 'API Server', status: 'online', uptime: '99.99%', icon: Server, response: '42ms' },
    { name: 'Database', status: 'online', uptime: '99.95%', icon: Database, response: '12ms' },
    { name: 'CDN', status: 'online', uptime: '100%', icon: Cloud, response: '8ms' },
    { name: 'Auth Service', status: 'online', uptime: '99.98%', icon: Lock, response: '35ms' },
    { name: 'AI Engine', status: 'maintenance', uptime: '98.5%', icon: Cpu, response: 'N/A' },
    { name: 'Storage', status: 'online', uptime: '99.97%', icon: HardDrive, response: '15ms' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: {
          current: Math.random() * 30 + 10,
          avg: 23.4,
          max: 67.8
        },
        memory: {
          used: 4.2,
          total: 8,
          percentage: 52.5
        },
        disk: {
          used: 127,
          total: 256,
          percentage: 49.6
        },
        network: {
          in: Math.random() * 50 + 100,
          out: Math.random() * 30 + 50,
          latency: Math.random() * 10 + 35
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-tech-green-400'
      case 'maintenance': return 'text-tech-yellow-400'
      case 'offline': return 'text-tech-red-400'
      default: return 'text-dark-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'online': return 'bg-tech-green-400/10'
      case 'maintenance': return 'bg-tech-yellow-400/10'
      case 'offline': return 'bg-tech-red-400/10'
      default: return 'bg-dark-400/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="tech-border rounded-xl p-6 glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-100 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-primary-400" />
            System Performance
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-tech-green-400 animate-pulse"></div>
            <span className="text-sm font-mono text-dark-400">MONITORING</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* CPU Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300 flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-primary-400" />
                CPU Usage
              </span>
              <span className="text-sm font-mono text-primary-400">
                {systemMetrics.cpu.current.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                  style={{width: `${systemMetrics.cpu.current}%`}}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-dark-500">
                <span>AVG: {systemMetrics.cpu.avg}%</span>
                <span>MAX: {systemMetrics.cpu.max}%</span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300 flex items-center">
                <HardDrive className="h-4 w-4 mr-2 text-accent-400" />
                Memory
              </span>
              <span className="text-sm font-mono text-accent-400">
                {systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full"
                  style={{width: `${systemMetrics.memory.percentage}%`}}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-dark-500">
                <span>{systemMetrics.memory.percentage}% Used</span>
                <span>{(systemMetrics.memory.total - systemMetrics.memory.used).toFixed(1)}GB Free</span>
              </div>
            </div>
          </div>

          {/* Network I/O */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-tech-purple-400" />
                Network I/O
              </span>
              <span className="text-sm font-mono text-tech-purple-400">
                {systemMetrics.network.latency.toFixed(1)}ms
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-dark-900/50 rounded p-2">
                <div className="text-dark-400">IN</div>
                <div className="font-mono text-tech-green-400">
                  {systemMetrics.network.in.toFixed(1)} Mbps
                </div>
              </div>
              <div className="bg-dark-900/50 rounded p-2">
                <div className="text-dark-400">OUT</div>
                <div className="font-mono text-primary-400">
                  {systemMetrics.network.out.toFixed(1)} Mbps
                </div>
              </div>
            </div>
          </div>

          {/* Disk Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300 flex items-center">
                <Database className="h-4 w-4 mr-2 text-tech-yellow-400" />
                Storage
              </span>
              <span className="text-sm font-mono text-tech-yellow-400">
                {systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-tech-yellow-500 to-tech-yellow-400 h-2 rounded-full"
                  style={{width: `${systemMetrics.disk.percentage}%`}}
                />
              </div>
              <div className="text-xs font-mono text-dark-500 text-right">
                {systemMetrics.disk.percentage}% Used
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="tech-border rounded-xl p-6 glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-100 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-accent-400" />
            Service Health
          </h3>
          <span className="text-xs font-mono text-dark-400">
            Last checked: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = service.icon
            const StatusIcon = service.status === 'online' ? CheckCircle : 
                             service.status === 'maintenance' ? AlertTriangle : 
                             AlertTriangle
            
            return (
              <div
                key={service.name}
                className={`
                  p-4 rounded-lg border transition-all duration-300
                  ${service.status === 'online' 
                    ? 'bg-dark-900/30 border-dark-700/50 hover:border-tech-green-500/30' 
                    : service.status === 'maintenance'
                    ? 'bg-tech-yellow-500/5 border-tech-yellow-500/30'
                    : 'bg-tech-red-500/5 border-tech-red-500/30'}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(service.status)}`} />
                </div>
                <h4 className="font-medium text-dark-100 text-sm mb-1">{service.name}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Status:</span>
                    <span className={`font-mono ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Uptime:</span>
                    <span className="font-mono text-dark-300">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Response:</span>
                    <span className="font-mono text-dark-300">{service.response}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* System Logs */}
      <div className="terminal rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-tech-green-400 font-mono text-xs">SYSTEM_MONITOR.log</span>
          <span className="text-dark-500 text-xs">streaming...</span>
        </div>
        <div className="space-y-1 text-xs font-mono">
          <div className="text-tech-green-400">
            <span className="text-dark-500">[{new Date().toLocaleTimeString()}]</span> All systems operational
          </div>
          <div className="text-tech-yellow-400">
            <span className="text-dark-500">[{new Date(Date.now() - 60000).toLocaleTimeString()}]</span> AI Engine maintenance mode activated
          </div>
          <div className="text-primary-400">
            <span className="text-dark-500">[{new Date(Date.now() - 120000).toLocaleTimeString()}]</span> Database backup completed
          </div>
          <div className="text-accent-400">
            <span className="text-dark-500">[{new Date(Date.now() - 180000).toLocaleTimeString()}]</span> CDN cache purged successfully
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus