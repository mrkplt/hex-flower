// Hex dimensions and calculations
export const HEX_WIDTH = 120; // Base width of the hexagon
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

// Helper function to calculate the offset pattern for a given number of hexagons
const calculateOffsetPattern = (hexCount) => {
  const pattern = [{ x: 0, y: 0 }]; // Start with center hex
  
  // Calculate the number of hexagons in each direction
  const halfCount = Math.floor(hexCount / 2);
  
  // Add right side hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: i, y: 0 });
  }
  
  // Add top-right hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: i, y: -i });
  }
  
  // Add top-left hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: 0, y: -i });
  }
  
  // Add left side hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: -i, y: 0 });
  }
  
  // Add bottom-left hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: -i, y: i });
  }
  
  // Add bottom-right hexes
  for (let i = 1; i <= halfCount; i++) {
    pattern.push({ x: 0, y: i });
  }
  
  return pattern;
};

export const getFlowerLayout = () => {
  // Create a hexagonal flower pattern with rings of 3, 4, 5, 4, 3 hexagons
  return [4 , 5, 6, 7, 6, 5, 4];
  // return [3, 4, 5, 4, 3];
};

export const getHexOffset = (hexIndex, totalHexes) => {
  // Calculate which ring this hex belongs to
  const layout = getFlowerLayout();
  let currentCount = 0;
  let ringIndex = 0;
  
  for (let i = 0; i < layout.length; i++) {
    if (hexIndex < currentCount + layout[i]) {
      ringIndex = i;
      break;
    }
    currentCount += layout[i];
  }
  
  // Calculate the offset pattern for this ring
  const pattern = calculateOffsetPattern(layout[ringIndex]);
  
  // Calculate the pattern index based on the hex's position in its ring
  const ringPosition = hexIndex - currentCount;
  const patternIndex = ringPosition % pattern.length;
  const { x, y } = pattern[patternIndex];
  
  // Calculate the actual offset values
  const baseOffset = HEX_WIDTH * 0.15; // Base offset as percentage of hex width
  const offsetX = baseOffset * x;
  const offsetY = baseOffset * y;
  
  // Apply additional offset based on ring index to create the flower pattern
  const ringOffset = ringIndex * (HEX_WIDTH * 0.1);
  
  return {
    x: offsetX + (ringIndex % 2 === 1 ? -ringOffset : ringOffset),
    y: offsetY + (ringIndex * HEX_HEIGHT * 0.2)
  };
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
