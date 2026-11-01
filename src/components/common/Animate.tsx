import { useEffect, type ReactNode } from "react";
import type { ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

/**
 * Where each animation STARTS from. Every animation ends at the normal state
 * (opacity 1, no offset, scale 1, no rotation).
 *
 * x / y are multiplied by `distance` (default 100px), same as AOS:
 *   x: 1  → starts on the right   x: -1 → starts on the left
 *   y: 1  → starts below          y: -1 → starts above
 *
 * To add a new animation, just add a line here.
 */
const ANIMATIONS = {
  // Fade
  fade: { opacity: 0 },
  "fade-up": { opacity: 0, y: 1 },
  "fade-down": { opacity: 0, y: -1 },
  "fade-left": { opacity: 0, x: 1 },
  "fade-right": { opacity: 0, x: -1 },
  "fade-up-right": { opacity: 0, x: -1, y: 1 },
  "fade-up-left": { opacity: 0, x: 1, y: 1 },
  "fade-down-right": { opacity: 0, x: -1, y: -1 },
  "fade-down-left": { opacity: 0, x: 1, y: -1 },

  // Flip
  "flip-up": { opacity: 0, rotateX: -100 },
  "flip-down": { opacity: 0, rotateX: 100 },
  "flip-left": { opacity: 0, rotateY: -100 },
  "flip-right": { opacity: 0, rotateY: 100 },

  // Slide (no fade, just moves in)
  "slide-up": { y: 1 },
  "slide-down": { y: -1 },
  "slide-left": { x: 1 },
  "slide-right": { x: -1 },

  // Zoom in (starts small)
  "zoom-in": { opacity: 0, scale: 0.6 },
  "zoom-in-up": { opacity: 0, scale: 0.6, y: 1 },
  "zoom-in-down": { opacity: 0, scale: 0.6, y: -1 },
  "zoom-in-left": { opacity: 0, scale: 0.6, x: 1 },
  "zoom-in-right": { opacity: 0, scale: 0.6, x: -1 },

  // Zoom out (starts big)
  "zoom-out": { opacity: 0, scale: 1.2 },
  "zoom-out-up": { opacity: 0, scale: 1.2, y: 1 },
  "zoom-out-down": { opacity: 0, scale: 1.2, y: -1 },
  "zoom-out-left": { opacity: 0, scale: 1.2, x: 1 },
  "zoom-out-right": { opacity: 0, scale: 1.2, x: -1 },
};

export type AnimationName = keyof typeof ANIMATIONS;

interface StartValues {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
}

interface AnimateProps extends ViewProps {
  /** Animation name, same as AOS. Default: "fade-up" */
  type?: AnimationName;
  /** How long the animation takes, in ms. Default: 600 */
  duration?: number;
  /** Wait this long before starting, in ms. Default: 0 */
  delay?: number;
  /** How far it moves, in px. Default: 100 */
  distance?: number;
  children: ReactNode;
}

/**
 * Plays an AOS-style animation when the component appears on screen.
 *
 * @example
 * <Animate type="fade-up" delay={200}>
 *   <Text>Hello</Text>
 * </Animate>
 */
export default function Animate({
  type = "fade-up",
  duration = 600,
  delay = 0,
  distance = 100,
  style,
  children,
  ...rest
}: AnimateProps) {
  const reduceMotion = useReducedMotion();
  const start: StartValues = ANIMATIONS[type];

  // 0 = start position, 1 = finished
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = 0;
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [type, duration, delay, reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    // Move from the start value to the end value as p goes 0 → 1
    const mix = (from: number, to: number) => from + (to - from) * p;

    return {
      opacity: mix(start.opacity ?? 1, 1),
      transform: [
        { perspective: 2500 },
        { translateX: mix((start.x ?? 0) * distance, 0) },
        { translateY: mix((start.y ?? 0) * distance, 0) },
        { scale: mix(start.scale ?? 1, 1) },
        { rotateX: `${mix(start.rotateX ?? 0, 0)}deg` },
        { rotateY: `${mix(start.rotateY ?? 0, 0)}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[{ backfaceVisibility: "hidden" }, style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}

// import { useState } from "react";
// import { Pressable, ScrollView, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import { Animate } from "@/components/common";

// // Demo screen: every one of the 27 animations used once, in a real UI.
// // The animation name is written in a comment above each element.
// const Home = () => {
//   // Changing the ScrollView key remounts the page, so everything animates again
//   const [replay, setReplay] = useState(0);

//   return (
//     <SafeAreaView className="flex-1 bg-slate-100">
//       <ScrollView key={replay} contentContainerClassName="p-4 pb-16">
//         {/* ───────── Notification banner ───────── */}

//         {/* slide-down */}
//         <Animate type="slide-down" distance={60}>
//           <View className="mb-6 rounded-xl bg-amber-100 px-4 py-3">
//             <Text className="text-amber-800">🎉 New levels are available!</Text>
//           </View>
//         </Animate>

//         {/* ───────── Header ───────── */}

//         <View className="items-center">
//           {/* zoom-out */}
//           <Animate type="zoom-out">
//             <Image
//               source={require("../../assets/logo.png")}
//               style={{ width: 80, height: 80 }}
//               contentFit="contain"
//             />
//           </Animate>

//           {/* fade-down */}
//           <Animate type="fade-down" delay={200}>
//             <Text className="mt-4 text-3xl font-extrabold text-slate-900">Memory Match</Text>
//           </Animate>

//           {/* fade */}
//           <Animate type="fade" delay={400}>
//             <Text className="mt-1 text-base text-slate-500">
//               Train your brain, one card at a time
//             </Text>
//           </Animate>
//         </View>

//         {/* ───────── Hero card + buttons ───────── */}

//         {/* flip-up */}
//         <Animate type="flip-up" delay={500}>
//           <View className="mt-6 rounded-3xl bg-indigo-600 p-6">
//             <Text className="text-xl font-bold text-white">Daily Challenge</Text>
//             <Text className="mt-1 text-indigo-100">Match 12 pairs in under 60 seconds</Text>
//           </View>
//         </Animate>

//         {/* zoom-in-up */}
//         <Animate type="zoom-in-up" delay={700}>
//           <Pressable className="mt-4 rounded-full bg-slate-900 py-4 active:opacity-80">
//             <Text className="text-center font-semibold text-white">Play now</Text>
//           </Pressable>
//         </Animate>

//         {/* fade-up */}
//         <Animate type="fade-up" delay={800}>
//           <Pressable className="mt-3 rounded-full border border-slate-300 py-4 active:opacity-60">
//             <Text className="text-center font-semibold text-slate-700">How to play</Text>
//           </Pressable>
//         </Animate>

//         {/* ───────── Stats row ───────── */}

//         <View className="mt-8 flex-row gap-3">
//           {/* fade-up-right (comes in from bottom-left) */}
//           <Animate type="fade-up-right" style={{ flex: 1 }}>
//             <View className="rounded-2xl bg-white p-4">
//               <Text className="text-2xl font-bold text-slate-900">42</Text>
//               <Text className="text-xs text-slate-500">Games</Text>
//             </View>
//           </Animate>

//           {/* slide-up */}
//           <Animate type="slide-up" delay={100} style={{ flex: 1 }}>
//             <View className="rounded-2xl bg-white p-4">
//               <Text className="text-2xl font-bold text-slate-900">87%</Text>
//               <Text className="text-xs text-slate-500">Accuracy</Text>
//             </View>
//           </Animate>

//           {/* fade-up-left (comes in from bottom-right) */}
//           <Animate type="fade-up-left" delay={200} style={{ flex: 1 }}>
//             <View className="rounded-2xl bg-white p-4">
//               <Text className="text-2xl font-bold text-slate-900">12</Text>
//               <Text className="text-xs text-slate-500">Streak</Text>
//             </View>
//           </Animate>
//         </View>

//         {/* ───────── Featured image ───────── */}

//         {/* fade-right */}
//         <Animate type="fade-right">
//           <Text className="mt-8 text-lg font-bold text-slate-900">Featured deck</Text>
//         </Animate>

//         {/* zoom-in */}
//         <Animate type="zoom-in" delay={150}>
//           <View className="mt-3 items-center rounded-3xl bg-white p-6">
//             <Image
//               source={require("../../assets/card-back.png")}
//               style={{ width: 140, height: 190 }}
//               contentFit="contain"
//             />
//           </View>
//         </Animate>

//         {/* fade-left */}
//         <Animate type="fade-left" delay={300}>
//           <Text className="mt-2 text-center text-sm text-slate-500">Classic deck · 24 cards</Text>
//         </Animate>

//         {/* ───────── Difficulty cards ───────── */}

//         <Text className="mt-8 text-lg font-bold text-slate-900">Choose difficulty</Text>

//         <View className="mt-3 flex-row gap-3">
//           {/* flip-left */}
//           <Animate type="flip-left" style={{ flex: 1 }}>
//             <View className="items-center rounded-2xl bg-emerald-500 py-6">
//               <Text className="font-bold text-white">Easy</Text>
//             </View>
//           </Animate>

//           {/* flip-down */}
//           <Animate type="flip-down" delay={150} style={{ flex: 1 }}>
//             <View className="items-center rounded-2xl bg-amber-500 py-6">
//               <Text className="font-bold text-white">Medium</Text>
//             </View>
//           </Animate>

//           {/* flip-right */}
//           <Animate type="flip-right" delay={300} style={{ flex: 1 }}>
//             <View className="items-center rounded-2xl bg-rose-500 py-6">
//               <Text className="font-bold text-white">Hard</Text>
//             </View>
//           </Animate>
//         </View>

//         {/* ───────── Achievement stars ───────── */}

//         <Text className="mt-8 text-lg font-bold text-slate-900">Achievements</Text>

//         <View className="mt-3 flex-row justify-center gap-6 rounded-2xl bg-white py-6">
//           {/* zoom-in-left */}
//           <Animate type="zoom-in-left">
//             <Image source={require("../../assets/star.png")} style={{ width: 48, height: 48 }} />
//           </Animate>

//           {/* zoom-in-down */}
//           <Animate type="zoom-in-down" delay={150}>
//             <Image source={require("../../assets/star.png")} style={{ width: 48, height: 48 }} />
//           </Animate>

//           {/* zoom-in-right */}
//           <Animate type="zoom-in-right" delay={300}>
//             <Image
//               source={require("../../assets/star-empty.png")}
//               style={{ width: 48, height: 48 }}
//             />
//           </Animate>
//         </View>

//         {/* ───────── Leaderboard ───────── */}

//         <Text className="mt-8 text-lg font-bold text-slate-900">Leaderboard</Text>

//         {/* zoom-out-left */}
//         <Animate type="zoom-out-left">
//           <View className="mt-3 flex-row justify-between rounded-xl bg-white p-4">
//             <Text className="font-semibold text-slate-800">🥇 Alex</Text>
//             <Text className="text-slate-500">980 pts</Text>
//           </View>
//         </Animate>

//         {/* zoom-out-right */}
//         <Animate type="zoom-out-right" delay={150}>
//           <View className="mt-2 flex-row justify-between rounded-xl bg-white p-4">
//             <Text className="font-semibold text-slate-800">🥈 Sam</Text>
//             <Text className="text-slate-500">870 pts</Text>
//           </View>
//         </Animate>

//         {/* ───────── Settings rows ───────── */}

//         <Text className="mt-8 text-lg font-bold text-slate-900">Quick settings</Text>

//         {/* slide-left */}
//         <Animate type="slide-left">
//           <View className="mt-3 flex-row justify-between rounded-xl bg-white p-4">
//             <Text className="text-slate-800">🔊 Sound</Text>
//             <Text className="font-semibold text-emerald-600">On</Text>
//           </View>
//         </Animate>

//         {/* slide-right */}
//         <Animate type="slide-right" delay={100}>
//           <View className="mt-2 flex-row justify-between rounded-xl bg-white p-4">
//             <Text className="text-slate-800">📳 Vibration</Text>
//             <Text className="font-semibold text-slate-400">Off</Text>
//           </View>
//         </Animate>

//         {/* ───────── Tags ───────── */}

//         <View className="mt-8 flex-row justify-between">
//           {/* fade-down-right (comes in from top-left) */}
//           <Animate type="fade-down-right">
//             <View className="rounded-full bg-sky-100 px-4 py-2">
//               <Text className="font-semibold text-sky-700">#new</Text>
//             </View>
//           </Animate>

//           {/* fade-down-left (comes in from top-right) */}
//           <Animate type="fade-down-left">
//             <View className="rounded-full bg-rose-100 px-4 py-2">
//               <Text className="font-semibold text-rose-700">#popular</Text>
//             </View>
//           </Animate>
//         </View>

//         {/* ───────── Tip box ───────── */}

//         {/* zoom-out-down */}
//         <Animate type="zoom-out-down">
//           <View className="mt-6 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 p-4">
//             <Text className="text-indigo-800">
//               💡 Tip: remember card positions in rows, not one by one.
//             </Text>
//           </View>
//         </Animate>

//         {/* ───────── Footer button ───────── */}

//         {/* zoom-out-up */}
//         <Animate type="zoom-out-up" delay={150}>
//           <Pressable
//             onPress={() => setReplay((n) => n + 1)}
//             className="mt-8 rounded-full bg-indigo-600 py-4 active:opacity-80"
//           >
//             <Text className="text-center font-semibold text-white">↻ Replay all animations</Text>
//           </Pressable>
//         </Animate>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;
