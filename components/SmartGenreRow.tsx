import { getMoviesByGenre, Movie } from "@/services/api";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MovieSection from "./MovieSection";
import SkeletonRow from "./SkeletonRow";

interface SmartGenreRowProps {
    title: string;
    genre: string;
    onLoadComplete?: () => void;
    enabled?: boolean;
}

export default function SmartGenreRow({ title, genre, onLoadComplete, enabled = true }: SmartGenreRowProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const fetchGenre = async () => {
            setLoading(true);
            try {
                const data = await getMoviesByGenre(genre);
                setMovies(data);
            } catch (err) {
                console.error(`Error loading genre ${genre}:`, err);
            } finally {
                setLoading(false);
                if (onLoadComplete) onLoadComplete();
            }
        };

        fetchGenre();
    }, [genre, enabled]);

    if (!enabled || loading) {
        return (
            <View>
                <Text className="text-xl font-bold text-white px-5 mb-3 uppercase tracking-wider">{title}</Text>
                <SkeletonRow />
            </View>
        );
    }

    if (movies.length === 0) return null;

    return <MovieSection title={title} movies={movies} />;
}
