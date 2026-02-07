import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const GENRES = [
    { id: "28", name: "Action", color: "#EF4444" },
    { id: "35", name: "Comedy", color: "#F59E0B" },
    { id: "27", name: "Horror", color: "#7C3AED" },
    { id: "10749", name: "Romance", color: "#EC4899" },
    { id: "878", name: "Sci-Fi", color: "#3B82F6" },
    { id: "53", name: "Thriller", color: "#10B981" },
    { id: "18", name: "Drama", color: "#6366F1" },
    { id: "12", name: "Adventure", color: "#F97316" },
];

interface GenreGridProps {
    onGenrePress: (genre: string) => void;
}

export default function GenreGrid({ onGenrePress }: GenreGridProps) {
    return (
        <View className="mb-6 px-4">
            <Text className="text-white text-lg font-bold font-lato mb-3">Browse by Genre</Text>

            <View className="flex-row flex-wrap justify-between">
                {GENRES.map((genre) => (
                    <TouchableOpacity
                        key={genre.id}
                        className="w-[48%] h-24 mb-3 rounded-xl p-3 flex justify-end"
                        style={{ backgroundColor: genre.color, opacity: 0.9 }}
                        onPress={() => onGenrePress(genre.name)}
                    >
                        <Text className="text-white font-bold text-lg font-lato shadow-sm">
                            {genre.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
