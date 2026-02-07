import Header from "@/components/Header";
import { fetchMovies, Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const { width } = Dimensions.get('window');

  // 1. Fetch Data on Mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMovies();
      setMovies(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // 2. Client-Side Filtering & Sorting
  const trendingMovies = useMemo(() => {
    return movies.slice(0, 5); // Take top 5 for the slider
  }, [movies]);

  // 1.5 Auto-Play Carousel (Moved here to avoid hoisting issue)
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const intervalId = setInterval(() => {
      let nextIndex = currentHeaderIndex + 1;
      if (nextIndex >= trendingMovies.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentHeaderIndex(nextIndex);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [currentHeaderIndex, trendingMovies]);

  const topRatedMovies = useMemo(() => {
    return [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  }, [movies]);

  const newReleases = useMemo(() => {
    return [...movies].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 10);
  }, [movies]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View className="mr-4 w-[160px]">
      <Link href={`/movie/${item.imdbId || item.title}`} asChild>
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

        {/* Background Image with Gradient Overlay handled by container color if png transparent, else just image */}
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
          {/* FEATURED Badge */}
          <View className="self-start border border-primary px-2 py-1 rounded mb-3">
            <Text className="text-primary text-[10px] uppercase font-bold tracking-wider">Featured</Text>
          </View>

          {/* Title */}
          <Text className="text-4xl font-bold text-white leading-none mb-2 font-latoBold">
            {item.title}
          </Text>

          {/* Metadata */}
          <View className="flex-row items-center gap-4 mb-6">
            <Text className="text-primary text-xs font-bold">{item.releaseYear}</Text>
            <Text className="text-primary text-xs font-bold">|</Text>
            {/* Country dummy for now as api doesn't always have it, or use Genre */}
            <Text className="text-primary text-xs font-bold uppercase">{item.genres?.[0]?.name || "MOVIE"}</Text>
            <Text className="text-primary text-xs font-bold">|</Text>
            {/* Duration dummy or from prop if available */}
            {/* Duration using dynamic runtime */}
            <Text className="text-primary text-xs font-bold">
              {item.runtime ? `${Math.floor(item.runtime / 60)}H ${item.runtime % 60}M` : "1H 38M"}
            </Text>
          </View>

          {/* Watch Button */}
          <Link href={`/movie/${item.imdbId || item.title}`} asChild>
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

      {/* Header */}


      <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <Header />
        {loading ? (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#84f906" />
            <Text className="text-center mt-4 text-primary">Loading Content...</Text>
          </View>
        ) : (
          <View className="pb-4 pt-8">
            {/* Featured Hero Carousel */}
            {/* Featured Hero Carousel */}
            <View className="w-full h-[550px] mb-8">
              <FlatList
                ref={flatListRef}
                data={trendingMovies}
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
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                  });
                }}
              />
            </View>

            {/* Trending Section */}
            {movies.length > 5 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center px-5 mb-4">
                  <Text className="text-2xl font-black text-white uppercase tracking-widest">Trending</Text>

                </View>
                <FlatList
                  horizontal
                  data={movies.slice(5, 15)}
                  renderItem={renderMovieItem}
                  keyExtractor={(item) => `trending-${item.imdbId || item.title}`}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Top Rated */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center px-5 mb-4">
                <Text className="text-2xl font-black text-white uppercase tracking-widest">Top Rated</Text>

              </View>
              <FlatList
                horizontal
                data={topRatedMovies}
                renderItem={renderMovieItem}
                keyExtractor={(item) => `top-${item.imdbId || item.title}`}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* New Releases */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center px-5 mb-4">
                <Text className="text-2xl font-black text-white uppercase tracking-widest">New Releases</Text>

              </View>
              <FlatList
                horizontal
                data={newReleases}
                renderItem={renderMovieItem}
                keyExtractor={(item) => `new-${item.imdbId || item.title}`}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
