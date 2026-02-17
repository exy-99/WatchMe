import { useCollectionsStore } from '@/store/collections';
import { MediaItem } from '@/types/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { collections, deleteCollection, removeItem } = useCollectionsStore();

    const collection = useMemo(() =>
        collections.find((c) => c.id === id),
        [collections, id]
    );

    if (!collection) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white text-lg">Collection not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-primary">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleDeleteCollection = () => {
        Alert.alert(
            "Delete Collection",
            `Are you sure you want to delete "${collection.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteCollection(collection.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const renderRightActions = (itemId: number) => {
        return (
            <TouchableOpacity
                onPress={() => removeItem(collection.id, itemId)}
                className="bg-red-600 justify-center items-center w-20 h-full"
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }: { item: MediaItem }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    if ('budget' in item) {
                        router.push(`/details/movie/${item.id}`);
                    } else {
                        router.push(`/details/show/${item.id}`);
                    }
                }}
                className="flex-row items-center bg-[#111] mb-1 p-2"
            >
                <Image
                    source={{ uri: item.poster }}
                    className="w-16 h-24 rounded-md"
                    contentFit="cover"
                />
                <View className="flex-1 ml-4 justify-center">
                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-gray-400">{item.year}</Text>
                    {'rating' in item && (
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="star" size={14} color="#e5e5e5" />
                            <Text className="text-gray-300 text-xs ml-1">{item.rating?.toFixed(1)}</Text>
                        </View>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#222]">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold font-serif" numberOfLines={1}>
                    {collection.title}
                </Text>
                {!collection.isDefault ? (
                    <TouchableOpacity onPress={handleDeleteCollection}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    </TouchableOpacity>
                ) : (
                    <View className="w-6" /> // spacer
                )}
            </View>

            {/* List */}
            <FlatList
                data={collection.items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20">
                        <Text className="text-gray-500">No items in this collection.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
