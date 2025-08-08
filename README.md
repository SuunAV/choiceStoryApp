# Choice Story App

A cross-platform interactive choice-based story application designed for children ages 8-12. Features engaging narratives, secure design, and responsive layout.

## Features

- **Interactive Storytelling**: Choice-driven narrative with branching paths
- **Cross-Platform**: Works on Windows, Mac, Linux, iOS, Android, and web browsers
- **Secure**: Input sanitization and XSS protection built-in
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Progress Saving**: Local storage for game progress
- **Accessibility**: WCAG 2.1 compliant design
- **Modern UI**: Beautiful animations and smooth transitions

## Quick Start

### Option 1: Direct Use
1. Open `index.html` in any modern web browser
2. Start playing immediately - no installation required

### Option 2: Development Server
```bash
# Navigate to project directory
cd C:\Users\avsuun\dev-workspace\choiceStoryApp

# Install dependencies (optional for development)
npm install

# Start development server
npm run dev
```

## Project Structure

```
choiceStoryApp/
├── index.html          # Main application file
├── package.json        # Project configuration
├── README.md          # This file
├── src/               # Source files
├── assets/            # Images, sounds, additional CSS
├── games/             # Additional story JSON files
└── docs/              # Documentation
```

## Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ with classes and modules
- **Local Storage**: For progress saving
- **Responsive Design**: Mobile-first approach

## Security Features

- Input sanitization to prevent XSS attacks
- Content Security Policy (CSP) headers
- Safe innerHTML methods with validation
- Error handling and graceful degradation

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari 12+, Android Chrome 70+)

## Creating New Stories

Stories are defined in JSON format following this structure:

```json
{
  "game_title": "Story Title",
  "start_scene": "SCENE_ID",
  "scenes": {
    "SCENE_ID": {
      "title": "Scene Title",
      "description": "Scene description text",
      "decision_point": {
        "prompt": "What do you choose?",
        "choices": [
          {
            "text": "Choice text",
            "consequence": {
              "description": "Result description",
              "next_scene": "NEXT_SCENE_ID"
            }
          }
        ]
      },
      "is_end_scene": false
    }
  }
}
```

## Controls

- **Restart Story**: Reset to beginning
- **Go Back**: Return to previous scene
- **Save Progress**: Store current position locally
- **Load Progress**: Restore saved position

## Educational Value

- **Reading Comprehension**: Engaging narrative content
- **Critical Thinking**: Decision-making with consequences
- **Problem Solving**: Navigate story challenges
- **Digital Literacy**: Modern interface interaction

## Customization

The application supports:
- Custom story JSON files
- Theming through CSS variables
- Configurable animations and transitions
- Multiple language support (future feature)

## Performance

- Optimized for mobile devices
- Minimal dependencies
- Efficient DOM manipulation
- Progressive enhancement

## License

MIT License - Feel free to modify and distribute

## Support

For issues or questions:
1. Check browser console for error messages
2. Ensure JavaScript is enabled
3. Try clearing browser cache
4. Test in different browsers

## Future Enhancements

- [ ] Audio narration support
- [ ] Multiple language options
- [ ] Story editor interface
- [ ] Cloud save functionality
- [ ] Achievement system
- [ ] Accessibility improvements
