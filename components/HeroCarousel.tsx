import { Movie } from "@/services/api";
import { getRoute } from "@/services/simkl";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface HeroCarouselProps {
    items: Movie[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { width, height } = Dimensions.get('window');
    const HERO_HEIGHT = height * 0.7;

    // Auto-Play
    useEffect(() => {
        if (items.length === 0) return;

        const intervalId = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 8000); // 8 seconds per slide

        return () => clearInterval(intervalId);
    }, [currentIndex, items]);

    const renderItem = ({ item }: { item: Movie }) => {
        const mediaType = 'movie';

        const handlePress = () => {
            const route = getRoute(mediaType, Number(item.imdbId));
            router.push(route as any);
        };

        return (
            <View style={{ width: width, height: HERO_HEIGHT }}>
                <View className="flex-1 relative bg-[#000000]">
                    <Image
                        source={{ uri: item.imageSet?.verticalPoster?.w720 || item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/720x1080' }}
                        className="w-full h-full opacity-60"
                        resizeMode="cover"
                    />

                    {/* Cyberpunk Gradient Overlay - Pure Black */}
                    <LinearGradient
                        colors={['transparent', '#000000']}
                        locations={[0.4, 1]}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />

                    {/* Top Scanline/Border */}
                    <View className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#000000] to-transparent" />

                    {/* Content Overlay */}
                    <View className="absolute bottom-0 w-full px-5 pb-12 justify-end">

                        {/* Title with Glow Effect - Left Aligned */}
                        <Text className="text-5xl font-black text-white text-left mb-2 font-mono tracking-tighter leading-tight italic"
                            style={{ textShadowColor: 'rgba(132, 249, 6, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>
                            {item.title.toUpperCase()}
                        </Text>

                        {/* Tags / Metadata - Clean Text, No Box */}
                        <View className="flex-row items-center mb-6">
                            <Text className="text-[#00FF41] text-xs font-mono tracking-widest font-bold uppercase mr-2">
                                {item.releaseYear}
                            </Text>
                            {/* Separator */}
                            <View className="w-1 h-1 rounded-full bg-gray-400 mr-2" />

                            <Text className="text-gray-300 text-xs font-mono tracking-widest font-bold uppercase shadow-black drop-shadow-md">
                                {item.genres?.slice(0, 3).map(g => g.name).join(' • ').toUpperCase() || 'SCI-FI • ACTION'}
                            </Text>
                        </View>

                        {/* Action Buttons - Left Aligned */}
                        <View className="flex-row items-center justify-start w-full gap-5">

                            {/* Main Action - Green Block */}
                            <TouchableOpacity
                                onPress={handlePress}
                                className="w-40 h-14 bg-[#00FF41] flex-row items-center justify-center space-x-2 shadow-[0_0_30px_rgba(0,255,65,0.5)] rounded-sm border border-[#ccffcc] active:scale-95 transition-transform"
                            >
                                <Ionicons name="play-sharp" size={24} color="black" />
                                <Text className="text-black font-mono font-black text-lg tracking-[0.1em]">WATCH</Text>
                            </TouchableOpacity>

                            {/* My List */}
                            <View className="items-center">
                                <TouchableOpacity className="items-center justify-center w-14 h-14 border border-white/20 bg-black/40 rounded-lg active:bg-white/10">
                                    <Ionicons name="add" size={28} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Details */}
                            <View className="items-center">
                                <TouchableOpacity
                                    onPress={handlePress}
                                    className="items-center justify-center w-14 h-14 border border-white/20 bg-black/40 rounded-lg active:bg-white/10"
                                >
                                    <Ionicons name="information-circle-outline" size={28} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (!items || items.length === 0) return null;

    return (
        <View style={{ height: HERO_HEIGHT }} className="mb-4">
            <FlatList
                ref={flatListRef}
                data={items}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `hero-${item.imdbId}-${index}`}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            />
        </View>
    );
}
