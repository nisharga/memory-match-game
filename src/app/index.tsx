import { Animate } from "@/components";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <Text className="font-inter-bold text-6xl text-red-700">Home</Text>

      <Animate type="fade">
        <Text style={{ fontFamily: "Fredoka-Regular", fontSize: 30 }}>Fade</Text>
      </Animate>

      <Animate type="fade-up">
        <Text>Fade Up</Text>
      </Animate>

      <Animate type="fade-down">
        <Text>Fade Down</Text>
      </Animate>

      <Animate type="fade-left">
        <Text>Fade Left</Text>
      </Animate>

      <Animate type="fade-right">
        <Text>Fade Right</Text>
      </Animate>

      <Animate type="fade-up-right">
        <Text>Fade Up Right</Text>
      </Animate>

      <Animate type="fade-up-left">
        <Text>Fade Up Left</Text>
      </Animate>

      <Animate type="fade-down-right">
        <Text>Fade Down Right</Text>
      </Animate>

      <Animate type="fade-down-left">
        <Text>Fade Down Left</Text>
      </Animate>

      <Animate type="flip-up">
        <Text>Flip Up</Text>
      </Animate>

      <Animate type="flip-down">
        <Text>Flip Down</Text>
      </Animate>

      <Animate type="flip-left">
        <Text>Flip Left</Text>
      </Animate>

      <Animate type="flip-right">
        <Text>Flip Right</Text>
      </Animate>

      <Animate type="slide-up">
        <Text>Slide Up</Text>
      </Animate>

      <Animate type="slide-down">
        <Text>Slide Down</Text>
      </Animate>

      <Animate type="slide-left">
        <Text>Slide Left</Text>
      </Animate>

      <Animate type="slide-right">
        <Text>Slide Right</Text>
      </Animate>

      <Animate type="zoom-in">
        <Text>Zoom In</Text>
      </Animate>

      <Animate type="zoom-in-up">
        <Text>Zoom In Up</Text>
      </Animate>

      <Animate type="zoom-in-down">
        <Text>Zoom In Down</Text>
      </Animate>

      <Animate type="zoom-in-left">
        <Text>Zoom In Left</Text>
      </Animate>

      <Animate type="zoom-in-right">
        <Text>Zoom In Right</Text>
      </Animate>

      <Animate type="zoom-out">
        <Text>Zoom Out</Text>
      </Animate>

      <Animate type="zoom-out-up">
        <Text>Zoom Out Up</Text>
      </Animate>

      <Animate type="zoom-out-down">
        <Text>Zoom Out Down</Text>
      </Animate>

      <Animate type="zoom-out-left">
        <Text>Zoom Out Left</Text>
      </Animate>

      <Animate type="zoom-out-right">
        <Text>Zoom Out Right</Text>
      </Animate>
    </SafeAreaView>
  );
};

export default Home;
