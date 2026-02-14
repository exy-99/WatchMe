import { CATEGORY_MAP } from "@/constants/Categories";
import { Movie, fetchMoviesFromPath } from "@/services/api";
import { getRoute } from "@/services/simkl";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const config = id ? CATEGORY_MAP[id] : null;

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { width } = Dimensions.get('window');
    const gap = 5;
    const padding = 5;
    const numColumns = 3;
    const cardWidth = (width - (padding * 2) - (gap * (numColumns - 1))) / numColumns;
    const cardHeight = cardWidth * 1.5;

    const loadMovies = async (pageNum: number, shouldReset = false) => {
        if (!config || loading || (!hasMore && !shouldReset)) return;

        setLoading(true);
        try {
            // Add page param to existing params
            const params = {
                ...config.params,
                page: pageNum,
                limit: 20 // Ensure limit is explicit
            };

            const newMovies = await fetchMoviesFromPath(config.endpoint, params);

            if (shouldReset) {
                setMovies(newMovies);
            } else {
                // Filter out duplicates just in case
                setMovies(prev => {
                    const existingIds = new Set(prev.map(m => m.imdbId));
                    const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.imdbId));
                    return [...prev, ...uniqueNewMovies];
                });
            }

            if (newMovies.length < 20) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load category movies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (config) {
            setPage(1);
            setHasMore(true);
            loadMovies(1, true);
        }
    }, [id]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadMovies(nextPage);
        }
    };

    const renderCard = ({ item }: { item: Movie }) => (
        <Link href={getRoute(config?.type === 'show' ? 'tv' : (config?.type || 'movie'), Number(item.imdbId)) as any} asChild>
            <TouchableOpacity style={{ width: cardWidth, marginBottom: gap }}>
                <View
                    style={{ height: cardHeight }}
                    className="overflow-hidden bg-black border border-[#00FF41] relative rounded-sm"
                >
                    <Image
                        source={{ uri: item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300' }}
                        className="w-full h-full opacity-80"
                        resizeMode="cover"
                    />

                    {/* Rating Badge */}
                    {!!item.rating && (
                        <View className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded flex-row items-center border border-[#00FF41]/30">
                            <Ionicons name="star" size={8} color="#00FF41" style={{ marginRight: 2 }} />
                            <Text className="text-[#00FF41] font-mono text-[8px] font-bold">{item.rating.toFixed(1)}</Text>
                        </View>
                    )}

                    {/* Gradient Overlay */}
                    <View className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <View className="absolute bottom-2 left-2 right-2">
                        <Text className="text-[#00FF41] font-mono text-[10px] font-bold uppercase truncate" numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!!item.releaseYear && (
                            <Text className="text-gray-400 font-mono text-[8px] font-bold mt-0.5">{item.releaseYear}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );

    if (!config) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white font-mono">Category not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-white/10 bg-black z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
                    <Ionicons name="arrow-back" size={24} color="#00FF41" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white uppercase font-mono tracking-tighter flex-1">
                    {config.title}
                </Text>
            </View>

            <FlatList
                data={movies}
                renderItem={renderCard}
                keyExtractor={(item, index) => `${item.imdbId}-${index}`}
                numColumns={numColumns}
                columnWrapperStyle={{ gap: gap }}
                contentContainerStyle={{ padding: padding, paddingBottom: 100 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color="#00FF41" />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
