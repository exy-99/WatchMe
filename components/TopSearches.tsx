import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const TOP_SEARCHES = [
    "Avatar: The Way of Water",
    "The Last of Us",
    "Wednesday",
    "Top Gun: Maverick",
    "Stranger Things",
];

interface TopSearchesProps {
    onSearchPress: (term: string) => void;
}

export default function TopSearches({ onSearchPress }: TopSearchesProps) {
    return (
        <View className="mb-6 px-4">
            <Text className="text-white text-lg font-bold font-lato mb-3">Top Searches</Text>

            {TOP_SEARCHES.map((term, index) => (
                <TouchableOpacity
                    key={term}
                    className="flex-row items-center py-3 border-b border-gray-800"
                    onPress={() => onSearchPress(term)}
                >
                    <Text className="text-[#84f906] font-bold text-lg w-8 font-hennyPenny">
                        {index + 1}
                    </Text>
                    <Text className="text-gray-300 text-base font-lato flex-1">
                        {term}
                    </Text>
                    <Ionicons name="trending-up-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            ))}
        </View>
    );
}
