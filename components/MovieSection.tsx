import { Movie } from "@/services/api";
import { getRoute } from "@/services/simkl";
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import React from "react";
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface MovieSectionProps {
    title: string;
    movies: Movie[];
    variant?: 'standard' | 'large' | 'landscape';
    layout?: 'row' | 'grid' | 'double-scroll';
    mediaType?: 'movie' | 'show' | 'anime';
    categoryKey?: string;
}

export default function MovieSection({ title, movies, variant = 'standard', layout = 'row', mediaType = 'movie', categoryKey }: MovieSectionProps) {
    if (!movies || movies.length === 0) return null;

    const { width } = Dimensions.get('window');

    let cardWidth = width * 0.33; // Default standard (reduced from 0.35)
    let cardHeight = cardWidth * 1.5; // 2:3 ratio

    if (variant === 'large') {
        // MATCH REFERENCE: Larger posters -> ~43% width (reduced from 0.45)
        cardWidth = width * 0.43;
        cardHeight = cardWidth * 1.5;
    } else if (variant === 'landscape') {
        cardWidth = width * 0.66; // Reduced from 0.7
        cardHeight = cardWidth * (9 / 16);
    }

    // Grid Layout Overrides
    if (layout === 'grid') {
        const gap = 8;
        const padding = 40;

        if (variant === 'large') {
            // 3 columns for larger posters
            cardWidth = (width - padding - (gap * 2)) / 3;
        } else {
            // Default 5 columns
            cardWidth = (width - padding - (gap * 4)) / 5;
        }

        cardHeight = cardWidth * 1.5;
    }

    const renderCard = ({ item }: { item: Movie }) => (
        <Link href={getRoute(mediaType === 'show' ? 'tv' : mediaType, Number(item.imdbId)) as any} asChild>
            <TouchableOpacity style={{ width: cardWidth }} className="mr-0">
                <View
                    style={{ height: cardHeight }}
                    className="overflow-hidden bg-black border border-[#00FF41] relative" // Green border
                >
                    <Image
                        source={{
                            uri: variant === 'landscape'
                                ? (item.imageSet?.horizontalPoster?.w1080 || item.imageSet?.verticalPoster?.w480)
                                : (item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/150')
                        }}
                        className="w-full h-full opacity-80"
                        resizeMode="cover"
                    />

                    {/* Dark gradient overlay for text readability */}
                    <View className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/90 to-transparent" />

                    {/* RATING Overlay - Top Right */}
                    {!!item.rating && (
                        <View className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded flex-row items-center border border-[#00FF41]/30">
                            <Ionicons name="star" size={10} color="#00FF41" style={{ marginRight: 2 }} />
                            <Text className="text-[#00FF41] font-mono text-[10px] font-bold">{item.rating.toFixed(1)}</Text>
                        </View>
                    )}

                    {/* Internal Wrapper for Title and Year - Bottom */}
                    <View className="absolute bottom-2 left-2 right-2 flex-row justify-between items-center">
                        <Text
                            className="text-[#00FF41] font-mono text-[10px] font-bold uppercase tracking-wider flex-1 mr-2" // Green text
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>

                        {/* YEAR Badge - Next to Title */}
                        {!!item.releaseYear && (
                            <View className="bg-black/60 px-1.5 py-0.5 rounded border border-[#00FF41]/30">
                                <Text className="text-[#00FF41] font-mono text-[8px] font-bold">{item.releaseYear}</Text>
                            </View>
                        )}
                    </View>
                </View>
                {/* No external text */}
            </TouchableOpacity>
        </Link>
    );

    // Header Component
    const SectionHeader = () => {
        const router = useRouter();

        return (
            <View className="mb-4 px-5">
                <View className="flex-row items-center justify-between">
                    {/* Title with left bar */}
                    <View className="flex-row items-center">
                        <View className="w-1 h-6 bg-[#00FF41] mr-3" />
                        <Text className="text-xl font-bold text-white uppercase tracking-tighter font-mono">
                            {title.replace(/\s+/g, '_')}
                        </Text>
                    </View>

                    {/* View All Button */}
                    {categoryKey && (
                        <TouchableOpacity
                            onPress={() => router.push(`/category/${categoryKey}` as any)}
                            className="border border-[#005500] bg-[#001100] px-3 py-1 active:bg-[#002200]"
                        >
                            <Text className="text-[8px] text-[#00FF41] font-bold font-mono tracking-widest">VIEW_ALL</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    if (layout === 'double-scroll') {
        // Enforce 5 items per row exactly
        const firstRow = movies.slice(0, 5);
        const secondRow = movies.slice(5, 10);

        return (
            <View className="mb-10">
                <SectionHeader />
                <FlatList
                    data={firstRow}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
                    keyExtractor={(item) => `row1-${item.imdbId}`}
                    renderItem={renderCard}
                    className="mb-4"
                />
                <FlatList
                    data={secondRow}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
                    keyExtractor={(item) => `row2-${item.imdbId}`}
                    renderItem={renderCard}
                />
            </View>
        );
    }

    return (
        <View className="mb-10">
            <SectionHeader />
            {layout === 'grid' ? (
                <View className="px-5 flex-row flex-wrap justify-between">
                    {movies.slice(0, 10).map((item) => (
                        <React.Fragment key={item.imdbId}>
                            {renderCard({ item })}
                        </React.Fragment>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={movies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
                    keyExtractor={(item) => item.imdbId}
                    renderItem={renderCard}
                />
            )}
        </View>
    );
}
