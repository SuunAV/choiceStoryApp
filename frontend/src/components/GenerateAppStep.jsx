import React, { useState } from 'react'
import { Package, Download, Loader } from 'lucide-react'

const GenerateAppStep = ({ storyData, updateStoryData, onPrevious }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate app generation process
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationComplete(true)
      updateStoryData({ generatedApp: { url: '#', downloadReady: true } })
    }, 3000)
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Package className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Generate Interactive App</h3>
        </div>
        
        <div className="space-y-4">
          {!generationComplete ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">
                Ready to transform your story into an interactive application?
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Generating App...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    Generate App
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                App Generated Successfully!
              </h4>
              <p className="text-gray-600 mb-6">
                Your interactive story app is ready to download.
              </p>
              <button className="px-8 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors flex items-center mx-auto">
                <Download className="w-5 h-5 mr-2" />
                Download App
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
      </div>
    </div>
  )
}

export default GenerateAppStep