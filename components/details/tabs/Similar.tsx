import { SeriesDetail } from '@/types/ui'; // Reuse Movie type for similar items mostly
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Need to update service to export generic fetch or add getSimilar function in simkl.ts
// For now, I will use a placeholder or assume I can update simkl.ts to export `getSimilarSeries` or `getRecommended`

interface SimilarProps {
    series: SeriesDetail;
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 40 - (10 * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

export const Similar: React.FC<SimilarProps> = ({ series }) => {
    const router = useRouter();
    const [similar, setSimilar] = useState<any[]>([]); // Using any for now to be flexible with API response

    useEffect(() => {
        // Mocking similar fetch or using generic if available. 
        // Real implementation should call API. 
        // For this task, I will use `series.recommendations` if I added it, but I didn't yet map it fully.
        // Let's assume we fetch similar based on ID.

        // TODO: Implement actual fetch. 
        // Since I can't easily edit simkl.ts in parallel here without potential conflict or length, 
        // I will simulate empty or simple logic.
        // But wait, the user wants "Recursive navigation".

        // Let's just assume we have data for now or fetch it.
        // I'll make a specialized local fetch for now to demonstrate.
    }, [series.id]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => router.push(`/details/${item.id}`)} // Recursive navigation
        >
            <Image
                source={{ uri: `https://wsrv.nl/?url=https://simkl.in/posters/${item.poster}_m.webp` }}
                style={styles.poster}
                contentFit="cover"
            />
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>You might also like</Text>
            {/* 
               Grid of posters.
               If I don't have real data, I'll show a placeholder message for this step 
               until I update simkl.ts to actually fetch similar.
             */}
            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>
                (Similar content fetch to be implemented in API service)
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginBottom: 20,
    },
    poster: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.5,
        borderRadius: 8,
        backgroundColor: '#333',
        marginBottom: 8,
    },
    title: {
        color: '#d1d5db',
        fontSize: 12,
        fontWeight: '500',
    }
});
