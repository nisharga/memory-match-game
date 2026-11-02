import { colors } from "@/styles/colors";
import { Lock } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

export interface LevelCardProps {
  badge: string;
  badgeColor: string;
  name: string;
  pairs: number;
  seconds: number;
  earnedStars: number;
  totalStars?: number;
  isUnlocked: boolean;
  isSelected: boolean;
  starsRequired?: number;
  onPress: () => void;
}

function StarRow({ earned, total }: { earned: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Image
          key={i}
          source={
            i < earned
              ? require("../../../assets/star.png")
              : require("../../../assets/star-empty.png")
          }
          style={{ width: 18, height: 18, resizeMode: "contain" }}
        />
      ))}
    </View>
  );
}

export default function LevelCard({
  badge,
  badgeColor,
  name,
  pairs,
  seconds,
  earnedStars,
  totalStars = 3,
  isUnlocked,
  isSelected,
  starsRequired,
  onPress,
}: LevelCardProps) {
  return (
    <Pressable
      onPress={isUnlocked ? onPress : undefined}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: isSelected && isUnlocked ? colors.primary : "transparent",
        padding: 16,
        gap: 14,
        opacity: isUnlocked ? 1 : 0.5,
      }}
    >
      {/* Badge / Lock */}
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: isUnlocked ? badgeColor : colors.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isUnlocked ? (
          <Text
            style={{
              color: colors.primaryForeground,
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            {badge}
          </Text>
        ) : (
          <Lock size={20} color={colors.mutedForeground} strokeWidth={2} />
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text className={isUnlocked ? "base-semibold" : "sm-medium"}>{name}</Text>
        {isUnlocked ? (
          <Text className="sm-medium">{`${pairs} pairs · ${seconds} seconds`}</Text>
        ) : (
          <Text className="sm-medium">{`Get ${starsRequired} stars to unlock`}</Text>
        )}
      </View>

      {/* Stars */}
      {isUnlocked && <StarRow earned={earnedStars} total={totalStars} />}
    </Pressable>
  );
}
