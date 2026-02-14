import HeroCarousel from "@/components/HeroCarousel";
import SectionRow from "@/components/SectionRow";
import SkeletonRow from "@/components/SkeletonRow";
import { CATEGORY_MAP } from "@/constants/Categories";
import { fetchMoviesFromPath, Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [sectionsData, setSectionsData] = useState<Record<string, Movie[]>>({});
  const [heroItems, setHeroItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const keys = Object.keys(CATEGORY_MAP);
        const promises = keys.map(key => {
          const config = CATEGORY_MAP[key];
          return fetchMoviesFromPath(config.endpoint, config.params)
            .then(data => ({ key, data }))
            .catch(error => {
              console.error(`Failed to fetch ${key}:`, error);
              return { key, data: [] as Movie[] };
            });
        });

        const results = await Promise.all(promises);

        const newSectionsData: Record<string, Movie[]> = {};
        const newHeroItems: Movie[] = [];

        results.forEach(({ key, data }) => {
          if (data && data.length > 0) {
            newSectionsData[key] = data;
            // Extract first item for Hero, ensuring uniqueness if possible
            // Simple check: strictly first item
            newHeroItems.push(data[0]);
          }
        });

        setSectionsData(newSectionsData);
        setHeroItems(newHeroItems);

      } catch (error) {
        console.error("Critical error loading home screen:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <View className="flex-1 bg-[#000000]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Simple Transparent Header to avoid collision with Hero */}
      <View className="absolute top-0 left-0 right-0 z-50 px-4 pt-2">
        <SafeAreaView edges={['top']} className="flex-row justify-between items-center bg-transparent">
          <Text className="text-xl font-hennyPenny text-primary shadow-black drop-shadow-md">
            WatchMe
          </Text>
          <TouchableOpacity className="bg-black/40 p-2 rounded-full backdrop-blur-md">
            <Ionicons name="search" size={24} color="#84f906" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* HERO SECTION */}
        {loading ? (
          // Skeleton for Hero (approx height)
          <View className="w-full h-[70vh] bg-gray-900 animate-pulse justify-center items-center">
            <Text className="text-primary font-mono text-xs">INITIALIZING...</Text>
          </View>
        ) : (
          <HeroCarousel items={heroItems} />
        )}

        {/* SECTIONS */}
        <View className="gap-8 mt-4">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            Object.keys(CATEGORY_MAP).map(key => {
              const movies = sectionsData[key];
              if (!movies || movies.length === 0) return null;
              return (
                <SectionRow
                  key={key}
                  title={CATEGORY_MAP[key].title}
                  items={movies}
                  mediaType={CATEGORY_MAP[key].type}
                  categoryKey={key}
                />
              );
            })
          )}
        </View>

        {/* Footer / System status */}
        <View className="items-center mt-10 mb-6 opacity-30">
          <Text className="text-primary font-mono text-[10px]">SYSTEM STATUS: ONLINE</Text>
          <Text className="text-primary font-mono text-[10px]">V.2.0.26</Text>
        </View>

      </ScrollView>
    </View>
  );
}
