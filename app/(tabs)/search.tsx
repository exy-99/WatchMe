import { Movie, searchMovies } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Shared Header w/ Menu Callback (optional here, but keeps consistency) */}


      <View className="flex-1 px-4 mt-0">
        {/* Search Input */}
        <View className="flex-row items-center bg-[#1E1E1E] rounded-full px-4 py-3 mb-6 border border-gray-800">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-white text-base font-lato"
            placeholder="Search for movies, TV shows..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#84f906" className="mt-10" />
        ) : (
          <FlatList
            ListHeaderComponent={<View className="h-4" />}
            data={results}
            keyExtractor={(item) => item.imdbId || item.title}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            ListEmptyComponent={() => (
              <View className="mt-20 items-center">
                {query.length > 0 ? (
                  <Text className="text-gray-500 font-lato text-lg">
                    No results found for "{query}"
                  </Text>
                ) : (
                  <View className="items-center opacity-50">
                    <Ionicons name="film-outline" size={64} color="#374151" />
                    <Text className="text-gray-600 font-lato mt-4 text-center">
                      Search for your favorite movies
                    </Text>
                  </View>
                )}
              </View>
            )}
            renderItem={({ item }) => (
              <Link href={`/movie/${item.imdbId || item.title}`} asChild>
                <TouchableOpacity className="w-[48%] mb-6">
                  <Image
                    source={{
                      uri:
                        item.imageSet?.verticalPoster?.w480 ||
                        "https://via.placeholder.com/300x450",
                    }}
                    className="w-full h-64 rounded-xl bg-gray-800"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-white font-bold mt-2 text-base font-lato"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-gray-400 text-xs font-lato">
                      {item.releaseYear}
                    </Text>
                    <Text className="text-gray-500 text-xs font-lato max-w-[70%]" numberOfLines={1}>
                      {item.genres?.map((g) => g.name).join(", ")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}