import { createAudioPlayer, useAudioPlayer } from "expo-audio";
import { useEffect, useRef } from "react";
import { SettingsStorage } from "@/services/storages/gameSettings";

// ─── Sound maps ───────────────────────────────────────────────────────────────

export type BgTrack = "game";
export type SfxKey = "flip" | "match" | "wrong" | "win" | "lose" | "tap" | "tick" | "notification";
export type ResultTrack = "win" | "lose";

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

const RESULT_SOURCES: Record<ResultTrack, ReturnType<typeof require>> = {
  win: require("../../assets/sounds/win.mp3"),
  lose: require("../../assets/sounds/lose.mp3"),
};

// ─── Background music ─────────────────────────────────────────────────────────
// Controlled by the Music toggle in Settings.

export function useBackgroundMusic(track: BgTrack = "game") {
  const player = useAudioPlayer(BG_SOURCES[track] as any);

  useEffect(() => {
    SettingsStorage.getMusic().then((enabled) => {
      if (!enabled) return;
      player.loop = true;
      player.play();
    });
  }, []);
}

// ─── Result music (win / lose screen) ────────────────────────────────────────
// Controlled by the Sound Effects toggle in Settings.

export function useResultMusic(track: ResultTrack) {
  const player = useAudioPlayer(RESULT_SOURCES[track] as any);

  useEffect(() => {
    SettingsStorage.getSoundEffects().then((enabled) => {
      if (enabled) player.play();
    });
  }, []);
}

// ─── Sound effects ────────────────────────────────────────────────────────────
// Controlled by the Sound Effects toggle in Settings.
// Setting is cached in a ref on mount — zero async overhead on every playSound call.

export function useSound() {
  const enabledRef = useRef(true);

  useEffect(() => {
    SettingsStorage.getSoundEffects().then((v) => {
      enabledRef.current = v;
    });
  }, []);

  function playSound(key: SfxKey) {
    if (!enabledRef.current) return;
    const player = createAudioPlayer(SFX_SOURCES[key] as any);
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
