import { colors } from "@/styles/colors";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = { onFinish: () => void };

const PROGRESS_MS = 3000;
const FADE_MS = 400;

export default function CustomSplashScreen({ onFinish }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const barWidth = screenWidth - 80; // 40px padding each side

  const iconScale = useSharedValue(0.25);
  const textY = useSharedValue(48);
  const textOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {});
    });

    // Logo zoom in with slight bounce
    iconScale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.back(1.15)),
    });

    // Title + subtitle slide up from bottom
    textY.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    // Progress bar fills over 3 seconds
    progressWidth.value = withTiming(barWidth, {
      duration: PROGRESS_MS,
      easing: Easing.linear,
    });

    // Fade out then hand off
    screenOpacity.value = withDelay(
      PROGRESS_MS + 100,
      withTiming(0, { duration: FADE_MS }, (done) => {
        "worklet";
        if (done) runOnJS(onFinish)();
      }),
    );

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View style={[screenStyle, { flex: 1, backgroundColor: colors.background }]}>
      {/* Center: logo + text */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* Logo zooms in */}
        <Animated.View style={iconStyle}>
          <Image
            source={require("../../../assets/splash-icon.png")}
            style={{ width: 130, height: 130, resizeMode: "contain" }}
          />
        </Animated.View>

        {/* Title + subtitle slide up */}
        <Animated.View style={[textStyle, { alignItems: "center", marginTop: 28 }]}>
          <Text className="four-xl-bold text-center">Memory Match</Text>
          <Text className="base-normal mt-2.5 text-center font-inter-semibold">
            Flip. Remember. Match.
          </Text>
          <Text className="sm-normal mt-2.5 text-center font-inter-semibold text-body!">
            By. Nisharga. kabir
          </Text>
        </Animated.View>
      </View>

      {/* Bottom: progress bar + tap to continue */}
      <View style={{ paddingHorizontal: 40, paddingBottom: 52, alignItems: "center", gap: 20 }}>
        {/* Track */}
        <View
          style={{
            width: barWidth,
            height: 6,
            backgroundColor: colors.muted,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Fill */}
          <Animated.View
            style={[progressStyle, { height: 4, backgroundColor: colors.primary, borderRadius: 2 }]}
          />
        </View>

        <Text className="sm-gray">Tap to continue</Text>
      </View>
    </Animated.View>
  );
}
