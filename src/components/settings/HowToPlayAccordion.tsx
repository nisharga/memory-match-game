import { colors } from "@/styles/colors";
import {
  ChevronRight,
  Footprints,
  Hand,
  RotateCcw,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TIPS = [
  {
    icon: <Hand size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.tertiary,
    title: "Tap to flip",
    body: "Tap any face-down card to reveal the shape underneath. Take a mental note of what you see!",
  },
  {
    icon: <Sparkles size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.success,
    title: "Find the match",
    body: "Flip a second card. If both shapes are identical, they stay revealed and lock in place as a matched pair.",
  },
  {
    icon: <RotateCcw size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.warning,
    title: "Wrong pair? Try again",
    body: "No match — both cards flip back face-down after a short pause. Try to remember their positions for later.",
  },
  {
    icon: <Timer size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.destructive,
    title: "Race the clock",
    body: "You have a countdown timer. Match all pairs before it hits zero or the game ends.",
  },
  {
    icon: <Footprints size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.purple,
    title: "Mind your moves",
    body: "Every card tap counts as one move. Some levels cap your total moves — flip wisely!",
  },
  {
    icon: <Zap size={17} color="#fff" strokeWidth={2} />,
    iconBg: colors.shapeGold,
    title: "Earn stars",
    body: "Finish with more time left on the clock to earn up to 3 stars. The faster you clear the board, the better!",
  },
];

export default function HowToPlayAccordion() {
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function toggle() {
    const next = !open;
    setOpen(next);
    rotation.value = withTiming(next ? 90 : 0, { duration: 220 });
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "500", color: colors.foreground }}>
          How to play
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Animated.View>
      </Pressable>

      {open && (
        <Animated.View
          entering={FadeInDown.duration(220).springify()}
          style={{ borderTopWidth: 1, borderTopColor: colors.border }}
        >
          {TIPS.map((tip, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: i < TIPS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: tip.iconBg,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {tip.icon}
              </View>

              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  {tip.title}
                </Text>
                <Text style={{ fontSize: 13, lineHeight: 19, color: colors.body }}>{tip.body}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}
