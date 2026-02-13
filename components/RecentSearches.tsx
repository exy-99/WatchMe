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
        <View className="mb-8 px-5 pt-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-[#00FF00] font-bold text-lg tracking-widest uppercase">Recent Searches</Text>
                <TouchableOpacity onPress={onClearAll}>
                    <Text className="text-[#00aa00] text-sm tracking-widest">Clear all</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-4">
                {searches.map((term, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSearchPress(term)}
                        className="flex-row items-center py-2 bg-transparent border-b border-[#00FF00]/10"
                    >
                        <Ionicons name="time-outline" size={20} color="#888" />
                        <Text className="text-gray-300 text-lg ml-4 font-normal tracking-wide">{term}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
