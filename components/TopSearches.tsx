import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopSearchesProps {
    onSearchPress: (term: string) => void;
}

export default function TopSearches({ onSearchPress }: TopSearchesProps) {
    const topSearches = ["Avatar", "Batman", "Spider-man", "Inception", "Interstellar"];

    return (
        <View className="px-5 pb-8">
            <Text className="text-white font-bold text-lg mb-4">Top Searches</Text>
            {topSearches.map((term, index) => (
                <TouchableOpacity
                    key={term}
                    onPress={() => onSearchPress(term)}
                    className="flex-row items-center py-4 border-b border-white/5"
                >
                    <Text className="text-primary font-bold mr-4 text-lg">{index + 1}</Text>
                    <Text className="text-gray-300 text-base flex-1">{term}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#4B5563" />
                </TouchableOpacity>
            ))}
        </View>
    );
}
