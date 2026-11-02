import type { CardState, ShapeType } from "@/components/game/GameCard";
import type { RootState } from "@/redux/store";
import { colors } from "@/styles/colors";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ─── Level config ─────────────────────────────────────────────────────────────

export type GameLevel = "easy" | "medium" | "hard" | "expert";
export type GameStatus = "idle" | "playing" | "checking" | "won" | "lost";

export const LEVEL_CONFIG: Record<
  GameLevel,
  {
    label: string;
    columns: number;
    rows: number;
    totalPairs: number;
    totalSeconds: number;
    maxMoves?: number;
  }
> = {
  easy: { label: "Easy", columns: 3, rows: 4, totalPairs: 6, totalSeconds: 30, maxMoves: 12 },
  medium: { label: "Medium", columns: 4, rows: 4, totalPairs: 8, totalSeconds: 75 },
  hard: { label: "Hard", columns: 4, rows: 5, totalPairs: 10, totalSeconds: 90 },
};

// ─── Card types ───────────────────────────────────────────────────────────────

export interface GameCard {
  id: number;
  pairId: number;
  shape: ShapeType;
  shapeColor: string;
  state: CardState;
}

// ─── Card pool (12 unique shape+color combos for Expert) ──────────────────────

const CARD_POOL: { shape: ShapeType; shapeColor: string }[] = [
  { shape: "circle", shapeColor: colors.shapeOrange },
  { shape: "star", shapeColor: colors.shapeIndigo },
  { shape: "triangle", shapeColor: colors.shapeGold },
  { shape: "diamond", shapeColor: colors.shapeBlue },
  { shape: "square", shapeColor: colors.shapePink },
  { shape: "circle", shapeColor: colors.shapeBlue },
  { shape: "star", shapeColor: colors.shapeGold },
  { shape: "triangle", shapeColor: colors.shapePink },
  { shape: "diamond", shapeColor: colors.shapeOrange },
  { shape: "square", shapeColor: colors.shapeIndigo },
  { shape: "circle", shapeColor: colors.shapePink },
  { shape: "star", shapeColor: colors.shapeOrange },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

function generateCards(totalPairs: number): GameCard[] {
  const pool = CARD_POOL.slice(0, totalPairs);
  const pairs = [
    ...pool.map((c, i) => ({ ...c, pairId: i, state: "hidden" as CardState })),
    ...pool.map((c, i) => ({ ...c, pairId: i, state: "hidden" as CardState })),
  ];
  return shuffle(pairs).map((c, idx) => ({ ...c, id: idx }));
}

// ─── State ────────────────────────────────────────────────────────────────────

interface GameState {
  level: GameLevel;
  columns: number;
  totalPairs: number;
  totalSeconds: number;
  maxMoves: number | undefined;
  timeLeft: number;
  moves: number;
  pairsFound: number;
  cards: GameCard[];
  flippedIds: number[];
  isLocked: boolean;
  status: GameStatus;
}

const initialState: GameState = {
  level: "easy",
  columns: 3,
  totalPairs: 6,
  totalSeconds: 30,
  maxMoves: 12,
  timeLeft: 30,
  moves: 0,
  pairsFound: 0,
  cards: [],
  flippedIds: [],
  isLocked: false,
  status: "idle",
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame(state, action: PayloadAction<GameLevel>) {
      const cfg = LEVEL_CONFIG[action.payload];
      state.level = action.payload;
      state.columns = cfg.columns;
      state.totalPairs = cfg.totalPairs;
      state.totalSeconds = cfg.totalSeconds;
      state.maxMoves = cfg.maxMoves;
      state.timeLeft = cfg.totalSeconds;
      state.moves = 0;
      state.pairsFound = 0;
      state.cards = generateCards(cfg.totalPairs);
      state.flippedIds = [];
      state.isLocked = false;
      state.status = "playing";
    },

    // Every card press → +1 move. Exceeding maxMoves ends the game.
    flipCard(state, action: PayloadAction<number>) {
      if (state.isLocked) return;
      if (state.status !== "playing") return;

      const card = state.cards.find((c) => c.id === action.payload);
      if (!card || card.state !== "hidden") return;
      if (state.flippedIds.length >= 2) return;

      // 13th press on Easy (maxMoves = 12) → game over
      if (state.maxMoves !== undefined && state.moves >= state.maxMoves) {
        state.status = "lost";
        return;
      }

      card.state = "flipped";
      state.flippedIds.push(action.payload);
      state.moves += 1;

      if (state.flippedIds.length === 2) {
        state.isLocked = true;
        state.status = "checking";
      }
    },

    // Call this when the two flipped cards match.
    matchCards(state) {
      const [id1, id2] = state.flippedIds;
      const c1 = state.cards.find((c) => c.id === id1);
      const c2 = state.cards.find((c) => c.id === id2);
      if (c1) c1.state = "matched";
      if (c2) c2.state = "matched";

      state.pairsFound += 1;
      state.flippedIds = [];
      state.isLocked = false;
      state.status = state.pairsFound === state.totalPairs ? "won" : "playing";
    },

    // Call this after the mismatch delay — flips both cards back.
    resetFlipped(state) {
      state.flippedIds.forEach((id) => {
        const card = state.cards.find((c) => c.id === id);
        if (card) card.state = "hidden";
      });
      state.flippedIds = [];
      state.isLocked = false;
      state.status = "playing";
    },

    // Tick the timer down 1 second — call from a setInterval in the game screen.
    tick(state) {
      if (state.status !== "playing" && state.status !== "checking") return;
      if (state.timeLeft <= 1) {
        state.timeLeft = 0;
        state.status = "lost";
      } else {
        state.timeLeft -= 1;
      }
    },

    // Restart the same level with freshly shuffled cards.
    resetGame(state) {
      const cfg = LEVEL_CONFIG[state.level];
      state.timeLeft = cfg.totalSeconds;
      state.maxMoves = cfg.maxMoves;
      state.moves = 0;
      state.pairsFound = 0;
      state.cards = generateCards(cfg.totalPairs);
      state.flippedIds = [];
      state.isLocked = false;
      state.status = "playing";
    },
  },
});

export const { startGame, flipCard, matchCards, resetFlipped, tick, resetGame } = gameSlice.actions;

export default gameSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectGame = (s: RootState) => s.game;
export const selectCards = (s: RootState) => s.game.cards;
export const selectGameStatus = (s: RootState) => s.game.status;
export const selectFlippedIds = (s: RootState) => s.game.flippedIds;

// "0:41" style label
export const selectTimeFormatted = (s: RootState) => {
  const t = s.game.timeLeft;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// 1 → full, 0 → empty (remaining time fraction)
export const selectProgress = (s: RootState) =>
  s.game.totalSeconds > 0 ? s.game.timeLeft / s.game.totalSeconds : 0;
