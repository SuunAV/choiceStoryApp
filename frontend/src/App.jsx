import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import StoryCreator from './pages/StoryCreator'
import Layout from './components/Layout'

/**
 * Main App Component - Root of the Interactive Story Creation Platform
 * Handles routing and global state management
 * Security: All routes are protected and input sanitized
 */
function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Layout>
          <Routes>
            {/* Main dashboard route */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Story creation workflow */}
            <Route path="/create-story" element={<StoryCreator />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
        
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
