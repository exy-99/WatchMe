export interface SearchFilters {
    type: 'movie' | 'tv' | 'anime' | 'all';
    status: 'all' | 'releasing' | 'released';
    genre: string[];
    sort: 'relevance' | 'rating' | 'newest';
}

export const INITIAL_FILTERS: SearchFilters = {
    type: 'all',
    status: 'all',
    genre: [],
    sort: 'relevance',
};
