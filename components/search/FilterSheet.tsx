import { INITIAL_FILTERS, SearchFilters } from "@/types/filters";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterSheetProps {
    visible: boolean;
    onClose: () => void;
    currentFilters: SearchFilters;
    onApply: (filters: SearchFilters) => void;
}

const GENRES = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "Thriller", "War", "Western"
];

const FILTER_TYPES = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Anime", value: "anime" },
] as const;

const SORT_OPTIONS = [
    { label: "Relevance", value: "relevance" },
    { label: "Highest Rated", value: "rating" },
    { label: "Newest First", value: "newest" },
] as const;

export default function FilterSheet({
    visible,
    onClose,
    currentFilters,
    onApply,
}: FilterSheetProps) {
    const [draftFilters, setDraftFilters] = useState<SearchFilters>(currentFilters);

    useEffect(() => {
        if (visible) {
            setDraftFilters(currentFilters);
        }
    }, [visible, currentFilters]);

    const handleApply = () => {
        onApply(draftFilters);
        onClose();
    };

    const handleReset = () => {
        setDraftFilters(INITIAL_FILTERS);
    };

    const toggleGenre = (genre: string) => {
        setDraftFilters((prev) => {
            const exists = prev.genre.includes(genre);
            return {
                ...prev,
                genre: exists
                    ? prev.genre.filter((g) => g !== genre)
                    : [...prev.genre, genre],
            };
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/80 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="bg-[#111] w-full rounded-t-3xl overflow-hidden h-[80%] border-t border-[#333]">
                            <SafeAreaView edges={['bottom']} className="flex-1">
                                {/* Header */}
                                <View className="flex-row justify-between items-center px-5 py-4 border-b border-[#333]">
                                    <Text className="text-white text-lg font-bold">Filters</Text>
                                    <TouchableOpacity onPress={onClose}>
                                        <Ionicons name="close" size={24} color="#999" />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView className="flex-1 px-5 pt-4">
                                    {/* Type Section */}
                                    <View className="mb-6">
                                        <Text className="text-[#999] text-xs font-bold mb-3 uppercase tracking-wider">
                                            Type
                                        </Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {FILTER_TYPES.map((type) => {
                                                const isActive = draftFilters.type === type.value;
                                                return (
                                                    <TouchableOpacity
                                                        key={type.value}
                                                        onPress={() =>
                                                            setDraftFilters({ ...draftFilters, type: type.value })
                                                        }
                                                        className={`px-4 py-2 border rounded-full ${isActive
                                                                ? "bg-[#00FF00] border-[#00FF00]"
                                                                : "bg-black border-[#333]"
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`font-medium ${isActive ? "text-black" : "text-[#999]"
                                                                }`}
                                                        >
                                                            {type.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    {/* Sort Section */}
                                    <View className="mb-6">
                                        <Text className="text-[#999] text-xs font-bold mb-3 uppercase tracking-wider">
                                            Sort By
                                        </Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {SORT_OPTIONS.map((option) => {
                                                const isActive = draftFilters.sort === option.value;
                                                return (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        onPress={() =>
                                                            setDraftFilters({ ...draftFilters, sort: option.value })
                                                        }
                                                        className={`px-4 py-2 border rounded-full ${isActive
                                                                ? "bg-[#00FF00] border-[#00FF00]"
                                                                : "bg-black border-[#333]"
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`font-medium ${isActive ? "text-black" : "text-[#999]"
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    {/* Genre Section */}
                                    <View className="mb-8">
                                        <Text className="text-[#999] text-xs font-bold mb-3 uppercase tracking-wider">
                                            Genres
                                        </Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {GENRES.map((genre) => {
                                                const isActive = draftFilters.genre.includes(genre);
                                                return (
                                                    <TouchableOpacity
                                                        key={genre}
                                                        onPress={() => toggleGenre(genre)}
                                                        className={`px-3 py-1.5 border rounded border-[#333] mb-1 ${isActive ? "bg-[#00FF00]/20 border-[#00FF00]" : "bg-black"
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`text-sm ${isActive ? "text-[#00FF00] font-bold" : "text-[#ccc]"
                                                                }`}
                                                        >
                                                            {genre}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Footer Actions */}
                                <View className="px-5 py-4 border-t border-[#333] flex-row gap-4 bg-[#111]">
                                    <TouchableOpacity
                                        onPress={handleReset}
                                        className="flex-1 items-center justify-center py-3 rounded-lg border border-[#333]"
                                    >
                                        <Text className="text-white font-medium">Reset</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleApply}
                                        className="flex-1 items-center justify-center py-3 rounded-lg bg-[#00FF00]"
                                    >
                                        <Text className="text-black font-bold text-base">Apply Results</Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
