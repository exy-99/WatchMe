import { AlegreyaSC_400Regular, AlegreyaSC_700Bold } from "@expo-google-fonts/alegreya-sc";
import { HennyPenny_400Regular } from "@expo-google-fonts/henny-penny";
import { Lato_700Bold } from "@expo-google-fonts/lato";
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, useFonts } from "@expo-google-fonts/playfair-display";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Lato_700Bold,
    HennyPenny_400Regular,
    AlegreyaSC_400Regular,
    AlegreyaSC_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
