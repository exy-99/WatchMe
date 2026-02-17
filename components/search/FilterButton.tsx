import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface FilterButtonProps {
    onPress: () => void;
    hasActiveFilters: boolean;
}

export default function FilterButton({ onPress, hasActiveFilters }: FilterButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-12 h-12 bg-black border ${hasActiveFilters ? "border-[#00FF00]" : "border-[#333333]"
                } justify-center items-center relative overflow-visible`}
        >
            <Ionicons
                name="options-outline"
                size={24}
                color={hasActiveFilters ? "#00FF00" : "#FFFFFF"}
            />
            {hasActiveFilters && (
                <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00FF00] rounded-full" />
            )}
        </TouchableOpacity>
    );
}
