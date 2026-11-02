import { createAudioPlayer, useAudioPlayer } from "expo-audio";
import { useEffect } from "react";

// ─── Sound maps ───────────────────────────────────────────────────────────────

export type BgTrack = "game";
export type SfxKey = "flip" | "match" | "wrong" | "win" | "lose" | "tap" | "tick" | "notification";

const BG_SOURCES: Record<BgTrack, ReturnType<typeof require>> = {
  game: require("../../assets/sounds/game_bg.mp3"),
};

const SFX_SOURCES: Record<SfxKey, ReturnType<typeof require>> = {
  flip: require("../../assets/sounds/flip.mp3"),
  match: require("../../assets/sounds/match.mp3"),
  wrong: require("../../assets/sounds/wrong.mp3"),
  win: require("../../assets/sounds/win.mp3"),
  lose: require("../../assets/sounds/lose.mp3"),
  tap: require("../../assets/sounds/tap.mp3"),
  tick: require("../../assets/sounds/tick.mp3"),
  notification: require("../../assets/sounds/notification_sound.wav"),
};

// ─── Background music ─────────────────────────────────────────────────────────
// Usage: call inside a screen component. Loops automatically, stops on unmount.
//   useBackgroundMusic("game");

export function useBackgroundMusic(track: BgTrack = "game") {
  const player = useAudioPlayer(BG_SOURCES[track] as any);

  useEffect(() => {
    player.loop = true;
    player.play();
    // useAudioPlayer releases the native player on unmount automatically
  }, []);
}

// ─── Result music (plays once, no loop) ──────────────────────────────────────
// Usage: useResultMusic("win")  /  useResultMusic("lose")

export type ResultTrack = "win" | "lose";

const RESULT_SOURCES: Record<ResultTrack, ReturnType<typeof require>> = {
  win: require("../../assets/sounds/win.mp3"),
  lose: require("../../assets/sounds/lose.mp3"),
};

export function useResultMusic(track: ResultTrack) {
  const player = useAudioPlayer(RESULT_SOURCES[track] as any);
  useEffect(() => {
    player.play();
  }, []);
}

// ─── Sound effects ────────────────────────────────────────────────────────────
// Usage: const { playSound } = useSound();
//        playSound("tap");      // button press
//        playSound("flip");     // card flip
//        playSound("match");    // matched pair

export function useSound() {
  function playSound(key: SfxKey) {
    const player = createAudioPlayer(SFX_SOURCES[key] as any);
    // Auto-cleanup when playback finishes
    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        sub.remove();
        player.remove();
      }
    });
    player.play();
  }

  return { playSound };
}
