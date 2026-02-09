import { getGenres } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GenreGridProps {
    onGenrePress: (genre: string) => void;
}

export default function GenreGrid({ onGenrePress }: GenreGridProps) {
    const [genres, setGenres] = useState<string[]>([]);

    useEffect(() => {
        getGenres().then(setGenres);
    }, []);

    const colors = [
        ['#FF0055', '#FF0000'],
        ['#0055FF', '#0000FF'],
        ['#00FF55', '#00FF00'],
        ['#FF5500', '#FF0000'],
        ['#5500FF', '#0000FF'],
        ['#FFFF00', '#FFCC00'],
    ];

    return (
        <View className="mb-8 px-5">
            <Text className="text-white font-bold text-lg mb-4">Browse by Genre</Text>
            <View className="flex-row flex-wrap justify-between">
                {genres.slice(0, 6).map((genre, index) => (
                    <TouchableOpacity
                        key={genre}
                        onPress={() => onGenrePress(genre)}
                        className="w-[48%] h-24 mb-4 rounded-xl overflow-hidden relative"
                    >
                        <LinearGradient
                            colors={colors[index % colors.length] as [string, string]}
                            className="w-full h-full justify-center items-center opacity-80"
                        />
                        <View className="absolute inset-0 justify-center items-center bg-black/20">
                            <Text className="text-white font-bold text-lg">{genre}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
