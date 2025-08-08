import React from 'react'
import { Eye } from 'lucide-react'

const PreviewStep = ({ storyData, updateStoryData, onPrevious, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Eye className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Story Preview</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Title: {storyData.title}</h4>
            <p className="text-gray-600">Author: {storyData.author || 'Unknown'}</p>
            <p className="text-gray-600">Target Age: {storyData.targetAge || 'Not specified'}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900">
              Story preview functionality will be implemented here.
              This will show the interactive story structure generated from the AI analysis.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Continue to Generate
        </button>
      </div>
    </div>
  )
}

export default PreviewStep