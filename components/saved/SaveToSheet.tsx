import { useCollectionsStore } from '@/store/collections';
import { MediaItem } from '@/types/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface SaveToSheetProps {
    visible: boolean;
    onClose: () => void;
    media: MediaItem;
}

export const SaveToSheet: React.FC<SaveToSheetProps> = ({ visible, onClose, media }) => {
    const { collections, createCollection, addItem, removeItem, isItemInCollection } = useCollectionsStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        createCollection(newTitle.trim());
        setNewTitle('');
        setIsCreating(false);
    };

    const toggleCollection = (collectionId: string) => {
        const isIn = isItemInCollection(collectionId, media.id);
        if (isIn) {
            removeItem(collectionId, media.id);
        } else {
            addItem(collectionId, media);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-end bg-black/50"
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="absolute inset-0" />
                </TouchableWithoutFeedback>

                <View className="bg-[#1a1a1a] rounded-t-3xl overflow-hidden border-t border-[#333] max-h-[70%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-[#333]">
                        <Text className="text-white text-lg font-bold">Save to...</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
                        {collections.map((collection) => {
                            const isSelected = isItemInCollection(collection.id, media.id);

                            return (
                                <TouchableOpacity
                                    key={collection.id}
                                    onPress={() => toggleCollection(collection.id)}
                                    className="flex-row items-center justify-between py-4 border-b border-[#2a2a2a]"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View className={`w-10 h-10 rounded-lg items-center justify-center ${isSelected ? 'bg-primary' : 'bg-[#333]'}`}>
                                            <Ionicons name={isSelected ? "bookmark" : "bookmark-outline"} size={20} color={isSelected ? "black" : "white"} />
                                        </View>
                                        <View>
                                            <Text className={`text-base font-medium ${isSelected ? 'text-primary' : 'text-gray-300'}`}>
                                                {collection.title}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {collection.items.length} items
                                            </Text>
                                        </View>
                                    </View>

                                    {isSelected && (
                                        <Ionicons name="checkbox" size={24} color="#84f906" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {/* Create New List */}
                        {!isCreating ? (
                            <TouchableOpacity
                                onPress={() => setIsCreating(true)}
                                className="flex-row items-center gap-3 py-6 mt-2"
                            >
                                <View className="w-10 h-10 rounded-lg bg-[#333] items-center justify-center border border-dashed border-gray-500">
                                    <Ionicons name="add" size={24} color="#84f906" />
                                </View>
                                <Text className="text-primary font-bold text-base">Create New List</Text>
                            </TouchableOpacity>
                        ) : (
                            <View className="mt-4 bg-[#222] p-4 rounded-xl border border-[#333]">
                                <Text className="text-gray-400 text-xs mb-2 uppercase font-bold">New Collection Name</Text>
                                <View className="flex-row gap-2">
                                    <TextInput
                                        className="flex-1 bg-[#111] text-white p-3 rounded-lg border border-[#333]"
                                        placeholder="e.g. Weekend Vibes"
                                        placeholderTextColor="#555"
                                        value={newTitle}
                                        onChangeText={setNewTitle}
                                        autoFocus
                                    />
                                    <TouchableOpacity
                                        onPress={handleCreate}
                                        disabled={!newTitle.trim()}
                                        className={`justify-center px-4 rounded-lg ${newTitle.trim() ? 'bg-primary' : 'bg-[#333]'}`}
                                    >
                                        <Ionicons name="arrow-forward" size={24} color={newTitle.trim() ? "black" : "#555"} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => setIsCreating(false)} className="mt-3">
                                    <Text className="text-gray-500 text-center text-xs">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
