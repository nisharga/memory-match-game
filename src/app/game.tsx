import { Animate, AppModal } from "@/components/common";
import {
  GameGrid,
  GameHeader,
  GameProgressBar,
  GameStats,
  GameStatusMessage,
  type GameCardData,
} from "@/components/game";
import { colors } from "@/styles/colors";
import { useBackgroundMusic } from "@/hooks";
import { useRouter } from "expo-router";
import { Pause, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Static mock data (replace with real game state later) ────────────────────

const GAME = {
  level: "Medium",
  timeLeft: "0:41",
  totalSeconds: 75,
  elapsedSeconds: 34,
  moves: 14,
  pairsFound: 3,
  totalPairs: 8,
  columns: 4,
  statusMessage: "Not a match. Try again!",
};

const CARDS: GameCardData[] = [
  // Row 1
  { id: 1, shape: "circle", shapeColor: colors.shapeOrange, state: "hidden" },
  { id: 2, shape: "circle", shapeColor: colors.shapeOrange, state: "flipped" },
  { id: 3, shape: "star", shapeColor: colors.shapeIndigo, state: "hidden" },
  { id: 4, shape: "star", shapeColor: colors.shapeIndigo, state: "flipped" },
  // Row 2
  { id: 5, shape: "triangle", shapeColor: colors.shapeGold, state: "matched" },
  { id: 6, shape: "diamond", shapeColor: colors.shapeBlue, state: "hidden" },
  { id: 7, shape: "triangle", shapeColor: colors.shapeGold, state: "matched" },
  { id: 8, shape: "star", shapeColor: colors.shapeIndigo, state: "flipped" },
  // Row 3
  { id: 9, shape: "triangle", shapeColor: colors.shapeOrange, state: "flipped" },
  { id: 10, shape: "square", shapeColor: colors.shapePink, state: "hidden" },
  { id: 11, shape: "diamond", shapeColor: colors.shapeBlue, state: "hidden" },
  { id: 12, shape: "square", shapeColor: colors.shapePink, state: "flipped" },
  // Row 4
  { id: 13, shape: "circle", shapeColor: colors.shapeOrange, state: "hidden" },
  { id: 14, shape: "square", shapeColor: colors.shapePink, state: "flipped" },
  { id: 15, shape: "triangle", shapeColor: colors.shapeOrange, state: "hidden" },
  { id: 16, shape: "diamond", shapeColor: colors.shapeBlue, state: "flipped" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GameScreen() {
  const router = useRouter();
  const [pausedModal, setPausedModal] = useState(false);
  const [restartModal, setRestartModal] = useState(false);

  // useBackgroundMusic("game");

  const progress = 1 - GAME.elapsedSeconds / GAME.totalSeconds;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameHeader
          title={GAME.level}
          onPause={() => setPausedModal(true)}
          onRestart={() => setRestartModal(true)}
        />
      </Animate>

      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameStats
          timeLeft={GAME.timeLeft}
          moves={GAME.moves}
          pairsFound={GAME.pairsFound}
          totalPairs={GAME.totalPairs}
        />
      </Animate>

      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameProgressBar progress={progress} />
      </Animate>

      <Animate type="zoom-in-up" duration={500} distance={55} className="mb-2">
        <GameGrid
          cards={CARDS}
          columns={GAME.columns}
          onCardPress={(id) => console.log("[Game] Card pressed:", id)}
        />
      </Animate>

      <GameStatusMessage message={GAME.statusMessage} />

      {/* Paused modal */}
      <AppModal
        visible={pausedModal}
        icon={<Pause size={22} color={colors.primary} />}
        iconBg={colors.background}
        title="Paused"
        content={`${GAME.level} · ${GAME.timeLeft} left · ${GAME.pairsFound} of ${GAME.totalPairs} pairs`}
        buttons={[
          {
            label: "Resume",
            variant: "primary",
            onPress: () => {
              console.log("[Game] Resume");
              setPausedModal(false);
            },
          },
          {
            label: "Restart level",
            onPress: () => {
              setPausedModal(false);
              setRestartModal(true);
            },
          },
          {
            label: "Quit to home",
            onPress: () => {
              setPausedModal(false);
              router.replace("/");
            },
          },
        ]}
        onRequestClose={() => setPausedModal(false)}
      />

      {/* Restart modal */}
      <AppModal
        visible={restartModal}
        icon={<RefreshCw size={22} color={colors.primary} />}
        iconBg={colors.background}
        title="Restart this game?"
        content={`The cards will be shuffled again. Your ${GAME.pairsFound} matched pairs and ${GAME.moves} moves will be cleared.`}
        buttons={[
          {
            label: "Yes, restart",
            variant: "primary",
            onPress: () => {
              console.log("[Game] Restart confirmed");
              setRestartModal(false);
            },
          },
          {
            label: "Keep playing",
            onPress: () => {
              console.log("[Game] Keep playing");
              setRestartModal(false);
            },
          },
        ]}
        onRequestClose={() => setRestartModal(false)}
      />
    </SafeAreaView>
  );
}
