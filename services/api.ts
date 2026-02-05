import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;
const API_HOST = 'streaming-availability.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}`;

const TRENDING_CACHE_KEY = 'TRENDING_MOVIES_CACHE';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export interface Movie {
  img: any;
  title: string;
  imdbId: string;
  tmdbId: string;
  overview: string;
  releaseYear: number;
  genres: { id: string; name: string }[];
  rating: number;
  imageSet?: {
    verticalPoster?: { w480: string };
    horizontalPoster?: { w1080: string };
  };
}

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    // 1. Check Cache
    const cachedData = await AsyncStorage.getItem(TRENDING_CACHE_KEY);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (!isExpired) {
        console.log('✅ Returning valid cached data');
        return data;
      } else {
        console.log('⚠️ Cache expired, fetching new data...');
      }
    } else {
      console.log('ℹ️ No cache found, fetching from API...');
    }

    // 2. Fetch from API if no valid cache
    // Using simple search to get trending/popular items. 
    // Adapting query for "50 trending movies". 
    // Note: The specific endpoint might vary, assuming /shows/search/filters or similar logic.
    // Since we don't have the exact endpoint docs, I'll use a generic 'search' which usually yields results.
    // Adding `limit=50` is crucial.
    
    // Constructing query params
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY || '',
        'X-RapidAPI-Host': API_HOST,
      },
    };

    // We use a search that returns many items.
    // 'country=us' is a standard required param for many availability APIs
    const response = await fetch(
      `${BASE_URL}/shows/search/filters?country=us&series_granularity=show&order_by=popularity_1week&limit=50&output_language=en&show_type=movie`, 
      options
    );

    if (!response.ok) {
        if (response.status === 429) {
            console.error('❌ API Quota Exceeded');
        }
        throw new Error(`API Error: ${response.status}`);
    }

    const json = await response.json();
    const movies = json.shows || []; // Adjust based on actual response structure

    // 3. Save to Cache
    await AsyncStorage.setItem(
      TRENDING_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: movies,
      })
    );

    console.log('💾 Data cached successfully');
    return movies;

  } catch (error) {
    console.error('Error fetching movies:', error);
    // Fallback: Try to return expired cache if simple fetch fails? 
    // For now, just return empty or rethrow. 
    // If we have expired cache, better to show that than nothing?
    // Let's rely on standard error handling for now.
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query || query.length < 3) return [];
    
    console.log(`🔎 Searching API for: ${query}`);
    try {
        const options = {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': API_KEY || '',
              'X-RapidAPI-Host': API_HOST,
            },
          };
      
          // Search specific title
          const response = await fetch(
            `${BASE_URL}/shows/search/title?country=us&title=${encodeURIComponent(query)}&series_granularity=show&show_type=movie&limit=10&output_language=en`, 
            options
          );

          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          
          const json = await response.json();
          return json.shows || [];

    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}
