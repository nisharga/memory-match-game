import { colors } from "@/styles/colors";
import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animate from "./Animate";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ModalButtonVariant = "primary" | "secondary" | "destructive";

export interface ModalButton {
  label: string;
  variant?: ModalButtonVariant;
  onPress: () => void;
}

export interface AppModalProps {
  /** Controls whether the modal is shown */
  visible: boolean;
  /** Lucide icon or any ReactNode rendered inside the circle at the top */
  icon?: ReactNode;
  /** Background color of the icon circle. Defaults to colors.background */
  iconBg?: string;
  title: string;
  /** String → centered body text. ReactNode → rendered as-is (use ModalInfoList for key/value rows) */
  content?: string | ReactNode;
  /** At least one button required */
  buttons: ModalButton[];
  /** Called when the user taps the dark backdrop */
  onRequestClose?: () => void;
}

// ─── Info list helper ─────────────────────────────────────────────────────────

interface InfoItem {
  label: string;
  value: string | number;
}

export function ModalInfoList({ items, subtitle }: { items: InfoItem[]; subtitle?: string }) {
  return (
    <View style={{ gap: 8 }}>
      {subtitle ? (
        <Text className="sm-normal" style={{ color: colors.body }}>
          {subtitle}
        </Text>
      ) : null}
      <View
        style={{
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {items.map(({ label, value }, i) => (
          <View
            key={i}
            style={[
              infoRow.base,
              i < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <Text className="sm-medium" style={{ color: colors.body }}>
              {label}
            </Text>
            <Text className="sm-bold" style={{ color: colors.heading }}>
              {String(value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const infoRow = StyleSheet.create({
  base: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: colors.background,
  },
});

// ─── Button color maps ────────────────────────────────────────────────────────

const BTN_BG: Record<ModalButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.overlay,
  destructive: colors.destructive,
};

const BTN_TEXT_COLOR: Record<ModalButtonVariant, string> = {
  primary: colors.primaryForeground,
  secondary: colors.foreground,
  destructive: colors.destructiveForeground,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppModal({
  visible,
  icon,
  iconBg = colors.background,
  title,
  content,
  buttons,
  onRequestClose,
}: AppModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      {/*
       * Root view fills the entire screen with a solid dark background.
       * This is NOT in an Animate — it must be opaque immediately when
       * the Modal opens, not fade in from zero.
       */}
      <View style={styles.backdrop}>
        {/* Pressable backdrop — tap outside card to dismiss */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />

        {/*
         * Centering shell — pointerEvents="box-none" means this View
         * doesn't swallow touches itself; only the card inside does.
         * Without this, the Pressable above would be unreachable.
         */}
        <View style={styles.centerer} pointerEvents="box-none">
          {/* Card — only mounts when visible so zoom-in replays every open */}
          {visible && (
            <Animate type="zoom-in" duration={260} distance={0} style={{ width: "100%" }}>
              {/* Pressable swallows touches on the card so the backdrop doesn't fire */}
              <Pressable style={styles.card} onPress={() => {}}>
                {/* Icon circle */}
                {icon ? (
                  <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
                ) : null}

                {/* Title */}
                <Text className="two-xl-bold text-center" style={{ color: colors.heading }}>
                  {title}
                </Text>

                {/* Content — string or ReactNode */}
                {content ? (
                  typeof content === "string" ? (
                    <Text className="base-normal text-center" style={{ color: colors.body }}>
                      {content}
                    </Text>
                  ) : (
                    content
                  )
                ) : null}

                {/* Buttons */}
                <View style={{ gap: 10, marginTop: 4 }}>
                  {buttons.map((btn, i) => {
                    const variant = btn.variant ?? "secondary";
                    return (
                      <Pressable
                        key={i}
                        onPress={btn.onPress}
                        style={({ pressed }) => [
                          styles.button,
                          {
                            backgroundColor: BTN_BG[variant],
                            opacity: pressed ? 0.78 : 1,
                          },
                        ]}
                      >
                        <Text style={[styles.btnText, { color: BTN_TEXT_COLOR[variant] }]}>
                          {btn.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Pressable>
            </Animate>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    // Solid dark overlay — appears the instant the Modal opens, no animation needed
    backgroundColor: "rgba(0, 0, 0, 0.80)",
  },
  centerer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.popover,
    borderRadius: 24,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
