import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RecentSearchesProps {
    searches: string[];
    onSearchPress: (term: string) => void;
    onClearAll: () => void;
}

export default function RecentSearches({
    searches,
    onSearchPress,
    onClearAll,
}: RecentSearchesProps) {
    if (searches.length === 0) return null;

    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3 px-4">
                <Text className="text-white text-lg font-bold font-lato">Recent Searches</Text>
                <TouchableOpacity onPress={onClearAll}>
                    <Text className="text-[#84f906] text-sm font-lato">Clear All</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap px-4 gap-2">
                {searches.map((term, index) => (
                    <TouchableOpacity
                        key={`${term}-${index}`}
                        className="flex-row items-center bg-[#1E1E1E] px-3 py-2 rounded-full border border-gray-800"
                        onPress={() => onSearchPress(term)}
                    >
                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                        <Text className="text-gray-300 ml-2 font-lato">{term}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
