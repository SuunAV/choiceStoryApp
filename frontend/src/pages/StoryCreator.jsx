import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import BookUploadStep from '../components/BookUploadStep'
import AIAnalysisStep from '../components/AIAnalysisStep'
import PreviewStep from '../components/PreviewStep'
import GenerateAppStep from '../components/GenerateAppStep'
import toast from 'react-hot-toast'

/**
 * StoryCreator Component - Main workflow for creating interactive stories
 * Multi-step process: Upload -> AI Analysis -> Preview -> Generate
 * Security: All user inputs are sanitized and validated at each step
 */
const StoryCreator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [storyData, setStoryData] = useState({
    bookContent: '',
    title: '',
    author: '',
    targetAge: '',
    analysis: null,
    storyStructure: null,
    generatedApp: null
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    {
      id: 'upload',
      title: 'DATA_INTAKE',
      description: 'Upload source material and metadata',
      component: BookUploadStep,
      icon: '📤',
      status: 'pending'
    },
    {
      id: 'analysis',
      title: 'AI_PROCESSING',
      description: 'Neural analysis of narrative structure',
      component: AIAnalysisStep,
      icon: '🧠',
      status: 'pending'
    },
    {
      id: 'preview',
      title: 'STRUCTURE_REVIEW',
      description: 'Validate generated story architecture',
      component: PreviewStep,
      icon: '👁',
      status: 'pending'
    },
    {
      id: 'generate',
      title: 'BUILD_DEPLOY',
      description: 'Compile and package interactive application',
      component: GenerateAppStep,
      icon: '🚀',
      status: 'pending'
    }
  ]

  /**
   * Sanitizes and validates user input to prevent XSS attacks
   * @param {string} input - Raw user input
   * @returns {string} - Sanitized input
   */
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return ''
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
  }

  /**
   * Updates story data with sanitized input
   * @param {Object} updates - Data updates to apply
   */
  const updateStoryData = (updates) => {
    const sanitizedUpdates = {}
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'string') {
        sanitizedUpdates[key] = sanitizeInput(updates[key])
      } else {
        sanitizedUpdates[key] = updates[key]
      }
    })
    setStoryData(prev => ({ ...prev, ...sanitizedUpdates }))
  }

  /**
   * Advances to the next step if current step is valid
   */
  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  /**
   * Goes back to the previous step
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  /**
   * Validates the current step's data
   * @returns {boolean} - Whether the step is valid
   */
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 0: // Upload step
        if (!storyData.bookContent.trim()) {
          toast.error('Please upload or enter book content')
          return false
        }
        if (!storyData.title.trim()) {
          toast.error('Please enter a story title')
          return false
        }
        return true

      case 1: // Analysis step
        return storyData.analysis !== null

      case 2: // Preview step
        return storyData.storyStructure !== null

      case 3: // Generate step
        return true

      default:
        return true
    }
  }

  /**
   * Checks if a step is completed
   * @param {number} stepIndex - Index of the step to check
   * @returns {boolean} - Whether the step is completed
   */
  const isStepCompleted = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return storyData.bookContent.trim() && storyData.title.trim()
      case 1:
        return storyData.analysis !== null
      case 2:
        return storyData.storyStructure !== null
      case 3:
        return storyData.generatedApp !== null
      default:
        return false
    }
  }

  const getStepStatus = (stepIndex) => {
    if (stepIndex === currentStep) return 'active'
    if (stepIndex < currentStep || isStepCompleted(stepIndex)) return 'completed'
    return 'pending'
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Tech Background */}
      <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
      
      {/* Scanning animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 animate-[scan_6s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                STORY_COMPILER_v3.1.2
              </h1>
              <div className="flex items-center space-x-4 text-sm font-mono">
                <span className="text-cyan-400">● COMPILATION_MODE</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-400">STEP: {currentStep + 1}/{steps.length}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-400">PIPELINE: {steps[currentStep].id.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-slate-400 text-xs font-mono">BUILD_STATUS</div>
                <div className="text-cyan-400 text-sm font-mono font-bold">
                  {isProcessing ? 'PROCESSING...' : 'READY'}
                </div>
              </div>
              <div className={`w-2 h-8 rounded-full animate-pulse shadow-lg ${
                isProcessing ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-cyan-400 shadow-cyan-400/50'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Progress Pipeline */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-mono">BUILD_PIPELINE</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-xs font-mono">ACTIVE</span>
            </div>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-6 right-6 h-0.5 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(index)
                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    {/* Step Circle */}
                    <div className={`
                      relative z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${status === 'active' 
                        ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30' 
                        : status === 'completed'
                          ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/30'
                          : 'border-slate-600 bg-slate-800/50'
                      }
                    `}>
                      {status === 'completed' ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : status === 'active' && isProcessing ? (
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-2xl">{step.icon}</span>
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="mt-4 text-center max-w-32">
                      <div className={`text-sm font-mono font-bold ${
                        status === 'active' ? 'text-cyan-400' : 
                        status === 'completed' ? 'text-green-400' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        {step.description}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
          {/* Step Header */}
          <div className="border-b border-slate-800 p-6 bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center">
                  <span className="text-2xl">{steps[currentStep].icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-slate-400 text-sm font-mono">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-slate-400 text-xs font-mono">STEP_ID</div>
                <div className="text-cyan-400 text-sm font-mono font-bold">
                  {steps[currentStep].id.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            <CurrentStepComponent
              storyData={storyData}
              updateStoryData={updateStoryData}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              onNext={nextStep}
              onPrev={prevStep}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-mono font-medium transition-all duration-300
                ${currentStep === 0
                  ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:text-white'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              PREVIOUS
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-slate-400 text-xs font-mono">PROGRESS</div>
                <div className="text-white font-mono font-bold">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </div>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1 || isProcessing}
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-mono font-medium transition-all duration-300
                ${currentStep === steps.length - 1 || isProcessing
                  ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-500 hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  PROCESSING
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  COMPLETE
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  NEXT
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryCreator
