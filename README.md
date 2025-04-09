# Hex Flower App

A React-based application for creating and managing Hex Flowers, inspired by the [Hex Flower Power concept](https://goblinshenchman.wordpress.com/hex-power-flower/). This tool allows users to build hex flowers with a drag-and-drop interface.

## Features

- Drag-and-drop interface for creating hex-based game elements
- Customizable hex tiles with various properties
- Tile library management
- Save and load functionality for hex configurations
- PDF export capabilities
- Responsive design for desktop and mobile

## Technical Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Drag-and-Drop**: React DnD with HTML5 Backend
- **PDF Generation**: jspdf and html2canvas
- **UUID Generation**: uuid

## Project Structure

```
hex-flower-app/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── HexFlower.jsx      # Main hex grid component
│   │   ├── TileLibrary.jsx    # Tile selection and management
│   │   └── Toast.jsx          # Notification system
│   ├── constants.js          # Application constants
│   └── App.jsx              # Root component
├── package.json           # Project dependencies
└── vite.config.js        # Build configuration
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview the production build:
```bash
npm run preview
```

## Development Notes

This entire application was developed by Windsurf, Cascade, and myself as an exercise in learning how to talk with agentic AI. The code is not production ready for whatever definition of production you may use. I lso have no idea if it's well architected, I didn't really look at it, and I am not great with React anyway. Some of the notes in here are to make prompting easier during development by providing context.

### Important Implementation Details

1. **State Management**:
   - Uses React's useState for managing hex tiles and application state
   - Implements custom hooks for complex state logic

2. **Drag-and-Drop System**:
   - Utilizes React DnD for tile manipulation
   - Custom drag layers for visual feedback
   - Optimized for performance with memoization

3. **PDF Export**:
   - Combines html2canvas and jspdf for high-quality exports
   - Handles complex layouts and styling
   - Maintains visual consistency with the application

## License

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/) CC BY-NC-SA 4.0

## Contributing
