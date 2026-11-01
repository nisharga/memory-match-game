/**
 * JS mirror of the CSS @theme tokens in global.css.
 * Change values here AND in global.css together — this file is for
 * React Native StyleSheet usage where NativeWind className can't be used
 * (e.g. tab bar config, navigation options).
 */

export const colors = {
  // Brand
  primary: "#7ef0c9", // mint: main buttons (Play, Next, Resume)
  primaryForeground: "#0e3b3c", // text/icons on primary buttons
  secondary: "#165253", // secondary buttons, stat boxes, panels
  tertiary: "#2bc49a", // face-down card color

  // Surface
  background: "#0e3b3c", // main screen background
  surface: "#165253", // cards, list rows, settings box
  overlay: "#061e1f", // behind pop-ups (pause, restart, reset)
  white: "#ffffff",
  black: "#000000",

  // Text
  foreground: "#eafff7",
  heading: "#eafff7",
  body: "#a9dccd",
  mutedForeground: "#a9dccd",
  subtleForeground: "#8fc2b4", // locked level text

  // Borders
  border: "#22625f",
  divider: "#22625f",
  input: "#2e6b6a",

  // Semantic
  success: "#3ddc84", // matched card border, "It's a match!"
  warning: "#ffc94a", // stars, trophy badge, flipped card border
  destructive: "#ff8a7a", // reset progress, time's up ring
  destructiveForeground: "#3a0d05", // text on the red reset button
  link: "#7ef0c9",
  purple: "#5b5bd6",
  ring: "#7ef0c9",

  // Component tokens
  accent: "#165253",
  accentForeground: "#eafff7",
  popover: "#165253", // pop-up box
  popoverForeground: "#eafff7",
  muted: "#2e6b6a", // empty stars, inactive dots, toggle off

  // Gradients
  primaryGradientFrom: "#7ef0c9",
  primaryGradientTo: "#2bc49a",

  // toast bg
  successBg: "#0f4d33",
  warningBg: "#3d2f0a",
  destructiveBg: "#3a2a2a",

  // Game: cards
  cardBack: "#2bc49a",
  cardBackBorder: "#7ef0c9",
  cardFace: "#fff4d6", // flipped, not matched yet
  cardMatched: "#d8efe6", // matched pair
  star: "#ffc94a",
  starEmpty: "#2e6b6a",

  // Game: card picture colors
  shapeOrange: "#ff7b54", // circle / heart
  shapeIndigo: "#5b5bd6", // star
  shapeGold: "#e0a100", // triangle
  shapePink: "#c2378f", // square
  shapeBlue: "#2f8be0", // diamond
};

export const darkColors = {
  primary: "#5b7cfa",
  secondary: "#1e2330",
  tertiary: "#e4e6eb",

  background: "#0e1117",
  surface: "#161a23",
  white: "#ffffff",
  black: "#000000",

  foreground: "#f5f6fa",
  heading: "#f5f6fa",
  body: "#a0a8b6",
  mutedForeground: "#a0a8b6",
  subtleForeground: "#7c8595",

  border: "#262b37",
  divider: "#2e3442",
  input: "#2e3442",

  success: "#5cc160",
  warning: "#fbbf24",
  destructive: "#ff6467",
  link: "#7c95ff",
  purple: "#a3a6ff",
  ring: "#7c95ff",

  accent: "#1f2640",
  accentForeground: "#f5f6fa",
  popover: "#1b202b",
  popoverForeground: "#f5f6fa",
  muted: "#1e2330",

  primaryGradientFrom: "#5b7cfa",
  primaryGradientTo: "#7c95ff",

  successBg: "#052e16",
  warningBg: "#1c1400",
  destructiveBg: "#1c0002",
};
