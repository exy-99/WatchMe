import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchHeaderProps {
    query: string;
    setQuery: (text: string) => void;
    onFilterPress?: () => void;
    onSubmitEditing?: () => void;
}

export default function SearchHeader({
    query,
    setQuery,
    onFilterPress,
    onSubmitEditing,
}: SearchHeaderProps) {
    return (
        <View className="flex-row items-center px-4 py-4 bg-[#121212] z-50">
            {/* Search Input Container */}
            <View className="flex-1 flex-row items-center bg-[#1E1E1E] rounded-full px-4 py-3 border border-gray-800">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-3 text-white text-base font-lato"
                    placeholder="Search movies, shows, actors..."
                    placeholderTextColor="#9CA3AF"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={onSubmitEditing}
                    autoCapitalize="none"
                    returnKeyType="search"
                />

                {/* Buttons inside input: Clear & Mic */}
                <View className="flex-row items-center space-x-2">
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery("")}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}

                </View>
            </View>

            {/* Filter Button */}
            <TouchableOpacity
                className="ml-4 bg-[#1E1E1E] w-12 h-12 rounded-full items-center justify-center border border-gray-800"
                onPress={onFilterPress}
            >
                <Ionicons name="options-outline" size={24} color="#84f906" />
            </TouchableOpacity>
        </View>
    );
}
