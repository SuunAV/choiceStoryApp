import React, { useState, useEffect } from 'react'
import { Eye, BookOpen } from 'lucide-react'

const PreviewStep = ({ storyData, updateStoryData, onPrev, onNext }) => {
  const [storyStructure, setStoryStructure] = useState(null);

  // Generate story structure when component mounts or analysis data changes
  useEffect(() => {
    if (storyData.analysis && !storyStructure) {
      const structure = generateStoryStructure(storyData);
      setStoryStructure(structure);
      updateStoryData({ storyStructure: structure });
    }
  }, [storyData.analysis, updateStoryData, storyStructure]);

  /**
   * Generate interactive story structure from analysis
   */
  const generateStoryStructure = (data) => {
    const analysis = data.analysis;
    if (!analysis) return null;

    // Create story scenes based on decision points
    const scenes = [];
    const decisionCount = analysis.decisionPoints || 5;
    
    // Opening scene
    scenes.push({
      id: 'SCENE_START',
      title: `${data.title} - Beginning`,
      description: `Welcome to the interactive story of "${data.title}". Your choices will shape the adventure ahead.`,
      decisionPrompt: 'How would you like to begin this story?',
      choices: [
        {
          text: 'Start at the very beginning',
          consequence: 'You begin the story from the opening scene.',
          nextScene: 'SCENE_1'
        },
        {
          text: 'Jump into the action',
          consequence: 'You dive right into the exciting part of the story.',
          nextScene: 'SCENE_2'
        }
      ],
      is_end_scene: false
    });

    // Generate middle scenes
    for (let i = 1; i <= decisionCount - 2; i++) {
      scenes.push({
        id: `SCENE_${i}`,
        title: `Chapter ${i}`,
        description: `Continue your journey through this interactive story. Each choice leads to new possibilities.`,
        decisionPrompt: `What should happen next in chapter ${i}?`,
        choices: [
          {
            text: `Choice A for Chapter ${i}`,
            consequence: 'This choice leads to an interesting development.',
            nextScene: i < decisionCount - 2 ? `SCENE_${i + 1}` : 'SCENE_END_A'
          },
          {
            text: `Choice B for Chapter ${i}`,
            consequence: 'This choice takes the story in a different direction.',
            nextScene: i < decisionCount - 2 ? `SCENE_${i + 1}` : 'SCENE_END_B'
          }
        ],
        is_end_scene: false
      });
    }

    // Generate ending scenes
    const endings = analysis.potentialEndings || 2;
    for (let i = 0; i < endings; i++) {
      const endingLetter = String.fromCharCode(65 + i); // A, B, C...
      scenes.push({
        id: `SCENE_END_${endingLetter}`,
        title: `Ending ${endingLetter}`,
        description: `This is one of the possible endings for "${data.title}". Your choices have led you here.`,
        decisionPrompt: '',
        choices: [],
        is_end_scene: true
      });
    }

    return {
      title: data.title,
      author: data.author || 'Unknown Author',
      startingScene: 'SCENE_START',
      metadata: {
        targetAge: analysis.ageRecommendation,
        estimatedPlayTime: analysis.estimatedGameLength,
        themes: analysis.themes,
        createdDate: new Date().toISOString()
      },
      scenes: scenes.reduce((acc, scene) => {
        acc[scene.id] = scene;
        return acc;
      }, {})
    };
  };

  if (!storyData.analysis) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No analysis data available. Please complete the AI Analysis step first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const analysis = storyData.analysis;

  return (
    <div className="space-y-6">
      {/* Story Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Eye className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Story Analysis & Preview</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Story Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {storyData.title}</p>
                <p><strong>Author:</strong> {storyData.author || 'Unknown'}</p>
                <p><strong>Word Count:</strong> {analysis.wordCount?.toLocaleString()}</p>
                <p><strong>Reading Time:</strong> {analysis.estimatedReadingTime} minutes</p>
                <p><strong>Target Age:</strong> {analysis.ageRecommendation}</p>
                <p><strong>Complexity:</strong> {analysis.complexity}</p>
              </div>
            </div>

            {/* Themes */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Story Themes</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.themes?.map((theme, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Interactive Elements</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Decision Points:</strong> {analysis.decisionPoints}</p>
                <p><strong>Story Paths:</strong> {analysis.narrativePaths}</p>
                <p><strong>Possible Endings:</strong> {analysis.potentialEndings}</p>
                <p><strong>Estimated Play Time:</strong> {analysis.estimatedGameLength}</p>
              </div>
            </div>

            {/* Characters */}
            {analysis.characters && analysis.characters.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-3">Characters</h4>
                <div className="space-y-1 text-sm">
                  {analysis.characters.map((char, index) => (
                    <p key={index}>
                      <strong>{char.name}:</strong> {char.role}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Structure Preview */}
      {storyStructure && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">Interactive Story Structure</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">
                {Object.keys(storyStructure.scenes).length} scenes created
              </h4>
              <p className="text-sm text-indigo-700">
                Starting from "{storyStructure.scenes[storyStructure.startingScene]?.title}" 
                with {analysis.potentialEndings} different endings possible.
              </p>
            </div>

            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {Object.entries(storyStructure.scenes).map(([sceneId, scene]) => (
                <div key={sceneId} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{scene.title}</p>
                    <p className="text-xs text-gray-600 truncate">{scene.description}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {scene.is_end_scene ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">End</span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {scene.choices?.length || 0} choices
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!storyStructure}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Generate
        </button>
      </div>
    </div>
  );
};

export default PreviewStep