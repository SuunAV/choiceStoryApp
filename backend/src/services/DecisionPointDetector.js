import logger from '../utils/logger.js';

/**
 * DecisionPointDetector - Identifies key moments where choices can be made
 * Based on the decision point scanner patterns from the documentation
 */
export class DecisionPointDetector {
  constructor(config = {}) {
    this.config = {
      minConfidence: config.minConfidence || 'medium',
      contextWindow: config.contextWindow || 1,
      maxPointsPerChunk: config.maxPointsPerChunk || 3,
      ...config
    };
    
    // Initialize detection patterns based on the schema
    this.initializePatterns();
  }

  /**
   * Detects decision points in parsed text chunks
   * @param {Array} chunks - Array of parsed text chunks
   * @returns {Promise<Array>} Array of decision points with metadata
   */
  async detect(chunks) {
    logger.debug('Starting decision point detection', {
      chunkCount: chunks.length,
      config: this.config
    });

    try {
      const allDecisionPoints = [];
      
      for (const chunk of chunks) {
        const chunkPoints = await this.analyzeChunk(chunk);
        
        // Limit points per chunk to avoid over-segmentation
        const limitedPoints = this.limitPointsPerChunk(chunkPoints);
        
        // Add chunk context to each point
        limitedPoints.forEach(point => {
          point.chunkId = chunk.id;
          point.chunkIndex = chunk.index;
          point.sectionTitle = chunk.sectionTitle;
        });
        
        allDecisionPoints.push(...limitedPoints);
      }
      
      // Post-process to ensure good distribution
      const distributedPoints = this.distributePoints(allDecisionPoints, chunks.length);
      
      // Enhance with AI analysis if available
      const enhancedPoints = await this.enhanceWithAI(distributedPoints, chunks);
      
      logger.info('Decision point detection completed', {
        totalPoints: enhancedPoints.length,
        distribution: this.getDistributionStats(enhancedPoints)
      });
      
      return enhancedPoints;
      
    } catch (error) {
      logger.error('Decision point detection failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Initializes detection patterns
   * @private
   */
  initializePatterns() {
    this.categories = [
      {
        name: 'Moral & Ethical Crossroads',
        weight: 1.5, // Higher weight for more engaging choices
        patterns: [
          /\b(had|has|was)\s+to\s+choose\s+between\b/i,
          /\bforced\s+to\s+decide\b/i,
          /\btorn\s+between\b/i,
          /\bcould\s+(either|neither).+?\bor\b/i,
          /\bagainst\s+(my|his|her|their)\s+better\s+judgment\b/i,
          /\bquestioned\s+(his|her|their|my)\s+morals\b/i,
          /\bweighing\s+the\s+consequences\b/i,
          /\bno\s+other\s+option\s+but\b/i,
          /\bdilemma\b/i,
          /\bconflict(ed|ing)?\s+(loyalty|interest)\b/i
        ],
        examples: [
          'Moral Dilemma',
          'Conflicting Loyalties',
          'Unavoidable Sacrifice',
          'Personal Temptation'
        ]
      },
      {
        name: 'Strategic or Tactical Choices',
        weight: 1.3,
        patterns: [
          /\b(path|fork|crossroads)\b/i,
          /\blimited\s+supplies\b|\bration\b|\bscarce\s+resources\b/i,
          /\bunexpected\s+obstacle\b|\bbarrier\b/i,
          /\babandon\s+the\s+plan\b|\bchange\s+of\s+strategy\b/i,
          /\bfight\s+or\s+flee\b/i,
          /\bspeed\s+or\s+stealth\b/i,
          /\bsplit\s+the\s+group\b/i,
          /\btake\s+the\s+risk\b|\bplay\s+it\s+safe\b/i,
          /\broute\s+(through|around)\b/i,
          /\btactical\s+decision\b/i
        ],
        examples: [
          'Literal Fork in the Path',
          'Resource Scarcity',
          'Competing Goals',
          'Unforeseen Obstacle'
        ]
      },
      {
        name: 'Time-Pressure Scenarios',
        weight: 1.4,
        patterns: [
          /\bbefore\s+it'?s\s+too\s+late\b/i,
          /\btime\s+(was|is)\s+running\s+out\b/i,
          /\bin\s+the\s+nick\s+of\s+time\b/i,
          /\bdeadline\b/i,
          /\bseconds\s+left\b/i,
          /\bhad\s+to\s+act\s+(fast|quickly|now)\b/i,
          /\brace\s+against\s+time\b/i,
          /\burgent\s+decision\b/i,
          /\bnow\s+or\s+never\b/i,
          /\bno\s+time\s+to\s+(think|lose)\b/i
        ],
        examples: [
          'Time-Sensitive Choices',
          'Simultaneous Crises',
          'Act Now vs. Wait'
        ]
      },
      {
        name: 'Relationship & Trust Conflicts',
        weight: 1.2,
        patterns: [
          /\btrust(ed)?\s+(him|her|them)\b|\bbetray(ed|al)\b/i,
          /\bswitch\s+sides\b|\bjoin\s+the\s+enemy\b/i,
          /\baccept(ed)?\s+help\b|\breject(ed)?\s+help\b/i,
          /\bpast\s+came\s+back\b/i,
          /\bprotect\s+(myself|yourself|himself|herself)\b|\bprotect\s+others\b/i,
          /\bmake\s+peace\b|\bcut\s+ties\b/i,
          /\bforgive\s+or\s+forget\b/i,
          /\bstand\s+by\s+(him|her|them)\b/i,
          /\bloyalty\s+tested\b/i,
          /\balliance\s+(formed|broken)\b/i
        ],
        examples: [
          'Trust or Betrayal Moment',
          'Allegiance Shift',
          'Accept or Reject Help'
        ]
      },
      {
        name: 'Information & Knowledge Risks',
        weight: 1.1,
        patterns: [
          /\breveal(ed)?\s+the\s+secret\b/i,
          /\bkeep\s+it\s+hidden\b/i,
          /\btold\s+the\s+truth\b/i,
          /\bwarn(ed)?\s+others\b/i,
          /\bfalse\s+information\b/i,
          /\bevidence\b/i,
          /\bprophecy\b|\bprediction\b/i,
          /\bconflicting\s+accounts\b/i,
          /\bhidden\s+knowledge\b/i,
          /\bforbidden\s+information\b/i
        ],
        examples: [
          'Hidden Info Reveal',
          'Forbidden Knowledge',
          'Keep or Share Info'
        ]
      }
    ];
    
    // General choice cues that boost confidence
    this.choiceCues = [
      /\bchoose\b/i,
      /\bchoice\b/i,
      /\bdecide\b/i,
      /\bdecision\b/i,
      /\beither\b.*\bor\b/i,
      /\bnow\s+or\s+never\b/i,
      /\bno\s+other\s+option\b/i,
      /\bweigh(ing)?\s+the\s+consequences\b/i,
      /\btrade\s+off\b/i,
      /\bat\s+the\s+cost\s+of\b/i,
      /\bmust\s+(choose|decide)\b/i,
      /\bcould\s+(go|take|choose)\b/i
    ];
  }

  /**
   * Analyzes a single chunk for decision points
   * @private
   */
  async analyzeChunk(chunk) {
    const points = [];
    const sentences = chunk.sentences || [];
    
    for (let i = 0; i < sentences.length; i++) {
      // Get context window
      const contextStart = Math.max(0, i - this.config.contextWindow);
      const contextEnd = Math.min(sentences.length, i + this.config.contextWindow + 1);
      const context = sentences.slice(contextStart, contextEnd).join(' ');
      
      // Check against each category
      for (const category of this.categories) {
        let matched = false;
        let matchedPattern = null;
        
        for (const pattern of category.patterns) {
          if (pattern.test(context)) {
            matched = true;
            matchedPattern = pattern.source;
            break;
          }
        }
        
        if (matched) {
          const confidence = this.calculateConfidence(context, matched);
          
          if (this.meetsConfidenceThreshold(confidence)) {
            points.push({
              id: `dp_${chunk.id}_${i}_${points.length}`,
              category: category.name,
              categoryWeight: category.weight,
              type: category.examples[0], // Default to first example
              sentenceIndex: i,
              sentence: sentences[i],
              context,
              confidence,
              pattern: matchedPattern,
              position: this.calculateRelativePosition(i, sentences.length),
              metadata: {
                hasDialog: chunk.metadata.hasDialog,
                isChapterBoundary: chunk.metadata.isChapterStart || chunk.metadata.isChapterEnd
              }
            });
          }
        }
      }
      
      // Check for general choice cues if no category matched
      if (points.length === 0) {
        const hasChoiceCue = this.choiceCues.some(cue => cue.test(context));
        if (hasChoiceCue) {
          points.push({
            id: `dp_${chunk.id}_${i}_generic`,
            category: 'General Choice Point',
            categoryWeight: 1.0,
            type: 'Choice Cue',
            sentenceIndex: i,
            sentence: sentences[i],
            context,
            confidence: 'low',
            pattern: 'choice_cue',
            position: this.calculateRelativePosition(i, sentences.length)
          });
        }
      }
    }
    
    // Remove duplicates and overlapping points
    return this.deduplicatePoints(points);
  }

  /**
   * Calculates confidence score for a match
   * @private
   */
  calculateConfidence(context, hasPatternMatch) {
    const hasChoiceCue = this.choiceCues.some(cue => cue.test(context));
    
    if (hasPatternMatch && hasChoiceCue) {
      return 'high';
    } else if (hasPatternMatch) {
      return 'medium';
    } else if (hasChoiceCue) {
      return 'low';
    }
    
    return 'none';
  }

  /**
   * Checks if confidence meets threshold
   * @private
   */
  meetsConfidenceThreshold(confidence) {
    const thresholds = {
      high: ['high', 'medium', 'low'],
      medium: ['high', 'medium'],
      low: ['high']
    };
    
    return thresholds[this.config.minConfidence].includes(confidence);
  }

  /**
   * Calculates relative position in text (0-1)
   * @private
   */
  calculateRelativePosition(index, total) {
    return total > 0 ? index / total : 0;
  }

  /**
   * Removes duplicate and overlapping points
   * @private
   */
  deduplicatePoints(points) {
    if (points.length <= 1) return points;
    
    // Sort by sentence index
    points.sort((a, b) => a.sentenceIndex - b.sentenceIndex);
    
    const deduplicated = [];
    let lastIndex = -999;
    
    for (const point of points) {
      // Keep points that are at least 3 sentences apart
      if (point.sentenceIndex - lastIndex >= 3) {
        deduplicated.push(point);
        lastIndex = point.sentenceIndex;
      } else if (point.confidence === 'high' && deduplicated[deduplicated.length - 1].confidence !== 'high') {
        // Replace with higher confidence point
        deduplicated[deduplicated.length - 1] = point;
        lastIndex = point.sentenceIndex;
      }
    }
    
    return deduplicated;
  }

  /**
   * Limits points per chunk
   * @private
   */
  limitPointsPerChunk(points) {
    if (points.length <= this.config.maxPointsPerChunk) {
      return points;
    }
    
    // Prioritize by confidence and weight
    points.sort((a, b) => {
      const confScore = { high: 3, medium: 2, low: 1 };
      const aScore = confScore[a.confidence] * a.categoryWeight;
      const bScore = confScore[b.confidence] * b.categoryWeight;
      return bScore - aScore;
    });
    
    return points.slice(0, this.config.maxPointsPerChunk);
  }

  /**
   * Ensures good distribution across the story
   * @private
   */
  distributePoints(points, totalChunks) {
    // Ensure we have points distributed throughout the story
    const minPoints = this.config.minDecisionPoints || 3;
    const maxPoints = this.config.maxDecisionPoints || 15;
    
    // If too few points, lower confidence threshold and re-scan
    if (points.length < minPoints) {
      logger.warn('Too few decision points detected', {
        found: points.length,
        minimum: minPoints
      });
    }
    
    // If too many points, prioritize and trim
    if (points.length > maxPoints) {
      points.sort((a, b) => {
        const confScore = { high: 3, medium: 2, low: 1 };
        const aScore = confScore[a.confidence] * a.categoryWeight;
        const bScore = confScore[b.confidence] * b.categoryWeight;
        return bScore - aScore;
      });
      
      points = points.slice(0, maxPoints);
    }
    
    // Sort by position in story
    points.sort((a, b) => {
      if (a.chunkIndex !== b.chunkIndex) {
        return a.chunkIndex - b.chunkIndex;
      }
      return a.sentenceIndex - b.sentenceIndex;
    });
    
    return points;
  }

  /**
   * Enhances points with AI analysis
   * @private
   */
  async enhanceWithAI(points, chunks) {
    // This would normally call the AI service to enhance decision points
    // For now, return as-is
    return points;
  }

  /**
   * Gets distribution statistics
   * @private
   */
  getDistributionStats(points) {
    const stats = {
      total: points.length,
      byCategory: {},
      byConfidence: {},
      avgSpacing: 0
    };
    
    // Count by category
    points.forEach(point => {
      stats.byCategory[point.category] = (stats.byCategory[point.category] || 0) + 1;
      stats.byConfidence[point.confidence] = (stats.byConfidence[point.confidence] || 0) + 1;
    });
    
    // Calculate average spacing
    if (points.length > 1) {
      let totalSpacing = 0;
      for (let i = 1; i < points.length; i++) {
        totalSpacing += points[i].chunkIndex - points[i-1].chunkIndex;
      }
      stats.avgSpacing = totalSpacing / (points.length - 1);
    }
    
    return stats;
  }
}