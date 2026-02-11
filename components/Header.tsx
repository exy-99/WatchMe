import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
};

export default function Header({ activeTab = 'films', onTabChange }: HeaderProps) {
    const tabs = [
        { key: 'films', label: 'FILMS' },
        { key: 'series', label: 'SERIES' },
        { key: 'anime', label: 'ANIME' },
    ];

    return (
        <SafeAreaView edges={['top']} className="px-4 pb-4 flex-row justify-between items-center z-50 bg-transparent pt-2">

            {/* LEFT: LOGO */}
            <View className="flex-row items-center">
                <Text className="text-xl font-hennyPenny text-primary">
                    WatchMe
                </Text>
            </View>

            {/* CENTER: NAV TABS */}
            <View className="flex-row gap-8">
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabChange?.(tab.key)}
                        className={`border-b-2 pb-1 ${activeTab === tab.key ? 'border-primary' : 'border-transparent'}`}
                    >
                        <Text className={`font-mono text-base tracking-widest ${activeTab === tab.key ? 'text-primary font-bold' : 'text-gray-500'}`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* RIGHT: SEARCH */}
            <Link href="/search" asChild>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="#84f906" />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
