import { colors } from "@/styles/colors";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const PIECES = [
  { color: colors.shapeOrange, x: 24, w: 16, h: 9, dur: 2800, delay: 0, rotDur: 1100 },
  { color: colors.shapeIndigo, x: 68, w: 10, h: 10, dur: 3300, delay: 350, rotDur: 900 },
  { color: colors.warning, x: 120, w: 8, h: 8, dur: 2500, delay: 700, rotDur: 700 },
  { color: colors.shapePink, x: 175, w: 13, h: 6, dur: 3600, delay: 150, rotDur: 1200 },
  { color: colors.shapeBlue, x: 230, w: 8, h: 8, dur: 2900, delay: 500, rotDur: 850 },
  { color: colors.success, x: 285, w: 11, h: 7, dur: 3100, delay: 900, rotDur: 1000 },
  { color: colors.warning, x: 330, w: 14, h: 8, dur: 2700, delay: 250, rotDur: 800 },
  { color: colors.shapeOrange, x: 55, w: 9, h: 9, dur: 3400, delay: 600, rotDur: 950 },
  { color: colors.shapePink, x: 150, w: 7, h: 12, dur: 2600, delay: 1100, rotDur: 650 },
  { color: colors.shapeBlue, x: 310, w: 10, h: 6, dur: 3000, delay: 800, rotDur: 1050 },
  { color: colors.shapeIndigo, x: 90, w: 8, h: 8, dur: 2400, delay: 1300, rotDur: 750 },
  { color: colors.success, x: 260, w: 12, h: 5, dur: 3200, delay: 450, rotDur: 900 },
];

function Piece({ color, x, w, h, dur, delay, rotDur }: (typeof PIECES)[number]) {
  const translateY = useSharedValue(-20);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_HEIGHT + 30, { duration: dur, easing: Easing.linear }),
        -1,
        false,
      ),
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: rotDur, easing: Easing.linear }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: x,
          width: w,
          height: h,
          borderRadius: 3,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

export default function Confetti() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PIECES.map((p, i) => (
        <Piece key={i} {...p} />
      ))}
    </View>
  );
}
