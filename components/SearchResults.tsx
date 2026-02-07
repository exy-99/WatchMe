import { Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SearchResultsProps {
    results: Movie[];
    loading: boolean;
    viewMode: "grid" | "list";
    toggleViewMode: () => void;
    onMoviePress: (movie: Movie) => void;
}

export default function SearchResults({
    results,
    loading,
    viewMode,
    toggleViewMode,
    onMoviePress,
}: SearchResultsProps) {
    const router = useRouter();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center mt-20">
                <ActivityIndicator size="large" color="#84f906" />
                <Text className="text-gray-500 mt-4 font-lato">Searching...</Text>
            </View>
        );
    }

    if (results.length === 0) {
        return (
            <View className="flex-1 justify-center items-center mt-20 opacity-70">
                <Ionicons name="film-outline" size={80} color="#374151" />
                <Text className="text-gray-400 font-bold text-xl mt-4 font-lato">
                    No Results Found
                </Text>
                <Text className="text-gray-600 font-lato mt-2 text-center px-10">
                    Check your spelling or try a different keyword.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 px-4">
            {/* Visual Toggle */}
            <View className="flex-row justify-end mb-4">
                <TouchableOpacity
                    onPress={toggleViewMode}
                    className="flex-row items-center bg-[#1E1E1E] px-3 py-1.5 rounded-lg border border-gray-800"
                >
                    <Ionicons
                        name={viewMode === "grid" ? "list-outline" : "grid-outline"}
                        size={18}
                        color="#84f906"
                    />
                    <Text className="text-gray-300 ml-2 font-lato text-sm">
                        {viewMode === "grid" ? "List View" : "Grid View"}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                key={viewMode} // Force re-render when switching columns
                data={results}
                keyExtractor={(item) => item.imdbId || item.title}
                showsVerticalScrollIndicator={false}
                numColumns={viewMode === "grid" ? 2 : 1}
                columnWrapperStyle={viewMode === "grid" ? { justifyContent: "space-between" } : undefined}
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className={viewMode === "grid" ? "w-[48%] mb-6" : "w-full flex-row mb-4 bg-[#1E1E1E] rounded-xl overflow-hidden"}
                        activeOpacity={0.7}
                        onPress={() => {
                            onMoviePress(item);
                            router.push(`/movie/${item.imdbId || item.title}`);
                        }}
                    >
                        {/* Poster Image */}
                        <Image
                            source={{
                                uri:
                                    item.imageSet?.verticalPoster?.w480 ||
                                    "https://via.placeholder.com/300x450",
                            }}
                            className={viewMode === "grid" ? "w-full h-64 rounded-xl bg-gray-800" : "w-24 h-36 bg-gray-800"}
                            resizeMode="cover"
                        />

                        {/* Content */}
                        <View className={viewMode === "grid" ? "mt-2" : "flex-1 p-3 justify-center"}>
                            <Text
                                className={`text-white font-bold font-lato ${viewMode === "grid" ? "text-base" : "text-lg"}`}
                                numberOfLines={viewMode === "grid" ? 1 : 2}
                            >
                                {item.title}
                            </Text>

                            <View className="flex-row items-center mt-1">
                                <Text className="text-[#84f906] text-xs font-bold mr-2">
                                    {item.releaseYear}
                                </Text>
                                {viewMode === "list" && (
                                    <Text className="text-gray-500 text-xs font-lato flex-1" numberOfLines={1}>
                                        {item.genres?.map((g) => g.name).join(", ")}
                                    </Text>
                                )}
                            </View>

                            {viewMode === "grid" && (
                                <Text className="text-gray-500 text-xs font-lato mt-0.5" numberOfLines={1}>
                                    {item.genres?.map((g) => g.name).join(", ")}
                                </Text>
                            )}

                            {viewMode === "list" && (
                                <Text className="text-gray-400 text-sm font-lato mt-2 line-clamp-2" numberOfLines={2}>
                                    {item.overview}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
