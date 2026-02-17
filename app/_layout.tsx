import { AlegreyaSC_400Regular, AlegreyaSC_700Bold } from "@expo-google-fonts/alegreya-sc";
import { HennyPenny_400Regular } from "@expo-google-fonts/henny-penny";
import { Lato_700Bold } from "@expo-google-fonts/lato";
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Lato_700Bold,
    HennyPenny_400Regular,
    AlegreyaSC_400Regular,
    AlegreyaSC_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="saved/[id]" />
        <Stack.Screen name="details/movie/[id]" />
        <Stack.Screen name="details/show/[id]" />
        {/* Add other screens as needed */}
      </Stack>
    </GestureHandlerRootView>
  );
}
