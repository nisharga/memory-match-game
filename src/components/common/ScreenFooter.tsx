import type { ReactNode } from "react";
import { Text, View } from "react-native";
import Animate from "./Animate";

interface ScreenFooterProps {
  children: ReactNode;
}

export default function ScreenFooter({ children }: ScreenFooterProps) {
  return (
    <Animate type="fade-up" duration={400} delay={380} distance={20}>
      <View style={{ paddingHorizontal: 32, paddingBottom: 32, alignItems: "center" }}>
        <Text className="base-normal text-center">{children}</Text>
      </View>
    </Animate>
  );
}
