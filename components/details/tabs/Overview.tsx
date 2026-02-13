import { Actor, SeriesDetail } from '@/types/ui';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface OverviewProps {
    series: SeriesDetail;
}

export const Overview: React.FC<OverviewProps> = ({ series }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

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

    return (
        <View style={styles.container}>
            {/* Metadata Grid */}
            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Network</Text>
                    <Text style={styles.metaValue}>{series.network || 'N/A'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Runtime</Text>
                    <Text style={styles.metaValue}>{series.runtime ? `${series.runtime} min` : 'N/A'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Country</Text>
                    <Text style={styles.metaValue}>{series.country || 'N/A'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Episodes</Text>
                    <Text style={styles.metaValue}>{series.totalEpisodes || '?'}</Text>
                </View>
            </View>

            {/* Synopsis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Synopsis</Text>
                <Text
                    style={styles.synopsisText}
                    numberOfLines={expanded ? undefined : 4}
                >
                    {series.overview || "No synopsis available."}
                </Text>
                {series.overview && series.overview.length > 150 && (
                    <TouchableOpacity onPress={toggleExpand}>
                        <Text style={styles.readMore}>{expanded ? "Show Less" : "Read More"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Cast */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cast</Text>
                <FlatList
                    horizontal
                    data={series.cast}
                    renderItem={renderCastItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.castList}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
    },
    metaItem: {
        width: '50%',
        marginBottom: 12,
    },
    metaLabel: {
        color: '#9ca3af',
        fontSize: 12,
        marginBottom: 2,
    },
    metaValue: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
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
    castList: {
        paddingRight: 20,
    },
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
});
