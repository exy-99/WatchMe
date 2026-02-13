import { ActionBar } from '@/components/details/ActionBar';
import { HeroHeader } from '@/components/details/HeroHeader';
import { InfoGrid } from '@/components/details/InfoGrid';
import { getMovieDetails, getRoute } from '@/services/simkl';
import { Actor, MovieDetail, Recommendation } from '@/types/ui';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get('window');
const REC_POSTER_WIDTH = (width - 40 - 30) / 2.5; // ~2.5 items visible

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [synopsisExpanded, setSynopsisExpanded] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(false);
                const data = await getMovieDetails(Number(id));
                if (data) {
                    setMovie(data);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const toggleSynopsis = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSynopsisExpanded(!synopsisExpanded);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#E50914" />
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load movie details.</Text>
            </View>
        );
    }

    const renderCastItem = ({ item }: { item: Actor }) => (
        <View style={styles.castItem}>
            <Image
                source={{ uri: item.image }}
                style={styles.castImage}
                contentFit="cover"
            />
            <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.castRole} numberOfLines={1}>{item.role}</Text>
        </View>
    );

    const renderRecItem = ({ item }: { item: Recommendation }) => (
        <TouchableOpacity
            style={styles.recItem}
            onPress={() => router.push(getRoute('movie', item.id) as any)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.poster }}
                style={styles.recPoster}
                contentFit="cover"
                transition={300}
            />
            <Text style={styles.recTitle} numberOfLines={2}>{item.title}</Text>
            {item.year && <Text style={styles.recYear}>{item.year}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Header */}
                <HeroHeader media={movie} />

                {/* Action Bar */}
                <ActionBar media={movie} mediaType="movie" />

                {/* Content Body */}
                <View style={styles.body}>

                    {/* Tagline */}
                    {movie.tagline ? (
                        <Text style={styles.tagline}>"{movie.tagline}"</Text>
                    ) : null}

                    {/* Synopsis */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Synopsis</Text>
                        <Text
                            style={styles.synopsisText}
                            numberOfLines={synopsisExpanded ? undefined : 4}
                        >
                            {movie.overview || "No synopsis available."}
                        </Text>
                        {movie.overview && movie.overview.length > 150 && (
                            <TouchableOpacity onPress={toggleSynopsis}>
                                <Text style={styles.readMore}>
                                    {synopsisExpanded ? "Show Less" : "Read More"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Info Grid */}
                    <View style={styles.section}>
                        <InfoGrid
                            director={movie.director}
                            budget={movie.budget}
                            revenue={movie.revenue}
                            year={movie.year}
                        />
                    </View>

                    {/* Cast */}
                    {movie.cast.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Cast</Text>
                            <FlatList
                                horizontal
                                data={movie.cast}
                                renderItem={renderCastItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}

                    {/* Recommendations */}
                    {movie.recommendations.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recommendations</Text>
                            <FlatList
                                horizontal
                                data={movie.recommendations}
                                renderItem={renderRecItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}

                    {/* Bottom padding */}
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    center: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
    },
    body: {
        padding: 20,
    },
    tagline: {
        color: '#d1d5db',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 10,
        lineHeight: 24,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    synopsisText: {
        color: '#d1d5db',
        fontSize: 14,
        lineHeight: 22,
    },
    readMore: {
        color: '#E50914',
        marginTop: 8,
        fontWeight: '600',
    },
    // Cast
    castItem: {
        marginRight: 16,
        width: 80,
        alignItems: 'center',
    },
    castImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
        backgroundColor: '#333',
    },
    castName: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    castRole: {
        color: '#9ca3af',
        fontSize: 10,
        textAlign: 'center',
    },
    // Recommendations
    recItem: {
        width: REC_POSTER_WIDTH,
        marginRight: 12,
    },
    recPoster: {
        width: REC_POSTER_WIDTH,
        height: REC_POSTER_WIDTH * 1.5,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
        marginBottom: 8,
    },
    recTitle: {
        color: '#d1d5db',
        fontSize: 12,
        fontWeight: '500',
    },
    recYear: {
        color: '#6b7280',
        fontSize: 11,
        marginTop: 2,
    },
});
