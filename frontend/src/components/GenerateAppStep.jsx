import React, { useState } from 'react'
import { Package, Download, Loader, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const GenerateAppStep = ({ storyData, updateStoryData, onPrev }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate app generation process with more realistic steps
      await simulateGenerationProcess()
      
      // Generate the final story JSON and create download
      const storyJson = generateFinalStoryJson(storyData)
      const files = {
        'story.json': storyJson,
        'index.html': generateStoryPlayer(),
        'styles.css': generateStoryStyles(),
        'app.js': generateStoryScript()
      }
      
      setGeneratedFiles(files)
      
      // Create downloadable ZIP (in real implementation)
      const blob = new Blob([JSON.stringify(storyJson, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
      setGenerationComplete(true)
      updateStoryData({ 
        generatedApp: { 
          files: files,
          downloadUrl: url,
          downloadReady: true 
        } 
      })
    } catch (error) {
      console.error('Generation failed:', error)
      toast.error('Failed to generate app. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const simulateGenerationProcess = () => {
    return new Promise((resolve) => {
      let progress = 0
      const steps = [
        'Compiling story structure...',
        'Generating interactive elements...',
        'Creating user interface...',
        'Optimizing for target devices...',
        'Finalizing application...'
      ]
      
      const interval = setInterval(() => {
        progress++
        if (progress >= steps.length) {
          clearInterval(interval)
          resolve()
        }
      }, 600)
    })
  }

  const generateFinalStoryJson = (data) => {
    if (!data.storyStructure) {
      throw new Error('No story structure available for generation')
    }

    return {
      title: data.title,
      author: data.author || 'Unknown Author',
      startingScene: data.storyStructure.startingScene,
      metadata: {
        ...data.storyStructure.metadata,
        generatedDate: new Date().toISOString(),
        version: '1.0.0',
        platform: 'web',
        analysisConfidence: data.analysis?.confidence || 0.85
      },
      scenes: data.storyStructure.scenes,
      // Additional game configuration
      gameConfig: {
        saveProgress: true,
        showChoiceConsequences: true,
        enableBackButton: true,
        autoSave: true,
        theme: 'default'
      }
    }
  }

  const generateStoryPlayer = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${storyData.title || 'Interactive Story'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="story-app"></div>
    <script src="app.js"></script>
</body>
</html>`
  }

  const generateStoryStyles = () => {
    return `/* Generated styles for ${storyData.title} */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

#story-app {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.choice-button {
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin: 8px 0;
    width: 100%;
    font-size: 16px;
    transition: background-color 0.3s;
}

.choice-button:hover {
    background: #45a049;
}`
  }

  const generateStoryScript = () => {
    return `// Generated JavaScript for ${storyData.title}
// Load story data and initialize the interactive story player
fetch('story.json')
    .then(response => response.json())
    .then(storyData => {
        const app = new StoryPlayer(storyData);
        app.init();
    })
    .catch(error => {
        console.error('Failed to load story:', error);
    });

// Story Player Class
class StoryPlayer {
    constructor(storyData) {
        this.story = storyData;
        this.currentScene = storyData.startingScene;
        this.gameState = {};
    }

    init() {
        this.render();
    }

    render() {
        const app = document.getElementById('story-app');
        const scene = this.story.scenes[this.currentScene];
        
        if (!scene) {
            app.innerHTML = '<h2>Story Complete!</h2><p>Thank you for playing!</p>';
            return;
        }

        let html = \`<h1>\${scene.title}</h1>\`;
        html += \`<p>\${scene.description}</p>\`;
        
        if (!scene.is_end_scene && scene.choices) {
            html += \`<h3>\${scene.decisionPrompt}</h3>\`;
            scene.choices.forEach((choice, index) => {
                html += \`<button class="choice-button" onclick="player.makeChoice('\${choice.nextScene}')">\${choice.text}</button>\`;
            });
        }
        
        app.innerHTML = html;
    }

    makeChoice(nextScene) {
        this.currentScene = nextScene;
        this.render();
    }
}

// Global player instance
let player;
`
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${storyData.title?.replace(/[^a-z0-9]/gi, '_') || 'interactive_story'}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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
              {!isGenerating ? (
                <>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Generate Your Interactive Story
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Transform your analyzed story into a fully interactive application 
                    that readers can enjoy on any device.
                  </p>
                  
                  {/* Generation Preview */}
                  {storyData.analysis && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <h5 className="font-medium text-gray-900 mb-2">Generation Summary:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• {Object.keys(storyData.storyStructure?.scenes || {}).length} interactive scenes</li>
                        <li>• {storyData.analysis.decisionPoints} decision points</li>
                        <li>• {storyData.analysis.potentialEndings} different endings</li>
                        <li>• Optimized for {storyData.analysis.ageRecommendation}</li>
                        <li>• Estimated play time: {storyData.analysis.estimatedGameLength}</li>
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center mx-auto"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Generate Interactive App
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Generating Your App...
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Please wait while we create your interactive story application.
                    This may take a few moments.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                🎉 App Generated Successfully!
              </h4>
              <p className="text-gray-600 mb-6">
                Your interactive story "{storyData.title}" is ready for download and deployment.
              </p>

              {/* Generated Files Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h5 className="font-medium text-gray-900 mb-3">Generated Files:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    story.json
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    index.html
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    styles.css
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    app.js
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleDownload}
                  className="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Story JSON
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would open the story player
                    alert('Story player would open here!')
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Story
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <div className="text-sm text-gray-500">
          {generationComplete ? 'Generation Complete!' : 'Final Step'}
        </div>
      </div>
    </div>
  )
}

export default GenerateAppStep