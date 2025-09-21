/**
 * Calculate the price of a neon sign based on its dimensions
 * @param width - Width of the neon sign in inches
 * @param height - Height of the neon sign in inches
 * @param ratePerSquareInch - Rate per square inch (default: 86₹)
 * @returns The calculated price
 */
export const calculateNeonSignPrice = (
  width: number,
  height: number,
  ratePerSquareInch: number = 7
): number => {
  const area = width * height;
  return area * ratePerSquareInch;
};

/**
 * Calculate the dimensions of a neon sign based on text and size
 * @param text - The text to be displayed
 * @param size - The selected size (regular, medium, large)
 * @returns Object containing width and height
 */
export const calculateNeonSignDimensions = (
  text: string,
  size: string
): { width: number; height: number } => {
  // Count letters (excluding spaces)
  const letterCount = text.trim() !== "" ? text.replace(/\s/g, '').length : 0;
  
  let width = 0;
  let height = 0;
  
  switch (size) {
    case "regular":
      // Height: 10 inches (constant), Width: 3 inches per letter
      width = letterCount * 3;
      height = 10;
      break;
    case "medium":
      // Height: 13 inches (constant), Width: 4 inches per letter
      width = letterCount * 4;
      height = 13;
      break;
    case "large":
      // Height: 15 inches (constant), Width: 5 inches per letter
      width = letterCount * 5;
      height = 15;
      break;
    default:
      // For custom or any other size, return default dimensions
      width = letterCount * 3;
      height = 10;
  }
  
  // Enforce maximum width of 96 inches
  if (width > 96) {
    width = 96;
  }
  
  return { width, height };
};

/**
 * Calculate the final dimensions considering user input adjustments
 * @param text - The text to be displayed
 * @param size - The selected size (regular, medium, large, custom)
 * @param customWidth - Custom width input by user (if applicable)
 * @param customHeight - Custom height input by user (if applicable)
 * @returns Object containing final width and height
 */
export const calculateFinalDimensions = (
  text: string,
  size: string,
  customWidth?: string,
  customHeight?: string
): { width: number; height: number } => {
  // For custom size, use user input values
  if (size === "custom") {
    let width = parseFloat(customWidth || "0") || 0;
    let height = parseFloat(customHeight || "0") || 0;
    
    // Enforce minimum and maximum values for custom size
    if (width !== 0 && width < 10) width = 10;
    if (width > 96) width = 96;
    if (height !== 0 && height < 10) height = 10;
    if (height > 48) height = 48;
    
    return { width, height };
  }
  
  // For regular sizes, calculate based on text
  return calculateNeonSignDimensions(text, size);
};