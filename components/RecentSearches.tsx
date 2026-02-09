import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RecentSearchesProps {
    searches: string[];
    onSearchPress: (term: string) => void;
    onClearAll: () => void;
}

export default function RecentSearches({ searches, onSearchPress, onClearAll }: RecentSearchesProps) {
    if (searches.length === 0) return null;

    return (
        <View className="mb-8 px-5">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Recent Searches</Text>
                <TouchableOpacity onPress={onClearAll}>
                    <Text className="text-gray-400 text-xs">Clear All</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2">
                {searches.map((term, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSearchPress(term)}
                        className="flex-row items-center bg-[#1E1E1E] px-4 py-2 rounded-full border border-white/5"
                    >
                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                        <Text className="text-gray-300 text-sm ml-2 font-medium">{term}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
