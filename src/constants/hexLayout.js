// Hex dimensions and calculations
export const HEX_HEIGHT = 90; // Base height of the hexagon
export const HEX_WIDTH = HEX_HEIGHT * 1.1547; 
export const HEX_MARGIN = HEX_HEIGHT * 0.4; 

// Layout calculations
export const ROW_SPACING = HEX_HEIGHT * -1.12; // Distance between rows

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
