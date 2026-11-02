import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

interface StatBoxProps {
  label: string;
  value: string | number;
}

export default function StatBox({ label, value }: StatBoxProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text className="stat-label">{label}</Text>
      <Text className="stat-value">{value}</Text>
    </View>
  );
}
