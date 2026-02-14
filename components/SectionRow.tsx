import { Movie } from "@/services/api";
import React from "react";
import MovieSection from "./MovieSection";

interface SectionRowProps {
    title: string;
    items: Movie[];
    mediaType?: 'movie' | 'show' | 'anime';
    categoryKey?: string;
}

export default function SectionRow({ title, items, mediaType = 'movie', categoryKey }: SectionRowProps) {
    if (!items || items.length === 0) return null;

    return (
        <MovieSection
            title={title}
            movies={items}
            variant="large"
            layout="double-scroll"
            mediaType={mediaType}
            categoryKey={categoryKey}
        />
    );
}
