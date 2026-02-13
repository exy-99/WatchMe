import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoGridProps {
    director: string;
    budget: string;
    revenue: string;
    year: string;
}

interface StatItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => (
    <View style={styles.statItem}>
        <View style={styles.statIconRow}>
            <Ionicons name={icon} size={16} color="#9ca3af" />
            <Text style={styles.statLabel}>{label}</Text>
        </View>
        <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
    </View>
);

export const InfoGrid: React.FC<InfoGridProps> = ({ director, budget, revenue, year }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <StatItem icon="person-outline" label="Director" value={director} />
                <StatItem icon="calendar-outline" label="Release" value={year} />
            </View>
            <View style={styles.row}>
                <StatItem icon="wallet-outline" label="Budget" value={budget} />
                <StatItem icon="trending-up-outline" label="Box Office" value={revenue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flex: 1,
    },
    statIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    statLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '500',
    },
    statValue: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        paddingLeft: 22, // Align with text after icon
    },
});
