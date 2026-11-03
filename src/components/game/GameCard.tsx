import { colors } from "@/styles/colors";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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
  // `face` drives visuals — updated at the midpoint of the flip (scaleX = 0)
  // so the content swap is invisible to the user.
  const [face, setFace] = useState<CardState>(state);
  const scaleX = useSharedValue(1);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip the initial mount — no flip needed on first render.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    // All transitions use the same scaleX flip so setState is always called
    // from a runOnJS callback, never synchronously inside the effect body.
    // matched gets a snappier 100ms half-duration; hidden ↔ flipped uses 150ms.
    const half = state === "matched" ? 100 : 150;

    cancelAnimation(scaleX);
    scaleX.value = withTiming(0, { duration: half }, (finished) => {
      if (finished) {
        runOnJS(setFace)(state);
        scaleX.value = withTiming(1, { duration: half });
      }
    });
  }, [state, scaleX]);

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  const isHidden = face === "hidden";
  const isMatched = face === "matched";

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
          opacity: pressed && !isMatched ? 0.85 : 1,
        })}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              borderRadius: 16,
              backgroundColor: bgColor,
              borderWidth: 2,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
            },
            flipStyle,
          ]}
        >
          {!isHidden && (
            <View style={{ opacity: isMatched ? 0.75 : 1 }}>
              <Shape type={shape} color={shapeColor} size={shapeSize} />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animate>
  );
}
