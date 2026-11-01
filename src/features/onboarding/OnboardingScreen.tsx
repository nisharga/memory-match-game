import { Button } from "@/components";
import { Animate } from "@/components/common";
import {
  ONBOARDING_BTN_GET_STARTED,
  ONBOARDING_BTN_NEXT,
  ONBOARDING_BTN_SKIP,
} from "@/config/appConfig";
import { colors } from "@/styles/colors";
import { Check, ChevronRight, Clock, Pointer, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { setOnboardingCompleted } from "./storageOnboarding";

type Props = { onComplete?: () => void };

// ─── Slide 1 visual: face-down card → face-up card with star ─────────────────

function FlipVisual() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      {/* Face-down card */}
      <View
        style={{
          width: 88,
          height: 118,
          backgroundColor: colors.cardBack,
          borderRadius: 16,
          borderWidth: 3,
          borderColor: colors.cardBackBorder,
        }}
      />
      <ChevronRight size={28} color={colors.primary} strokeWidth={2.5} />
      {/* Face-up card with filled star */}
      <View
        style={{
          width: 88,
          height: 118,
          backgroundColor: colors.cardFace,
          borderRadius: 16,
          borderWidth: 3,
          borderColor: colors.tertiary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Star size={44} color={colors.shapeIndigo} fill={colors.shapeIndigo} strokeWidth={0} />
      </View>
    </View>
  );
}

// ─── Slide 2 visual: two matched cards + "It's a match!" badge ───────────────

function PairsCard() {
  return (
    <View
      style={{
        width: 108,
        height: 138,
        backgroundColor: colors.cardFace,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: colors.tertiary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.shapeOrange }}
      />
    </View>
  );
}

function PairsVisual() {
  return (
    <View style={{ alignItems: "center", gap: 16 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <PairsCard />
        <PairsCard />
      </View>
      {/* Match badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.tertiary,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 999,
        }}
      >
        <Check size={16} color={colors.heading} strokeWidth={3} />
        <Text className="sm-bold">It&apos;s a match!</Text>
      </View>
    </View>
  );
}

// ─── Slide 3 visual: three stars + pill badges ────────────────────────────────

function StarsVisual() {
  return (
    <View style={{ alignItems: "center", gap: 20 }}>
      {/* Stars — middle one is largest */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Image source={require("../../../assets/star.png")} style={{ width: 54, height: 54 }} />
        <Image source={require("../../../assets/star.png")} style={{ width: 76, height: 76 }} />
        <Image source={require("../../../assets/star.png")} style={{ width: 54, height: 54 }} />
      </View>
      {/* Pill badges */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.surface,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Clock size={14} color={colors.primary} strokeWidth={2} />
          <Text className="sm-semibold">Beat the clock</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.surface,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Pointer size={14} color={colors.primary} strokeWidth={2} />
          <Text className="sm-semibold">Few moves</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: "flip",
    Visual: FlipVisual,
    title: "Tap to flip",
    description: "Every card hides a picture. Tap any card to turn it over.",
  },
  {
    key: "match",
    Visual: PairsVisual,
    title: "Find the pairs",
    description:
      "Flip two cards at a time. Same picture? They stay open. Different? They flip back.",
  },
  {
    key: "stars",
    Visual: StarsVisual,
    title: "Earn 3 stars",
    description: "Match every pair before time runs out. Fewer moves means more stars.",
  },
] as const;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index]!;
  const { Visual } = slide;

  async function finish() {
    try {
      await setOnboardingCompleted();
      onComplete?.();
    } catch (e) {
      console.error("Failed to complete onboarding", e);
    }
  }

  function goNext() {
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-2">
        {!isLast ? (
          <Pressable onPress={finish} hitSlop={12}>
            <Text className="sm-gray">{ONBOARDING_BTN_SKIP}</Text>
          </Pressable>
        ) : (
          <View className="h-6" />
        )}
      </View>

      {/* Slide — key forces remount, re-triggering Animate children */}
      <Animated.View
        key={index}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        className="flex-1 items-center justify-center px-8"
      >
        {/* Visual drops in from top */}
        <Animate type="fade-down" duration={500} distance={60}>
          <Visual />
        </Animate>

        {/* Title rises from bottom */}
        <Animate
          type="fade-up"
          duration={500}
          delay={120}
          distance={40}
          className="mt-12 items-center"
        >
          <Text className="four-xl-bold text-center">{slide.title}</Text>
        </Animate>

        {/* Description rises from bottom */}
        <Animate
          type="fade-up"
          duration={500}
          delay={220}
          distance={40}
          className="mt-4 items-center"
        >
          <Text className="base-normal text-center">{slide.description}</Text>
        </Animate>
      </Animated.View>

      {/* Bottom controls */}
      <View className="gap-5 px-6 pb-6">
        {/* Progress dots */}
        <View className="flex-row justify-center gap-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{ backgroundColor: i === index ? colors.primary : colors.border }}
              className={`h-2 rounded-full ${i === index ? "w-6" : "w-2"}`}
            />
          ))}
        </View>

        <Button onPress={goNext} className="rounded-2xl">
          {isLast ? ONBOARDING_BTN_GET_STARTED : ONBOARDING_BTN_NEXT}
        </Button>
      </View>
    </SafeAreaView>
  );
}
