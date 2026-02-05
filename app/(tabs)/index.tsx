import { fetchMovies, Movie, searchMovies } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    return movies.slice(0, 10);
  }, [movies]);

  const topRatedMovies = useMemo(() => {
    // Sort by rating (descending)
    return [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  }, [movies]);

  const newReleases = useMemo(() => {
    // Sort by release year (descending)
    return [...movies].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 10);
  }, [movies]);

  // Featured Movie (Static/Mocked for consistent UI as per wireframe)
  // In a real app, this might come from a specific API or be the #1 trending movie.
  const featuredMovie = {
    title: "Suspiria",
    year: "1977",
    genre: "Horror",
    duration: "1h 38m",
    country: "Italy",
    image: "https://image.tmdb.org/t/p/w780/5gFq1Kq0vXXD7H6H8g1FqKq0vXX.jpg", // Placeholder or real URL if available, using a known placeholder for now
    // Ideally we'd find this in 'movies' list if it exists, or just hardcode for the visual requirement:
    poster: "https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjq975SC.jpg" // Using Suspiria (1977) poster
  };

  // 3. Debounced Search
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View className="mr-4 w-32">
      <Link href={`/movie/${item.imdbId || item.title}`} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/150' }}
            className="w-32 h-48 rounded-lg bg-gray-200"
            resizeMode="cover"
          />
          <Text className="text-sm font-bold mt-2 text-white" numberOfLines={1}>{item.title}</Text>
          <Text className="text-xs text-gray-400">{item.releaseYear}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-5 pt-4 z-50 pb-2 flex-row justify-between items-center bg-[#121212]">
        <View>
          <Text className="text-4xl font-hennyPenny text-primary leading-10 mt-2">
            WatchMe
          </Text>
        </View>

        {/* Search Icon expands to input - simplified for this step to just be the icon/input row if needed, 
            but design shows Search as a separate screen or below. Wireframe implies it's on Home?
            Actually wireframe has a separate Search screen.
            Let's keep the menu button here.
        */}
        <View className="flex-row items-center gap-4">
          <Link href="/(tabs)/search" asChild>
            <TouchableOpacity>
              <Ionicons name="search" size={28} color="white" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#121212]" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {loading ? (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#E50914" />
            <Text className="text-center mt-4 text-gray-500">Loading Content...</Text>
          </View>
        ) : (
          <View className="pb-4">
            {/* Featured Hero */}
            <View className="w-full h-[500px] mb-8 relative">
              <Image
                // Using a high-res poster or backdrop
                source={{ uri: 'https://image.tmdb.org/t/p/original/a4W3D811oF61E481Z271530182.jpg' }} // Suspiria 1977 backdrop style
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', '#121212']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300 }}
              />
              <View className="absolute bottom-4 left-5 right-5">
                <Text className="text-5xl font-bebas text-white tracking-widest mb-1">SUSPIRIA</Text>
                <View className="flex-row items-center space-x-3 mb-4">
                  <Text className="text-gray-300 text-sm">1977</Text>
                  <Text className="text-gray-500 text-xs">•</Text>
                  <Text className="text-gray-300 text-sm">Italy</Text>
                  <Text className="text-gray-500 text-xs">•</Text>
                  <Text className="text-gray-300 text-sm">Horror</Text>
                  <Text className="text-gray-500 text-xs">•</Text>
                  <Text className="text-gray-300 text-sm">1h 38m</Text>
                </View>

                <View className="flex-row space-x-3">
                  <TouchableOpacity className="bg-primary px-8 py-2 rounded-full">
                    <Text className="text-black font-bold text-lg">Play</Text>
                  </TouchableOpacity>
                  <Link href="/movie/suspiria-1977" asChild>
                    <TouchableOpacity className="bg-transparent border border-white px-6 py-2 rounded-full">
                      <Text className="text-white font-bold text-lg">Details</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>

            {/* Trending */}
            <Text className="text-xl font-bold px-5 mb-4 text-white">Trending</Text>
            <FlatList
              horizontal
              data={trendingMovies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.imdbId || item.title}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
            />

            {/* Top Rated */}
            <Text className="text-xl font-bold px-5 mt-8 mb-4 text-white">Top Rated</Text>
            <FlatList
              horizontal
              data={topRatedMovies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => `top-${item.imdbId || item.title}`}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
            />

            {/* New Releases */}
            <Text className="text-xl font-bold px-5 mt-8 mb-4 text-white">New Releases</Text>
            <FlatList
              horizontal
              data={newReleases}
              renderItem={renderMovieItem}
              keyExtractor={(item) => `new-${item.imdbId || item.title}`}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
            />

            <View className="h-20" />
          </View>
        )}
      </ScrollView>

      {/* Floating Menu Overlay */}
      {menuVisible && (
        <BlurView
          intensity={90}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
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

          <View className="w-full max-w-sm rounded-3xl bg-[#1E1E1E] p-8 border border-gray-800">
            <View className="flex-row justify-end mb-4">
              <TouchableOpacity onPress={() => setMenuVisible(false)} className="p-2 bg-gray-800 rounded-full">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="space-y-6 items-center">
              {['Home', 'Movies', 'Series', 'My List', 'Profile'].map((item) => (
                <TouchableOpacity key={item} onPress={() => setMenuVisible(false)} className="border-b border-gray-800 pb-4 w-full items-center">
                  <Text className="text-2xl font-playfairBold text-white tracking-wider">
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  );
}
