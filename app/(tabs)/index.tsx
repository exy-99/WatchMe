import Header from "@/components/Header";
import MovieSection from "@/components/MovieSection";
import SkeletonRow from "@/components/SkeletonRow";
import SmartGenreRow from "@/components/SmartGenreRow";
import { getContentRows, getHeroMovies, Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [contentRows, setContentRows] = useState<{
    topRated: Movie[];
    newReleases: Movie[];
  } | null>(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingRows, setLoadingRows] = useState(true);

  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get('window');

  // 1. Fetch Data
  useEffect(() => {
    // Fast API: Hero
    const loadHero = async () => {
      setLoadingHero(true);
      const data = await getHeroMovies();
      setHeroMovies(data);
      setLoadingHero(false);
    };

    // Hybrid API: Content Rows (Parallel)
    const loadRows = async () => {
      setLoadingRows(true);
      const data = await getContentRows();
      setContentRows(data);
      setLoadingRows(false);
    };

    loadHero();
    loadRows();

    // DEBUG: Trigger genre fetch for logs
    const debugApi = async () => {
      try {
        const { getMoviesByGenre } = await import('@/services/api');
        await getMoviesByGenre('Action');
      } catch (e) {
        console.error('DEBUG API Error:', e);
      }
    };
    debugApi();
  }, []);

  // 2. Auto-Play Carousel
  useEffect(() => {
    if (heroMovies.length === 0) return;

    const intervalId = setInterval(() => {
      let nextIndex = currentHeaderIndex + 1;
      if (nextIndex >= Math.min(heroMovies.length, 5)) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentHeaderIndex(nextIndex);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentHeaderIndex, heroMovies]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View className="mr-4 w-[160px]">
      <Link href={`/movie/${item.imdbId}`} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/150' }}
            className="w-[160px] h-[240px] rounded-xl bg-[#1E1E1E]"
            resizeMode="cover"
          />
          <Text className="text-sm font-bold mt-3 text-white" numberOfLines={1}>{item.title}</Text>
          <Text className="text-xs text-primary mt-1">{item.releaseYear}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const renderFeaturedItem = ({ item }: { item: Movie }) => (
    <View style={{ width: width, height: 550, alignItems: 'center', justifyContent: 'center' }}>
      <View className="w-[90%] h-full bg-[#121212] rounded-3xl overflow-hidden border border-[#333333] relative">

        <Image
          source={{ uri: item.imageSet?.horizontalPoster?.w1080 || item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/1080x600' }}
          className="w-full h-[60%] opacity-80"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#121212']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
        />

        <View className="flex-1 px-5 pt-4 justify-start">
          <View className="self-start border border-primary px-2 py-1 rounded mb-3">
            <Text className="text-primary text-[10px] uppercase font-bold tracking-wider">Featured</Text>
          </View>

          <Text className="text-4xl font-bold text-white leading-none mb-2 font-latoBold" numberOfLines={2}>
            {item.title}
          </Text>

          <View className="flex-row items-center gap-4 mb-6">
            <Text className="text-primary text-xs font-bold">{item.releaseYear}</Text>
            <Text className="text-primary text-xs font-bold">|</Text>
            <Text className="text-primary text-xs font-bold uppercase">{item.genres?.[0]?.name || "MOVIE"}</Text>
            <Text className="text-primary text-xs font-bold">|</Text>
            <Text className="text-primary text-xs font-bold">
              {item.runtime ? `${Math.floor(item.runtime / 60)}H ${item.runtime % 60}M` : "1H 38M"}
            </Text>
          </View>

          <Link href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`} asChild>
            <TouchableOpacity className="bg-primary px-6 py-3 rounded-full flex-row items-center justify-center space-x-2 w-48 shadow-[0_0_10px_rgba(132,249,6,0.6)]">
              <Ionicons name="play" size={18} color="black" />
              <Text className="text-black font-bold text-sm tracking-wide">WATCH NOW</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Header />

        {/* HERO SECTION (Fast API) */}
        {loadingHero ? (
          <View className="h-[550px] justify-center items-center">
            <ActivityIndicator size="large" color="#84f906" />
          </View>
        ) : (
          <View className="pb-4 pt-8">
            <View className="w-full h-[550px] mb-8">
              <FlatList
                ref={flatListRef}
                data={heroMovies.slice(0, 5)}
                renderItem={renderFeaturedItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `featured-${item.imdbId}`}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setCurrentHeaderIndex(index);
                }}
                onScrollToIndexFailed={(info) => {
                  // Fallback logic for scroll failure
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    if (flatListRef.current) {
                      flatListRef.current.scrollToIndex({ index: info.index, animated: true });
                    }
                  });
                }}
              />
            </View>
          </View>
        )}

        {/* CONTENT ROWS (Hybrid) */}
        <View className="pb-8">
          {loadingRows ? (
            <View>
              <Text className="text-2xl font-black text-white uppercase tracking-widest px-5 mb-4">Trending</Text>
              <SkeletonRow />
              <Text className="text-2xl font-black text-white uppercase tracking-widest px-5 mb-4">Top Rated</Text>
              <SkeletonRow />
              <Text className="text-2xl font-black text-white uppercase tracking-widest px-5 mb-4">New Releases</Text>
              <SkeletonRow />
            </View>
          ) : (
            contentRows && (
              <>
                {/* Top Rated Row */}
                <MovieSection title="⭐ Top Rated" movies={contentRows.topRated} />

                {/* New Releases Row */}
                <MovieSection title="🆕 New Releases" movies={contentRows.newReleases} />

                {/* Action Row */}
                <SmartGenreRow title="💥 Action Hits" genre="Action" />

                {/* Comedy Row */}
                <SmartGenreRow title="😂 Comedy Favorites" genre="Comedy" />
              </>
            )
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

