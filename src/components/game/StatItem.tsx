import { colors } from "@/styles";
import { Text, View } from "react-native";

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
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
    </View>
  );
}

export default StatItem;
