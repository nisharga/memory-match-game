import { ScreenFooter, ScreenHeader, SettingItem } from "@/components/common";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Music, Smartphone, SpeakerIcon, Swords, Volume2 } from "lucide-react-native";
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
      {/* Header — back button + title built into align="left" */}
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
            icon={<Swords size={18} color={colors.primary} strokeWidth={2} />}
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
            icon={<SpeakerIcon size={18} color={colors.primary} strokeWidth={2} />}
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
                    style={{
                      alignItems: "center",
                      gap: 6,
                    }}
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
      </ScrollView>

      <ScreenFooter>Settings are saved automatically.</ScreenFooter>
    </SafeAreaView>
  );
}
