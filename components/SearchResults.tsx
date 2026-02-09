import { Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface SearchResultsProps {
    results: Movie[];
    loading: boolean;
    viewMode: 'grid' | 'list';
    toggleViewMode: () => void;
    onMoviePress: () => void;
}

export default function SearchResults({ results, loading, viewMode, toggleViewMode, onMoviePress }: SearchResultsProps) {
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#84f906" />
            </View>
        );
    }

    if (results.length === 0) {
        return (
            <View className="flex-1 justify-center items-center px-10">
                <Ionicons name="search" size={64} color="#333" />
                <Text className="text-gray-500 text-lg mt-4 text-center">No results found. Try a different keyword.</Text>
            </View>
        );
    }

    const renderGridItem = ({ item }: { item: Movie }) => (
        <Link href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`} asChild>
            <TouchableOpacity onPress={onMoviePress} className="flex-1 m-2 mb-4">
                <Image
                    source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300x450' }}
                    className="w-full aspect-[2/3] rounded-xl bg-[#1E1E1E]"
                    resizeMode="cover"
                />
                <Text className="text-white text-sm font-semibold mt-2" numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
        </Link>
    );

    const renderListItem = ({ item }: { item: Movie }) => (
        <Link href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`} asChild>
            <TouchableOpacity onPress={onMoviePress} className="flex-row mb-4 bg-[#1E1E1E] rounded-xl overflow-hidden p-2">
                <Image
                    source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300x450' }}
                    className="w-16 h-24 rounded-lg bg-gray-800"
                    resizeMode="cover"
                />
                <View className="flex-1 ml-3 justify-center">
                    <Text className="text-white text-base font-bold mb-1">{item.title}</Text>
                    <Text className="text-primary text-xs">{item.releaseYear}</Text>
                    <Text className="text-gray-400 text-xs mt-1" numberOfLines={2}>{item.overview}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-5 mb-2 mt-2">
                <Text className="text-gray-400 text-sm">{results.length} results</Text>
                <TouchableOpacity onPress={toggleViewMode} className="flex-row items-center">
                    <Ionicons name={viewMode === 'grid' ? "list" : "grid"} size={18} color="#84f906" />
                    <Text className="text-primary ml-1 text-xs">{viewMode === 'grid' ? 'List' : 'Grid'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.imdbId}
                renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
                key={viewMode} // Force re-render on mode change
                numColumns={viewMode === 'grid' ? 2 : 1}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
            />
        </View>
    );
}
