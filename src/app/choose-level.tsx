import { Animate, ScreenFooter, ScreenHeader } from "@/components/common";
import { StatItem } from "@/components/game";
import LevelCard from "@/components/ui/LevelCard";
import { useSound } from "@/hooks";
import { GameStorage, type LevelStats } from "@/services/storages";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LevelId = "easy" | "medium" | "hard" | "expert";

interface Level {
  id: LevelId;
  badge: string;
  badgeColor: string;
  name: string;
  pairs: number;
  seconds: number;
  earnedStars: number;
  starsRequired?: number;
}

const LEVELS: Level[] = [
  {
    id: "easy",
    badge: "3×4",
    badgeColor: colors.tertiary,
    name: "Easy",
    pairs: 6,
    seconds: 60,
    earnedStars: 3,
  },
  {
    id: "medium",
    badge: "4×4",
    badgeColor: colors.warning,
    name: "Medium",
    pairs: 8,
    seconds: 75,
    earnedStars: 2,
  },
  {
    id: "hard",
    badge: "4×5",
    badgeColor: colors.shapeOrange,
    name: "Hard",
    pairs: 10,
    seconds: 90,
    earnedStars: 0,
  },
];

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function totalEarnedStars(levels: Level[]) {
  return levels.reduce((sum, l) => sum + l.earnedStars, 0);
}

function isLevelUnlocked(id: LevelId, levels: Level[]) {
  const easyStars = levels.find((l) => l.id === "easy")?.earnedStars ?? 0;
  const mediumStars = levels.find((l) => l.id === "medium")?.earnedStars ?? 0;
  const total = totalEarnedStars(levels);

  switch (id) {
    case "easy":
      return true;
    case "medium":
      return easyStars > 0;
    case "hard":
      return mediumStars > 0;
  }
}

export default function ChooseLevelScreen() {
  const router = useRouter();
  const [levels] = useState<Level[]>(LEVELS);
  const [selected, setSelected] = useState<LevelId>("easy");
  const [stats, setStats] = useState<LevelStats | null>(null);
  const { playSound } = useSound();

  // Load saved level on mount
  useEffect(() => {
    GameStorage.getSelectedLevel().then(setSelected);
  }, []);

  // Persist selection + reload stats whenever level changes
  useEffect(() => {
    GameStorage.setSelectedLevel(selected);
    GameStorage.getLevelStats(selected).then(setStats);
  }, [selected]);

  const unlockedMap = useMemo(
    () => Object.fromEntries(LEVELS.map((l) => [l.id, isLevelUnlocked(l.id, levels)])),
    [levels],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <ScreenHeader title="Choose level" align="left" onPress={() => router.back()} />

      {/* Level cards */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {levels.map((level, i) => (
          <Animate key={level.id} type="fade-up" duration={400} delay={80 + i * 70} distance={30}>
            <LevelCard
              {...level}
              isUnlocked={!!unlockedMap[level.id]}
              isSelected={selected === level.id}
              onPress={() => {
                playSound("tap");
                setSelected(level.id);
              }}
            />
          </Animate>
        ))}
      </ScrollView>

      {/* Best stats for selected level */}
      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingBottom: 12 }}>
        <StatItem
          label="Best Time"
          value={stats?.bestTime != null ? formatTime(stats.bestTime) : "—"}
          tag={levels.find((l) => l.id === selected)?.name}
        />
        <StatItem
          label="Fewest Moves"
          value={stats?.fewestMoves != null ? String(stats.fewestMoves) : "—"}
          tag={levels.find((l) => l.id === selected)?.name}
        />
      </View>

      {/* Footer */}
      <ScreenFooter>Each level reshuffles the cards every time you play.</ScreenFooter>
    </SafeAreaView>
  );
}
