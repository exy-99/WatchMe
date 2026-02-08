import { getMoviesByGenre, Movie } from '@/services/api';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface SmartGenreRowProps {
    title: string;
    genre: string;
}

const SmartGenreRow = ({ title, genre }: SmartGenreRowProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMovies = async (pageNum: number) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const newMovies = await getMoviesByGenre(genre, pageNum);

            if (newMovies.length === 0) {
                setHasMore(false);
            } else {
                setMovies(prev => [...prev, ...newMovies]);
            }
        } catch (error) {
            console.error(`Failed to load ${genre} page ${pageNum}`, error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadMovies(1);
    }, []);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadMovies(nextPage);
        }
    };

    // Chunk movies into pairs for double row layout
    // Split movies into two independent rows
    const row1Movies = movies.filter((_, i) => i % 2 === 0);
    const row2Movies = movies.filter((_, i) => i % 2 !== 0);

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

    if (loading && page === 1) {
        return (
            <View className="mb-8 h-[600px] justify-center">
                <Text className="text-2xl font-black text-white uppercase tracking-widest px-5 mb-4">{title}</Text>
                <ActivityIndicator size="small" color="#84f906" />
            </View>
        );
    }

    if (movies.length === 0) return null;

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center px-5 mb-4">
                <Text className="text-2xl font-black text-white uppercase tracking-widest">{title}</Text>
            </View>

            {/* Row 1 */}
            <View className="mb-6">
                <FlatList
                    horizontal
                    data={row1Movies}
                    renderItem={renderMovieItem}
                    keyExtractor={(item, index) => `${genre}-r1-${item.imdbId}-${index}`}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
            </View>

            {/* Row 2 */}
            <View>
                <FlatList
                    horizontal
                    data={row2Movies}
                    renderItem={renderMovieItem}
                    keyExtractor={(item, index) => `${genre}-r2-${item.imdbId}-${index}`}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="justify-center items-center w-[50px] h-full">
                                <ActivityIndicator size="small" color="#84f906" />
                            </View>
                        ) : null
                    }
                />
            </View>
        </View>
    );
};

export default SmartGenreRow;
