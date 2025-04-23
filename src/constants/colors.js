// GREENS
export const MANTIS = '#6c6';            // Light green
export const GREEN = '#4CAF50';  // Primary green
export const FERN = '#45a049';     // Dark green

// BLUES
export const BLUEBERRY = '#4285F4';     // Google blue
export const SAPPHIRE = '#357ABE';     // Dark Google blue
export const NOIR = '#213547';       // Dark blue-gray text

// REDS
export const ROSE_WATER = '#ffebee'; // Light red background
export const CORAL = '#FF5555';    // Light red
export const CINNABAR = '#f44336';       // Error red
export const RED = '#ff0000';        // Pure red
export const VIVALDI = '#d32f2f';    // Dark red

// Neutrals
export const WHITE = '#ffffff';          // Pure white
export const SNOW = '#f0f0f0';           // Off-white
export const LOTION = '#fafbfc';      // Very light blue-gray
export const CULTURED = '#f5f5f5';       // Very light gray
export const GAINSBORO = '#e0e0e0';      // Light gray
export const COSMONAUT = '#ddd';        // Light gray border
export const CHINESE_SILVER = '#ccc';        // Medium gray border
export const LIGHT_CHARCOAL = '#888';      // Light gray text
export const LEAD_GREY = '#666';          // Medium gray
export const DARK_CHARCOAL = '#333';               // Dark gray
export const CORDOVAN = '#222';       // Very dark gray
export const BLACK = '#000000';          // Pure black

// Background colors
export const BLACK_50_ALPHA = 'rgba(0, 0, 0, 0.5)';  // Semi-transparent black
export const BLACK_20_ALPHA = 'rgba(0, 0, 0, 0.2)';  // Light shadow

// Utility function to get contrasting text color
export function getContrastText(hexColor) {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black text for light colors, white text for dark colors
  return luminance > 0.5 ? BLACK : WHITE;
}
