import logger from '../utils/logger.js';

/**
 * ChoiceGenerator - Creates meaningful choices at decision points
 */
export class ChoiceGenerator {
  constructor(config = {}) {
    this.config = {
      minChoices: config.minChoices || 2,
      maxChoices: config.maxChoices || 4,
      ...config
    };
  }

  /**
   * Generates choices for decision points
   * @param {Array} scenes - Summarized scenes
   * @param {Array} decisionPoints - Decision points
   * @param {Object} persona - Persona configuration
   * @param {string} targetAge - Target age range
   * @returns {Promise<Array>} Generated choices
   */
  async generate(scenes, decisionPoints, persona, targetAge) {
    logger.debug('Starting choice generation', {
      sceneCount: scenes.length,
      persona: persona.name,
      targetAge
    });

    try {
      const allChoices = [];
      
      for (const scene of scenes) {
        const decisionPoint = decisionPoints.find(dp => dp.id === scene.decisionPointId);
        if (!decisionPoint) continue;
        
        // Generate choices based on decision point category
        const choices = await this.generateChoicesForPoint(
          scene,
          decisionPoint,
          persona,
          targetAge
        );
        
        allChoices.push({
          id: `choices_${scene.id}`,
          sceneId: scene.id,
          decisionPointId: decisionPoint.id,
          choices,
          metadata: {
            category: decisionPoint.category,
            confidence: decisionPoint.confidence,
            persona: persona.name
          }
        });
      }
      
      logger.info('Choice generation completed', {
        totalChoiceSets: allChoices.length,
        totalIndividualChoices: allChoices.reduce((sum, set) => sum + set.choices.length, 0)
      });
      
      return allChoices;
      
    } catch (error) {
      logger.error('Choice generation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Generates choices for a specific decision point
   * @private
   */
  async generateChoicesForPoint(scene, decisionPoint, persona, targetAge) {
    // In production, this would use AI to generate contextual choices
    // For MVP, use category-based templates
    
    const templates = this.getChoiceTemplates(decisionPoint.category, persona, targetAge);
    const numChoices = Math.min(templates.length, this.config.maxChoices);
    
    const choices = [];
    for (let i = 0; i < numChoices; i++) {
      choices.push({
        id: `choice_${scene.id}_${i}`,
        text: this.adaptChoiceText(templates[i], scene, persona, targetAge),
        type: templates[i].type,
        weight: templates[i].weight || 1.0
      });
    }
    
    return choices;
  }

  /**
   * Gets choice templates based on category
   * @private
   */
  getChoiceTemplates(category, persona, targetAge) {
    const templates = {
      'Moral & Ethical Crossroads': [
        { text: 'Do the right thing, even if it\'s difficult', type: 'moral_high', weight: 1.2 },
        { text: 'Choose the easier path to avoid conflict', type: 'moral_low', weight: 0.8 },
        { text: 'Find a middle ground that satisfies everyone', type: 'moral_compromise', weight: 1.0 },
        { text: 'Follow your heart, regardless of consequences', type: 'moral_emotional', weight: 1.0 }
      ],
      'Strategic or Tactical Choices': [
        { text: 'Take the direct approach', type: 'tactical_direct', weight: 1.0 },
        { text: 'Use stealth and caution', type: 'tactical_stealth', weight: 1.0 },
        { text: 'Wait and gather more information', type: 'tactical_wait', weight: 0.9 },
        { text: 'Try a creative solution', type: 'tactical_creative', weight: 1.1 }
      ],
      'Time-Pressure Scenarios': [
        { text: 'Act immediately', type: 'time_immediate', weight: 1.2 },
        { text: 'Take a moment to think', type: 'time_think', weight: 0.8 },
        { text: 'Ask for help first', type: 'time_help', weight: 1.0 }
      ],
      'Relationship & Trust Conflicts': [
        { text: 'Trust them completely', type: 'trust_full', weight: 1.0 },
        { text: 'Be cautious but give them a chance', type: 'trust_partial', weight: 1.1 },
        { text: 'Protect yourself first', type: 'trust_none', weight: 0.9 },
        { text: 'Test their loyalty', type: 'trust_test', weight: 1.0 }
      ],
      'Information & Knowledge Risks': [
        { text: 'Share the information', type: 'info_share', weight: 1.0 },
        { text: 'Keep it secret', type: 'info_hide', weight: 1.0 },
        { text: 'Share only part of it', type: 'info_partial', weight: 1.1 },
        { text: 'Use it as leverage', type: 'info_leverage', weight: 0.9 }
      ],
      'General Choice Point': [
        { text: 'Go forward', type: 'general_forward', weight: 1.0 },
        { text: 'Turn back', type: 'general_back', weight: 0.9 },
        { text: 'Try something different', type: 'general_alternative', weight: 1.1 }
      ]
    };
    
    return templates[category] || templates['General Choice Point'];
  }

  /**
   * Adapts choice text based on persona and age
   * @private
   */
  adaptChoiceText(template, scene, persona, targetAge) {
    let text = template.text;
    
    // Apply persona-specific phrasing
    if (persona.key === 'playful') {
      text = this.makePlayful(text);
    } else if (persona.key === 'adventurous') {
      text = this.makeAdventurous(text);
    } else if (persona.key === 'classic') {
      text = this.makeClassic(text);
    }
    
    // Simplify for younger audiences
    const minAge = parseInt(targetAge.split('-')[0]);
    if (minAge <= 8) {
      text = this.simplifyForYoung(text);
    }
    
    return text;
  }

  /**
   * Makes text more playful
   * @private
   */
  makePlayful(text) {
    const replacements = {
      'Do the right thing': 'Be a good friend',
      'difficult': 'hard',
      'conflict': 'trouble',
      'consequences': 'what happens next',
      'immediately': 'right now',
      'information': 'secret'
    };
    
    let playful = text;
    for (const [from, to] of Object.entries(replacements)) {
      playful = playful.replace(new RegExp(from, 'gi'), to);
    }
    
    return playful;
  }

  /**
   * Makes text more adventurous
   * @private
   */
  makeAdventurous(text) {
    if (text.startsWith('Go')) {
      return 'You decide to ' + text.toLowerCase();
    }
    if (text.startsWith('Take')) {
      return 'You ' + text.toLowerCase();
    }
    return 'You ' + text.toLowerCase();
  }

  /**
   * Makes text more classic/formal
   * @private
   */
  makeClassic(text) {
    if (!text.includes('the character')) {
      return 'The character chooses to ' + text.toLowerCase();
    }
    return text;
  }

  /**
   * Simplifies text for young readers
   * @private
   */
  simplifyForYoung(text) {
    const simplifications = {
      'consequences': 'what happens',
      'immediately': 'now',
      'information': 'news',
      'cautious': 'careful',
      'creative solution': 'new idea',
      'gather more information': 'learn more'
    };
    
    let simple = text;
    for (const [complex, simple_word] of Object.entries(simplifications)) {
      simple = simple.replace(new RegExp(complex, 'gi'), simple_word);
    }
    
    return simple;
  }
}