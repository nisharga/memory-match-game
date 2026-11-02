import { colors } from "@/styles/colors";
import { Text } from "react-native";

export default function SectionLabel({ label }: { label: string }) {
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
