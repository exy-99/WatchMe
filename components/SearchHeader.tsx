import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchHeaderProps {
    query: string;
    setQuery: (text: string) => void;
    onSubmitEditing: () => void;
    onFilterPress: () => void;
}

export default function SearchHeader({ query, setQuery, onSubmitEditing, onFilterPress }: SearchHeaderProps) {
    return (
        <View className="px-5 py-3 flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-[#1E1E1E] border border-white/10 rounded-xl px-4 h-12">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-3 text-white text-base font-medium"
                    placeholder="Search movies, shows..."
                    placeholderTextColor="#6B7280"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                onPress={onFilterPress}
                className="w-12 h-12 bg-[#1E1E1E] border border-white/10 rounded-xl justify-center items-center"
            >
                <Ionicons name="options" size={20} color="#84f906" />
            </TouchableOpacity>
        </View>
    );
}
