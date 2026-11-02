import { colors } from "@/styles/colors";
import { Pressable, View } from "react-native";
import Svg, { Circle, Polygon, Rect } from "react-native-svg";
import { Animate } from "../common";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ShapeType = "circle" | "star" | "triangle" | "square" | "diamond";
export type CardState = "hidden" | "flipped" | "matched";

export interface GameCardData {
  id: number;
  shape: ShapeType;
  shapeColor: string;
  state: CardState;
}

// ─── Shape renderer ───────────────────────────────────────────────────────────

function Shape({ type, color, size }: { type: ShapeType; color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {type === "circle" && <Circle cx="50" cy="50" r="42" fill={color} />}
      {type === "triangle" && <Polygon points="50,8 94,88 6,88" fill={color} />}
      {type === "square" && <Rect x="10" y="10" width="80" height="80" rx="12" fill={color} />}
      {type === "diamond" && <Polygon points="50,5 95,50 50,95 5,50" fill={color} />}
      {type === "star" && (
        <Polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={color} />
      )}
    </Svg>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface GameCardProps extends GameCardData {
  cardWidth: number;
  cardHeight: number;
  onPress: (id: number) => void;
}

export default function GameCard({
  id,
  shape,
  shapeColor,
  state,
  cardWidth,
  cardHeight,
  onPress,
}: GameCardProps) {
  const isHidden = state === "hidden";
  const isMatched = state === "matched";

  const bgColor = isHidden ? colors.cardBack : isMatched ? colors.cardMatched : colors.cardFace;
  const borderColor = isHidden
    ? colors.cardBackBorder
    : isMatched
      ? colors.success
      : colors.warning;

  const shapeSize = Math.floor(cardWidth * 0.48);

  return (
    <Animate type="flip-left" duration={500} delay={360} distance={30}>
      <Pressable
        onPress={() => !isMatched && onPress(id)}
        style={({ pressed }) => ({
          width: cardWidth,
          height: cardHeight,
          borderRadius: 16,
          backgroundColor: bgColor,
          borderWidth: 2,
          borderColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed && !isMatched ? 0.85 : 1,
        })}
      >
        {!isHidden && (
          <View style={{ opacity: isMatched ? 0.75 : 1 }}>
            <Shape type={shape} color={shapeColor} size={shapeSize} />
          </View>
        )}
      </Pressable>
    </Animate>
  );
}
