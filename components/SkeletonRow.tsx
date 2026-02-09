import React, { useEffect, useState } from "react";
import { Animated, ScrollView } from "react-native";

const SkeletonItem = () => {
    const opacity = useState(new Animated.Value(0.3))[0];

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <Animated.View className="w-[140px] h-[210px] bg-gray-800 rounded-xl mr-4" style={{ opacity }} />
    );
};

export default function SkeletonRow() {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} className="mb-6">
            {[1, 2, 3, 4].map((i) => (
                <SkeletonItem key={i} />
            ))}
        </ScrollView>
    );
}
