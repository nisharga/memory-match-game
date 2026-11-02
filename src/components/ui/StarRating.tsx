import { Animate } from "@/components/common";
import { Image, View } from "react-native";

interface StarRatingProps {
  stars: number;
  total?: number;
}

export default function StarRating({ stars, total = 3 }: StarRatingProps) {
  const mid = Math.floor(total / 2);
  return (
    <View
      style={{ flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "flex-end" }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const size = i === mid ? 72 : 52;
        return (
          <Animate key={i} type="zoom-in" duration={400} delay={80 + i * 120}>
            <Image
              source={
                i < stars
                  ? require("../../../assets/star.png")
                  : require("../../../assets/star-empty.png")
              }
              style={{ width: size, height: size, resizeMode: "contain" }}
            />
          </Animate>
        );
      })}
    </View>
  );
}
