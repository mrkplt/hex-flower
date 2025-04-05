// Hex dimensions and calculations
export const HEX_WIDTH = 100; // Base width of the hexagon
export const HEX_STROKE = 2; // Border width

// Calculated values
export const HEX_HEIGHT = HEX_WIDTH * 1.1; // Height based on equilateral triangle properties
export const HEX_MARGIN = HEX_WIDTH * 0.1; // 10% of hex width as margin

// Content area calculations (subtracting stroke width)
export const HEX_CONTENT_WIDTH = HEX_WIDTH - (HEX_STROKE * 2);
export const HEX_CONTENT_HEIGHT = HEX_HEIGHT - (HEX_STROKE * 2);

// Layout calculations
export const ROW_SPACING = HEX_HEIGHT * -0.30; // Distance between rows
export const ROW_OFFSET = HEX_WIDTH * -0.01; // Horizontal offset for even rows

// Helper functions
export const getHexSize = () => ({
  width: HEX_WIDTH,
  height: HEX_HEIGHT,
  contentWidth: HEX_CONTENT_WIDTH,
  contentHeight: HEX_CONTENT_HEIGHT
});

export const getRowOffset = (isEvenRow) => {
  return isEvenRow ? ROW_OFFSET : 0;
};

export const getHexMargin = () => HEX_MARGIN;

export const getFlowerLayout = () => {
  // Return the fixed flower layout pattern
  return [3, 4, 5, 4, 3];
};

export const updateHexDimensions = (newWidth) => {
  HEX_WIDTH = newWidth;
  HEX_HEIGHT = newWidth * Math.sqrt(3) / 2;
  HEX_MARGIN = newWidth * 0.1;
  HEX_CONTENT_WIDTH = newWidth - (HEX_STROKE * 2);
  HEX_CONTENT_HEIGHT = HEX_HEIGHT - (HEX_STROKE * 2);
  ROW_OFFSET = newWidth / 2;
  ROW_SPACING = HEX_HEIGHT;
};

export const getHexDimensions = () => ({
  width: HEX_WIDTH,
  height: HEX_HEIGHT,
  margin: HEX_MARGIN,
  contentWidth: HEX_CONTENT_WIDTH,
  contentHeight: HEX_CONTENT_HEIGHT,
  rowOffset: ROW_OFFSET,
  rowSpacing: ROW_SPACING
});
