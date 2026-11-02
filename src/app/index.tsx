import { Button } from "@/components";
import { Animate } from "@/components/common";
import { StatItem } from "@/components/game";
import type { GameLevel } from "@/redux/features/gameSlice";
import { GameStorage } from "@/services/storages";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { useFocusEffect, useRouter } from "expo-router";
import { Play, Settings } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const [totalStars, setTotalStars] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>("easy");
  const [bestTime, setBestTime] = useState<string>("—");
  const [fewestMoves, setFewestMoves] = useState<string>("—");

  // Reload every time the user comes back to home (e.g. after a game)
  useFocusEffect(
    useCallback(() => {
      async function load() {
        const [level, stars] = await Promise.all([
          GameStorage.getSelectedLevel(),
          GameStorage.getTotalStars(),
        ]);
        const stats = await GameStorage.getLevelStats(level);
        setSelectedLevel(level);
        setTotalStars(stars);
        setBestTime(stats.bestTime != null ? formatTime(stats.bestTime) : "—");
        setFewestMoves(stats.fewestMoves != null ? String(stats.fewestMoves) : "—");
      }
      load();
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 8,
        }}
      >
        {/* Stars earned */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}></View>

        {/* Settings */}
        <IconButton onPress={() => router.push("/setting")}>
          <Settings size={20} color={colors.foreground} strokeWidth={1.8} />
        </IconButton>
      </View>

      {/* Hero: logo + title */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animate type="fade-down" duration={500} distance={55}>
          <Image
            source={require("../../assets/splash-icon.png")}
            style={{ width: 160, height: 160, resizeMode: "contain" }}
          />
        </Animate>

        <Animate
          type="fade-up"
          duration={500}
          delay={150}
          distance={40}
          style={{ marginTop: 20, alignItems: "center" }}
        >
          <Text className="four-xl-bold text-center">{"Memory\nMatch"}</Text>
        </Animate>
      </View>

      <Animate type="fade-up" duration={500} delay={220} distance={30}>
        <View style={{ flexDirection: "row", gap: 14, paddingHorizontal: 24, paddingBottom: 14 }}>
          <StatItem
            label="Best Time"
            value={bestTime}
            tag={selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
          />
          <StatItem
            label="Fewest Moves"
            value={fewestMoves}
            tag={selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
          />
        </View>
      </Animate>

      {/* Stats + Buttons */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, gap: 14 }}>
        {/* Stats row */}

        {/* Play */}
        <Animate type="fade-up" duration={500} delay={300} distance={30}>
          <Button onPress={() => router.push("/game")} className="gap-10 rounded-2xl">
            <Play
              size={18}
              color={colors.primaryForeground}
              fill={colors.primaryForeground}
              strokeWidth={0}
            />
            <Text className="play-btn-label">Play</Text>
          </Button>
        </Animate>

        {/* Choose Level */}
        <Animate type="fade-up" duration={500} delay={360} distance={30}>
          <Button
            onPress={() => router.push("/choose-level")}
            className="gap-10 rounded-2xl bg-[#165253]"
          >
            <Text className="base-medium">Choose level</Text>
          </Button>
        </Animate>
      </View>
    </SafeAreaView>
  );
}
