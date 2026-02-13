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
        <View className="px-5 py-4 flex-row items-center gap-3 bg-black">
            <View className="flex-1 flex-row items-center bg-black border border-[#00FF00] px-4 h-12">
                <Ionicons name="search" size={20} color="#00FF00" />
                <TextInput
                    className="flex-1 ml-3 text-[#00FF00] text-base font-medium tracking-wider"
                    placeholder="SEARCH MOVIES, SHOWS..."
                    placeholderTextColor="#005500"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")}>
                        <Ionicons name="close" size={20} color="#00FF00" />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                onPress={onFilterPress}
                className="w-12 h-12 bg-black border border-[#00FF00] justify-center items-center"
            >
                <Ionicons name="options" size={20} color="#00FF00" />
            </TouchableOpacity>
        </View>
    );
}
