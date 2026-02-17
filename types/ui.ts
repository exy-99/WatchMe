export interface Actor {
    id: number;
    name: string;
    image: string;
    role: string;
}

export interface Episode {
    id: number;
    title: string;
    season: number;
    episode: number;
    type: string;
    aired?: string;
    img?: string;
    description?: string;
}

export interface SeriesDetail {
    id: number;
    title: string;
    year?: string;
    poster?: string;
    fanart?: string;
    overview?: string;
    rating?: number;
    runtime?: number; // minutes
    totalEpisodes?: number;
    network?: string;
    country?: string;
    status?: string; // e.g., "Returning Series", "Ended"
    genres: string[];
    cast: Actor[];
    seasons: Record<number, Episode[]>; // Dictionary for O(1) season lookup
    trailer?: string;
}

export interface Recommendation {
    id: number;
    title: string;
    poster: string;
    year?: string;
    rating?: number;
    runtime?: string;
}

export interface MovieDetail {
    id: number;
    title: string;
    tagline: string;
    poster: string;
    fanart: string;
    year: string;
    runtime: string;        // Pre-formatted "2h 45m"
    rating: number;
    overview: string;
    genres: string[];
    director: string;
    budget: string;          // Pre-formatted "$356M"
    revenue: string;
    trailerUrl?: string;
    cast: Actor[];
    recommendations: Recommendation[];
}

// Union type for shared components (HeroHeader, ActionBar)
export type MediaItem = SeriesDetail | MovieDetail;

// Type guard to distinguish MovieDetail from SeriesDetail
export const isMovie = (media: MediaItem): media is MovieDetail => 'budget' in media;

export interface Collection {
    id: string;        // UUID
    title: string;     // e.g. "My Watchlist"
    isDefault?: boolean; // True for the main "Watchlist" (cannot be deleted)
    items: MediaItem[]; // Array of movies/shows (Reuse existing MediaItem type)
    createdAt: number;
}
