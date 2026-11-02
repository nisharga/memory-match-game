import { colors } from "@/styles";
import { Text, View } from "react-native";

interface StatItemProps {
  label: string;
  value: string | number;
  tag?: string;
}

function StatItem({ label, value, tag }: StatItemProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 4,
      }}
    >
      <Text className="stat-label">{label}</Text>
      <Text className="stat-value">{value}</Text>
      {tag && (
        <View className="absolute -top-3 right-3 rounded-full bg-primary px-2 py-1">
          <Text className="text-xs text-black!">{tag}</Text>
        </View>
      )}
    </View>
  );
}

export default StatItem;
