import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, Brain, FileText, Zap } from 'lucide-react';

/**
 * AIAnalysisStep Component
 * Displays AI processing simulation with progress indicators and analysis results
 * Includes XSS protection and input sanitization throughout
 */
const AIAnalysisStep = ({ bookData, onNext, onBack }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

  // Analysis phases with realistic timing
  const analysisPhases = [
    {
      id: 'content-parsing',
      title: 'Parsing Book Content',
      description: 'Extracting and cleaning text content...',
      duration: 2000,
      icon: FileText
    },
    {
      id: 'story-analysis',
      title: 'Analyzing Story Structure',
      description: 'Identifying plot points, characters, and themes...',
      duration: 3000,
      icon: Brain
    },
    {
      id: 'decision-mapping',
      title: 'Mapping Decision Points',
      description: 'Finding natural choice opportunities...',
      duration: 2500,
      icon: Zap
    },
    {
      id: 'game-generation',
      title: 'Generating Interactive Elements',
      description: 'Creating branching narrative paths...',
      duration: 3500,
      icon: CheckCircle
    }
  ];

  // Simulate AI analysis process
  useEffect(() => {
    if (!bookData) {
      setError('No book data provided for analysis');
      setIsAnalyzing(false);
      return;
    }

    const runAnalysis = async () => {
      try {
        // Simulate each phase of analysis
        for (let i = 0; i < analysisPhases.length; i++) {
          setCurrentPhase(i);
          await new Promise(resolve => setTimeout(resolve, analysisPhases[i].duration));
        }

        // Generate mock analysis results (in real app, this would come from AI service)
        const results = generateMockAnalysisResults(bookData);
        setAnalysisResults(results);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
      } catch (err) {
        // Sanitize error message to prevent XSS
        const sanitizedError = String(err.message || 'Analysis failed').replace(/[<>]/g, '');
        setError(sanitizedError);
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [bookData]);

  /**
   * Generate mock analysis results based on book content
   * Sanitizes all text content to prevent XSS attacks
   */
  const generateMockAnalysisResults = (book) => {
    // Sanitize book title and content
    const sanitizeText = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
    };

    const title = sanitizeText(book.name || 'Unknown Title');
    const wordCount = book.content ? book.content.length : 0;

    return {
      title,
      wordCount,
      estimatedReadingTime: Math.ceil(wordCount / 200), // 200 words per minute
      confidence: 0.92,
      themes: [
        'Family relationships',
        'Problem-solving',
        'Creativity and imagination',
        'Helping others'
      ],
      characters: [
        { name: 'Marlon', role: 'Protagonist' },
        { name: 'Miss Yamaguchi', role: 'Teacher' },
        { name: 'Grandma', role: 'Supporting Character' },
        { name: 'Dejah', role: 'Sister' }
      ],
      decisionPoints: 12,
      estimatedGameLength: '15-20 minutes',
      complexity: 'Beginner-friendly',
      ageRecommendation: '8-12 years',
      narrativePaths: 8,
      potentialEndings: 3
    };
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (analysisResults && onNext) {
      onNext({ analysisResults });
    }
  };

  // Loading state
  if (isAnalyzing && !error) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Analysis in Progress</h2>
          <p className="text-gray-600">Our AI is analyzing your book to create the perfect interactive story...</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {analysisPhases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = index === currentPhase;
            const isCompleted = index < currentPhase;

            return (
              <div key={phase.id} className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : isCompleted 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-medium ${
                    isActive ? 'text-blue-800' : isCompleted ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {phase.title}
                  </h3>
                  <p className={`text-sm ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {phase.description}
                  </p>
                </div>
                {isActive && (
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-gray-800">
              {Math.round(((currentPhase + 1) / analysisPhases.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentPhase + 1) / analysisPhases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Results display
  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete!</h2>
        <p className="text-gray-600">Your interactive story is ready to be created</p>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Book Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Title:</span>
                <p className="font-medium text-gray-800">{analysisResults.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Word Count:</span>
                <p className="font-medium text-gray-800">{analysisResults.wordCount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Reading Time:</span>
                <p className="font-medium text-gray-800">{analysisResults.estimatedReadingTime} minutes</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">AI Confidence:</span>
                <p className="font-medium text-green-600">{Math.round(analysisResults.confidence * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Game Structure */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Structure</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Decision Points:</span>
                <p className="font-medium text-gray-800">{analysisResults.decisionPoints}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Narrative Paths:</span>
                <p className="font-medium text-gray-800">{analysisResults.narrativePaths}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Game Length:</span>
                <p className="font-medium text-gray-800">{analysisResults.estimatedGameLength}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Age Group:</span>
                <p className="font-medium text-gray-800">{analysisResults.ageRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Characters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Main Characters</h3>
            <div className="space-y-2">
              {analysisResults.characters.map((character, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{character.name}</span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {character.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Themes</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResults.themes.map((theme, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Upload
        </button>
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          Continue to Preview
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIAnalysisStep;