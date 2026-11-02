import AsyncStorage from "@react-native-async-storage/async-storage";

export type CardPicture = "shapes" | "fruits" | "animals";

export interface GameSettings {
  soundEffects: boolean;
  music: boolean;
  vibration: boolean;
  cardPicture: CardPicture;
}

const DEFAULTS: GameSettings = {
  soundEffects: true,
  music: true,
  vibration: true,
  cardPicture: "shapes",
};

const KEYS = {
  soundEffects: "@settings_sound_effects",
  music: "@settings_music",
  vibration: "@settings_vibration",
  cardPicture: "@settings_card_picture",
} as const;

async function getSoundEffects(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.soundEffects);
  return raw !== null ? raw === "true" : DEFAULTS.soundEffects;
}

async function setSoundEffects(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.soundEffects, String(value));
}

async function getMusic(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.music);
  return raw !== null ? raw === "true" : DEFAULTS.music;
}

async function setMusic(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.music, String(value));
}

async function getVibration(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.vibration);
  return raw !== null ? raw === "true" : DEFAULTS.vibration;
}

async function setVibration(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.vibration, String(value));
}

async function getCardPicture(): Promise<CardPicture> {
  const raw = await AsyncStorage.getItem(KEYS.cardPicture);
  return (raw as CardPicture | null) ?? DEFAULTS.cardPicture;
}

async function setCardPicture(value: CardPicture): Promise<void> {
  await AsyncStorage.setItem(KEYS.cardPicture, value);
}

async function getAll(): Promise<GameSettings> {
  const [soundEffects, music, vibration, cardPicture] = await Promise.all([
    getSoundEffects(),
    getMusic(),
    getVibration(),
    getCardPicture(),
  ]);
  return { soundEffects, music, vibration, cardPicture };
}

export const SettingsStorage = {
  getSoundEffects,
  setSoundEffects,
  getMusic,
  setMusic,
  getVibration,
  setVibration,
  getCardPicture,
  setCardPicture,
  getAll,
};
