import { Movie } from '@/services/api';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface MovieSectionProps {
    title: string;
    movies: Movie[];
}

const MovieSection = ({ title, movies }: MovieSectionProps) => {
    if (!movies || movies.length === 0) return null;

    // Determine items per row based on total count to create balanced rows
    // If many movies, split into multiple independent rows
    const rows: Movie[][] = [];
    let itemsPerRow = movies.length;

    if (movies.length >= 24) {
        itemsPerRow = Math.ceil(movies.length / 3);
    } else if (movies.length >= 12) {
        itemsPerRow = Math.ceil(movies.length / 2);
    }

    for (let i = 0; i < movies.length; i += itemsPerRow) {
        rows.push(movies.slice(i, i + itemsPerRow));
    }

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <View className="mr-4 w-[180px]">
            <Link href={`/movie/${item.imdbId}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/200x300' }}
                        className="w-[180px] h-[270px] rounded-xl bg-[#1E1E1E]"
                        resizeMode="cover"
                    />
                    <Text className="text-base font-bold mt-2 text-white" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-sm text-primary mt-0.5">
                        {item.releaseYear}
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center px-5 mb-4">
                <Text className="text-2xl font-black text-white uppercase tracking-widest">{title}</Text>
            </View>

            {rows.map((rowMovies, index) => (
                <View key={`row-${index}`} className={index < rows.length - 1 ? "mb-6" : ""}>
                    <FlatList
                        horizontal
                        data={rowMovies}
                        renderItem={renderMovieItem}
                        keyExtractor={(item) => `item-${index}-${item.imdbId || item.title}`}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            ))}
        </View>
    );
};

export default MovieSection;
