import { Collection } from '@/types/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CollectionCardProps {
    collection: Collection;
    onPress: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress }) => {
    const items = collection.items || [];
    const itemCount = items.length;

    const renderCover = () => {
        if (itemCount === 0) {
            return (
                <View className="w-full h-full bg-gray-800 items-center justify-center">
                    <Ionicons name="film-outline" size={32} color="#6b7280" />
                </View>
            );
        }

        if (itemCount === 1) {
            const item = items[0];
            const poster = item.poster;
            return (
                <Image
                    source={{ uri: poster }}
                    className="w-full h-full"
                    contentFit="cover"
                    transition={500}
                />
            );
        }

        // 4+ items: Show 2x2 grid (take first 4)
        // 2 or 3 items: Still show grid, but some slots might be empty or we repeat?
        // Requirement says: "If 4+ items: Arrange them in a 2x2 grid."
        // It's ambiguous for 2 or 3. I'll just show the first 4 in a grid, even if less than 4 (empty slots).
        const gridItems = items.slice(0, 4);

        return (
            <View className="flex-row flex-wrap w-full h-full">
                <View className="w-1/2 h-1/2 p-0.5">
                    {gridItems[0] && <Image source={{ uri: gridItems[0].poster }} className="w-full h-full rounded-tl-lg" contentFit="cover" />}
                </View>
                <View className="w-1/2 h-1/2 p-0.5">
                    {gridItems[1] && <Image source={{ uri: gridItems[1].poster }} className="w-full h-full rounded-tr-lg" contentFit="cover" />}
                </View>
                <View className="w-1/2 h-1/2 p-0.5">
                    {gridItems[2] && <Image source={{ uri: gridItems[2].poster }} className="w-full h-full rounded-bl-lg" contentFit="cover" />}
                </View>
                <View className="w-1/2 h-1/2 p-0.5">
                    {gridItems[3] && <Image source={{ uri: gridItems[3].poster }} className="w-full h-full rounded-br-lg" contentFit="cover" />}
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="w-[48%] mb-4 bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333]"
        >
            {/* Cover Art Area */}
            <View className="h-40 w-full bg-[#111]">
                {renderCover()}
            </View>

            {/* Meta Info */}
            <View className="p-3">
                <Text className="text-white font-bold text-base truncate" numberOfLines={1}>
                    {collection.title}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
            </View>

            {/* Default Badge */}
            {collection.isDefault && (
                <View className="absolute top-2 right-2 bg-primary/80 px-2 py-0.5 rounded-full">
                    <Text className="text-black text-[10px] font-bold">DEFAULT</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
