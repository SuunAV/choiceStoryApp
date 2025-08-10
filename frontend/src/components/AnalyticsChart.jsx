import React, { useEffect, useRef } from 'react'
import { LineChart, BarChart3, TrendingUp, Calendar } from 'lucide-react'

const AnalyticsChart = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Generate data points
    const dataPoints = []
    for (let i = 0; i < 30; i++) {
      dataPoints.push({
        reads: Math.floor(Math.random() * 100 + 50),
        engagement: Math.floor(Math.random() * 40 + 60),
        completions: Math.floor(Math.random() * 30 + 20)
      })
    }

    // Set up gradients
    const gradient1 = ctx.createLinearGradient(0, 0, 0, height)
    gradient1.addColorStop(0, 'rgba(9, 103, 210, 0.3)')
    gradient1.addColorStop(1, 'rgba(9, 103, 210, 0)')

    const gradient2 = ctx.createLinearGradient(0, 0, 0, height)
    gradient2.addColorStop(0, 'rgba(44, 177, 188, 0.3)')
    gradient2.addColorStop(1, 'rgba(44, 177, 188, 0)')

    // Draw grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)'
    ctx.lineWidth = 1

    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw data lines
    const drawLine = (data, color, gradient) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2

      data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index
        const y = height - (point / 150) * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Fill area under line
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
    }

    drawLine(dataPoints.map(d => d.reads), '#0967d2', gradient1)
    drawLine(dataPoints.map(d => d.engagement), '#2cb1bc', gradient2)

    // Draw points
    dataPoints.forEach((point, index) => {
      const x = (width / (dataPoints.length - 1)) * index
      const y1 = height - (point.reads / 150) * height
      const y2 = height - (point.engagement / 150) * height

      // Reads points
      ctx.beginPath()
      ctx.arc(x, y1, 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#0967d2'
      ctx.fill()

      // Engagement points
      ctx.beginPath()
      ctx.arc(x, y2, 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#2cb1bc'
      ctx.fill()
    })
  }, [])

  const timeRanges = ['24H', '7D', '30D', '90D', '1Y']
  const [selectedRange, setSelectedRange] = React.useState('30D')

  return (
    <div className="tech-border rounded-xl p-6 glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-dark-100 flex items-center">
          <LineChart className="h-6 w-6 mr-2 text-primary-400" />
          Story Analytics
        </h3>
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`
                px-3 py-1 text-xs font-mono rounded transition-all
                ${selectedRange === range
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-400">Total Reads</span>
            <TrendingUp className="h-4 w-4 text-tech-green-400" />
          </div>
          <div className="text-2xl font-bold text-dark-100">3,847</div>
          <div className="text-xs text-tech-green-400 font-mono mt-1">+12.3%</div>
        </div>
        <div className="bg-dark-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-400">Avg. Engagement</span>
            <BarChart3 className="h-4 w-4 text-accent-400" />
          </div>
          <div className="text-2xl font-bold text-dark-100">87.2%</div>
          <div className="text-xs text-accent-400 font-mono mt-1">+3.4%</div>
        </div>
        <div className="bg-dark-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-400">Completion Rate</span>
            <Calendar className="h-4 w-4 text-tech-purple-400" />
          </div>
          <div className="text-2xl font-bold text-dark-100">64.8%</div>
          <div className="text-xs text-tech-purple-400 font-mono mt-1">+7.1%</div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-auto"
          style={{ maxHeight: '300px' }}
        />
        <div className="absolute bottom-0 left-0 flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary-400"></div>
            <span className="text-dark-400">Story Reads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent-400"></div>
            <span className="text-dark-400">Engagement Rate</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-dark-900/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-dark-200 mb-3">Top Performing Stories</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">The Perfect Gift</span>
              <span className="text-sm font-mono text-tech-green-400">847 reads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Adventure Island</span>
              <span className="text-sm font-mono text-primary-400">623 reads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Mystery at School</span>
              <span className="text-sm font-mono text-accent-400">412 reads</span>
            </div>
          </div>
        </div>
        <div className="bg-dark-900/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-dark-200 mb-3">Reader Demographics</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Ages 8-10</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-xs font-mono text-dark-500">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Ages 10-12</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="text-xs font-mono text-dark-500">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Ages 12+</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-tech-purple-500 to-tech-purple-400 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-xs font-mono text-dark-500">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsChart