import { ActionBar } from '@/components/details/ActionBar';
import { HeroHeader } from '@/components/details/HeroHeader';
import { Episodes } from '@/components/details/tabs/Episodes';
import { Overview } from '@/components/details/tabs/Overview';
import { Similar } from '@/components/details/tabs/Similar';
import { ContentType, getDetails } from '@/services/simkl';
import { SeriesDetail } from '@/types/ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Tab = 'overview' | 'episodes' | 'similar';

export default function DetailsScreen() {
    const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
    const [series, setSeries] = useState<SeriesDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const contentType = (type as ContentType) || 'movie';
                const data = await getDetails(Number(id), contentType);
                if (data) {
                    setSeries(data);
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

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#E50914" />
            </View>
        );
    }

    if (error || !series) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load series details.</Text>
            </View>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview series={series} />;
            case 'episodes':
                return <Episodes series={series} />;
            case 'similar':
                return <Similar series={series} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                bounces={false}
                stickyHeaderIndices={[2]} // Sticky index for the Tab Bar (Hero=0, Action=1, Tabs=2)
                showsVerticalScrollIndicator={false}
            >
                <HeroHeader media={series} />
                <ActionBar media={series} mediaType={((type as string) || 'show') === 'movie' ? 'movie' : ((type as string) === 'anime' ? 'anime' : 'tv')} />

                {/* Sticky Tab Bar */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'overview' && styles.activeTabItem]}
                        onPress={() => setActiveTab('overview')}
                    >
                        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'episodes' && styles.activeTabItem]}
                        onPress={() => setActiveTab('episodes')}
                    >
                        <Text style={[styles.tabText, activeTab === 'episodes' && styles.activeTabText]}>Episodes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'similar' && styles.activeTabItem]}
                        onPress={() => setActiveTab('similar')}
                    >
                        <Text style={[styles.tabText, activeTab === 'similar' && styles.activeTabText]}>Similar</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.contentContainer}>
                    {renderTabContent()}
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
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.95)', // Slightly transparent for glass effect
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
        paddingHorizontal: 10,
    },
    tabItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: '#E50914',
    },
    tabText: {
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#ffffff',
    },
    contentContainer: {
        minHeight: 400, // Ensure smooth scroll
        backgroundColor: '#000',
    }
});
