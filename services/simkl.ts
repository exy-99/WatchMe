import { Actor, Episode, MovieDetail, Recommendation, SeriesDetail } from '@/types/ui';
import axios from 'axios';
import { generateCacheKey, getCachedData, setCachedData } from './cache';

const EXPO_PUBLIC_SIMKL_CLIENT_ID = process.env.EXPO_PUBLIC_SIMKL_CLIENT_ID;

const simklClient = axios.create({
    baseURL: 'https://api.simkl.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

const IMAGE_BASE = 'https://simkl.in';

const getPosterUrl = (path?: string, size: 'm' | 'poster' = 'm') => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Poster';
    return `${IMAGE_BASE}/posters/${path}_${size}.webp`;
}

const getFanartUrl = (path?: string) => {
    if (!path) return 'https://via.placeholder.com/1080x600?text=No+Image';
    return `${IMAGE_BASE}/fanart/${path}_medium.webp`;
}

// --- Formatting Helpers ---

export const formatRuntime = (minutes?: number): string => {
    if (!minutes || minutes <= 0) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
};

export const formatCurrency = (amount?: number): string => {
    if (!amount || amount <= 0) return 'N/A';
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
};

// --- Navigation Helper ---

export const getRoute = (mediaType: 'movie' | 'tv' | 'anime', id: number): string => {
    if (mediaType === 'movie') return `/details/movie/${id}`;
    return `/details/${id}?type=${mediaType === 'anime' ? 'anime' : 'show'}`;
};

// Content type: 'movie' | 'show' | 'anime'
// This determines which Simkl endpoint to use.
export type ContentType = 'movie' | 'show' | 'anime';

// --- Movie Details (Dedicated) ---

export const getMovieDetails = async (id: number): Promise<MovieDetail | null> => {
    console.log(`📡 Fetching Movie Details: ID=${id}`);
    const cacheKey = generateCacheKey(`/details/movie-v2/${id}`, {});

    const cached = await getCachedData<MovieDetail>(cacheKey);
    if (cached) {
        console.log('⚡ Serving Movie Details from cache');
        return cached;
    }

    try {
        const { data } = await simklClient.get(`/movies/${id}`, {
            params: { extended: 'full', client_id: EXPO_PUBLIC_SIMKL_CLIENT_ID }
        });

        if (!data) return null;

        // Cast is not available from the /movies/{id} endpoint
        const cast: Actor[] = [];

        // Recommendations may come from users_recommendations field
        const rawRecs = data.users_recommendations || data.recommendations || [];
        const recommendations: Recommendation[] = rawRecs.slice(0, 10).map((rec: any) => ({
            id: rec.ids?.simkl || rec.ids?.simkl_id || 0,
            title: rec.title || 'Untitled',
            poster: getPosterUrl(rec.poster, 'm'),
            year: rec.year?.toString(),
            rating: rec.ratings?.simkl?.rating,
        }));

        const movie: MovieDetail = {
            id: data.ids?.simkl ?? id,
            title: data.title || 'Untitled',
            tagline: data.tagline || '',
            poster: getPosterUrl(data.poster),
            fanart: getFanartUrl(data.fanart),
            year: data.year?.toString() ?? '',
            runtime: formatRuntime(data.runtime),
            rating: data.ratings?.simkl?.rating || 0,
            overview: data.overview || '',
            genres: (data.genres || []).map((g: any) => typeof g === 'string' ? g : g.name),
            director: data.director?.name || data.director || 'Unknown',
            budget: formatCurrency(data.budget),
            revenue: formatCurrency(data.revenue),
            trailerUrl: data.trailers?.[0]?.youtube
                ? `https://www.youtube.com/watch?v=${data.trailers[0].youtube}`
                : (data.trailer ? `https://www.youtube.com/watch?v=${data.trailer}` : undefined),
            cast,
            recommendations,
        };

        await setCachedData(cacheKey, movie);
        console.log(`✅ Movie loaded: "${movie.title}" (${movie.runtime}, ${cast.length} cast, ${recommendations.length} recs)`);
        return movie;

    } catch (error: any) {
        console.error('❌ Error fetching movie details:', error.response?.status, error.message);
        return null;
    }
};

// --- Series/Anime Details (Legacy Universal) ---

/**
 * Universal details fetcher.
 * - For movies: calls /movies/{id}
 * - For shows: calls /tv/{id} + /tv/episodes/{id}
 * - For anime: calls /anime/{id} + /anime/episodes/{id}
 */
export const getDetails = async (id: number, type: ContentType = 'movie'): Promise<SeriesDetail | null> => {
    console.log(`📡 Fetching Details: ID=${id}, type=${type}`);
    const cacheKey = generateCacheKey(`/details/${type}/${id}`, {});

    const cached = await getCachedData<SeriesDetail>(cacheKey);
    if (cached) {
        console.log('⚡ Serving Details from cache');
        return cached;
    }

    try {
        let data: any;
        let rawEpisodes: any[] = [];

        if (type === 'movie') {
            // Movies: single call, no episodes
            const res = await simklClient.get<any>(`/movies/${id}`, {
                params: { extended: 'full', client_id: EXPO_PUBLIC_SIMKL_CLIENT_ID }
            });
            data = res.data;
        } else {
            // TV Shows & Anime: parallel fetch details + episodes
            const baseRoute = type === 'anime' ? '/anime' : '/tv';

            const [detailsRes, episodesRes] = await Promise.all([
                simklClient.get<any>(`${baseRoute}/${id}`, {
                    params: { extended: 'full', client_id: EXPO_PUBLIC_SIMKL_CLIENT_ID }
                }),
                simklClient.get<any>(`${baseRoute}/episodes/${id}`, {
                    params: { extended: 'full', client_id: EXPO_PUBLIC_SIMKL_CLIENT_ID }
                }).catch(() => ({ data: [] })) // Gracefully handle missing episodes
            ]);

            data = detailsRes.data;
            const epData = episodesRes.data || [];
            rawEpisodes = Array.isArray(epData) ? epData : (epData.episodes || []);
        }

        if (!data) return null;

        // Transform Episodes (empty for movies)
        const episodes: Episode[] = rawEpisodes.map((ep: any) => ({
            id: ep.ids?.simkl_id ?? 0,
            title: ep.title || `Episode ${ep.episode}`,
            season: ep.season ?? 1,
            episode: ep.episode ?? 0,
            type: ep.type || 'episode',
            aired: ep.date,
            img: ep.img ? `${IMAGE_BASE}/episodes/${ep.img}_c.webp` : undefined,
            description: ep.description
        }));

        // Flatten to Seasons Dictionary
        const seasonDict: Record<number, Episode[]> = {};
        episodes.forEach(ep => {
            if (!seasonDict[ep.season]) seasonDict[ep.season] = [];
            seasonDict[ep.season].push(ep);
        });

        // Transform Cast (may be empty if API doesn't return it for this endpoint)
        const cast: Actor[] = (data.cast || []).slice(0, 10).map((actor: any) => ({
            id: actor.id || 0,
            name: actor.name || 'Unknown',
            role: actor.role || '',
            image: actor.headshot
                ? `${IMAGE_BASE}/${actor.headshot}`
                : 'https://via.placeholder.com/100x100?text=Actor'
        }));

        const details: SeriesDetail = {
            id: data.ids?.simkl ?? id,
            title: data.title || 'Untitled',
            year: data.year?.toString() ?? '',
            poster: getPosterUrl(data.poster),
            fanart: getFanartUrl(data.fanart),
            overview: data.overview,
            rating: data.ratings?.simkl?.rating,
            runtime: data.runtime,
            totalEpisodes: data.total_episodes,
            network: data.network,
            country: data.country,
            status: data.status,
            genres: (data.genres || []).map((g: any) => typeof g === 'string' ? g : g.name),
            cast,
            seasons: seasonDict,
            trailer: data.trailer ? `https://www.youtube.com/watch?v=${data.trailer}` : undefined,
        };

        await setCachedData(cacheKey, details);
        console.log(`✅ Details loaded: "${details.title}" (${Object.keys(seasonDict).length} seasons, ${episodes.length} episodes)`);
        return details;

    } catch (error: any) {
        console.error('❌ Error fetching details:', error.response?.status, error.message);
        return null;
    }
}

// Legacy alias (backwards compat)
export const getSeriesDetails = (id: number) => getDetails(id, 'show');

export const getRecommendations = async (id: number): Promise<Recommendation[]> => {
    // Placeholder - return empty for now
    return [];
}
