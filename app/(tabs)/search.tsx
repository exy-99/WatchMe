import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi",
  "Romance", "Thriller", "Fantasy", "Documentary", "Animation"
];

const RECENT_SEARCHES = [
  { id: '1', title: 'The Lighthouse', year: '2019', director: 'Robert Eggers', poster: 'https://image.tmdb.org/t/p/w200/3nk9UoepYmv1G9oP18q6JJCeYwN.jpg' },
  { id: '2', title: 'Midsommar', year: '2019', director: 'Ari Aster', poster: 'https://image.tmdb.org/t/p/w200/7LEI8ulZzO5gy9JghMDNGAfSrDT.jpg' },
  { id: '3', title: 'Blade Runner 2049', year: '2017', director: 'Denis Villeneuve', poster: 'https://image.tmdb.org/t/p/w200/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-white mb-4">Search</Text>

        {/* Search Input */}
        <View className="flex-row items-center bg-[#1E1E1E] rounded-xl px-4 py-3 border border-gray-800">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Search movies, shows, people..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Browse by Genre */}
        <View className="mt-6 px-5">
          <Text className="text-xl font-bold text-white mb-4">Browse by Genre</Text>
          <View className="flex-row flex-wrap gap-2">
            {GENRES.map((genre) => (
              <TouchableOpacity
                key={genre}
                className="bg-[#1E1E1E] px-4 py-2 rounded-full border border-gray-800"
              >
                <Text className="text-gray-300 font-medium">{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        <View className="mt-8 px-5 pb-10">
          <Text className="text-xl font-bold text-white mb-4">Recent Searches</Text>
          <View className="space-y-4">
            {RECENT_SEARCHES.map((item) => (
              <Link href={`/movie/${item.id}`} asChild key={item.id}>
                <TouchableOpacity className="flex-row items-center bg-[#1E1E1E] p-3 rounded-xl border border-gray-800 mb-3">
                  <Image
                    source={{ uri: item.poster }}
                    className="w-12 h-16 rounded bg-gray-700"
                    resizeMode="cover"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-bold text-lg">{item.title}</Text>
                    <Text className="text-gray-400 text-sm">{item.year} • {item.director}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#4B5563" />
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}