# Story Weaver Agent - Implementation Guide

## Overview

The Story Weaver Agent is a sophisticated AI-powered system that transforms linear books into interactive, choice-based narratives. It implements a 7-step process to analyze text content and create engaging decision points while ensuring all narrative paths converge to the original story's conclusion.

## Architecture

### Backend Components

1. **StoryWeaverAgent** - Main orchestrator class that manages the 7-step process
2. **TextParser** - Handles text chunking and preprocessing 
3. **DecisionPointDetector** - Identifies key decision moments using pattern matching
4. **SceneSummarizer** - Creates age-appropriate scene summaries
5. **ChoiceGenerator** - Generates meaningful choices at decision points
6. **ConsequenceMapper** - Maps choices to their immediate consequences
7. **PathConvergence** - Ensures all paths converge to original ending
8. **PersonaManager** - Manages AI personas for different narrative styles

### 7-Step Process

1. **Input Processing** - Validates and preprocesses book content
2. **Text Parsing** - Divides content into manageable chunks
3. **Decision Point Identification** - Finds natural choice opportunities
4. **Scene Summarization** - Creates persona-appropriate summaries
5. **Choice Generation** - Develops meaningful decision options
6. **Consequence Mapping** - Links choices to immediate outcomes
7. **Path Convergence** - Structures story to converge to original ending

## Usage

### Starting the Application

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend API server on http://localhost:3001
   - Frontend React app on http://localhost:5173

### Using the Story Weaver

1. **Upload Book Content:**
   - Navigate to the application in your browser
   - Click "Upload Book" or paste text directly
   - Supported formats: .txt, .md, .pdf
   - Content must be 500-90,000 words

2. **Configure Settings:**
   - Enter book title and author
   - Select target age range (6-8, 8-10, 10-12, 12-14)
   - Choose AI persona (optional - defaults to "Adventurous Guide")

3. **Process Story:**
   - Click "Analyze with AI"
   - Monitor real-time progress through the 7 steps
   - Review analysis results when complete

4. **Generate Interactive App:**
   - Continue to preview generated choices and consequences
   - Generate standalone interactive application

## AI Personas

### 1. The Classic Storyteller
- **Target:** Classic literature, older students (12-18)
- **Tone:** Formal, literary, thoughtful
- **Style:** Third-person narrative, weighty decisions

### 2. The Adventurous Guide  
- **Target:** Fantasy, adventure, middle-grade (9-13)
- **Tone:** Exciting, fast-paced, modern
- **Style:** Second-person ("you"), action-oriented

### 3. The Playful Friend
- **Target:** Young children (5-8), lighthearted tales
- **Tone:** Simple, warm, supportive
- **Style:** Gentle questions, low-stakes choices

### 4. The Objective Mentor
- **Target:** Educational stories, all ages
- **Tone:** Clear, analytical, cause-and-effect focused
- **Style:** Logical problems, consequence-focused

## API Endpoints

### Process Management
- `POST /api/weaver/process` - Start story processing
- `GET /api/weaver/process/:id` - Check processing status
- `DELETE /api/weaver/process/:id` - Cancel processing

### File Upload  
- `POST /api/weaver/upload` - Upload and process file

### Configuration
- `GET /api/weaver/personas` - Get available personas
- `GET /api/weaver/status` - Get system status
- `GET /health` - Health check

## Decision Point Categories

The system identifies 7 types of decision points:

1. **Moral & Ethical Crossroads** - Character values and principles
2. **Strategic or Tactical Choices** - Problem-solving and planning
3. **Time-Pressure Scenarios** - Urgent decisions under deadline
4. **Relationship & Trust Conflicts** - Interpersonal dynamics
5. **Information & Knowledge Risks** - What to reveal or conceal
6. **Identity & Self-Definition** - Character growth and self-discovery
7. **Life, Death, and Survival** - High-stakes physical challenges

## Content Safety

The system enforces strict content guidelines:
- All generated content must be G-rated
- Age-appropriate vocabulary and concepts
- No profanity or inappropriate themes
- Suitable for school environments
- XSS protection throughout the system

## Configuration

### Environment Variables
Create `.env` file in backend directory:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
CLAUDE_API_KEY=your_api_key_here
LOG_LEVEL=info
MAX_BOOK_SIZE_WORDS=90000
MIN_BOOK_SIZE_WORDS=500
```

### Processing Limits
- Minimum book size: 500 words
- Maximum book size: 90,000 words
- Decision points: 3-15 per story
- Maximum file upload: 10MB
- Processing timeout: 10 minutes per story

## Development Notes

### Current Implementation Status
- ✅ Complete 7-step processing pipeline
- ✅ All AI personas implemented
- ✅ Decision point detection with 70+ patterns
- ✅ Real-time progress tracking
- ✅ Frontend-backend integration
- ✅ Content safety and validation
- ✅ Path convergence algorithms

### For Production Deployment
- Add Redis for process state management
- Implement AI service integration (Claude API)
- Add comprehensive error recovery
- Set up monitoring and analytics
- Implement rate limiting and authentication
- Add database for persistent storage

### Testing
Run tests with:
```bash
npm test
```

This implementation provides a solid foundation for the Story Weaver platform, following all requirements from the PRD and ensuring educational appropriateness while maintaining narrative integrity.