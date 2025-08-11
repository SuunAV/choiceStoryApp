import { EventEmitter } from 'events';
import { StoryWeaverPersona } from '../../ai-agents/story-weaver/StoryWeaverPersona.js';
import { EnhancedDecisionPointDetector } from '../../ai-agents/story-weaver/tools/decision-point-detector/EnhancedDecisionPointDetector.js';
import { EnhancedChoiceGenerator } from '../../ai-agents/story-weaver/tools/choice-generator/EnhancedChoiceGenerator.js';
import { EnhancedConsequenceMapper } from '../../ai-agents/story-weaver/tools/consequence-mapper/EnhancedConsequenceMapper.js';import { v4 as uuidv4 } from 'uuid';
import { TextParser } from '../services/TextParser.js';
import { DecisionPointDetector } from '../services/DecisionPointDetector.js';
import { SceneSummarizer } from '../services/SceneSummarizer.js';
import { ChoiceGenerator } from '../services/ChoiceGenerator.js';
import { ConsequenceMapper } from '../services/ConsequenceMapper.js';
import { PathConvergence } from '../services/PathConvergence.js';
import { PersonaManager } from '../services/PersonaManager.js';
import logger from '../utils/logger.js';

/**
 * Story Weaver Agent - Core AI agent for transforming books into interactive narratives
 * Implements the 7-step process as defined in the PRD
 */
export class StoryWeaverAgent extends EventEmitter {
  constructor(config = {}) {
    super();
    this.id = uuidv4();
    
    this.config = {
      model: config.model || 'claude-3-5-sonnet',
      maxTokensPerChunk: config.maxTokensPerChunk || 2000,
      minDecisionPoints: config.minDecisionPoints || 3,
      maxDecisionPoints: config.maxDecisionPoints || 15,
      personaMode: config.personaMode || 'adventurous',
      useEnhancedTools: config.useEnhancedTools !== false, // Default to true
      ...config
    };
    
    // Initialize the Story Weaver Persona
    this.storyWeaverPersona = new StoryWeaverPersona({
      defaultMode: this.config.personaMode,
      ...config
    });
    
    // Initialize enhanced AI tools
    if (this.config.useEnhancedTools) {
      this.enhancedDecisionPointDetector = new EnhancedDecisionPointDetector({
        contextWindow: 3,
        minimumConfidence: 0.3,
        maxDecisionPoints: this.config.maxDecisionPoints,
        minDecisionPoints: this.config.minDecisionPoints
      });
      
      this.enhancedChoiceGenerator = new EnhancedChoiceGenerator({
        maxChoicesPerPoint: 4,
        defaultChoiceCount: 2,
        personalityVariation: true,
        ageAdaptation: true
      });
      
      this.enhancedConsequenceMapper = new EnhancedConsequenceMapper({
        maxDivergenceDepth: 3,
        convergencePreference: 'gradual',
        canonPreservation: 'strict'
      });
      
      logger.info('Enhanced AI tools initialized for Story Weaver');
    }
    
    // Initialize legacy services (kept for compatibility)
    this.textParser = new TextParser(this.config);
    this.decisionPointDetector = new DecisionPointDetector(this.config);
    this.sceneSummarizer = new SceneSummarizer(this.config);
    this.choiceGenerator = new ChoiceGenerator(this.config);
    this.consequenceMapper = new ConsequenceMapper(this.config);
    this.pathConvergence = new PathConvergence(this.config);
    this.personaManager = new PersonaManager(this.config);
    
    // Initialize AI provider client for LLM operations
    this.aiClient = new AIProviderClient({
      cacheResponses: true,
      useEnvironmentVars: true
    });
    
    // Connect persona events for enhanced processing
    this.setupPersonaEventHandlers();
    
    this.state = 'idle';
    this.currentProject = null;
  }
  /**
   * Loads the Story Weaver persona configuration
   * @private
   * @returns {Object} Persona configuration
   */
  loadPersonaConfig() {
    try {
      const fs = require('fs');
      const path = require('path');
      const configPath = path.join(process.cwd(), 'ai-agents/story-weaver/config/persona.json');
      
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
      } else {
        logger.warn('Story Weaver persona config not found, using default configuration');
        return this.getDefaultPersonaConfig();
      }
    } catch (error) {
      logger.error('Failed to load Story Weaver persona config:', error);
      return this.getDefaultPersonaConfig();
    }
  }

  /**
   * Returns default persona configuration if file is not available
   * @private
   * @returns {Object} Default persona configuration
   */
  getDefaultPersonaConfig() {
    return {
      name: "Story Weaver",
      version: "2.1.0",
      archetype: "Master Storyteller & Interactive Narrative Architect",
      core_identity: {
        personality: "Wise, creative, and deeply empathetic",
        expertise: ["Interactive narrative design", "Choice architecture", "Age-appropriate content adaptation"],
        communication_style: "Warm, engaging, and thoughtful"
      }
    };
  }

  /**
   * Gets persona-specific processing instructions
   * @param {string} mode - Persona mode (classic, adventurous, playful, objective)
   * @param {string} step - Processing step requiring persona guidance
   * @returns {Object} Persona-specific instructions
   */
  getPersonaInstructions(mode, step) {
    const persona = this.personaManager.getPersona(mode);
    const instructions = {
      systemContext: `You are the ${this.personaConfig.name}, ${this.personaConfig.archetype}. ${this.personaConfig.core_identity.personality}.`,
      processingMode: persona.rules,
      targetAudience: persona.targetAudience,
      communicationStyle: this.personaConfig.core_identity.communication_style
    };

    // Add step-specific guidance
    switch(step) {
      case 'summarization':
        instructions.specificGuidance = persona.prompts.summarize;
        break;
      case 'choice_generation':
        instructions.specificGuidance = persona.prompts.generateChoice;
        break;
      case 'consequence_mapping':
        instructions.specificGuidance = persona.prompts.consequence;
        break;
      default:
        instructions.specificGuidance = persona.rules.sceneSummarizationStyle;
    }

    return instructions;
  }

  /**
   * Gets comprehensive tool statistics for reporting
   * @returns {Object} Statistics from all enhanced tools
   */
  getToolStatistics() {
    const stats = {
      persona: this.storyWeaverPersona.getStatus(),
      enhanced_tools_enabled: this.config.useEnhancedTools
    };

    if (this.config.useEnhancedTools) {
      stats.enhanced_decision_detector = this.enhancedDecisionPointDetector.getStatistics();
      stats.enhanced_choice_generator = this.enhancedChoiceGenerator.getStatistics();
      stats.enhanced_consequence_mapper = this.enhancedConsequenceMapper.getStatistics();
    }

    return stats;
  }

  /**
   * Switches between enhanced and legacy processing modes
   * @param {boolean} useEnhanced - Whether to use enhanced tools
   */
  setEnhancedMode(useEnhanced) {
    this.config.useEnhancedTools = useEnhanced;
    logger.info(`Story Weaver switched to ${useEnhanced ? 'enhanced' : 'legacy'} processing mode`);
  }

  /**
   * Gets processing capabilities and tool information
   * @returns {Object} Current capabilities
   */
  getCapabilities() {
    return {
      version: '2.1.0',
      processing_mode: this.config.useEnhancedTools ? 'enhanced' : 'legacy',
      persona_system: {
        active: true,
        current_mode: this.storyWeaverPersona.getStatus().current_mode,
        available_modes: ['classic', 'adventurous', 'playful', 'objective']
      },
      enhanced_tools: {
        available: this.config.useEnhancedTools,
        decision_point_detector: {
          categories: this.config.useEnhancedTools ? this.enhancedDecisionPointDetector.getStatistics().categories : 'legacy',
          pattern_count: this.config.useEnhancedTools ? this.enhancedDecisionPointDetector.getStatistics().totalPatterns : 'legacy'
        },
        choice_generator: {
          rulebook_version: this.config.useEnhancedTools ? '2.1.0' : 'legacy',
          age_adaptation: true,
          personality_variation: this.config.useEnhancedTools
        },
        consequence_mapper: {
          convergence_strategies: this.config.useEnhancedTools ? 'advanced' : 'basic',
          narrative_coherence: true,
          canon_preservation: this.config.useEnhancedTools ? 'strict' : 'standard'
        }
      },
      supported_features: [
        'Multi-persona processing',
        'Age-appropriate adaptation',
        'Educational value integration',
        'Narrative convergence strategies',
        'Quality assessment and validation',
        'Comprehensive choice generation',
        'Advanced decision point detection',
        'Story structure preservation'
      ]
    };
  }

  /**
   * Validates processing configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation results
   */
  validateProcessingConfig(config) {
    const validation = {
      valid: true,
      warnings: [],
      errors: []
    };

    // Validate age range
    if (config.targetAge && !['6-8', '8-10', '10-12', '12-14'].includes(config.targetAge)) {
      validation.warnings.push('Non-standard age range provided');
    }

    // Validate persona mode
    const validPersonas = ['classic', 'adventurous', 'playful', 'objective'];
    if (config.persona && !validPersonas.includes(config.persona)) {
      validation.errors.push(`Invalid persona mode: ${config.persona}. Must be one of: ${validPersonas.join(', ')}`);
      validation.valid = false;
    }

    // Validate enhanced tools configuration
    if (config.useEnhancedTools && !this.enhancedDecisionPointDetector) {
      validation.warnings.push('Enhanced tools requested but not properly initialized');
    }

    // Validate decision point limits
    if (config.maxDecisionPoints && config.maxDecisionPoints < config.minDecisionPoints) {
      validation.errors.push('maxDecisionPoints cannot be less than minDecisionPoints');
      validation.valid = false;
    }

    return validation;
  }

  /**
   * Sets up event handlers for persona-driven processing
   * @private
   */
  setupPersonaEventHandlers() {
    this.storyWeaverPersona.on('mode:activated', (data) => {
      logger.info(`Story Weaver persona mode activated: ${data.mode}`);
      this.emit('persona:mode_changed', data);
    });

    this.storyWeaverPersona.on('quality:assessed', (data) => {
      this.emit('quality:assessment', data);
    });

    this.storyWeaverPersona.on('learning:patterns_updated', (patterns) => {
      logger.info('Story Weaver learned new patterns', { count: patterns.length });
    });
  }

  /**
   * Enhanced process method with integrated Story Weaver persona
   * @param {Object} input - Input object containing bookContent, metadata, etc.
   * @returns {Promise<Object>} - Processed story structure with persona enhancements
   */

  /**
   * Main process method - executes the 7-step Story Weaver process
   * @param {Object} input - Input object containing bookContent, metadata, etc.
   * @returns {Promise<Object>} - Processed story structure
   */
  async process(input) {
    const { bookContent, title, author, targetAge, persona = 'adventurous' } = input;
    
    try {
      this.state = 'processing';
      this.currentProject = {
        id: uuidv4(),
        title,
        author,
        targetAge,
        persona,
        startTime: Date.now(),
        useEnhancedTools: this.config.useEnhancedTools
      };
      
      // Activate the Story Weaver persona mode
      this.storyWeaverPersona.activateMode(persona, {
        targetAge,
        title,
        projectId: this.currentProject.id
      });
      
      logger.info(`Starting ${this.config.useEnhancedTools ? 'enhanced' : 'legacy'} Story Weaver process for: ${title}`, {
        projectId: this.currentProject.id,
        wordCount: bookContent.split(' ').length,
        personaMode: persona,
        enhancedMode: this.config.useEnhancedTools
      });
      
      // Step 1: Input validation and preprocessing with persona guidance
      this.emit('step:start', { step: 1, name: 'Input Processing & Validation' });
      const validatedInput = await this.validateInput(input);
      this.emit('step:complete', { step: 1 });
      
      // Step 2: Enhanced Text Parsing with persona-aware chunking
      this.emit('step:start', { step: 2, name: 'Intelligent Text Parsing' });
      const personaInstructions = this.storyWeaverPersona.generateProcessingInstructions('text_parsing', {
        targetAge,
        content: bookContent
      });
      const parsedChunks = await this.textParser.parse(bookContent, personaInstructions);
      this.emit('step:complete', { step: 2, result: { chunkCount: parsedChunks.length } });
      
      // Step 3: Enhanced Decision Point Identification
      this.emit('step:start', { step: 3, name: 'Advanced Decision Point Detection' });
      let decisionPoints;
      
      if (this.config.useEnhancedTools) {
        const decisionInstructions = this.storyWeaverPersona.generateProcessingInstructions('decision_point_detection', {
          targetAge,
          genre: input.genre,
          personaMode: persona
        });
        decisionPoints = await this.enhancedDecisionPointDetector.detect(parsedChunks, decisionInstructions);
      } else {
        // Legacy processing
        decisionPoints = await this.decisionPointDetector.detect(parsedChunks);
      }
      
      this.emit('step:complete', { step: 3, result: { 
        decisionPointCount: decisionPoints.length,
        enhancedDetection: this.config.useEnhancedTools
      }});
      
      // Step 4: Enhanced Scene Summarization with persona voice
      this.emit('step:start', { step: 4, name: 'Persona-Driven Scene Summarization' });
      const summaryInstructions = this.storyWeaverPersona.generateProcessingInstructions('summarization', {
        targetAge,
        personaMode: persona,
        originalStyle: input.style
      });
      const summarizedScenes = await this.sceneSummarizer.summarize(
        parsedChunks,
        decisionPoints,
        this.personaManager.getPersona(persona),
        targetAge,
        summaryInstructions
      );
      this.emit('step:complete', { step: 4 });
      
      // Step 5: Enhanced Choice Generation with comprehensive rulebook
      this.emit('step:start', { step: 5, name: 'Advanced Choice Generation' });
      let choices;
      
      if (this.config.useEnhancedTools) {
        const choiceInstructions = this.storyWeaverPersona.generateProcessingInstructions('choice_generation', {
          targetAge,
          personaMode: persona,
          educationalGoals: input.educationalGoals
        });
        choices = await this.enhancedChoiceGenerator.generate(
          summarizedScenes,
          decisionPoints,
          this.personaManager.getPersona(persona),
          targetAge,
          choiceInstructions
        );
      } else {
        // Legacy processing
        choices = await this.choiceGenerator.generate(
          summarizedScenes,
          decisionPoints,
          this.personaManager.getPersona(persona),
          targetAge
        );
      }
      
      this.emit('step:complete', { step: 5, result: { 
        totalChoices: Array.isArray(choices) ? choices.length : choices.reduce((sum, dp) => sum + dp.choices.length, 0),
        enhancedGeneration: this.config.useEnhancedTools
      }});
      
      // Step 6: Enhanced Consequence Mapping with sophisticated convergence
      this.emit('step:start', { step: 6, name: 'Intelligent Consequence Mapping' });
      let consequences;
      
      if (this.config.useEnhancedTools) {
        const consequenceInstructions = this.storyWeaverPersona.generateProcessingInstructions('consequence_mapping', {
          targetAge,
          personaMode: persona,
          moralComplexity: input.moralComplexity
        });
        consequences = await this.enhancedConsequenceMapper.map(
          choices,
          summarizedScenes,
          this.personaManager.getPersona(persona),
          consequenceInstructions
        );
      } else {
        // Legacy processing
        consequences = await this.consequenceMapper.map(
          choices,
          summarizedScenes,
          this.personaManager.getPersona(persona)
        );
      }
      
      this.emit('step:complete', { step: 6 });
      
      // Step 7: Advanced Path Convergence with narrative coherence
      this.emit('step:start', { step: 7, name: 'Narrative Path Convergence' });
      const convergenceInstructions = this.storyWeaverPersona.generateProcessingInstructions('narrative_coherence', {
        targetAge,
        personaMode: persona,
        storyThemes: input.themes
      });
      
      let storyStructure;
      if (this.config.useEnhancedTools) {
        // Enhanced convergence is built into the consequence mapper
        storyStructure = await this.pathConvergence.converge(
          summarizedScenes,
          choices,
          consequences,
          parsedChunks,
          convergenceInstructions
        );
        
        // Enhance with convergence data from consequence mapper
        if (consequences.convergence_timeline) {
          storyStructure.convergence_analysis = {
            timeline: consequences.convergence_timeline,
            branch_analysis: consequences.branch_analysis,
            validation_summary: consequences.validation_summary
          };
        }
      } else {
        // Legacy processing
        storyStructure = await this.pathConvergence.converge(
          summarizedScenes,
          choices,
          consequences,
          parsedChunks,
          convergenceInstructions
        );
      }
      
      this.emit('step:complete', { step: 7 });
      
      // Enhanced quality assessment of the final result
      const qualityAssessment = this.storyWeaverPersona.assessQuality('complete_story', storyStructure, {
        targetAge,
        originalContent: bookContent,
        personaMode: persona,
        enhancedProcessing: this.config.useEnhancedTools
      });
      
      // Get tool statistics for reporting
      const toolStatistics = this.getToolStatistics();
      
      // Final result compilation with comprehensive enhancements
      const result = {
        id: this.currentProject.id,
        metadata: {
          title,
          author,
          targetAge,
          persona,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - this.currentProject.startTime,
          personaVersion: this.storyWeaverPersona.getStatus().version,
          qualityScore: qualityAssessment.overall_score,
          enhancedProcessing: this.config.useEnhancedTools,
          stats: {
            wordCount: bookContent.split(' ').length,
            chunkCount: parsedChunks.length,
            decisionPointCount: decisionPoints.length,
            totalChoices: Array.isArray(choices) ? choices.length : choices.reduce((sum, dp) => sum + dp.choices.length, 0),
            qualityMetrics: qualityAssessment.detailed_scores,
            toolStatistics
          }
        },
        structure: storyStructure,
        personaEnhancements: {
          modeConfiguration: this.storyWeaverPersona.getCurrentModeConfiguration(),
          qualityAssessment,
          processingInstructions: {
            summary: `Story processed with ${this.config.useEnhancedTools ? 'enhanced' : 'legacy'} Story Weaver AI intelligence`,
            keyFeatures: [
              'Advanced decision point detection with 100+ categories',
              'Comprehensive choice generation with rulebook compliance',
              'Sophisticated consequence mapping with convergence strategies',
              'Age-appropriate content adaptation with persona intelligence',
              'Educational value integration with narrative preservation'
            ],
            toolsUsed: this.config.useEnhancedTools ? [
              'EnhancedDecisionPointDetector',
              'EnhancedChoiceGenerator', 
              'EnhancedConsequenceMapper',
              'StoryWeaverPersona'
            ] : [
              'DecisionPointDetector',
              'ChoiceGenerator',
              'ConsequenceMapper',
              'PersonaManager'
            ]
          }
        }
      };
      
      this.state = 'completed';
      this.emit('process:complete', result);
      
      // Update persona learning based on successful completion
      this.storyWeaverPersona.learn({
        successfulPatterns: [
          { type: 'story_completion', persona, targetAge, processingTime: result.metadata.processingTime, enhanced: this.config.useEnhancedTools }
        ],
        qualityFeedback: [
          { metric: 'overall_quality', successful: qualityAssessment.overall_score > 0.8 }
        ]
      });
      
      logger.info(`${this.config.useEnhancedTools ? 'Enhanced' : 'Legacy'} Story Weaver process completed for: ${title}`, {
        projectId: this.currentProject.id,
        processingTime: result.metadata.processingTime,
        qualityScore: qualityAssessment.overall_score,
        personaMode: persona,
        enhancedMode: this.config.useEnhancedTools,
        decisionPoints: decisionPoints.length,
        totalChoices: result.metadata.stats.totalChoices
      });
      
      return result;
      
    } catch (error) {
      this.state = 'error';
      logger.error(`${this.config.useEnhancedTools ? 'Enhanced' : 'Legacy'} Story Weaver process failed`, {
        projectId: this.currentProject?.id,
        error: error.message,
        stack: error.stack,
        personaMode: persona,
        enhancedMode: this.config.useEnhancedTools
      });
      
      this.emit('process:error', {
        error: error.message,
        step: this.state,
        projectId: this.currentProject?.id,
        personaMode: persona,
        enhancedMode: this.config.useEnhancedTools
      });
      
      throw error;
    }
  }

  /**
   * Validates input data
   * @private
   */
  async validateInput(input) {
    const { bookContent, title, targetAge } = input;
    
    if (!bookContent || bookContent.length < 100) {
      throw new Error('Book content must be at least 100 characters long');
    }
    
    if (!title || title.length < 1) {
      throw new Error('Title is required');
    }
    
    if (!targetAge || !['6-8', '8-10', '10-12', '12-14'].includes(targetAge)) {
      throw new Error('Valid target age range is required');
    }
    
    // Word count validation
    const wordCount = bookContent.split(' ').filter(w => w.length > 0).length;
    if (wordCount < 500 || wordCount > 90000) {
      throw new Error('Book must be between 500 and 90,000 words');
    }
    
    return input;
  }

  /**
   * Gets the current processing state
   */
  getState() {
    return {
      state: this.state,
      currentProject: this.currentProject
    };
  }

  /**
   * Cancels the current processing
   */
  cancel() {
    if (this.state === 'processing') {
      this.state = 'cancelled';
      this.emit('process:cancelled', {
        projectId: this.currentProject?.id
      });
    }
  }
}

/**
 * Initialize AI provider client for external AI services
 * @private
 */
import { AIProviderClient } from '../../ai-agents/story-weaver/utilities/AIProviderClient.js';
