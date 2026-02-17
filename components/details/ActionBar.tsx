import { SaveToSheet } from '@/components/saved/SaveToSheet';
import { useCollectionsStore } from '@/store/collections';
import { isMovie, MediaItem } from '@/types/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionBarProps {
    media: MediaItem;
    mediaType: 'movie' | 'tv' | 'anime';
}

export const ActionBar: React.FC<ActionBarProps> = ({ media }) => {
    const { isItemInAnyCollection } = useCollectionsStore();
    const bookmarked = isItemInAnyCollection(media.id);
    const [isSheetVisible, setSheetVisible] = useState(false);

    // Resolve trailer URL: MovieDetail uses trailerUrl, SeriesDetail uses trailer
    const trailerUrl = isMovie(media) ? media.trailerUrl : media.trailer;

    const handleTrailer = () => {
        if (trailerUrl) {
            Linking.openURL(trailerUrl).catch(err => console.error("Couldn't load page", err));
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${media.title}! ${trailerUrl || ''}`,
                title: media.title,
            });
        } catch (error: any) {
            console.error(error.message);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setSheetVisible(true)}>
                    <Ionicons
                        name={bookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={bookmarked ? "#E50914" : "#ffffff"}
                    />
                    <Text style={styles.actionText}>{bookmarked ? "Saved" : "My List"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleTrailer} disabled={!trailerUrl}>
                    <Ionicons name="play-circle-outline" size={26} color={trailerUrl ? "#ffffff" : "#555"} />
                    <Text style={[styles.actionText, !trailerUrl && styles.disabledText]}>Trailer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={24} color="#ffffff" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>

            <SaveToSheet
                visible={isSheetVisible}
                onClose={() => setSheetVisible(false)}
                media={media}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    actionText: {
        color: '#d1d5db',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    disabledText: {
        color: '#555',
    }
});
