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
        <div className="w-16 h-16 rounded-full border border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white font-mono mb-2">
          DATA_INTAKE_MODULE
        </h3>
        <p className="text-slate-400 font-mono text-sm">
          Upload source material or input narrative data directly. Supports .txt, .md, .pdf formats.
        </p>
      </div>

      {/* File Upload Area */}
      <div className="space-y-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all backdrop-blur-sm
              ${isDragActive || dragActive
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/40'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full border border-slate-600 bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            {isDragActive ? (
              <p className="text-cyan-400 font-mono font-bold">UPLOADING_FILE...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-white font-mono font-bold">
                  FILE_UPLOAD_INTERFACE
                </p>
                <p className="text-sm text-slate-400 font-mono">
                  Drag source file or CLICK to browse • MAX_SIZE: 10MB
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  SUPPORTED: .txt | .md | .pdf
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-mono font-bold text-white">{uploadedFile.name}</p>
                  <p className="text-sm text-slate-400 font-mono">
                    SIZE: {(uploadedFile.size / 1024).toFixed(1)}KB • STATUS: LOADED
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-400/10 border border-slate-700 hover:border-red-400/50 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Manual Text Input */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded border border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center">
              <span className="text-cyan-400 text-sm">⌘</span>
            </div>
            <label className="block text-sm font-mono font-bold text-white">
              DIRECT_INPUT_MODE:
            </label>
          </div>
          <div className="border border-slate-700 rounded-lg bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">NARRATIVE_INPUT.txt</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs font-mono text-slate-400">READY</span>
                </div>
              </div>
            </div>
            <textarea
              value={storyData.bookContent}
              onChange={handleTextChange}
              placeholder=">>> PASTE_STORY_CONTENT_HERE..."
              className="w-full h-64 px-4 py-4 bg-transparent text-white placeholder-slate-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent"
              style={{ fontFamily: 'JetBrains Mono, Roboto Mono, monospace' }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 font-mono">
                CHARS: {storyData.bookContent.length}
              </span>
              <span className="text-slate-400 font-mono">
                WORDS: {storyData.bookContent.split(' ').filter(w => w.length > 0).length}
              </span>
            </div>
            {storyData.bookContent.length > 0 && storyData.bookContent.length < 100 && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-mono">MIN_LENGTH: 100_CHARS</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Metadata */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded border border-blue-400/50 bg-blue-400/10 flex items-center justify-center">
            <span className="text-blue-400 text-sm">⚙</span>
          </div>
          <h4 className="text-lg font-mono font-bold text-white">METADATA_CONFIG</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Story Title */}
          <div className="space-y-3">
            <label className="block text-sm font-mono font-bold text-slate-300">
              PROJECT_TITLE <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={storyData.title}
              onChange={(e) => handleMetadataChange('title', e.target.value)}
              placeholder=">>> INPUT_STORY_TITLE"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
              maxLength="100"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-3">
            <label className="block text-sm font-mono font-bold text-slate-300">
              AUTHOR_NAME
            </label>
            <div className="relative">
              <User className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={storyData.author}
                onChange={(e) => handleMetadataChange('author', e.target.value)}
                placeholder=">>> AUTHOR_IDENTIFIER"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                maxLength="50"
              />
            </div>
          </div>

          {/* Target Age Group */}
          <div className="space-y-3 md:col-span-2">
            <label className="block text-sm font-mono font-bold text-slate-300">
              TARGET_DEMOGRAPHIC <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Users className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={storyData.targetAge}
                onChange={(e) => handleMetadataChange('targetAge', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all appearance-none"
              >
                <option value="" className="bg-slate-800">SELECT_AGE_RANGE...</option>
                {ageGroups.map((group) => (
                  <option key={group.value} value={group.value} className="bg-slate-800">
                    {group.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Guidelines */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/30 backdrop-blur-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded border border-green-400/50 bg-green-400/10 flex items-center justify-center">
            <span className="text-green-400 text-sm">ⓘ</span>
          </div>
          <h4 className="font-mono font-bold text-green-400">OPTIMIZATION_GUIDELINES</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-mono text-slate-300">
              <span className="text-cyan-400">▸</span> Maintain narrative coherence with distinct scenes
            </div>
            <div className="text-sm font-mono text-slate-300">
              <span className="text-cyan-400">▸</span> Include dialogue for character development
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-mono text-slate-300">
              <span className="text-cyan-400">▸</span> Extended content enables decision tree depth
            </div>
            <div className="text-sm font-mono text-slate-300">
              <span className="text-cyan-400">▸</span> AI processes natural narrative branches optimally
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookUploadStep
