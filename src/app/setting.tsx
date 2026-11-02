import { Animate, AppModal, ModalInfoList, ScreenFooter, ScreenHeader } from "@/components/common";
import { HowToPlayAccordion, SectionLabel } from "@/components/settings";
import { SettingsStorage, type CardPicture } from "@/services/storages/gameSettings";
import { GameStorage } from "@/services/storages";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { ChevronRight, RotateCcw, TriangleAlert } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components";

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

export default function SettingScreen() {
  const router = useRouter();

  const [soundEffects, setSoundEffectsState] = useState(true);
  const [music, setMusicState] = useState(true);
  const [vibration, setVibrationState] = useState(true);
  const [cardPicture, setCardPictureState] = useState<CardPicture>("shapes");
  const [resetModal, setResetModal] = useState(false);

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
      {/* Header */}
      <ScreenHeader title="Settings" align="left" onPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, gap: 20, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Toggles ── */}
        <Animate type="fade-up" duration={500} delay={360} distance={30}>
          <Card>
            <ToggleRow label="Sound effects" value={soundEffects} onChange={handleSoundEffects} />
            <ToggleRow label="Music" value={music} onChange={handleMusic} />
            <ToggleRow label="Vibration" value={vibration} onChange={handleVibration} isLast />
          </Card>
        </Animate>
        {/* ── How to play ── */}
        <Animate type="fade-up" duration={500} delay={360} distance={30}>
          <HowToPlayAccordion />
        </Animate>

        {/* ── Reset all progress ── */}
        <Animate type="fade-up" duration={500} delay={360} distance={30}>
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
        </Animate>
      </ScrollView>

      {/* ── Footer ── */}
      <View className="pt-8"></View>
      <ScreenFooter>Privacy policy · Version 1.0</ScreenFooter>

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
