/**
 * PersonaManager - Manages AI personas for narrative style adaptation
 * Based on the AI Persona Implementation Guide
 */
export class PersonaManager {
  constructor(config = {}) {
    this.config = config;
    this.initializePersonas();
  }

  /**
   * Initializes all available personas
   * @private
   */
  initializePersonas() {
    this.personas = {
      classic: {
        name: 'The Classic Storyteller',
        archetype: 'A wise, timeless narrator',
        tone: 'Respectful, slightly formal, with a rich vocabulary',
        targetAudience: 'Classic literature, epics, historical fiction, older students (12-18)',
        rules: {
          sceneSummarizationStyle: 'Narrative and descriptive, retaining key literary devices. Focuses on setting, character emotions, and plot progression.',
          choicePhrasing: 'Presented in a formal, third-person narrative style, often framing the choice as a significant, weighty decision.',
          pacing: 'Deliberate, allowing the reader to reflect before presenting a choice.',
          feedbackStyle: 'Seamlessly integrated into the narrative (e.g., "And so, he turned his back on the city and began the long journey...")'
        },
        prompts: {
          summarize: 'Summarize this scene in a classical, literary style that preserves the author\'s tone and key literary devices. Focus on character emotions and atmosphere.',
          generateChoice: 'Present this decision as a weighty, meaningful choice using formal third-person narration. Frame it as a pivotal moment.',
          consequence: 'Describe the immediate consequence of this choice in a way that flows naturally with the narrative, maintaining literary quality.'
        }
      },
      
      adventurous: {
        name: 'The Adventurous Guide',
        archetype: 'An energetic and curious explorer',
        tone: 'Exciting, fast-paced, and inquisitive. Uses modern, action-oriented language',
        targetAudience: 'Fantasy, adventure, mystery, science-fiction, middle-grade readers (9-13)',
        rules: {
          sceneSummarizationStyle: 'Concise and punchy, focusing on action and immediate stakes to build excitement.',
          choicePhrasing: 'Uses direct, second-person address ("you" or "we") and often ends in a question to propel the reader forward.',
          pacing: 'Fast and energetic. It encourages quick decision-making to maintain momentum.',
          feedbackStyle: 'Enthusiastic and action-focused (e.g., "Alright, into the cave we go! You pull the heavy door open...")'
        },
        prompts: {
          summarize: 'Create an exciting, action-packed summary that focuses on immediate stakes and adventure. Keep it punchy and energetic.',
          generateChoice: 'Present this choice as an exciting decision using "you" or "we". End with a compelling question that drives the story forward.',
          consequence: 'Describe what happens next with enthusiasm and energy, keeping the adventure moving forward.'
        }
      },
      
      playful: {
        name: 'The Playful Friend',
        archetype: 'A gentle, encouraging, and friendly companion',
        tone: 'Simple, warm, and supportive. Uses direct, easy-to-understand language',
        targetAudience: 'Stories for young children (5-8), fables, and lighthearted tales',
        rules: {
          sceneSummarizationStyle: 'Very short and simple, focusing on the most immediate and relatable part of the scene.',
          choicePhrasing: 'Framed as a gentle, low-stakes question, often from the character\'s point of view or as a shared activity.',
          pacing: 'Slow and reassuring, with no pressure to decide quickly.',
          feedbackStyle: 'Positive and affirming, confirming the choice in simple terms (e.g., "What a great idea! You decided to help the little squirrel.")'
        },
        prompts: {
          summarize: 'Summarize this in very simple, friendly language that a young child would understand. Focus on the most relatable elements.',
          generateChoice: 'Present this as a gentle, fun choice that feels like playing together. Use simple words and make it feel safe.',
          consequence: 'Describe what happens in a positive, encouraging way using simple language. Celebrate the choice made.'
        }
      },
      
      objective: {
        name: 'The Objective Mentor',
        archetype: 'A calm, thoughtful, and neutral teacher',
        tone: 'Clear, inquisitive, and focused on cause-and-effect',
        targetAudience: 'Educational stories, fables with strong morals, and scenarios focused on decision-making skills for all ages',
        rules: {
          sceneSummarizationStyle: 'Factual and to the point. It lays out the situation and context without emotional language.',
          choicePhrasing: 'Presented as a logical problem with clear, distinct options. It may subtly prompt the user to think about the consequences.',
          pacing: 'Measured and analytical. It gives the reader time to evaluate the options logically.',
          feedbackStyle: 'Neutral and consequence-focused (e.g., "You chose Option A. As a result, your resources were shared, and your ally was able to continue.")'
        },
        prompts: {
          summarize: 'Provide a clear, factual summary of the situation without emotional language. Focus on the key facts and context.',
          generateChoice: 'Present this decision as a logical problem with distinct options. Encourage analytical thinking about consequences.',
          consequence: 'Describe the logical outcome of this choice in neutral terms, focusing on cause and effect.'
        }
      }
    };
    
    // Global content safeguard rules
    this.contentRules = {
      mustAvoid: [
        'profanity',
        'violence beyond age-appropriate levels',
        'inappropriate content',
        'scary or disturbing imagery for young readers',
        'complex romantic themes for younger audiences'
      ],
      mustInclude: [
        'age-appropriate language',
        'positive messaging where appropriate',
        'clear, understandable choices',
        'content suitable for school environments'
      ]
    };
  }

  /**
   * Gets a specific persona
   * @param {string} personaKey - Key of the persona (classic, adventurous, playful, objective)
   * @returns {Object} Persona configuration
   */
  getPersona(personaKey) {
    const persona = this.personas[personaKey] || this.personas.adventurous;
    return {
      ...persona,
      contentRules: this.contentRules
    };
  }

  /**
   * Gets the appropriate persona based on genre and age
   * @param {string} genre - Story genre
   * @param {string} targetAge - Target age range
   * @returns {Object} Recommended persona
   */
  recommendPersona(genre, targetAge) {
    // Parse age range
    const minAge = parseInt(targetAge.split('-')[0]);
    
    // Young children
    if (minAge <= 8) {
      return this.getPersona('playful');
    }
    
    // Genre-based recommendations
    const genreMap = {
      adventure: 'adventurous',
      fantasy: 'adventurous',
      mystery: 'adventurous',
      'science fiction': 'adventurous',
      classic: 'classic',
      historical: 'classic',
      educational: 'objective',
      fable: 'objective'
    };
    
    const genreLower = genre.toLowerCase();
    for (const [key, persona] of Object.entries(genreMap)) {
      if (genreLower.includes(key)) {
        return this.getPersona(persona);
      }
    }
    
    // Default based on age
    if (minAge >= 12) {
      return this.getPersona('classic');
    }
    
    return this.getPersona('adventurous');
  }

  /**
   * Adapts text based on persona and age
   * @param {string} text - Original text
   * @param {Object} persona - Persona to use
   * @param {string} targetAge - Target age range
   * @returns {Object} Adaptation instructions
   */
  getAdaptationInstructions(text, persona, targetAge) {
    const minAge = parseInt(targetAge.split('-')[0]);
    
    return {
      vocabularyLevel: minAge <= 8 ? 'simple' : minAge <= 12 ? 'moderate' : 'advanced',
      sentenceComplexity: minAge <= 8 ? 'simple' : minAge <= 12 ? 'moderate' : 'complex',
      maxSentenceLength: minAge <= 8 ? 15 : minAge <= 12 ? 25 : 50,
      conceptComplexity: minAge <= 8 ? 'concrete' : minAge <= 12 ? 'moderate' : 'abstract',
      emotionalDepth: minAge <= 8 ? 'basic' : minAge <= 12 ? 'moderate' : 'nuanced',
      persona: persona.name,
      tone: persona.tone,
      style: persona.rules.sceneSummarizationStyle
    };
  }

  /**
   * Validates content against age-appropriate rules
   * @param {string} content - Content to validate
   * @param {string} targetAge - Target age range
   * @returns {Object} Validation result
   */
  validateContent(content, targetAge) {
    const issues = [];
    const minAge = parseInt(targetAge.split('-')[0]);
    
    // Check for age-inappropriate content
    const inappropriatePatterns = {
      violence: /\b(kill|murder|blood|gore|violent|death)\b/gi,
      romance: /\b(kiss|love|romance|passionate)\b/gi,
      fear: /\b(terror|horrify|nightmare|scary|frightening)\b/gi
    };
    
    // Apply stricter rules for younger audiences
    if (minAge <= 8) {
      for (const [type, pattern] of Object.entries(inappropriatePatterns)) {
        if (pattern.test(content)) {
          issues.push({
            type,
            severity: 'high',
            message: `Content may be too intense for young readers (${targetAge})`
          });
        }
      }
    }
    
    // Check for complex vocabulary for young readers
    if (minAge <= 8) {
      const complexWords = content.match(/\b\w{10,}\b/g) || [];
      if (complexWords.length > 5) {
        issues.push({
          type: 'vocabulary',
          severity: 'medium',
          message: 'Vocabulary may be too complex for target age'
        });
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Gets all available personas
   * @returns {Array} List of persona keys and names
   */
  getAllPersonas() {
    return Object.entries(this.personas).map(([key, persona]) => ({
      key,
      name: persona.name,
      archetype: persona.archetype,
      targetAudience: persona.targetAudience
    }));
  }
}