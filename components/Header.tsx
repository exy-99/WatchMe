import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    return (
        <SafeAreaView edges={['top']} className="px-2 pb-4 flex-row justify-between items-center z-50">
            <View className="flex-row items-center">
                <Image
                    source={require('../assets/images/react-logo.png')} // Fallback or use profile if available
                    className="w-10 h-10 rounded-full border-2 border-primary"
                />
                <Text className="text-3xl ml-3 font-hennyPenny text-primary pr-1">
                    WatchMe
                </Text>
            </View>

            <Link href="/search" asChild>
                <TouchableOpacity className="bg-white/10 p-2 rounded-full border border-white/10">
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
