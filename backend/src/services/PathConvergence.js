import logger from '../utils/logger.js';

/**
 * PathConvergence - Ensures all story paths converge to the original ending
 */
export class PathConvergence {
  constructor(config = {}) {
    this.config = {
      maxBranchDepth: config.maxBranchDepth || 3,
      convergenceBuffer: config.convergenceBuffer || 2, // scenes before mandatory convergence
      ...config
    };
  }

  /**
   * Creates the final story structure with convergence points
   * @param {Array} scenes - Summarized scenes
   * @param {Array} choiceSets - Generated choices
   * @param {Array} consequences - Mapped consequences
   * @param {Array} originalChunks - Original text chunks
   * @returns {Promise<Object>} Complete story structure
   */
  async converge(scenes, choiceSets, consequences, originalChunks) {
    logger.debug('Starting path convergence', {
      sceneCount: scenes.length,
      choiceSetCount: choiceSets.length
    });

    try {
      // Build the story graph
      const storyGraph = this.buildStoryGraph(scenes, choiceSets, consequences);
      
      // Identify convergence points
      const convergencePoints = this.identifyConvergencePoints(storyGraph, originalChunks);
      
      // Create the final structure
      const structure = {
        id: `story_${Date.now()}`,
        metadata: {
          totalScenes: scenes.length,
          totalChoices: choiceSets.reduce((sum, set) => sum + set.choices.length, 0),
          convergencePoints: convergencePoints.length,
          maxBranchDepth: this.calculateMaxDepth(storyGraph)
        },
        startScene: scenes[0]?.id || 'scene_start',
        scenes: this.formatScenes(scenes, choiceSets, consequences, convergencePoints),
        convergenceMap: this.createConvergenceMap(convergencePoints),
        ending: this.extractEnding(originalChunks)
      };
      
      logger.info('Path convergence completed', {
        convergencePoints: convergencePoints.length,
        maxDepth: structure.metadata.maxBranchDepth
      });
      
      return structure;
      
    } catch (error) {
      logger.error('Path convergence failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Builds a graph representation of the story
   * @private
   */
  buildStoryGraph(scenes, choiceSets, consequences) {
    const graph = {
      nodes: new Map(),
      edges: []
    };
    
    // Create nodes for each scene
    scenes.forEach((scene, index) => {
      graph.nodes.set(scene.id, {
        id: scene.id,
        index,
        scene,
        outgoing: [],
        incoming: []
      });
    });
    
    // Create edges based on choices and consequences
    choiceSets.forEach((choiceSet, index) => {
      const fromNode = graph.nodes.get(choiceSet.sceneId);
      if (!fromNode) return;
      
      const consequenceSet = consequences.find(c => c.choiceSetId === choiceSet.id);
      if (!consequenceSet) return;
      
      choiceSet.choices.forEach((choice, choiceIndex) => {
        const consequence = consequenceSet.consequences[choiceIndex];
        
        // Determine next scene (or convergence point)
        let toSceneId;
        if (index < scenes.length - 1) {
          // Check if we need to converge
          const shouldConverge = this.shouldConverge(fromNode.index, scenes.length);
          if (shouldConverge) {
            // All choices lead to the same next scene
            toSceneId = scenes[index + 1].id;
          } else {
            // Branch to a variation scene
            toSceneId = `${scenes[index + 1].id}_branch_${choiceIndex}`;
          }
        } else {
          // Last scene always converges to ending
          toSceneId = 'scene_ending';
        }
        
        const edge = {
          id: `edge_${choice.id}`,
          from: fromNode.id,
          to: toSceneId,
          choice,
          consequence
        };
        
        graph.edges.push(edge);
        fromNode.outgoing.push(edge);
      });
    });
    
    return graph;
  }

  /**
   * Identifies where paths should converge
   * @private
   */
  identifyConvergencePoints(graph, originalChunks) {
    const convergencePoints = [];
    const totalScenes = graph.nodes.size;
    
    // Add natural convergence points
    // 1. After every major section/chapter
    const chapterBoundaries = originalChunks
      .filter(chunk => chunk.metadata.isChapterStart || chunk.metadata.isChapterEnd)
      .map(chunk => chunk.index);
    
    chapterBoundaries.forEach(boundary => {
      convergencePoints.push({
        id: `convergence_chapter_${boundary}`,
        type: 'chapter_boundary',
        afterSceneIndex: boundary,
        reason: 'Natural chapter boundary'
      });
    });
    
    // 2. Every N scenes to prevent excessive branching
    const convergenceInterval = Math.max(3, Math.floor(totalScenes / 5));
    for (let i = convergenceInterval; i < totalScenes; i += convergenceInterval) {
      convergencePoints.push({
        id: `convergence_periodic_${i}`,
        type: 'periodic',
        afterSceneIndex: i,
        reason: 'Periodic convergence to maintain story coherence'
      });
    }
    
    // 3. Before the ending (last 2-3 scenes)
    if (totalScenes > 3) {
      convergencePoints.push({
        id: 'convergence_pre_ending',
        type: 'pre_ending',
        afterSceneIndex: totalScenes - 3,
        reason: 'Convergence before story ending'
      });
    }
    
    // Sort and deduplicate
    convergencePoints.sort((a, b) => a.afterSceneIndex - b.afterSceneIndex);
    
    return this.deduplicateConvergencePoints(convergencePoints);
  }

  /**
   * Determines if paths should converge at this point
   * @private
   */
  shouldConverge(sceneIndex, totalScenes) {
    // Always converge near the end
    if (sceneIndex >= totalScenes - this.config.convergenceBuffer) {
      return true;
    }
    
    // Converge at regular intervals
    const interval = Math.max(3, Math.floor(totalScenes / 5));
    if (sceneIndex % interval === 0) {
      return true;
    }
    
    return false;
  }

  /**
   * Formats scenes with choice and convergence information
   * @private
   */
  formatScenes(scenes, choiceSets, consequences, convergencePoints) {
    return scenes.map((scene, index) => {
      const choiceSet = choiceSets.find(cs => cs.sceneId === scene.id);
      const consequenceSet = consequences.find(c => c.sceneId === scene.id);
      const convergencePoint = convergencePoints.find(cp => cp.afterSceneIndex === index);
      
      return {
        ...scene,
        choices: choiceSet ? choiceSet.choices : [],
        consequences: consequenceSet ? consequenceSet.consequences : [],
        isConvergencePoint: !!convergencePoint,
        convergenceInfo: convergencePoint,
        nextScenes: this.determineNextScenes(scene, choiceSet, index, scenes.length)
      };
    });
  }

  /**
   * Determines next scenes based on choices
   * @private
   */
  determineNextScenes(scene, choiceSet, currentIndex, totalScenes) {
    if (!choiceSet || currentIndex >= totalScenes - 1) {
      return ['scene_ending'];
    }
    
    const shouldConverge = this.shouldConverge(currentIndex, totalScenes);
    
    if (shouldConverge) {
      // All choices lead to the same next scene
      return choiceSet.choices.map(() => `scene_${currentIndex + 1}`);
    } else {
      // Each choice can lead to a different branch
      return choiceSet.choices.map((choice, i) => `scene_${currentIndex + 1}_branch_${i}`);
    }
  }

  /**
   * Creates a convergence map for navigation
   * @private
   */
  createConvergenceMap(convergencePoints) {
    const map = {};
    
    convergencePoints.forEach(point => {
      map[point.afterSceneIndex] = {
        id: point.id,
        type: point.type,
        reason: point.reason
      };
    });
    
    return map;
  }

  /**
   * Extracts the ending from original chunks
   * @private
   */
  extractEnding(chunks) {
    if (chunks.length === 0) {
      return {
        content: 'The End',
        isOriginal: false
      };
    }
    
    // Get last chunk or last few sentences
    const lastChunk = chunks[chunks.length - 1];
    const sentences = lastChunk.sentences || [];
    const endingSentences = sentences.slice(-3); // Last 3 sentences
    
    return {
      content: endingSentences.join(' '),
      isOriginal: true,
      chunkId: lastChunk.id
    };
  }

  /**
   * Calculates maximum branch depth
   * @private
   */
  calculateMaxDepth(graph) {
    // Simple depth calculation
    // In a more complex implementation, would trace all paths
    return Math.min(this.config.maxBranchDepth, 3);
  }

  /**
   * Deduplicates convergence points
   * @private
   */
  deduplicateConvergencePoints(points) {
    const seen = new Set();
    return points.filter(point => {
      if (seen.has(point.afterSceneIndex)) {
        return false;
      }
      seen.add(point.afterSceneIndex);
      return true;
    });
  }
}