import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { fetchMoviesFromPath, Movie } from "@/services/api";
import { getRoute } from "@/services/simkl";
import ExternalLink from "./ExternalLink";
import MovieSection from "./MovieSection";
import SkeletonRow from "./SkeletonRow";

// Type definition for navigation props or similar if needed
type MediaFeedProps = {
    categoryKey: 'films' | 'series' | 'anime';
};

const CATEGORY_MAP = {
    films: {
        trending: '/movies/trending?interval=week',
        topRated: '/movies/trending?sort=rank',
        action: '/movies/genres/action/all-types/all-countries/all-years/rank',
        comedy: '/movies/genres/comedy/all-types/all-countries/all-years/rank',
        type: 'movie'
    },
    series: {
        trending: '/tv/trending?interval=week',
        topRated: '/tv/trending?sort=rank',
        action: '/tv/genres/action-adventure/all-types/all-countries/all-years/rank',
        comedy: '/tv/genres/comedy/all-types/all-countries/all-years/rank',
        type: 'show'
    },
    anime: {
        trending: '/anime/trending?interval=week',
        topRated: '/anime/trending?sort=rank',
        action: '/anime/genres/action/all-types/all-countries/all-years/rank',
        comedy: '/anime/genres/comedy/all-types/all-countries/all-years/rank',
        type: 'anime'
    }
};

export default function MediaFeed({ categoryKey }: MediaFeedProps) {
    const mediaType = CATEGORY_MAP[categoryKey].type as 'movie' | 'show' | 'anime';
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [contentRows, setContentRows] = useState<{
        topRated: Movie[];
        trending: Movie[];
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { width, height } = Dimensions.get('window');

    // Hero Height = 70% for immersive look
    const HERO_HEIGHT = height * 0.7;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Determine endpoints based on category
            const endpoints = CATEGORY_MAP[categoryKey];

            try {
                const [heroData, trendingData, topRatedData] = await Promise.all([
                    fetchMoviesFromPath(endpoints.trending), // Using trending for Hero
                    fetchMoviesFromPath(endpoints.trending), // Using trending for row 1
                    fetchMoviesFromPath(endpoints.topRated)  // Using topRated for row 2
                ]);

                setHeroMovies(heroData.slice(0, 5));
                setContentRows({
                    trending: trendingData,
                    topRated: topRatedData
                });
            } catch (error) {
                console.error("Failed to load media feed", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [categoryKey]);

    // Auto-Play Carousel
    useEffect(() => {
        if (heroMovies.length === 0) return;

        const intervalId = setInterval(() => {
            let nextIndex = currentHeaderIndex + 1;
            if (nextIndex >= Math.min(heroMovies.length, 5)) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentHeaderIndex(nextIndex);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [currentHeaderIndex, heroMovies]);

    const renderFeaturedItem = ({ item }: { item: Movie }) => (
        <View style={{ width: width, height: HERO_HEIGHT }}>
            <View className="flex-1 relative bg-[#000000]">
                <Image
                    source={{ uri: item.imageSet?.verticalPoster?.w720 || item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/720x1080' }}
                    className="w-full h-full opacity-60"
                    resizeMode="cover"
                />

                {/* Cyberpunk Gradient Overlay - Pure Black */}
                <LinearGradient
                    colors={['transparent', '#000000']}
                    locations={[0.4, 1]}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />

                {/* Top Scanline/Border */}
                <View className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#000000] to-transparent" />

                {/* Content Overlay */}
                <View className="absolute bottom-0 w-full px-5 pb-8 items-center">

                    {/* Dynamic Tag Box */}
                    <View className="border border-primary/30 bg-black/50 px-4 py-1.5 mb-6 backdrop-blur-sm">
                        <Text className="text-primary text-[10px] font-mono tracking-[0.2em] font-bold uppercase">
                            {item.genres?.slice(0, 3).map(g => g.name).join(' • ').toUpperCase() || 'CYBERPUNK • SCI-FI'}
                        </Text>
                    </View>

                    {/* Title with Glow Effect */}
                    <Text className="text-5xl font-black text-white text-center mb-6 font-mono tracking-tighter leading-tight italic"
                        style={{ textShadowColor: 'rgba(132, 249, 6, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>
                        {item.title.toUpperCase()}
                    </Text>

                    {/* Action Buttons - CUSTOM LAYOUT FROM IMAGE */}
                    <View className="flex-row items-start justify-between w-full max-w-md mb-10 px-4">

                        {/* My List */}
                        <View className="items-center">
                            <TouchableOpacity className="items-center justify-center w-16 h-16 border border-white/30 bg-black/40 rounded-lg mb-2">
                                <Ionicons name="add" size={30} color="white" />
                            </TouchableOpacity>
                            <Text className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">MY LIST</Text>
                        </View>

                        {/* Main Action - Green Block */}
                        <Link href={getRoute(mediaType === 'show' ? 'tv' : mediaType, Number(item.imdbId)) as any} asChild>
                            <TouchableOpacity className="bg-[#00FF41] w-56 h-16 flex-row items-center justify-center space-x-3 shadow-[0_0_60px_rgba(0,255,65,0.9)] rounded-sm border border-[#ccffcc]">
                                <Ionicons name="play-sharp" size={24} color="black" />
                                <Text className="text-black font-mono font-black text-lg tracking-[0.2em]">EXECUTE</Text>
                            </TouchableOpacity>
                        </Link>

                        {/* Details */}
                        <View className="items-center">
                            <TouchableOpacity className="items-center justify-center w-16 h-16 border border-white/30 bg-black/40 rounded-lg mb-2">
                                <Ionicons name="information-circle-outline" size={30} color="white" />
                            </TouchableOpacity>
                            <Text className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">DETAILS</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-[#000000]" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* HERO SECTION */}
            {loading ? (
                <View style={{ height: HERO_HEIGHT }} className="justify-center items-center bg-[#000000]">
                    <ActivityIndicator size="large" color="#84f906" />
                </View>
            ) : (
                <View style={{ height: HERO_HEIGHT }} className="mb-4">
                    <FlatList
                        ref={flatListRef}
                        data={heroMovies}
                        renderItem={renderFeaturedItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `featured-${item.imdbId}`}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width);
                            setCurrentHeaderIndex(index);
                        }}
                        getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                    />
                </View>
            )}

            {loading ? (
                <View className="pt-4">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                </View>
            ) : (
                contentRows && (
                    <View className="gap-8">
                        {/* TRENDING_NOW */}
                        <MovieSection
                            title="TRENDING_NOW"
                            movies={contentRows.trending}
                            variant="large"
                            layout="double-scroll"
                            mediaType={mediaType}
                        />

                        {/* TOP_RATED */}
                        <MovieSection
                            title="TOP_RATED"
                            movies={contentRows.topRated}
                            variant="large"
                            layout="double-scroll"
                            mediaType={mediaType}
                        />

                        {/* Smart Genre Rows - Simkl DOES NOT SUPPORT filtering 'trending' by genre directly easy way without specific endpoints.
                  The CATEGORY_MAP provided specific endpoints for action/comedy.
                  The user asked to use CATEGORY_MAP.
                  For Films/Series, existing approach using SmartGenreRow (which usually fetches by genre) might need adjustment if it calls `getMoviesByGenre`.
                  Wait, `SmartGenreRow` calls `getMoviesByGenre` internally usually.
                  I should check `SmartGenreRow` implementation. Assuming it calls `getMoviesByGenre`.
                  Actually, the user REQUESTED to use the API endpoints from CATEGORY_MAP.
                  So I should probably NOT use `SmartGenreRow` effectively unless I pass the data to it, OR I change `SmartGenreRow` to accept data, OR I just use `MovieSection` and fetch the data myself here.
                  
                  User instruction: 
                  "Inside <MediaFeed />, use `useEffect` to re-fetch data whenever `categoryKey` changes. Use `CATEGORY_MAP[categoryKey]` to get the correct endpoints."
                  
                  So I should fetch Action and Comedy here and pass to MovieSection?
                  The prompt says: "Extract my current movie list layout... into a new reusable component <MediaFeed />... re-fetch data... Use CATEGORY_MAP...".
                  
                  SmartGenreRow usually does its own fetching. If I want to stick to the plan strictly, I should likely fetch the data in MediaFeed and pass it to MovieSection, effectively replacing SmartGenreRow with MovieSection for these specific genres if SmartGenreRow is hardcoded to movies.
                  However, `SmartGenreRow` is used in the original `index.tsx`.
                  Ref:
                  <SmartGenreRow title="ACTION" genre="Action" ... />
                  
                  If I look at `SmartGenreRow` implementation (I haven't viewed it, but I see it in file list), I assume it calls `getMoviesByGenre`.
                  `getMoviesByGenre` in `api.ts` calls `/movies/genres/...`.
                  For "Series", it would need to call `/tv/genres/...`.
                  So `SmartGenreRow` is likely COUPLED to Movies.
                  
                  Therefore, I should fetch the genre data IN MediaFeed using the paths provided (action/comedy) and pass it to `MovieSection`. 
                  This is safer and consistent with "Use CATEGORY_MAP".
                  
              */}
                        {/* Fetching extra genre rows */}
                        <GenreSection categoryKey={categoryKey} genreKey="action" title="ACTION" />
                        <GenreSection categoryKey={categoryKey} genreKey="comedy" title="COMEDY" />
                    </View>
                )
            )}

            <ExternalLink
                url="https://simkl.com"
                text="SYSTEM_CORE: SIMKL"
                style={{ marginTop: 40, marginBottom: 40, alignSelf: 'center', opacity: 0.5 }}
            />
        </ScrollView>
    );
}

// Inner component to handle the specific genre fetching to avoid cluttering the main effect or avoid fetching everything at once if we want to be smarter, 
// BUT the user said "use useEffect to re-fetch data... Use CATEGORY_MAP". 
// I will include the fetching logic in the main component or a small sub-component.
// Let's do a sub component for clarity or just add to the main `Promise.all`.
// Adding to main `Promise.all` is easiest for "all at once loading" which is what user implies with "loading state triggers immediately".

function GenreSection({ categoryKey, genreKey, title }: { categoryKey: 'films' | 'series' | 'anime', genreKey: 'action' | 'comedy', title: string }) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const path = CATEGORY_MAP[categoryKey][genreKey];
            if (path) {
                const data = await fetchMoviesFromPath(path);
                setMovies(data);
            }
            setLoading(false);
        };
        load();
    }, [categoryKey, genreKey]);

    if (loading) return <SkeletonRow />;
    if (movies.length === 0) return null;

    const mediaType = CATEGORY_MAP[categoryKey].type as 'movie' | 'show' | 'anime';

    return (
        <MovieSection
            title={title}
            movies={movies}
            variant="large"
            layout="double-scroll"
            mediaType={mediaType}
        />
    );
}
