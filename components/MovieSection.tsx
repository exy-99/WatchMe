import { Movie } from "@/services/api";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface MovieSectionProps {
    title: string;
    movies: Movie[];
    variant?: 'standard' | 'large' | 'landscape';
}

export default function MovieSection({ title, movies, variant = 'standard' }: MovieSectionProps) {
    if (!movies || movies.length === 0) return null;

    const { width } = Dimensions.get('window');

    let cardWidth = width * 0.35; // Default standard
    let cardHeight = cardWidth * 1.5; // 2:3 ratio

    if (variant === 'large') {
        cardWidth = width * 0.45;
        cardHeight = cardWidth * 1.5;
    } else if (variant === 'landscape') {
        cardWidth = width * 0.7;
        cardHeight = cardWidth * (9 / 16);
    }

    return (
        <View className="mb-8">
            <View className="flex-row items-center mb-4 px-5">
                <View className="w-1 h-6 bg-primary mr-3 rounded-full" />
                <Text className="text-xl font-bold text-white uppercase tracking-wider">
                    {title}
                </Text>
            </View>

            <FlatList
                data={movies}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                keyExtractor={(item) => item.imdbId}
                renderItem={({ item }) => (
                    <Link href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`} asChild>
                        <TouchableOpacity style={{ width: cardWidth }}>
                            <View
                                style={{ height: cardHeight }}
                                className="rounded-xl overflow-hidden bg-gray-800 border border-white/10 shadow-lg shadow-black/50"
                            >
                                <Image
                                    source={{
                                        uri: variant === 'landscape'
                                            ? (item.imageSet?.horizontalPoster?.w1080 || item.imageSet?.verticalPoster?.w480)
                                            : (item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/150')
                                    }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <Text
                                className={`text-gray-200 font-semibold mt-2 ${variant === 'large' ? 'text-sm' : 'text-xs'}`}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
}
