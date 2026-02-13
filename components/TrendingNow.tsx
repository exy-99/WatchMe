import { getHeroMovies, Movie } from "@/services/api";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TrendingNow() {
    const [trending, setTrending] = useState<Movie[]>([]);

    useEffect(() => {
        getHeroMovies().then(setTrending);
    }, []);

    if (trending.length === 0) return null;

    return (
        <View className="mb-8 px-5">
            <Text className="text-[#00FF00] font-bold text-lg mb-4 tracking-widest uppercase">Trending Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {trending.map((item) => (
                    <Link
                        key={item.imdbId}
                        href={`/movie/${item.imdbId}?title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.imageSet?.verticalPoster?.w480 || '')}`}
                        asChild
                    >
                        <TouchableOpacity className="mr-4 w-[120px]">
                            <Image
                                source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300x450' }}
                                className="w-full h-[180px] border border-[#00FF00]/50"
                                resizeMode="cover"
                            />
                            {/* <Text className="text-gray-300 text-xs mt-2 text-center" numberOfLines={1}>{item.title}</Text> */}
                        </TouchableOpacity>
                    </Link>
                ))}
            </ScrollView>
        </View>
    );
}
