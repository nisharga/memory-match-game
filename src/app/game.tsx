import { Animate, AppModal } from "@/components/common";
import {
  GameGrid,
  GameHeader,
  GameProgressBar,
  GameStats,
  GameStatusMessage,
} from "@/components/game";
import { useBackgroundMusic } from "@/hooks";
import { GameStorage } from "@/services/storages";
import {
  clearStatus,
  flipCard,
  matchCards,
  resetFlipped,
  resetGame,
  selectCards,
  selectFlippedIds,
  selectGame,
  selectGameStatus,
  selectProgress,
  selectTimeFormatted,
  startGame,
  tick,
} from "@/redux/features/gameSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "expo-router";
import { Pause, RefreshCw } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";
import { AndroidNavSpacer, Screen } from "@/components";
import { View } from "react-native";

const MATCH_DELAY = 700; // ms to show matched pair before locking
const MISMATCH_DELAY = 900; // ms to show wrong pair before flipping back

export default function GameScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const game = useAppSelector(selectGame);
  const cards = useAppSelector(selectCards);
  const flippedIds = useAppSelector(selectFlippedIds);
  const status = useAppSelector(selectGameStatus);
  const timeLabel = useAppSelector(selectTimeFormatted);
  const progress = useAppSelector(selectProgress);

  const [pausedModal, setPausedModal] = useState(false);
  const [restartModal, setRestartModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkingRef = useRef(false);

  useBackgroundMusic("game");

  // ── Clear stale won/lost status, then start game ────────────────────────
  useEffect(() => {
    dispatch(clearStatus()); // prevents navigation effect firing on stale "won"/"lost"
    GameStorage.getSelectedLevel().then((level) => dispatch(startGame(level)));
  }, []);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "playing" || status === "checking") {
      timerRef.current = setInterval(() => dispatch(tick()), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // ── Navigate when game ends ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "won") router.replace("/you-win");
    if (status === "lost") router.replace("/lose");
  }, [status]);

  // ── Check match after two cards are flipped ──────────────────────────────
  useEffect(() => {
    if (flippedIds.length !== 2 || checkingRef.current) return;
    checkingRef.current = true;

    const [id1, id2] = flippedIds;
    const c1 = cards.find((c) => c.id === id1);
    const c2 = cards.find((c) => c.id === id2);
    const isMatch = c1 && c2 && c1.pairId === c2.pairId;

    const delay = isMatch ? MATCH_DELAY : MISMATCH_DELAY;
    const timer = setTimeout(() => {
      if (isMatch) dispatch(matchCards());
      else dispatch(resetFlipped());
      checkingRef.current = false;
    }, delay);

    return () => clearTimeout(timer);
  }, [flippedIds]);

  // ── Derived display values ───────────────────────────────────────────────
  const statusMessage =
    status === "checking"
      ? flippedIds.length === 2 &&
        (() => {
          const c1 = cards.find((c) => c.id === flippedIds[0]);
          const c2 = cards.find((c) => c.id === flippedIds[1]);
          return c1 && c2 && c1.pairId === c2.pairId;
        })()
        ? "It's a match!"
        : "Not a match. Try again!"
      : "";

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameHeader
          title={game.level.charAt(0).toUpperCase() + game.level.slice(1)}
          onPause={() => setPausedModal(true)}
          onRestart={() => setRestartModal(true)}
        />
      </Animate>

      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameStats
          timeLeft={timeLabel}
          moves={game.moves}
          pairsFound={game.pairsFound}
          totalPairs={game.totalPairs}
        />
      </Animate>

      <Animate type="fade-up" duration={500} distance={55} className="mb-2">
        <GameProgressBar progress={progress} />
      </Animate>

      {/* <Animate type="zoom-in-up" duration={500} distance={55} className="mb-2"> */}
      <GameGrid cards={cards} columns={game.columns} onCardPress={(id) => dispatch(flipCard(id))} />
      <View className="mb-12"></View>

      <GameStatusMessage message={statusMessage} />

      {/* Paused modal */}
      <AppModal
        visible={pausedModal}
        icon={<Pause size={22} color={colors.primary} />}
        iconBg={colors.background}
        title="Paused"
        content={`${game.level} · ${timeLabel} left · ${game.pairsFound} of ${game.totalPairs} pairs`}
        buttons={[
          {
            label: "Resume",
            variant: "primary",
            onPress: () => setPausedModal(false),
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
        content={`The cards will be shuffled again. Your ${game.pairsFound} matched pairs and ${game.moves} moves will be cleared.`}
        buttons={[
          {
            label: "Yes, restart",
            variant: "primary",
            onPress: () => {
              dispatch(resetGame());
              setRestartModal(false);
            },
          },
          {
            label: "Keep playing",
            onPress: () => setRestartModal(false),
          },
        ]}
        onRequestClose={() => setRestartModal(false)}
      />
    </Screen>
  );
}
