import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameLevel } from "@/redux/features/gameSlice";

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  bestTime: (level: GameLevel) => `@game_best_time_${level}`,
  fewestMoves: (level: GameLevel) => `@game_fewest_moves_${level}`,
  stars: (level: GameLevel) => `@game_stars_${level}`,
  totalStars: "@game_total_stars",
  unlockedLevels: "@game_unlocked_levels",
  selectedLevel: "@game_selected_level",
} as const;

// ─── Per-level stats ──────────────────────────────────────────────────────────

export interface LevelStats {
  bestTime: number | null; // seconds, e.g. 41
  fewestMoves: number | null; // e.g. 10
  stars: number; // 0–3
}

// ─── Best time ────────────────────────────────────────────────────────────────

async function getBestTime(level: GameLevel): Promise<number | null> {
  const raw = await AsyncStorage.getItem(KEYS.bestTime(level));
  return raw !== null ? Number(raw) : null;
}

async function setBestTime(level: GameLevel, seconds: number): Promise<void> {
  const current = await getBestTime(level);
  if (current === null || seconds < current) {
    await AsyncStorage.setItem(KEYS.bestTime(level), String(seconds));
  }
}

async function removeBestTime(level: GameLevel): Promise<void> {
  await AsyncStorage.removeItem(KEYS.bestTime(level));
}

// ─── Fewest moves ─────────────────────────────────────────────────────────────

async function getFewestMoves(level: GameLevel): Promise<number | null> {
  const raw = await AsyncStorage.getItem(KEYS.fewestMoves(level));
  return raw !== null ? Number(raw) : null;
}

async function setFewestMoves(level: GameLevel, moves: number): Promise<void> {
  const current = await getFewestMoves(level);
  if (current === null || moves < current) {
    await AsyncStorage.setItem(KEYS.fewestMoves(level), String(moves));
  }
}

async function removeFewestMoves(level: GameLevel): Promise<void> {
  await AsyncStorage.removeItem(KEYS.fewestMoves(level));
}

// ─── Stars ────────────────────────────────────────────────────────────────────

async function getStars(level: GameLevel): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.stars(level));
  return raw !== null ? Number(raw) : 0;
}

async function setStars(level: GameLevel, stars: number): Promise<void> {
  const current = await getStars(level);
  if (stars > current) {
    await AsyncStorage.setItem(KEYS.stars(level), String(stars));
    await _recalcTotalStars();
  }
}

async function removeStars(level: GameLevel): Promise<void> {
  await AsyncStorage.removeItem(KEYS.stars(level));
}

// ─── Total stars (auto-derived, used for unlocking Expert) ───────────────────

async function getTotalStars(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.totalStars);
  return raw !== null ? Number(raw) : 0;
}

async function _recalcTotalStars(): Promise<void> {
  const levels: GameLevel[] = ["easy", "medium", "hard", "expert"];
  const counts = await Promise.all(levels.map(getStars));
  const total = counts.reduce((sum, n) => sum + n, 0);
  await AsyncStorage.setItem(KEYS.totalStars, String(total));
}

// ─── Unlocked levels ──────────────────────────────────────────────────────────

async function getUnlockedLevels(): Promise<GameLevel[]> {
  const raw = await AsyncStorage.getItem(KEYS.unlockedLevels);
  if (raw) {
    try {
      return JSON.parse(raw) as GameLevel[];
    } catch {
      /* fall through */
    }
  }
  return ["easy"]; // easy is always unlocked by default
}

async function setUnlockedLevels(levels: GameLevel[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.unlockedLevels, JSON.stringify(levels));
}

async function unlockLevel(level: GameLevel): Promise<void> {
  const current = await getUnlockedLevels();
  if (!current.includes(level)) {
    await setUnlockedLevels([...current, level]);
  }
}

// ─── Full level stats (convenience getter) ────────────────────────────────────

async function getLevelStats(level: GameLevel): Promise<LevelStats> {
  const [bestTime, fewestMoves, stars] = await Promise.all([
    getBestTime(level),
    getFewestMoves(level),
    getStars(level),
  ]);
  return { bestTime, fewestMoves, stars };
}

// ─── Reset ────────────────────────────────────────────────────────────────────

async function resetLevel(level: GameLevel): Promise<void> {
  await Promise.all([removeBestTime(level), removeFewestMoves(level), removeStars(level)]);
  await _recalcTotalStars();
}

async function resetAll(): Promise<void> {
  const levels: GameLevel[] = ["easy", "medium", "hard", "expert"];
  await Promise.all(levels.map(resetLevel));
  await AsyncStorage.removeItem(KEYS.unlockedLevels);
}

// ─── Selected level ───────────────────────────────────────────────────────────

async function getSelectedLevel(): Promise<GameLevel> {
  const raw = await AsyncStorage.getItem(KEYS.selectedLevel);
  const valid: GameLevel[] = ["easy", "medium", "hard", "expert"];
  return raw && valid.includes(raw as GameLevel) ? (raw as GameLevel) : "easy";
}

async function setSelectedLevel(level: GameLevel): Promise<void> {
  await AsyncStorage.setItem(KEYS.selectedLevel, level);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const GameStorage = {
  // best time
  getBestTime,
  setBestTime,
  removeBestTime,

  // fewest moves
  getFewestMoves,
  setFewestMoves,
  removeFewestMoves,

  // stars
  getStars,
  setStars,
  removeStars,

  // total stars
  getTotalStars,

  // unlocked levels
  getUnlockedLevels,
  setUnlockedLevels,
  unlockLevel,

  // convenience
  getLevelStats,

  // selected level
  getSelectedLevel,
  setSelectedLevel,

  // reset
  resetLevel,
  resetAll,
};
