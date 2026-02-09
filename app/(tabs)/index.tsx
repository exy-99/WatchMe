import ExternalLink from '@/components/ExternalLink';
import Header from "@/components/Header";
import { getContentRows, getHeroMovies, Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MovieSection from "../../components/MovieSection";
import SkeletonRow from "../../components/SkeletonRow";
import SmartGenreRow from "../../components/SmartGenreRow";

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
  const { width, height } = Dimensions.get('window');

  // Hero Height = 55% of screen height
  const HERO_HEIGHT = height * 0.55;

  const [isActionLoaded, setIsActionLoaded] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const loadHero = async () => {
      setLoadingHero(true);
      const data = await getHeroMovies();
      setHeroMovies(data);
      setLoadingHero(false);
    };

    const loadRows = async () => {
      setLoadingRows(true);
      const data = await getContentRows();
      setContentRows(data);
      setLoadingRows(false);
    };

    loadHero();
    loadRows();
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

  const renderFeaturedItem = ({ item }: { item: Movie }) => (
    <View style={{ width: width, height: HERO_HEIGHT }}>
      <View className="flex-1 relative">
        <Image
          source={{ uri: item.imageSet?.verticalPoster?.w720 || item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/720x1080' }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Gradient Overlay for Readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)', '#000000']}
          locations={[0, 0.4, 0.7, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Content Overlay */}
        <View className="absolute bottom-0 w-full px-5 pb-8">
          <View className="items-center mb-6">
            <View className="bg-white/20 px-3 py-1 rounded backdrop-blur-md mb-3 border border-white/10">
              <Text className="text-white text-[10px] font-bold tracking-widest uppercase">
                #1 In Movies Today
              </Text>
            </View>

            <Text className="text-5xl font-black text-white text-center mb-3 font-serif tracking-tighter leading-tight shadow-lg">
              {item.title}
            </Text>

            <View className="flex-row items-center gap-2 mb-6">
              <Text className="text-gray-300 text-xs font-semibold">{item.releaseYear}</Text>
              <View className="w-1 h-1 bg-gray-500 rounded-full" />
              <Text className="text-gray-300 text-xs font-semibold uppercase">{item.genres?.[0]?.name || "Film"}</Text>
              <View className="w-1 h-1 bg-gray-500 rounded-full" />
              <Text className="text-gray-300 text-xs font-semibold">
                {item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : "Movie"}
              </Text>
            </View>

            <View className="flex-row gap-4 w-full px-4">
              <Link href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/720x1080')}`} asChild>
                <TouchableOpacity className="flex-1 bg-white py-3 rounded-lg flex-row items-center justify-center space-x-2">
                  <Ionicons name="play" size={24} color="black" />
                  <Text className="text-black font-bold text-base">Play</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity className="flex-1 bg-[#2C2C2C] py-3 rounded-lg flex-row items-center justify-center space-x-2">
                <Ionicons name="add" size={24} color="white" />
                <Text className="text-white font-bold text-base">My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header overlaid on top */}
      <View className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </View>

      <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* HERO SECTION */}
        {loadingHero ? (
          <View style={{ height: HERO_HEIGHT }} className="justify-center items-center bg-[#121212]">
            <ActivityIndicator size="large" color="#84f906" />
          </View>
        ) : (
          <View style={{ height: HERO_HEIGHT }} className="mb-6 mt-16">
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
              // Optimistic scroll fix
              getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            />
            {/* Dots Indicator */}
            <View className="absolute bottom-28 w-full flex-row justify-center gap-2">
              {heroMovies.slice(0, 5).map((_, i) => (
                <View
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentHeaderIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </View>
          </View>
        )}

        {/* CONTENT ROWS */}
        <View className="-mt-4 relative z-10">
          {loadingRows ? (
            <View className="pt-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : (
            contentRows && (
              <View className="gap-4">
                {/* Top Rated Row - Larger Cards */}
                <MovieSection
                  title="Top Rated Movies"
                  movies={contentRows.topRated}
                  variant="large"
                />

                {/* Trending Row - Standard Cards */}
                <MovieSection
                  title="Trending Now"
                  movies={contentRows.newReleases}
                  variant="standard"
                />

                {/* Smart Genre Rows */}
                <SmartGenreRow
                  title="Blockbuster Actions"
                  genre="Action"
                  onLoadComplete={() => setIsActionLoaded(true)}
                />

                {/* Comedy Row - Loads after Action */}
                <SmartGenreRow
                  title="Comedy Hits"
                  genre="Comedy"
                  enabled={isActionLoaded}
                />
              </View>
            )
          )}

          <ExternalLink
            url="https://simkl.com"
            text="Powered by Simkl"
            style={{ marginTop: 40, marginBottom: 40, alignSelf: 'center' }}
          />
        </View>

      </ScrollView>
    </View>
  );
}
