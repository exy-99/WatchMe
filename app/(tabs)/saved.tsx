import { CollectionCard } from '@/components/saved/CollectionCard';
import { useCollectionsStore } from '@/store/collections';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedScreen() {
  const router = useRouter();
  const { collections, createCollection } = useCollectionsStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createCollection(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-4" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center py-4 mb-2">
        <Text className="text-3xl font-bold text-white font-serif">
          Collections
        </Text>
        <TouchableOpacity onPress={() => setIsCreating(!isCreating)}>
          <Ionicons name={isCreating ? "close-circle" : "add-circle"} size={32} color="#84f906" />
        </TouchableOpacity>
      </View>

      {/* Inline Creation Input */}
      {isCreating && (
        <View className="mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
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
        </View>
      )}

      {/* Grid of Collections */}
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => router.push({ pathname: '/saved/[id]', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Ionicons name="albums-outline" size={64} color="#333" />
            <Text className="text-gray-500 mt-4">No collections yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}