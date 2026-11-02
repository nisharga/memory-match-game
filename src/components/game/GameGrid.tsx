import { Dimensions, FlatList, View } from "react-native";
import GameCard, { type GameCardData } from "./GameCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 16;
const CARD_GAP = 8;

function getCardSize(columns: number) {
  const available = SCREEN_WIDTH - GRID_PADDING * 2 - CARD_GAP * (columns - 1);
  const cardWidth = Math.floor(available / columns);
  const cardHeight = Math.floor(cardWidth * 1.28);
  return { cardWidth, cardHeight };
}

interface GameGridProps {
  cards: GameCardData[];
  columns?: number;
  onCardPress: (id: number) => void;
}

export default function GameGrid({ cards, columns = 4, onCardPress }: GameGridProps) {
  const { cardWidth, cardHeight } = getCardSize(columns);

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => String(item.id)}
      numColumns={columns}
      scrollEnabled={false}
      contentContainerStyle={{ paddingHorizontal: GRID_PADDING, paddingVertical: 12 }}
      columnWrapperStyle={{ gap: CARD_GAP, marginBottom: CARD_GAP }}
      renderItem={({ item }) => (
        <GameCard {...item} cardWidth={cardWidth} cardHeight={cardHeight} onPress={onCardPress} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
    />
  );
}
