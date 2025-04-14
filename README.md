# Hex Flower App

A React-based application for creating and managing Hex Flowers, inspired by the [Hex Flower Power concept](https://goblinshenchman.wordpress.com/hex-power-flower/). This tool allows users to build hex flowers with a drag-and-drop interface.

This entire application was developed by Windsurf, Cascade, and myself as an exercise in learning how to talk with agentic AI. The code is not production ready for whatever definition of production you may use. I also have no idea if it's well architected, I didn't really look at it, and I'm not great with React anyway. Some of the notes in here are to make prompting easier during development by providing context.

## Features

- **Drag-and-Drop Interface**: Easily create hex flowers by dragging and dropping tiles.
- **Customizable Tiles**: Add your own images to create unique tiles. You can also add text only and specify background colors.
- **Advanced Image Editor**: Before adding an image to a tile, you can:
  - Crop the image to fit the hex shape with precise control
  - Rotate the image in 90-degree increments
  - Zoom in/out to adjust the composition
  - Maintain aspect ratio automatically
  - Upload various image formats
  - Preview changes in real-time
- **Color Picker Integration**: 
  - Choose custom colors for tile backgrounds
  - Select colors from a palette or use color picker
  - Maintain color consistency across tiles
  - Preview color changes before applying
- **Tile Library**: Add tiles to your library to drag onto the flower.
- **Save/Load**: Save your hex flower configurations and load them later.
- **Tile Management**: 
  - Drag tiles from the library to the hex grid
  - Remove tiles by dragging them to the trashcan
  - Save custom tiles for future use
- **Layout Management**:
  - Choose between Small (2 hexes), Medium (3 hexes), or Large (4 hexes) flower layouts. 
  - Change layout sizes with confirmation dialog when tiles are present
  - Reset hexes when changing layouts
  - Maintain tile library across layout changes
- **Export** Save your flower as either an SVG or a PDF

## Technical
- **Drag-and-Drop**: React DnD with HTML5 Backend
- **PDF Generation**: jspdf and html-to-image
- **SVG Generation**: html-to-image
- **Image Processing**: 
  - Cropper.js for advanced image editing
  - Color picker for custom color selection

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

## Usage

1. **Create a New Tile**:
   - Click the + button in the tile library
   - Select an image from your computer
   - Use the advanced image editor to:
     - Crop the image to fit the hex shape
     - Rotate the image using the rotation buttons
     - Zoom in/out using the zoom buttons
     - Choose custom colors using the color picker
     - Preview changes in real-time
   - Click Save to add the edited image as a new tile
   - Click Cancel to discard changes

2. **Build a Hex Flower**:
   - Drag tiles from the library onto the hex grid
   - Click and drag to move tiles
   - Remove tiles by dragging them to the trashcan
   - Choose between Small, Medium, or Large flower layouts
   - Save your work using the Save button
   - Export your hexflower as an SVG or PDF

## Usage



3. **Save/Load**:
   - Click the Save button to save your current configuration
   - Click the Load button to load a saved configuration

4. **Print**:
   - Click the Print button to print your hex flower
   - The print preview maintains the hex layout and styling

## License

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/) CC BY-NC-SA 4.0

## Contributing
