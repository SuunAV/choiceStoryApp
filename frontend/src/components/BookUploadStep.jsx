import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, BookOpen, User, Users, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * BookUploadStep Component - First step in the story creation workflow
 * Handles file upload and basic story metadata input
 * Security: All inputs are sanitized and validated to prevent XSS attacks
 */
const BookUploadStep = ({ storyData, updateStoryData }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  /**
   * Sanitizes text input to prevent XSS attacks
   * @param {string} input - Raw text input
   * @returns {string} - Sanitized text
   */
  const sanitizeInput = useCallback((input) => {
    if (typeof input !== 'string') return ''
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
      .substring(0, 1000) // Limit length to prevent abuse
  }, [])

  /**
   * Handles file drop and upload
   */
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|pdf)$/i)) {
      toast.error('Please upload a text file (.txt, .md, or .pdf)')
      return
    }

    try {
      setUploadedFile(file)
      
      // Read file content
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        
        // Sanitize file content
        const sanitizedContent = sanitizeInput(content)
        
        if (sanitizedContent.length < 100) {
          toast.error('Story content is too short. Please provide at least 100 characters.')
          return
        }

        updateStoryData({
          bookContent: sanitizedContent,
          title: storyData.title || file.name.replace(/\.[^/.]+$/, "")
        })
        
        toast.success('File uploaded successfully!')
      }
      
      reader.onerror = () => {
        toast.error('Error reading file')
        setUploadedFile(null)
      }
      
      reader.readAsText(file)
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Error uploading file')
      setUploadedFile(null)
    }
  }, [updateStoryData, sanitizeInput, storyData.title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  /**
   * Handles manual text input
   */
  const handleTextChange = (e) => {
    const sanitizedText = sanitizeInput(e.target.value)
    updateStoryData({ bookContent: sanitizedText })
    
    // Clear uploaded file if user starts typing
    if (uploadedFile && sanitizedText !== storyData.bookContent) {
      setUploadedFile(null)
    }
  }

  /**
   * Handles metadata input changes
   */
  const handleMetadataChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value)
    updateStoryData({ [field]: sanitizedValue })
  }

  /**
   * Removes uploaded file
   */
  const removeFile = () => {
    setUploadedFile(null)
    updateStoryData({ bookContent: '' })
    toast.success('File removed')
  }

  const ageGroups = [
    { value: '6-8', label: '6-8 years (Early Readers)' },
    { value: '8-10', label: '8-10 years (Beginning Chapter Books)' },
    { value: '10-12', label: '10-12 years (Middle Grade)' },
    { value: '12-14', label: '12-14 years (Young Adult)' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Upload Your Story
        </h3>
        <p className="text-gray-600">
          Upload your book content or paste it directly. We support text files, markdown, and PDFs.
        </p>
      </div>

      {/* File Upload Area */}
      <div className="space-y-4">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive || dragActive
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop your file here...</p>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  Drop your story file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports .txt, .md, and .pdf files (max 10MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Manual Text Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or paste your story content directly:
          </label>
          <textarea
            value={storyData.bookContent}
            onChange={handleTextChange}
            placeholder="Paste your story content here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {storyData.bookContent.length} characters
            </span>
            {storyData.bookContent.length > 0 && storyData.bookContent.length < 100 && (
              <span className="text-warning-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Minimum 100 characters required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Story Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Story Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Story Title *
          </label>
          <input
            type="text"
            value={storyData.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            placeholder="Enter your story title"
            className="input"
            maxLength="100"
          />
        </div>

        {/* Author Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Author Name
          </label>
          <div className="relative">
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={storyData.author}
              onChange={(e) => handleMetadataChange('author', e.target.value)}
              placeholder="Enter author name"
              className="input pl-10"
              maxLength="50"
            />
          </div>
        </div>

        {/* Target Age Group */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Target Age Group *
          </label>
          <div className="relative">
            <Users className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={storyData.targetAge}
              onChange={(e) => handleMetadataChange('targetAge', e.target.value)}
              className="input pl-10"
            >
              <option value="">Select target age group</option>
              {ageGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📝 Upload Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your story engaging with clear scenes and characters</li>
          <li>• Include dialogue and descriptive narrative</li>
          <li>• Longer stories work better for creating multiple choice points</li>
          <li>• Our AI works best with stories that have natural decision moments</li>
        </ul>
      </div>
    </div>
  )
}

export default BookUploadStep
