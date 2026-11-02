import { AppModal, ModalInfoList } from "@/components/common";
import { SettingsStorage, type CardPicture } from "@/services/storages/gameSettings";
import { GameStorage } from "@/services/storages";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { ChevronRight, RotateCcw, TriangleAlert } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Card picture options ─────────────────────────────────────────────────────

const CARD_PICTURES: { id: CardPicture; label: string }[] = [
  { id: "shapes", label: "Shapes" },
  { id: "fruits", label: "Fruits" },
  { id: "animals", label: "Animals" },
];

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  value,
  onChange,
  isLast,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "500", color: colors.foreground }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.muted, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
        color: colors.mutedForeground,
        textTransform: "uppercase",
        paddingHorizontal: 4,
        marginBottom: 6,
      }}
    >
      {label}
    </Text>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingScreen() {
  const router = useRouter();

  const [soundEffects, setSoundEffectsState] = useState(true);
  const [music, setMusicState] = useState(true);
  const [vibration, setVibrationState] = useState(true);
  const [cardPicture, setCardPictureState] = useState<CardPicture>("shapes");
  const [resetModal, setResetModal] = useState(false);

  // Load persisted settings on mount
  useEffect(() => {
    SettingsStorage.getAll().then((s) => {
      setSoundEffectsState(s.soundEffects);
      setMusicState(s.music);
      setVibrationState(s.vibration);
      setCardPictureState(s.cardPicture);
    });
  }, []);

  function handleSoundEffects(v: boolean) {
    setSoundEffectsState(v);
    SettingsStorage.setSoundEffects(v);
  }

  function handleMusic(v: boolean) {
    setMusicState(v);
    SettingsStorage.setMusic(v);
  }

  function handleVibration(v: boolean) {
    setVibrationState(v);
    SettingsStorage.setVibration(v);
  }

  function handleCardPicture(id: CardPicture) {
    setCardPictureState(id);
    SettingsStorage.setCardPicture(id);
  }

  async function handleResetAll() {
    await GameStorage.resetAll();
    setResetModal(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight
            size={20}
            color={colors.foreground}
            strokeWidth={2.2}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.heading }}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, gap: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Toggles ── */}
        <Card>
          <ToggleRow label="Sound effects" value={soundEffects} onChange={handleSoundEffects} />
          <ToggleRow label="Music" value={music} onChange={handleMusic} />
          <ToggleRow label="Vibration" value={vibration} onChange={handleVibration} isLast />
        </Card>

        {/* ── Card pictures ── */}
        <View>
          <SectionLabel label="Card Pictures" />
          <Card>
            <View
              style={{
                flexDirection: "row",
                padding: 6,
                gap: 6,
              }}
            >
              {CARD_PICTURES.map(({ id, label }) => {
                const selected = cardPicture === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => handleCardPicture(id)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: selected ? colors.primary : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: selected ? colors.primaryForeground : colors.body,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </View>

        {/* ── How to play ── */}
        <Pressable
          onPress={() => router.push("/faq" as any)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500", color: colors.foreground }}>
            How to play
          </Text>
          <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Pressable>

        {/* ── Reset all progress ── */}
        <Pressable
          onPress={() => setResetModal(true)}
          style={{
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: colors.destructive,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingVertical: 16,
          }}
        >
          <RotateCcw size={17} color={colors.destructive} strokeWidth={2.2} />
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.destructive }}>
            Reset all progress
          </Text>
        </Pressable>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={{ paddingBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 13, color: colors.mutedForeground }}>
          Privacy policy · Version 1.0
        </Text>
      </View>

      {/* ── Reset modal ── */}
      <AppModal
        visible={resetModal}
        icon={<TriangleAlert size={22} color={colors.destructive} />}
        iconBg={colors.destructiveBg}
        title="Reset all progress?"
        content={
          <ModalInfoList
            subtitle="This can't be undone. You will lose:"
            items={[
              { label: "Stars earned", value: "All" },
              { label: "Best times and moves", value: "All" },
              { label: "Unlocked levels", value: "All" },
            ]}
          />
        }
        buttons={[
          {
            label: "Reset everything",
            variant: "destructive",
            onPress: handleResetAll,
          },
          {
            label: "Cancel",
            onPress: () => setResetModal(false),
          },
        ]}
        onRequestClose={() => setResetModal(false)}
      />
    </SafeAreaView>
  );
}
