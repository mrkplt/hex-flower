# Hex Flower App

A React-based application for creating and managing Hex Flowers, inspired by the [Hex Flower Power concept](https://goblinshenchman.wordpress.com/hex-power-flower/). This tool allows users to build hex flowers with a drag-and-drop interface.

This entire application was developed by Windsurf, Cascade, and myself as an exercise in learning how to talk with agentic AI. The code is not production ready for whatever definition of production you may use. I also have no idea if it's well architected, I didn't really look at it, and I'm not great with React anyway. Some of the notes in here are to make prompting easier during development by providing context.

## Features

- **Drag-and-Drop Interface**: Easily create hex flowers by dragging and dropping tiles.
- **Customizable Tiles**: Add your own images to create unique tiles.
- **Image Editor**: Before adding an image to a tile, you can:
  - Crop the image to fit the hex shape
  - Rotate the image in 90-degree increments
  - Zoom in/out to adjust the composition
- **Tile Library**: Add tiles to your library to drag onto the flower.
- **Save/Load**: Save your hex flower configurations and load them later.
- **Printing**: Print your hex flower directly from the application.
- **Multiple Sizes**: Choose between 2, 3, or 4 hexes to a side for your flower.
- **Tile Management**: 
  - Drag tiles from the library to the hex grid
  - Remove tiles by dragging them to the trashcan
  - Save custom tiles for future use

## Technical Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Drag-and-Drop**: React DnD with HTML5 Backend
- **PDF Generation**: jspdf and html2canvas
- **UUID Generation**: uuid
- **Image Processing**: Cropper.js for image editing

## Project Structure

```
hex-flower-app/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── HexFlower.jsx      # Main hex grid component
│   │   ├── TileLibrary.jsx    # Tile selection and management
│   │   ├── ImageEditor.jsx    # Image cropping and editing
│   │   └── Toast.jsx          # Notification system
│   ├── constants.js          # Application constants
│   └── App.jsx              # Root component
├── src/styles/          # Global styles
│   └── cropper.css      # Image editor styles
├── package.json         # Project dependencies
└── vite.config.js      # Build configuration
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

### Important Implementation Details

1. **State Management**:
   - Uses React's useState for managing hex tiles and application state
   - Implements custom hooks for complex state logic
   - Maintains separate state for library tiles and active flower tiles

2. **Drag-and-Drop System**:
   - Utilizes React DnD for tile manipulation
   - Custom drag layers for visual feedback
   - Optimized for performance with memoization
   - Implements drag-to-trash functionality

3. **Image Processing**:
   - Uses Cropper.js for image editing
   - Maintains aspect ratio for hex-shaped tiles
   - Implements rotation and zoom controls
   - Handles image file uploads and conversions

4. **PDF Export**:
   - Combines html2canvas and jspdf for high-quality exports
   - Handles complex layouts and styling
   - Maintains visual consistency with the application

## Usage

1. **Create a New Tile**:
   - Click the + button in the tile library
   - Select an image from your computer
   - Use the image editor to:
     - Crop the image to fit the hex shape
     - Rotate the image using the rotation buttons
     - Zoom in/out using the zoom buttons
   - Click Save to add the edited image as a new tile
   - Click Cancel to discard changes

2. **Build a Hex Flower**:
   - Drag tiles from the library onto the hex grid
   - Click and drag to move tiles
   - Remove tiles by dragging them to the trashcan
   - Choose between 2, 3, or 4 hexes to a side

3. **Save/Load**:
   - Click the Save button to save your current configuration
   - Click the Load button to load a saved configuration

4. **Print**:
   - Click the Print button to print your hex flower
   - The print preview maintains the hex layout and styling

## License

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/) CC BY-NC-SA 4.0

## Contributing

A React-based application for creating and managing Hex Flowers, inspired by the [Hex Flower Power concept](https://goblinshenchman.wordpress.com/hex-power-flower/). This tool allows users to build hex flowers with a drag-and-drop interface.

This entire application was developed by Windsurf, Cascade, and myself as an exercise in learning how to talk with agentic AI. The code is not production ready for whatever definition of production you may use. I also have no idea if it's well architected, I didn't really look at it, and I'm not great with React anyway. Some of the notes in here are to make prompting easier during development by providing context.
