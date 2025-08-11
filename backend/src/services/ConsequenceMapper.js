import logger from '../utils/logger.js';

/**
 * ConsequenceMapper - Maps choices to their immediate consequences
 */
export class ConsequenceMapper {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Maps consequences for all choices
   * @param {Array} choiceSets - Generated choice sets
   * @param {Array} scenes - Summarized scenes
   * @param {Object} persona - Persona configuration
   * @returns {Promise<Array>} Mapped consequences
   */
  async map(choiceSets, scenes, persona) {
    logger.debug('Starting consequence mapping', {
      choiceSetCount: choiceSets.length,
      persona: persona.name
    });

    try {
      const consequences = [];
      
      for (const choiceSet of choiceSets) {
        const scene = scenes.find(s => s.id === choiceSet.sceneId);
        if (!scene) continue;
        
        const mappedConsequences = await this.mapChoiceSetConsequences(
          choiceSet,
          scene,
          persona
        );
        
        consequences.push({
          id: `consequences_${choiceSet.id}`,
          choiceSetId: choiceSet.id,
          sceneId: scene.id,
          consequences: mappedConsequences,
          metadata: {
            persona: persona.name,
            convergenceRequired: true
          }
        });
      }
      
      logger.info('Consequence mapping completed', {
        totalConsequenceSets: consequences.length
      });
      
      return consequences;
      
    } catch (error) {
      logger.error('Consequence mapping failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Maps consequences for a single choice set
   * @private
   */
  async mapChoiceSetConsequences(choiceSet, scene, persona) {
    const consequences = [];
    
    for (const choice of choiceSet.choices) {
      const consequence = {
        id: `consequence_${choice.id}`,
        choiceId: choice.id,
        text: this.generateConsequenceText(choice, scene, persona),
        type: this.determineConsequenceType(choice.type),
        duration: 'temporary', // All consequences are temporary to ensure convergence
        emotionalTone: this.determineEmotionalTone(choice.type),
        nextSceneModifier: this.getSceneModifier(choice.type)
      };
      
      consequences.push(consequence);
    }
    
    return consequences;
  }

  /**
   * Generates consequence text based on choice
   * @private
   */
  generateConsequenceText(choice, scene, persona) {
    // In production, this would use AI
    // For MVP, use template-based consequences
    
    const templates = {
      moral_high: 'Your decision to do what\'s right creates a ripple of positive change.',
      moral_low: 'Taking the easier path provides immediate relief, but leaves questions unanswered.',
      moral_compromise: 'Your balanced approach satisfies most, though some concerns remain.',
      tactical_direct: 'The direct approach leads to immediate action and quick results.',
      tactical_stealth: 'Moving carefully and quietly, you avoid detection and gather valuable insights.',
      tactical_wait: 'Patience reveals new information that changes your perspective.',
      time_immediate: 'Your quick action prevents disaster, though some details are missed.',
      time_think: 'The brief pause allows for a better plan, though time grows short.',
      trust_full: 'Your complete trust strengthens bonds and opens new possibilities.',
      trust_partial: 'Your cautious trust maintains safety while allowing progress.',
      info_share: 'Sharing the information creates new alliances and opportunities.',
      info_hide: 'Keeping the secret maintains your advantage for now.',
      general_forward: 'Moving forward brings new discoveries and challenges.',
      general_back: 'Returning provides safety but delays your goals.',
      general_alternative: 'Your creative approach yields unexpected results.'
    };
    
    let text = templates[choice.type] || 'Your choice leads to new developments.';
    
    // Apply persona styling
    if (persona.key === 'playful') {
      text = this.makeConsequencePlayful(text);
    } else if (persona.key === 'adventurous') {
      text = 'Wow! ' + text;
    } else if (persona.key === 'classic') {
      text = 'Thus, ' + text.toLowerCase();
    } else if (persona.key === 'objective') {
      text = 'Result: ' + text;
    }
    
    return text;
  }

  /**
   * Makes consequence text playful
   * @private
   */
  makeConsequencePlayful(text) {
    const replacements = {
      'disaster': 'big trouble',
      'maintains': 'keeps',
      'advantage': 'special thing',
      'perspective': 'way of thinking',
      'valuable insights': 'important clues',
      'unexpected results': 'surprises'
    };
    
    let playful = text;
    for (const [from, to] of Object.entries(replacements)) {
      playful = playful.replace(new RegExp(from, 'gi'), to);
    }
    
    return playful + ' How exciting!';
  }

  /**
   * Determines consequence type
   * @private
   */
  determineConsequenceType(choiceType) {
    const typeMap = {
      moral_high: 'positive_growth',
      moral_low: 'temporary_relief',
      tactical_direct: 'immediate_progress',
      tactical_stealth: 'hidden_advantage',
      time_immediate: 'crisis_averted',
      trust_full: 'relationship_strengthened',
      info_share: 'knowledge_spread'
    };
    
    return typeMap[choiceType] || 'neutral_development';
  }

  /**
   * Determines emotional tone of consequence
   * @private
   */
  determineEmotionalTone(choiceType) {
    const toneMap = {
      moral_high: 'uplifting',
      moral_low: 'uncertain',
      moral_compromise: 'balanced',
      tactical_direct: 'exciting',
      tactical_stealth: 'tense',
      time_immediate: 'relieved',
      trust_full: 'warm',
      trust_partial: 'cautious',
      info_share: 'open',
      info_hide: 'secretive'
    };
    
    return toneMap[choiceType] || 'neutral';
  }

  /**
   * Gets scene modifier for next scene
   * @private
   */
  getSceneModifier(choiceType) {
    // These modifiers affect how the next scene is presented
    // but don't change the ultimate story outcome
    
    const modifiers = {
      moral_high: { mood: 'positive', trust: 1.2 },
      moral_low: { mood: 'uncertain', trust: 0.8 },
      tactical_direct: { pace: 'fast', tension: 1.1 },
      tactical_stealth: { pace: 'slow', awareness: 1.3 },
      time_immediate: { pace: 'rushed', detail: 0.7 },
      trust_full: { relationships: 1.3, vulnerability: 1.2 },
      info_share: { knowledge: 1.2, exposure: 1.1 }
    };
    
    return modifiers[choiceType] || { mood: 'neutral', pace: 'normal' };
  }
}