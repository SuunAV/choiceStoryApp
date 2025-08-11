import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
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
      ...config
    };
    
    // Initialize services
    this.textParser = new TextParser(this.config);
    this.decisionPointDetector = new DecisionPointDetector(this.config);
    this.sceneSummarizer = new SceneSummarizer(this.config);
    this.choiceGenerator = new ChoiceGenerator(this.config);
    this.consequenceMapper = new ConsequenceMapper(this.config);
    this.pathConvergence = new PathConvergence(this.config);
    this.personaManager = new PersonaManager(this.config);
    
    this.state = 'idle';
    this.currentProject = null;
  }

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
        startTime: Date.now()
      };
      
      logger.info(`Starting Story Weaver process for: ${title}`, {
        projectId: this.currentProject.id,
        wordCount: bookContent.split(' ').length
      });
      
      // Step 1: Input validation and preprocessing
      this.emit('step:start', { step: 1, name: 'Input Processing' });
      const validatedInput = await this.validateInput(input);
      this.emit('step:complete', { step: 1 });
      
      // Step 2: Text Parsing
      this.emit('step:start', { step: 2, name: 'Text Parsing' });
      const parsedChunks = await this.textParser.parse(bookContent);
      this.emit('step:complete', { step: 2, result: { chunkCount: parsedChunks.length } });
      
      // Step 3: Decision Point Identification
      this.emit('step:start', { step: 3, name: 'Decision Point Identification' });
      const decisionPoints = await this.decisionPointDetector.detect(parsedChunks);
      this.emit('step:complete', { step: 3, result: { decisionPointCount: decisionPoints.length } });
      
      // Step 4: Scene Summarization
      this.emit('step:start', { step: 4, name: 'Scene Summarization' });
      const summarizedScenes = await this.sceneSummarizer.summarize(
        parsedChunks,
        decisionPoints,
        this.personaManager.getPersona(persona),
        targetAge
      );
      this.emit('step:complete', { step: 4 });
      
      // Step 5: Choice Generation
      this.emit('step:start', { step: 5, name: 'Choice Generation' });
      const choices = await this.choiceGenerator.generate(
        summarizedScenes,
        decisionPoints,
        this.personaManager.getPersona(persona),
        targetAge
      );
      this.emit('step:complete', { step: 5, result: { totalChoices: choices.length } });
      
      // Step 6: Consequence Mapping
      this.emit('step:start', { step: 6, name: 'Consequence Mapping' });
      const consequences = await this.consequenceMapper.map(
        choices,
        summarizedScenes,
        this.personaManager.getPersona(persona)
      );
      this.emit('step:complete', { step: 6 });
      
      // Step 7: Path Convergence
      this.emit('step:start', { step: 7, name: 'Path Convergence' });
      const storyStructure = await this.pathConvergence.converge(
        summarizedScenes,
        choices,
        consequences,
        parsedChunks
      );
      this.emit('step:complete', { step: 7 });
      
      // Final result compilation
      const result = {
        id: this.currentProject.id,
        metadata: {
          title,
          author,
          targetAge,
          persona,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - this.currentProject.startTime,
          stats: {
            wordCount: bookContent.split(' ').length,
            chunkCount: parsedChunks.length,
            decisionPointCount: decisionPoints.length,
            totalChoices: choices.length
          }
        },
        structure: storyStructure
      };
      
      this.state = 'completed';
      this.emit('process:complete', result);
      
      logger.info(`Story Weaver process completed for: ${title}`, {
        projectId: this.currentProject.id,
        processingTime: result.metadata.processingTime
      });
      
      return result;
      
    } catch (error) {
      this.state = 'error';
      logger.error('Story Weaver process failed', {
        projectId: this.currentProject?.id,
        error: error.message,
        stack: error.stack
      });
      
      this.emit('process:error', {
        error: error.message,
        step: this.state,
        projectId: this.currentProject?.id
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