// Import Chart.js
import { Chart, Tooltip } from "chart.js";
// Import Tailwind config
import { adjustColorOpacity, getCssVariable } from "../utils/Utils";

Chart.register(Tooltip);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = "nearest";
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = "nearest";
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 8;

// Function that generates a gradient for line charts
export const chartAreaGradient = (ctx, chartArea, colorStops) => {
  if (!ctx || !chartArea || !colorStops || colorStops.length === 0) {
    return "transparent";
  }
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
};

export const chartColors = {
  textColor: {
    light: "#9ca3af", // --color-gray-400
    dark: "#6b7280", // --color-gray-500
  },
  gridColor: {
    light: "#f3f4f6", // --color-gray-100
    dark: adjustColorOpacity("#374151", 0.6), // --color-gray-700
  },
  backdropColor: {
    light: "#ffffff", // --color-white
    dark: "#1f2937", // --color-gray-800
  },
  tooltipTitleColor: {
    light: "#1f2937", // --color-gray-800
    dark: "#f3f4f6", // --color-gray-100
  },
  tooltipBodyColor: {
    light: "#6b7280", // --color-gray-500
    dark: "#9ca3af", // --color-gray-400
  },
  tooltipBgColor: {
    light: "#ffffff", // --color-white
    dark: "#374151", // --color-gray-700
  },
  tooltipBorderColor: {
    light: "#e5e7eb", // --color-gray-200
    dark: "#4b5563", // --color-gray-600
  },
};
