import { Movie } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface SearchResultsProps {
    results: Movie[];
    loading: boolean;
    onMoviePress: () => void;
}

export default function SearchResults({ results, loading, onMoviePress }: SearchResultsProps) {
    const { width } = Dimensions.get('window');
    const gap = 10;
    const padding = 20; // px-5 = 20px
    const cardWidth = (width - padding - gap) / 2;
    const cardHeight = cardWidth * 1.5;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00FF00" />
            </View>
        );
    }

    if (results.length === 0) {
        return (
            <View className="flex-1 justify-center items-center px-10">
                <Ionicons name="search" size={64} color="#333" />
                <Text className="text-gray-500 text-lg mt-4 text-center">No results found.</Text>
            </View>
        );
    }

    const renderGridItem = ({ item }: { item: Movie }) => (
        <Link href={`/details/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`} asChild>
            <TouchableOpacity onPress={onMoviePress} className="mb-4" style={{ width: cardWidth }}>
                <View
                    style={{ height: cardHeight }}
                    className="overflow-hidden bg-black border border-[#00FF00] relative"
                >
                    <Image
                        source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300x450' }}
                        className="w-full h-full opacity-80"
                        resizeMode="cover"
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                    />

                    {/* RATING Overlay - Top Right */}
                    {!!item.rating && (
                        <View className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded flex-row items-center border border-[#00FF00]/30">
                            <Ionicons name="star" size={10} color="#00FF00" style={{ marginRight: 2 }} />
                            <Text className="text-[#00FF00] font-mono text-[10px] font-bold">{item.rating.toFixed(1)}</Text>
                        </View>
                    )}

                    {/* Bottom Info */}
                    <View className="absolute bottom-1 left-1 right-1 flex-row justify-between items-end">
                        <Text
                            className="text-[#00FF00] font-mono text-[10px] font-bold uppercase tracking-wider flex-1 mr-1"
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>

                        {/* YEAR Badge */}
                        {!!item.releaseYear && (
                            <View className="bg-black/60 px-1 py-0.5 rounded border border-[#00FF00]/30 mb-[1px]">
                                <Text className="text-[#00FF00] font-mono text-[8px] font-bold">{item.releaseYear}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View className="flex-1 pt-4">
            <FlatList
                data={results}
                keyExtractor={(item) => item.imdbId}
                renderItem={renderGridItem}
                numColumns={2}
                key={2} // Force re-render
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
