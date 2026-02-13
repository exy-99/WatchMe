import { isMovie, MediaItem } from '@/types/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeroHeaderProps {
    media: MediaItem;
}

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 450;

export const HeroHeader: React.FC<HeroHeaderProps> = ({ media }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 800 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    const posterUri = media.poster || media.fanart;
    const fanartUri = media.fanart || media.poster;

    return (
        <View style={styles.container}>
            {/* Background Fanart */}
            <ImageBackground
                source={{ uri: fanartUri }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    <LinearGradient
                        colors={['transparent', '#000000']}
                        style={styles.gradient}
                        start={{ x: 0.5, y: 0.2 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                </Animated.View>
            </ImageBackground>

            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { top: insets.top + 10 }]}
                onPress={() => router.back()}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Poster */}
                <Image
                    source={{ uri: posterUri }}
                    style={styles.poster}
                    contentFit="cover"
                    transition={500}
                />

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>{media.title}</Text>

                    <View style={styles.metaRow}>
                        {media.year ? (
                            <Text style={styles.year}>{media.year}</Text>
                        ) : null}
                        {media.rating ? (
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{media.rating.toFixed(1)}</Text>
                            </View>
                        ) : null}
                        {/* Movie-specific: runtime badge */}
                        {isMovie(media) && media.runtime !== 'N/A' && (
                            <View style={styles.runtimeBadge}>
                                <Text style={styles.runtimeText}>{media.runtime}</Text>
                            </View>
                        )}
                        {/* Series-specific: status badge */}
                        {!isMovie(media) && media.status && (
                            <Text style={styles.status}>{media.status}</Text>
                        )}
                    </View>

                    <Text style={styles.genres} numberOfLines={1}>
                        {media.genres.join(' • ')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT,
        width: width,
        position: 'relative',
        justifyContent: 'flex-end',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: HEADER_HEIGHT,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    contentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'flex-end',
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 12,
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        paddingBottom: 8,
    },
    title: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        flexWrap: 'wrap',
        gap: 8,
    },
    year: {
        color: '#d1d5db',
        fontSize: 14,
        fontWeight: '600',
    },
    ratingBadge: {
        backgroundColor: '#F5C518',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    ratingText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    runtimeBadge: {
        backgroundColor: 'rgba(229, 9, 20, 0.8)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    runtimeText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    status: {
        color: '#4ade80',
        fontSize: 12,
        fontWeight: '600',
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    genres: {
        color: '#9ca3af',
        fontSize: 13,
        fontWeight: '500',
    },
});
