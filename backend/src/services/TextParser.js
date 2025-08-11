import logger from '../utils/logger.js';

/**
 * TextParser - Handles text chunking and preprocessing
 * Divides book content into manageable blocks for AI processing
 */
export class TextParser {
  constructor(config = {}) {
    this.config = {
      maxChunkSize: config.maxChunkSize || 3000, // characters
      minChunkSize: config.minChunkSize || 500,
      overlapSize: config.overlapSize || 200,
      preserveSentences: config.preserveSentences !== false,
      ...config
    };
  }

  /**
   * Parses book content into chunks
   * @param {string} bookContent - Full book text
   * @returns {Promise<Array>} Array of text chunks with metadata
   */
  async parse(bookContent) {
    logger.debug('Starting text parsing', {
      contentLength: bookContent.length,
      config: this.config
    });

    try {
      // Clean and normalize text
      const cleanedContent = this.cleanText(bookContent);
      
      // Detect chapters/sections
      const sections = this.detectSections(cleanedContent);
      
      // Create chunks based on sections
      const chunks = [];
      let globalIndex = 0;
      
      for (const section of sections) {
        const sectionChunks = this.chunkText(section.content, section.title);
        
        sectionChunks.forEach((chunk, index) => {
          chunks.push({
            id: `chunk_${globalIndex}`,
            index: globalIndex,
            sectionIndex: section.index,
            sectionTitle: section.title,
            content: chunk.content,
            startChar: chunk.startChar,
            endChar: chunk.endChar,
            wordCount: chunk.content.split(' ').filter(w => w.length > 0).length,
            sentences: this.extractSentences(chunk.content),
            metadata: {
              hasDialog: this.detectDialog(chunk.content),
              paragraphCount: chunk.content.split('\n\n').length,
              isChapterStart: index === 0 && section.isChapter,
              isChapterEnd: index === sectionChunks.length - 1 && section.isChapter
            }
          });
          globalIndex++;
        });
      }
      
      logger.info('Text parsing completed', {
        totalChunks: chunks.length,
        totalSections: sections.length
      });
      
      return chunks;
      
    } catch (error) {
      logger.error('Text parsing failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Cleans and normalizes text
   * @private
   */
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/ {2,}/g, ' ') // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to 2
      .trim();
  }

  /**
   * Detects chapters and major sections
   * @private
   */
  detectSections(text) {
    const sections = [];
    
    // Common chapter patterns
    const chapterPatterns = [
      /^Chapter\s+\d+/im,
      /^Chapter\s+[IVXLCDM]+/im,
      /^Part\s+\d+/im,
      /^\d+\.\s+[A-Z]/m,
      /^[A-Z][A-Z\s]{2,}$/m // All caps titles
    ];
    
    // Split by double newlines first
    const paragraphs = text.split('\n\n');
    let currentSection = { title: 'Beginning', content: '', index: 0, isChapter: false };
    let sectionIndex = 0;
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      
      // Check if this is a chapter/section header
      let isNewSection = false;
      for (const pattern of chapterPatterns) {
        if (pattern.test(trimmed) && trimmed.length < 100) {
          isNewSection = true;
          break;
        }
      }
      
      if (isNewSection) {
        // Save current section if it has content
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: trimmed,
          content: '',
          index: ++sectionIndex,
          isChapter: true
        };
      } else {
        // Add to current section
        currentSection.content += (currentSection.content ? '\n\n' : '') + trimmed;
      }
    }
    
    // Don't forget the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }
    
    // If no sections detected, treat entire text as one section
    if (sections.length === 0) {
      sections.push({
        title: 'Full Text',
        content: text,
        index: 0,
        isChapter: false
      });
    }
    
    return sections;
  }

  /**
   * Chunks text while preserving sentence boundaries
   * @private
   */
  chunkText(text, sectionTitle = '') {
    const chunks = [];
    const sentences = this.extractSentences(text);
    
    let currentChunk = {
      content: '',
      startChar: 0,
      endChar: 0
    };
    
    let charCount = 0;
    
    for (const sentence of sentences) {
      const sentenceLength = sentence.length;
      
      // Check if adding this sentence would exceed max chunk size
      if (currentChunk.content && 
          (currentChunk.content.length + sentenceLength > this.config.maxChunkSize)) {
        // Save current chunk
        currentChunk.endChar = charCount - 1;
        chunks.push({ ...currentChunk });
        
        // Start new chunk with overlap
        const overlap = this.getOverlapText(currentChunk.content);
        currentChunk = {
          content: overlap + sentence,
          startChar: charCount - overlap.length,
          endChar: 0
        };
      } else {
        // Add sentence to current chunk
        currentChunk.content += (currentChunk.content ? ' ' : '') + sentence;
      }
      
      charCount += sentenceLength + 1; // +1 for space
    }
    
    // Don't forget the last chunk
    if (currentChunk.content.trim()) {
      currentChunk.endChar = charCount - 1;
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  /**
   * Extracts sentences from text
   * @private
   */
  extractSentences(text) {
    // Improved sentence splitting that handles common edge cases
    const sentenceEnders = /([.!?]+)\s+(?=[A-Z])/g;
    const rawSentences = text.split(sentenceEnders);
    
    const sentences = [];
    for (let i = 0; i < rawSentences.length; i += 2) {
      const sentence = rawSentences[i] + (rawSentences[i + 1] || '');
      if (sentence.trim()) {
        sentences.push(sentence.trim());
      }
    }
    
    // If no sentences detected, treat entire text as one sentence
    if (sentences.length === 0 && text.trim()) {
      sentences.push(text.trim());
    }
    
    return sentences;
  }

  /**
   * Gets overlap text for chunk continuity
   * @private
   */
  getOverlapText(chunkContent) {
    const sentences = this.extractSentences(chunkContent);
    if (sentences.length === 0) return '';
    
    // Take last 1-2 sentences for overlap
    const lastSentences = sentences.slice(-2);
    const overlap = lastSentences.join(' ');
    
    // Limit overlap size
    if (overlap.length > this.config.overlapSize) {
      return overlap.substring(overlap.length - this.config.overlapSize);
    }
    
    return overlap;
  }

  /**
   * Detects if text contains dialog
   * @private
   */
  detectDialog(text) {
    // Check for common dialog patterns
    const dialogPatterns = [
      /"[^"]+"/,
      /'[^']+'/,
      /said\s+[A-Z]\w+/,
      /asked\s+[A-Z]\w+/,
      /replied\s+[A-Z]\w+/
    ];
    
    return dialogPatterns.some(pattern => pattern.test(text));
  }
}