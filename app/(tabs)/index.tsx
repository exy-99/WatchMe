import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Removed RankedHero import as we are implementing directly
// import { RankedHero } from "@/components/RankedHero";

export default function Home() {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-5 pt-6 bg-white z-50">
        <View className="flex-row justify-between items-end mb-1">
          <Text className="text-4xl font-hennyPenny text-black leading-10 mt-2">
            WatchMe
          </Text>

          {!menuVisible && (
            <TouchableOpacity onPress={() => setMenuVisible(true)} className="mb-2">
              <Ionicons name="menu" size={32} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View className="h-[1px] bg-black w-full mt-2" />
      </View>

      {/* Floating Menu Overlay */}
      {menuVisible && (
        <BlurView
          intensity={100}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 40,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />

          <View className="w-full max-w-sm rounded-3xl shadow-2xl bg-white/90 border border-white/50 p-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            {/* Close Button Inside */}
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity onPress={() => setMenuVisible(false)} className="p-3 bg-gray-100 rounded-full">
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Navigation Items */}
            <View className="space-y-6 items-center">
              {['Home', 'Movies', 'Series', 'My List', 'Profile'].map((item) => (
                <TouchableOpacity key={item} onPress={() => setMenuVisible(false)} className="border-b border-gray-100 pb-2 w-full items-center">
                  <Text className="text-3xl font-playfairBold text-slate-900 tracking-wider">
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="pt-4">
                <Text className="text-sm font-lato text-gray-400 uppercase tracking-widest">Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>




      </ScrollView>
    </SafeAreaView>
  );
}
