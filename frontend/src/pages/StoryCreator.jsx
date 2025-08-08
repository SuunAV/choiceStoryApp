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
      title: 'Upload Book',
      description: 'Upload your book content',
      component: BookUploadStep
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'AI analyzes your story structure',
      component: AIAnalysisStep
    },
    {
      id: 'preview',
      title: 'Preview Story',
      description: 'Review and customize your interactive story',
      component: PreviewStep
    },
    {
      id: 'generate',
      title: 'Generate App',
      description: 'Create your final application',
      component: GenerateAppStep
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
      // Validate current step before proceeding
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

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${index === currentStep 
                  ? 'border-primary-600 bg-primary-600 text-white' 
                  : index < currentStep || isStepCompleted(index)
                    ? 'border-success-600 bg-success-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }
              `}>
                {index < currentStep || isStepCompleted(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  index === currentStep 
                    ? 'text-primary-600' 
                    : index < currentStep || isStepCompleted(index)
                      ? 'text-success-600'
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  mx-6 w-12 h-0.5 transition-all
                  ${index < currentStep || isStepCompleted(index)
                    ? 'bg-success-600'
                    : 'bg-gray-300'
                  }
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mt-2">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-96">
        <CurrentStepComponent
          storyData={storyData}
          updateStoryData={updateStoryData}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`
            inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1 || isProcessing}
          className={`
            inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${currentStep === steps.length - 1 || isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
            }
          `}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Processing...
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StoryCreator
