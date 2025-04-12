// Hex dimensions and calculations
export const HEX_WIDTH = 110; // Base width of the hexagon

// Calculated values
export const HEX_HEIGHT = HEX_WIDTH * .9;
export const HEX_MARGIN = HEX_WIDTH * 0.35; 

// Layout calculations
export const ROW_SPACING = HEX_HEIGHT * -1.12; // Distance between rows
export const ROW_OFFSET = HEX_WIDTH * 0.01; // Horizontal offset for even rows

// Helper functions
export const getHexSize = () => ({
  width: HEX_WIDTH,
  height: HEX_HEIGHT
});

export const getHexMargin = () => HEX_MARGIN;

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
  rowOffset: ROW_OFFSET,
  rowSpacing: ROW_SPACING
});
