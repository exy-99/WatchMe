import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;
const API_HOST = 'streaming-availability.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}`;

const TRENDING_CACHE_KEY = 'TRENDING_MOVIES_CACHE';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// --- API DTOs (Data Transfer Objects) ---

export interface ImageSetDto {
  verticalPoster: {
    w240: string;
    w360: string;
    w480: string;
    w600: string;
    w720: string;
  };
  horizontalPoster: {
    w360: string;
    w480: string;
    w720: string;
    w1080: string;
    w1440: string;
  };
  verticalBackdrop: {
    w240: string;
    w360: string;
    w480: string;
    w600: string;
    w720: string;
  };
  horizontalBackdrop: {
    w360: string;
    w480: string;
    w720: string;
    w1080: string;
    w1440: string;
  };
}

export interface ShowDto {
  itemType: 'show';
  showType: 'movie' | 'series';
  id: string;
  imdbId: string;
  tmdbId: string;
  title: string;
  overview: string;
  releaseYear: number;
  originalTitle: string;
  genres: { id: string; name: string }[];
  directors: string[];
  cast: string[];
  rating: number;
  runtime: number; // Runtime in minutes
  imageSet?: ImageSetDto;
}

export interface SearchResponseDto {
  shows: ShowDto[];
  hasMore: boolean;
  nextCursor?: string;
}

// --- Application Domain Interfaces ---

export interface Movie {
  title: string;
  imdbId: string;
  tmdbId: string;
  overview: string;
  releaseYear: number;
  genres: { id: string; name: string }[];
  rating: number;
  runtime?: number; // Runtime in minutes
  imageSet?: {
    verticalPoster?: { w480: string };
    horizontalPoster?: { w1080: string };
  };
}

// --- Helper Functions ---

const mapShowDtoToMovie = (show: ShowDto): Movie => {
  return {
    title: show.title,
    imdbId: show.imdbId,
    tmdbId: show.tmdbId,
    overview: show.overview,
    releaseYear: show.releaseYear,
    genres: show.genres,
    rating: show.rating,
    // Use API runtime or fallback to random logic for UI consistency if missing (0/undefined)
    runtime: show.runtime || Math.floor(Math.random() * (180 - 90 + 1) + 90),
    imageSet: {
      verticalPoster: show.imageSet?.verticalPoster?.w480
        ? { w480: show.imageSet.verticalPoster.w480 }
        : undefined,
      horizontalPoster: show.imageSet?.horizontalPoster?.w1080
        ? { w1080: show.imageSet.horizontalPoster.w1080 }
        : undefined,
    },
  };
};

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

    // 2. Fetch from API with pagination
    const allMovies: Movie[] = [];
    let cursor: string | undefined = undefined;
    const MAX_PAGES = 3; // Fetch 3 pages -> ~60 items

    for (let page = 0; page < MAX_PAGES; page++) {
      const queryParams = [
        'country=us',
        'series_granularity=show',
        'order_by=popularity_1week',
        'output_language=en',
        'show_type=movie',
      ];

      if (cursor) {
        queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
      }

      const queryString = queryParams.join('&');
      const url = `${BASE_URL}/shows/search/filters?${queryString}`;

      console.log(`📡 Fetching page ${page + 1}: ${url}`);

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY || '',
          'X-RapidAPI-Host': API_HOST,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 429) {
          console.error('❌ API Quota Exceeded');
          break; // Stop fetching if quota exceeded
        }
        console.error(`❌ API Error on page ${page + 1}: ${response.status}`);
        break;
      }

      const json: SearchResponseDto = await response.json();

      if (!json.shows || json.shows.length === 0) {
        console.log(`⚠️ Page ${page + 1} returned no shows.`);
        break;
      }

      const mappedMovies = json.shows.map(mapShowDtoToMovie);
      allMovies.push(...mappedMovies);
      console.log(`✅ Page ${page + 1} fetched: ${mappedMovies.length} movies.`);

      if (!json.hasMore || !json.nextCursor) {
        console.log('ℹ️ No more pages available.');
        break;
      }
      cursor = json.nextCursor;

      // Safety break to prevent infinite loops strictly
      if (page === MAX_PAGES - 1) break;
    }

    // 3. Save to Cache if we got data
    if (allMovies.length > 0) {
      await AsyncStorage.setItem(
        TRENDING_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: allMovies,
        })
      );
      console.log(`💾 Data cached successfully: ${allMovies.length} total movies`);
      return allMovies;
    } else {
      console.log('⚠️ No movies fetched, returning empty list.');
      return [];
    }

  } catch (error) {
    console.error('Error fetching movies:', error);
    // Return empty list on error to prevent app crash
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
    // Using limit=20 (maximum allowed by API)
    const url = `${BASE_URL}/shows/search/title?country=us&title=${encodeURIComponent(query)}&series_granularity=show&show_type=movie&limit=20&output_language=en`;

    const response = await fetch(url, options);

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const json: SearchResponseDto = await response.json();
    return (json.shows || []).map(mapShowDtoToMovie);

  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};
