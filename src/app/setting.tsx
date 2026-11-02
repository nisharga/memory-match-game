import {
  AppModal,
  ModalInfoList,
  ScreenFooter,
  ScreenHeader,
  SettingItem,
} from "@/components/common";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import {
  Layers,
  Music,
  Pause,
  RefreshCw,
  Smartphone,
  TriangleAlert,
  Trophy,
  Volume2,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Card theme options ────────────────────────────────────────────────────────

const CARD_THEMES = [
  { id: "teal", color: colors.cardBack, label: "Teal" },
  { id: "indigo", color: colors.shapeIndigo, label: "Indigo" },
  { id: "orange", color: colors.shapeOrange, label: "Orange" },
  { id: "pink", color: colors.shapePink, label: "Pink" },
  { id: "blue", color: colors.shapeBlue, label: "Blue" },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text className="stat-label" style={{ paddingHorizontal: 4 }}>
        {label}
      </Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 18,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {children}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingScreen() {
  const router = useRouter();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [cardTheme, setCardTheme] = useState("teal");

  // Modal demo state
  const [pausedModal, setPausedModal] = useState(false);
  const [restartModal, setRestartModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  function handleSoundToggle(value: boolean) {
    setSoundEnabled(value);
    console.log("[Settings] Sound effects:", value);
  }

  function handleMusicToggle(value: boolean) {
    setMusicEnabled(value);
    console.log("[Settings] Music:", value);
  }

  function handleVibrationToggle(value: boolean) {
    setVibrationEnabled(value);
    console.log("[Settings] Vibration:", value);
  }

  function handleCardTheme(id: string) {
    setCardTheme(id);
    console.log("[Settings] Card theme:", id);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <ScreenHeader title="Settings" align="left" onPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 20, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Audio */}
        <Section label="Audio">
          <SettingItem
            index={0}
            icon={<Volume2 size={18} color={colors.primary} strokeWidth={2} />}
            title="Sound Effects"
            subtitle="Card flips, matches and game sounds"
            right="toggle"
            toggled={soundEnabled}
            onToggle={handleSoundToggle}
          />
          <SettingItem
            index={1}
            icon={<Music size={18} color={colors.primary} strokeWidth={2} />}
            title="Music"
            subtitle="Background music during gameplay"
            right="toggle"
            toggled={musicEnabled}
            onToggle={handleMusicToggle}
            isLast
          />
        </Section>

        {/* Gameplay */}
        <Section label="Gameplay">
          <SettingItem
            index={2}
            icon={<Smartphone size={18} color={colors.primary} strokeWidth={2} />}
            title="Vibration"
            subtitle="Haptic feedback on card tap and match"
            right="toggle"
            toggled={vibrationEnabled}
            onToggle={handleVibrationToggle}
          />
          <SettingItem
            index={3}
            icon={<Trophy size={18} color={colors.primary} strokeWidth={2} />}
            title="Difficulty"
            subtitle="Affects time limits and card counts"
            right="chevron"
            onPress={() => {
              console.log("[Settings] Difficulty pressed → navigate to choose-level");
              router.push("/choose-level");
            }}
            isLast
          />
        </Section>

        {/* Appearance */}
        <Section label="Appearance">
          <SettingItem
            index={4}
            icon={<Layers size={18} color={colors.primary} strokeWidth={2} />}
            title="Card Theme"
            subtitle={`Current: ${CARD_THEMES.find((t) => t.id === cardTheme)?.label ?? "Teal"}`}
            right="chevron"
            isLast
            expandedContent={
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {CARD_THEMES.map((theme) => (
                  <Pressable
                    key={theme.id}
                    onPress={() => handleCardTheme(theme.id)}
                    style={{ alignItems: "center", gap: 6 }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: theme.color,
                        borderWidth: 2.5,
                        borderColor: cardTheme === theme.id ? colors.primary : "transparent",
                      }}
                    />
                    <Text className="xss-normal">{theme.label}</Text>
                  </Pressable>
                ))}
              </View>
            }
          />
        </Section>

        {/* Modal demo — remove after testing */}
        <Section label="Modal demo (remove later)">
          <Pressable
            onPress={() => setPausedModal(true)}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text className="base-semibold" style={{ color: colors.foreground }}>
              Paused modal
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setRestartModal(true)}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text className="base-semibold" style={{ color: colors.foreground }}>
              Restart modal
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setResetModal(true)}
            style={{ paddingVertical: 16, paddingHorizontal: 18 }}
          >
            <Text className="base-semibold" style={{ color: colors.destructive }}>
              Reset modal
            </Text>
          </Pressable>
        </Section>
      </ScrollView>

      <ScreenFooter>Settings are saved automatically.</ScreenFooter>

      {/* ── Paused modal ── */}
      <AppModal
        visible={pausedModal}
        icon={<Pause size={22} color={colors.primary} />}
        iconBg={colors.background}
        title="Paused"
        content="Medium · 0:41 left · 3 of 8 pairs"
        buttons={[
          {
            label: "Resume",
            variant: "primary",
            onPress: () => {
              console.log("[Modal] Resume");
              setPausedModal(false);
            },
          },
          {
            label: "Restart level",
            onPress: () => {
              console.log("[Modal] Restart level");
              setPausedModal(false);
            },
          },
          {
            label: "Quit to home",
            onPress: () => {
              console.log("[Modal] Quit to home");
              setPausedModal(false);
              router.replace("/");
            },
          },
        ]}
        onRequestClose={() => setPausedModal(false)}
      />

      {/* ── Restart modal ── */}
      <AppModal
        visible={restartModal}
        icon={<RefreshCw size={22} color={colors.primary} />}
        iconBg={colors.background}
        title="Restart this game?"
        content="The cards will be shuffled again. Your 3 matched pairs and 14 moves will be cleared."
        buttons={[
          {
            label: "Yes, restart",
            variant: "primary",
            onPress: () => {
              console.log("[Modal] Yes restart");
              setRestartModal(false);
            },
          },
          {
            label: "Keep playing",
            onPress: () => {
              console.log("[Modal] Keep playing");
              setRestartModal(false);
            },
          },
        ]}
        onRequestClose={() => setRestartModal(false)}
      />

      {/* ── Reset all progress modal ── */}
      <AppModal
        visible={resetModal}
        icon={<TriangleAlert size={22} color={colors.destructive} />}
        iconBg={colors.destructiveBg}
        title="Reset all progress?"
        content={
          <ModalInfoList
            subtitle="This can't be undone. You will lose:"
            items={[
              { label: "Stars earned", value: 14 },
              { label: "Levels unlocked", value: 3 },
              { label: "Best times and moves", value: "All" },
            ]}
          />
        }
        buttons={[
          {
            label: "Reset everything",
            variant: "destructive",
            onPress: () => {
              console.log("[Modal] Reset everything");
              setResetModal(false);
            },
          },
          {
            label: "Cancel",
            onPress: () => {
              console.log("[Modal] Cancel reset");
              setResetModal(false);
            },
          },
        ]}
        onRequestClose={() => setResetModal(false)}
      />
    </SafeAreaView>
  );
}
