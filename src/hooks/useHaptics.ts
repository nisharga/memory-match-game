import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { SettingsStorage } from "@/services/storages/gameSettings";

export type HapticType =
  | "light" // card flip, button tap
  | "medium" // general feedback
  | "heavy" // strong press
  | "success" // pair matched, win
  | "warning" // time running low
  | "error" // wrong pair, lose
  | "selection"; // list / menu selection

export function useHaptics() {
  const enabledRef = useRef(true);

  useEffect(() => {
    SettingsStorage.getVibration().then((v) => {
      enabledRef.current = v;
    });
  }, []);

  function haptic(type: HapticType = "light") {
    if (!enabledRef.current) return;
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
    }
  }

  return { haptic };
}
