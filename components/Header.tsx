import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
    onMenuPress?: () => void;
}

export default function Header({ onMenuPress }: HeaderProps) {
    return (
        <View className=" pt-1 z-50 pb-6 bg-black w-full rounded-b-[30px]">
            <View className="w-[95%] mx-auto flex-row justify-between items-center">
                <Link href="/(tabs)/profile" asChild>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-primary justify-center items-center">
                        <Ionicons name="person" size={24} color="black" />
                    </TouchableOpacity>
                </Link>

                <View>
                    <Text
                        className="text-3xl tracking-widest text-primary font-hennyPenny"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        WatchMe
                    </Text>
                </View>

                <Link href="/(tabs)/search" asChild>
                    <TouchableOpacity>
                        <Ionicons name="search" size={28} color="#84f906" />
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
