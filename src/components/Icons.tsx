import {
  ArrowRight,
  type LucideProps,
  Menu,
  Moon,
  Phone,
  SunMedium,
  X,
  Bell,
  User,
  FileText,
  Search,
} from "lucide-react-native";
import { G, Path, Svg } from "react-native-svg";

// Lucide icon props — use size, color, strokeWidth (not className)
// Example: <Icons.Bell size={20} color={colors.primary} strokeWidth={1.8} />
export type IconProps = LucideProps;

type SVGIconProps = {
  width?: number | string;
  height?: number | string;
  fill?: string;
  color?: string;
};

export const Icons = {
  // --- Lucide icons (already native-compatible) ---
  Moon,
  SunMedium,
  Menu,
  X,
  Phone,
  ArrowRight,
  Bell,
  User,
  FileText,
  Search,
  // --- Custom SVG icons ---
  RightArrow: ({ fill = "none", color = "#000", width = 16, height = 17 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 16 17" fill={fill}>
      <Path
        d="M1 8.5H15"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 1.5L15 8.5L8 15.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  // ---------- Memory Match: logo ----------
  Logo: ({ fill = "none", width = 160, height = 150 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 160 150" fill={fill}>
      <G rotation={-12} origin="50, 71">
        <Path
          d="M22 12h56a16 16 0 0 1 16 16v86a16 16 0 0 1-16 16H22a16 16 0 0 1-16-16V28a16 16 0 0 1 16-16z"
          fill="#2bc49a"
          stroke="#7ef0c9"
          strokeWidth={6}
        />
      </G>
      <G rotation={10} origin="108, 63">
        <Path
          d="M80 4h56a16 16 0 0 1 16 16v86a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V20a16 16 0 0 1 16-16z"
          fill="#fff4d6"
        />
        <Path
          d="M107.6 83.3s-17.25-10.58-21.85-21.16c-3-7.36 2.07-15.64 10.12-15.64 4.6 0 8.28 2.53 11.73 6.9 3.45-4.37 7.13-6.9 11.73-6.9 8.05 0 13.11 8.28 10.12 15.64-4.6 10.58-21.85 21.16-21.85 21.16z"
          fill="#ff7b54"
        />
      </G>
    </Svg>
  ),

  // ---------- Memory Match: stars ----------
  StarFilled: ({ fill = "none", width = 24, height = 24 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z" fill="#ffc94a" />
    </Svg>
  ),
  StarEmpty: ({ fill = "none", width = 24, height = 24 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z" fill="#2e6b6a" />
    </Svg>
  ),

  // ---------- Memory Match: card pictures ----------
  CardCircle: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18z" fill="#ff7b54" />
    </Svg>
  ),
  CardStar: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z" fill="#5b5bd6" />
    </Svg>
  ),
  CardTriangle: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 3l9 18H3z" fill="#e0a100" />
    </Svg>
  ),
  CardSquare: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path
        d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
        fill="#c2378f"
      />
    </Svg>
  ),
  CardDiamond: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2l9 10-9 10-9-10z" fill="#2f8be0" />
    </Svg>
  ),
  CardHeart: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path
        d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 6.9 5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.5 0 5.7 3.6 4.4 6.8C19.5 16.4 12 21 12 21z"
        fill="#e2445c"
      />
    </Svg>
  ),
  CardHexagon: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2l8.7 5v10L12 22l-8.7-5V7z" fill="#2a9d5c" />
    </Svg>
  ),
  CardMoon: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="#8e44d6" />
    </Svg>
  ),
  CardDrop: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2.5c3.5 4.6 7 8.6 7 12a7 7 0 0 1-14 0c0-3.4 3.5-7.4 7-12z" fill="#1a8fb7" />
    </Svg>
  ),
  CardBolt: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#e07800" />
    </Svg>
  ),
  CardCloud: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M7 19a5 5 0 0 1-.6-9.96A6.5 6.5 0 0 1 19 9.5 4.5 4.5 0 0 1 18 19z" fill="#4a8fd6" />
    </Svg>
  ),
  CardPlus: ({ fill = "none", width = 40, height = 40 }: SVGIconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#13897a" />
    </Svg>
  ),
};
