import HeroCarousel from "@/components/HeroCarousel";
import SectionRow from "@/components/SectionRow";
import SkeletonRow from "@/components/SkeletonRow";
import { ANIME_CATEGORIES, MOVIE_CATEGORIES, TV_CATEGORIES } from "@/constants/Categories";
import { fetchMoviesFromPath, Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'movie' | 'show' | 'anime'>('movie');
  const [sectionsData, setSectionsData] = useState<Record<string, Movie[]>>({});
  const [heroItems, setHeroItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const activeMap = activeTab === 'movie' ? MOVIE_CATEGORIES : (activeTab === 'show' ? TV_CATEGORIES : ANIME_CATEGORIES);
        const keys = Object.keys(activeMap);
        const promises = keys.map(key => {
          const config = activeMap[key];
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
  }, [activeTab]);

  return (
    <View className="flex-1 bg-[#000000]">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="absolute top-0 left-0 right-0 z-50 px-4 pt-2">
        <SafeAreaView edges={['top']} className="bg-transparent flex-row items-center justify-between min-h-[50px]">
          {/* Left: Logo */}
          <View className="flex-1 justify-center items-start">
            <Text className="text-xl font-hennyPenny text-primary shadow-black drop-shadow-md">
              WatchMe
            </Text>
          </View>

          {/* Center: Tabs */}
          <View className="flex-[2] flex-row justify-center items-center gap-4">
            {(['movie', 'show', 'anime'] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text className={`text-sm font-bold uppercase tracking-wider ${activeTab === tab ? 'text-[#00FF41] border-b border-[#00FF41]' : 'text-white/60'}`}>
                  {tab === 'movie' ? 'MOVIES' : (tab === 'show' ? 'TV' : 'ANIME')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right: Search */}
          <View className="flex-1 justify-center items-end">
            <TouchableOpacity onPress={() => router.push('/search')} className="bg-black/40 p-2 rounded-full backdrop-blur-md">
              <Ionicons name="search" size={20} color="#84f906" />
            </TouchableOpacity>
          </View>
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
            Object.keys(activeTab === 'movie' ? MOVIE_CATEGORIES : (activeTab === 'show' ? TV_CATEGORIES : ANIME_CATEGORIES)).length > 0 &&
              Object.keys(sectionsData).length > 0 ? (
              Object.keys(activeTab === 'movie' ? MOVIE_CATEGORIES : (activeTab === 'show' ? TV_CATEGORIES : ANIME_CATEGORIES)).map(key => {
                const activeMap = activeTab === 'movie' ? MOVIE_CATEGORIES : (activeTab === 'show' ? TV_CATEGORIES : ANIME_CATEGORIES);
                const movies = sectionsData[key];
                if (!movies || movies.length === 0) return null;
                return (
                  <SectionRow
                    key={key}
                    title={activeMap[key].title}
                    items={movies}
                    mediaType={activeMap[key].type}
                    categoryKey={key}
                  />
                );
              })
            ) : (
              <View className="items-center py-20">
                <Ionicons name="alert-circle-outline" size={48} color="#84f906" />
                <Text className="text-white mt-4 font-bold">No content found</Text>
                <Text className="text-white/60 text-xs mt-2 text-center px-10">
                  Please check your internet connection or try again later.
                </Text>
              </View>
            )
          )}
        </View>

        {/* Footer / System status */}
        <View className="items-center mt-10 mb-6 opacity-30">
          <Text className="text-primary font-mono text-[10px]">SYSTEM STATUS: ONLINE</Text>
          <Text className="text-primary font-mono text-[10px]">
            API_KEY: {process.env.EXPO_PUBLIC_SIMKL_CLIENT_ID ? `${process.env.EXPO_PUBLIC_SIMKL_CLIENT_ID.slice(0, 4)}***` : 'MISSING'}
          </Text>
          <Text className="text-primary font-mono text-[10px]">V.2.0.26</Text>
        </View>

      </ScrollView>
    </View>
  );
}
