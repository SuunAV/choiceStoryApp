import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { StoryWeaverAgent } from './agents/StoryWeaverAgent.js';
import logger from './utils/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize Story Weaver Agent
const storyWeaver = new StoryWeaverAgent({
  model: 'claude-3-5-sonnet',
  maxTokensPerChunk: 3000,
  minDecisionPoints: 3,
  maxDecisionPoints: 12
});

// Store active processes (in production, use Redis or database)
const activeProcesses = new Map();

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'story-weaver-backend'
  });
});

/**
 * Get Story Weaver status
 */
app.get('/api/weaver/status', (req, res) => {
  const state = storyWeaver.getState();
  res.json({
    ...state,
    activeProcesses: Array.from(activeProcesses.keys())
  });
});

/**
 * Process book text into interactive story
 */
app.post('/api/weaver/process', async (req, res) => {
  try {
    const { bookContent, title, author, targetAge, persona = 'adventurous' } = req.body;
    
    // Validation
    if (!bookContent || !title || !targetAge) {
      return res.status(400).json({
        error: 'Missing required fields: bookContent, title, targetAge'
      });
    }
    
    if (!['6-8', '8-10', '10-12', '12-14'].includes(targetAge)) {
      return res.status(400).json({
        error: 'Invalid targetAge. Must be one of: 6-8, 8-10, 10-12, 12-14'
      });
    }
    
    logger.info('Starting Story Weaver process', {
      title,
      wordCount: bookContent.split(' ').length,
      targetAge,
      persona
    });
    
    // Set up progress tracking
    const processId = `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    activeProcesses.set(processId, { status: 'starting', progress: 0 });
    
    // Set up event listeners for progress updates
    storyWeaver.on('step:start', (data) => {
      const process = activeProcesses.get(processId);
      if (process) {
        process.status = 'processing';
        process.currentStep = data.step;
        process.stepName = data.name;
        process.progress = (data.step / 7) * 100;
      }
    });
    
    storyWeaver.on('step:complete', (data) => {
      const process = activeProcesses.get(processId);
      if (process) {
        process.progress = (data.step / 7) * 100;
        if (data.result) {
          process.stepResult = data.result;
        }
      }
    });
    
    // Start processing (don't await here, send immediate response)
    storyWeaver.process({
      bookContent,
      title,
      author,
      targetAge,
      persona
    }).then(result => {
      activeProcesses.set(processId, {
        status: 'completed',
        progress: 100,
        result
      });
      
      // Clean up after 1 hour
      setTimeout(() => {
        activeProcesses.delete(processId);
      }, 60 * 60 * 1000);
      
    }).catch(error => {
      logger.error('Story Weaver process failed', {
        processId,
        error: error.message
      });
      
      activeProcesses.set(processId, {
        status: 'failed',
        progress: 0,
        error: error.message
      });
    });
    
    // Return process ID for tracking
    res.json({
      processId,
      status: 'started',
      message: 'Story processing has begun. Use the processId to check progress.'
    });
    
  } catch (error) {
    logger.error('Failed to start Story Weaver process', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      error: 'Failed to start processing',
      details: error.message
    });
  }
});

/**
 * Check processing status
 */
app.get('/api/weaver/process/:processId', (req, res) => {
  const { processId } = req.params;
  const process = activeProcesses.get(processId);
  
  if (!process) {
    return res.status(404).json({
      error: 'Process not found',
      processId
    });
  }
  
  res.json({
    processId,
    ...process
  });
});

/**
 * Cancel processing
 */
app.delete('/api/weaver/process/:processId', (req, res) => {
  const { processId } = req.params;
  const process = activeProcesses.get(processId);
  
  if (!process) {
    return res.status(404).json({
      error: 'Process not found',
      processId
    });
  }
  
  if (process.status === 'processing') {
    storyWeaver.cancel();
    activeProcesses.set(processId, {
      ...process,
      status: 'cancelled'
    });
  }
  
  res.json({
    processId,
    status: 'cancelled'
  });
});

/**
 * File upload endpoint
 */
app.post('/api/weaver/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }
    
    const { title, author, targetAge, persona = 'adventurous' } = req.body;
    
    // Read file content
    const bookContent = req.file.buffer.toString('utf-8');
    
    // Validate file size and content
    if (bookContent.length < 100) {
      return res.status(400).json({
        error: 'File content is too short. Must be at least 100 characters.'
      });
    }
    
    const wordCount = bookContent.split(' ').filter(w => w.length > 0).length;
    if (wordCount < 500 || wordCount > 90000) {
      return res.status(400).json({
        error: 'Book must be between 500 and 90,000 words'
      });
    }
    
    // Process the uploaded content
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/weaver/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookContent,
        title: title || req.file.originalname.replace(/\.[^/.]+$/, ""),
        author,
        targetAge,
        persona
      })
    });
    
    const result = await response.json();
    res.json(result);
    
  } catch (error) {
    logger.error('File upload failed', {
      error: error.message
    });
    
    res.status(500).json({
      error: 'File upload failed',
      details: error.message
    });
  }
});

/**
 * Get available personas
 */
app.get('/api/weaver/personas', async (req, res) => {
  try {
    const { PersonaManager } = await import('./services/PersonaManager.js');
    const personaManager = new PersonaManager();
    
    res.json({
      personas: personaManager.getAllPersonas()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load personas',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Story Weaver backend started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

export default app;