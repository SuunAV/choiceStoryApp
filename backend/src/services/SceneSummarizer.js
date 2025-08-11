import logger from '../utils/logger.js';

/**
 * SceneSummarizer - Creates age-appropriate scene summaries using AI
 */
export class SceneSummarizer {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Summarizes scenes around decision points
   * @param {Array} chunks - Text chunks
   * @param {Array} decisionPoints - Identified decision points
   * @param {Object} persona - Persona configuration
   * @param {string} targetAge - Target age range
   * @returns {Promise<Array>} Summarized scenes
   */
  async summarize(chunks, decisionPoints, persona, targetAge) {
    logger.debug('Starting scene summarization', {
      chunkCount: chunks.length,
      decisionPointCount: decisionPoints.length,
      persona: persona.name,
      targetAge
    });

    try {
      const summarizedScenes = [];
      
      for (const point of decisionPoints) {
        const chunk = chunks.find(c => c.id === point.chunkId);
        if (!chunk) continue;
        
        // For MVP, create basic summaries
        // In production, this would call the AI service
        const summary = {
          id: `scene_${point.id}`,
          decisionPointId: point.id,
          chunkId: chunk.id,
          content: this.createBasicSummary(chunk, point, persona, targetAge),
          metadata: {
            wordCount: chunk.wordCount,
            hasDialog: chunk.metadata.hasDialog,
            position: point.position,
            persona: persona.name
          }
        };
        
        summarizedScenes.push(summary);
      }
      
      logger.info('Scene summarization completed', {
        totalScenes: summarizedScenes.length
      });
      
      return summarizedScenes;
      
    } catch (error) {
      logger.error('Scene summarization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Creates a basic summary (placeholder for AI integration)
   * @private
   */
  createBasicSummary(chunk, decisionPoint, persona, targetAge) {
    // Extract relevant context around the decision point
    const sentences = chunk.sentences || [];
    const pointIndex = decisionPoint.sentenceIndex;
    
    // Get 2-3 sentences before the decision point
    const contextStart = Math.max(0, pointIndex - 2);
    const contextEnd = Math.min(sentences.length, pointIndex + 1);
    const contextSentences = sentences.slice(contextStart, contextEnd);
    
    // Apply basic persona styling
    let summary = contextSentences.join(' ');
    
    // Simplify for younger audiences
    const minAge = parseInt(targetAge.split('-')[0]);
    if (minAge <= 8) {
      // Remove complex words and shorten sentences
      summary = summary
        .replace(/\b\w{10,}\b/g, match => match.substring(0, 8))
        .replace(/[,;:]/g, '.')
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 3)
        .join('. ') + '.';
    }
    
    return summary;
  }
}