import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GenreGridProps {
    onGenrePress: (genre: string) => void;
}

export default function GenreGrid({ onGenrePress }: GenreGridProps) {
    const genres = [
        "ACTION", "SCI-FI",
        "COMEDY", "DRAMA",
        "HORROR", "DOCUMENTARY"
    ];

    return (
        <View className="mb-8 px-5">
            <Text className="text-[#00FF00] font-bold text-lg mb-4 tracking-widest uppercase">Browse by Genre</Text>
            <View className="flex-row flex-wrap justify-between">
                {genres.map((genre) => (
                    <TouchableOpacity
                        key={genre}
                        onPress={() => onGenrePress(genre)}
                        className="w-[48%] h-24 mb-4 border border-[#00FF00] bg-black justify-center items-center active:bg-[#003300]"
                    >
                        <Text className="text-[#00FF00] font-bold text-lg tracking-widest">{genre}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
