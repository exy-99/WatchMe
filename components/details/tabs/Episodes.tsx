import { Episode, SeriesDetail } from '@/types/ui';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EpisodesProps {
    series: SeriesDetail;
}

export const Episodes: React.FC<EpisodesProps> = ({ series }) => {
    // Determine available seasons
    const seasons = useMemo(() => {
        return Object.keys(series.seasons).map(Number).sort((a, b) => a - b);
    }, [series.seasons]);

    const [activeSeason, setActiveSeason] = useState<number>(seasons[0] || 1);

    const episodes = series.seasons[activeSeason] || [];

    const renderSeasonPill = (season: number) => (
        <TouchableOpacity
            key={season}
            onPress={() => setActiveSeason(season)}
            style={[styles.seasonPill, activeSeason === season && styles.activeSeasonPill]}
        >
            <Text style={[styles.seasonText, activeSeason === season && styles.activeSeasonText]}>
                Season {season}
            </Text>
        </TouchableOpacity>
    );

    const renderEpisodeItem = ({ item }: { item: Episode }) => (
        <View style={styles.episodeCard}>
            <View style={styles.thumbnailContainer}>
                <Image
                    source={{ uri: item.img || series.fanart }} // Fallback to fanart if no episode img
                    style={styles.thumbnail}
                    contentFit="cover"
                />
                <View style={styles.episodeBadge}>
                    <Text style={styles.episodeBadgeText}>S{item.season} • E{item.episode}</Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.episodeTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.airDate}>{item.aired ? new Date(item.aired).toLocaleDateString() : 'Unknown Date'}</Text>
                <Text style={styles.overview} numberOfLines={2}>{item.description}</Text>
            </View>
        </View>
    );

    if (seasons.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No episodes available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Season Selector */}
            <View style={styles.seasonSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {seasons.map(renderSeasonPill)}
                </ScrollView>
            </View>

            {/* Episodes List */}
            <FlatList
                data={episodes}
                renderItem={renderEpisodeItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false} // Let the parent scroll
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    center: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9ca3af',
    },
    seasonSelectorContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    seasonPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    activeSeasonPill: {
        backgroundColor: '#E50914',
        borderColor: '#E50914',
    },
    seasonText: {
        color: '#9ca3af',
        fontWeight: '600',
    },
    activeSeasonText: {
        color: '#ffffff',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    episodeCard: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#111',
        borderRadius: 8,
        overflow: 'hidden',
    },
    thumbnailContainer: {
        position: 'relative',
    },
    thumbnail: {
        width: 130,
        height: 74, // 16:9 approx
        backgroundColor: '#333',
    },
    episodeBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    episodeBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    episodeTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    airDate: {
        color: '#9ca3af',
        fontSize: 11,
        marginBottom: 4,
    },
    overview: {
        color: '#d1d5db',
        fontSize: 12,
        lineHeight: 16,
    },
});
