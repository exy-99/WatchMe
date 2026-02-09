import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

interface ExternalLinkProps {
    url: string;
    text: string;
    style?: any;
}

export default function ExternalLink({ url, text, style }: ExternalLinkProps) {
    const handlePress = async () => {
        // Check if the link is supported
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={style}>
            <Text className="text-gray-500 text-xs text-center py-4 underline">
                {text}
            </Text>
        </TouchableOpacity>
    );
}
