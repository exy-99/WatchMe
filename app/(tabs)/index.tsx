import Header from "@/components/Header";
import MediaFeed from "@/components/MediaFeed";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'films' | 'series' | 'anime'>('films');

  return (
    <View className="flex-1 bg-[#000000]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header overlaid on top */}
      <View className="absolute top-0 left-0 right-0 z-50">
        <Header
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
        />
      </View>

      {/* Media Feed handles data fetching and rendering based on category */}
      <MediaFeed categoryKey={activeTab} />
    </View>
  );
}
