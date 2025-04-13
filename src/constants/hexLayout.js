// Hex dimensions and calculations
const HEX_SPACING = 5;
export const HEX_HEIGHT = 109; // Base height of the hexagon
export const HEX_WIDTH = (2/Math.sqrt(3)) * HEX_HEIGHT; 
export const HEX_MARGIN = HEX_WIDTH * 0.248 + HEX_SPACING;
export const ROW_SPACING = -(HEX_HEIGHT * 0.752 - HEX_SPACING * 0.3); // Distance between rows

// Helper functions
export const LAYOUT_SIZES = {
  SMALL: [1,2, 1, 2, 1],
  MEDIUM: [1, 2, 3, 2, 3, 2, 3, 2, 1],
  LARGE: [1, 2, 3, 4, 3, 4, 3, 4, 3, 4, 3, 2, 1]
};

export const getFlowerLayout = (size = 'MEDIUM') => {
  return LAYOUT_SIZES[size];
};

export const getHexDimensions = () => ({
  width: HEX_WIDTH,
  height: HEX_HEIGHT,
  margin: HEX_MARGIN,
  rowSpacing: ROW_SPACING
});
