import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EXPO_PUBLIC_MOVIE_API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;
const EXPO_PUBLIC_RAPIDAPI_HOST2 = process.env.EXPO_PUBLIC_RAPIDAPI_HOST2;


// --- Clients ---
const fastClient = axios.create({
  baseURL: 'https://streaming-availability.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': EXPO_PUBLIC_MOVIE_API_KEY,
    'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
  },
});


const slowClient = axios.create({
  baseURL: 'https://moviesminidatabase.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': EXPO_PUBLIC_MOVIE_API_KEY,
    'X-RapidAPI-Host': EXPO_PUBLIC_RAPIDAPI_HOST2,
  },
});

// --- Constants ---
const HERO_CACHE_KEY = 'HERO_MOVIES_CACHE';
const TOP_RATED_CACHE_KEY = 'TOP_RATED_MOVIES_CACHE';
const NEW_RELEASES_CACHE_KEY = 'NEW_RELEASES_MOVIES_CACHE';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// --- Interfaces ---
export interface Movie {
  title: string;
  imdbId: string;
  tmdbId?: string;
  overview?: string;
  releaseYear: number;
  genres?: { id: string; name: string }[];
  rating?: number;
  runtime?: number;
  contentRating?: string;
  trailer?: string;
  keywords?: string[];
  imageSet?: {
    verticalPoster?: { w480?: string; w720?: string };
    horizontalPoster?: { w1080?: string };
  };
}

export interface MovieDetails extends Movie {
  cast: string[];
  directors: string[];
  streamingOptions?: any;
  imageSet: {
    verticalPoster: { w720: string; w480?: string };
    horizontalPoster: { w1080: string };
  };
}

export interface Series {
  title: string;
  imdbId: string;
  releaseYear: number;
  rating?: number;
  description?: string;
  keywords?: string[];
  imageSet?: {
    verticalPoster?: { w480?: string };
    horizontalPoster?: { w1080?: string };
  };
  startYear?: number;
  endYear?: number;
}

export interface Actor {
  imdbId: string;
  name: string;
  birthDate?: string;
  birthPlace?: string;
  image?: string;
  bio?: string;
}

export interface Episode {
  imdbId: string;
  title: string;
  rating?: number;
  releaseDate?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  plot?: string;
  poster?: string;
}


// --- Helper Functions ---
const mapFastApiToMovie = (item: any): Movie => ({
  title: item.title,
  imdbId: item.imdbId,
  tmdbId: item.tmdbId,
  overview: item.overview,
  releaseYear: item.releaseYear,
  genres: item.genres,
  rating: item.rating,
  runtime: item.runtime,
  imageSet: {
    verticalPoster: item.imageSet?.verticalPoster ? { w480: item.imageSet.verticalPoster.w480 } : undefined,
    horizontalPoster: item.imageSet?.horizontalPoster ? { w1080: item.imageSet.horizontalPoster.w1080 } : undefined,
  },
});

const mapSlowApiToMovie = (item: any): Movie => ({
  title: item.title,
  imdbId: item.imdb_id || item.imdbId,
  releaseYear: parseInt(item.year) || item.releaseYear || new Date().getFullYear(),
  genres: item.gen ? item.gen.map((g: any) => ({ id: String(g.id || g.genre), name: g.genre || g.name })) : [],
  rating: item.rating || 0,
  runtime: item.movie_length || item.runtime,
  contentRating: item.content_rating,
  trailer: item.trailer,
  keywords: item.keywords ? item.keywords.map((k: any) => k.keyword) : [],
  overview: item.description || item.plot,
  imageSet: {
    verticalPoster: { w480: item.image_url || item.poster || item.banner || 'https://via.placeholder.com/300x450' },
    horizontalPoster: { w1080: item.banner || item.image_url || 'https://via.placeholder.com/1080x600' }
  },
});

const mapSlowApiToSeries = (item: any): Series => ({
  title: item.title,
  imdbId: item.imdb_id,
  releaseYear: parseInt(item.year) || item.start_year || new Date().getFullYear(),
  rating: item.rating,
  description: item.description || item.plot,
  keywords: item.keywords ? item.keywords.map((k: any) => k.keyword) : [],
  startYear: item.start_year,
  endYear: item.end_year,
  imageSet: {
    verticalPoster: { w480: item.image_url || item.poster || 'https://via.placeholder.com/300x450' },
    horizontalPoster: { w1080: item.banner || 'https://via.placeholder.com/1080x600' }
  }
});


// --- API Functions ---

// 1. Hero Movies (Fast API + Cache)
export const getHeroMovies = async (): Promise<Movie[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(HERO_CACHE_KEY);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const response = await fastClient.get('/shows/search/filters', {
      params: {
        country: 'us',
        series_granularity: 'show',
        order_by: 'popularity_1week',
        output_language: 'en',
        show_type: 'movie',
      },
    });

    const movies = response.data.shows.map(mapFastApiToMovie);
    await AsyncStorage.setItem(HERO_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: movies }));
    return movies;
  } catch (error) {
    console.error('❌ Error fetching Hero movies:', error);
    return [];
  }
};

// 2. Content Rows (Hybrid: Fast + Slow API)
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(TOP_RATED_CACHE_KEY);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const response = await fastClient.get('/shows/search/filters', {
      params: {
        country: 'us',
        show_type: 'movie',
        order_by: 'rating',
        order_direction: 'desc',
        rating_min: 80,
      },
    });

    const movies = response.data.shows.map(mapFastApiToMovie);
    await AsyncStorage.setItem(TOP_RATED_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: movies }));
    return movies;
  } catch (error) {
    console.error('❌ Error fetching Top Rated movies:', error);
    return [];
  }
};

export const getNewReleases = async (): Promise<Movie[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(NEW_RELEASES_CACHE_KEY);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const response = await fastClient.get('/shows/search/filters', {
      params: {
        country: 'us',
        show_type: 'movie',
        order_by: 'release_date',
        order_direction: 'desc',
        year_min: 2024,
      },
    });

    const movies = response.data.shows.map(mapFastApiToMovie);
    await AsyncStorage.setItem(NEW_RELEASES_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: movies }));
    return movies;
  } catch (error) {
    console.error('❌ Error fetching New Releases:', error);
    return [];
  }
};

export const getContentRows = async () => {
  console.log('🔄 Fetching Hybrid Content Rows...');

  const [topRated, newReleases] = await Promise.all([
    getTopRatedMovies(),
    getNewReleases(),
  ]);

  return { topRated, newReleases };
};

// --- Slow API Extensions (New Endpoints) ---

// Movies
export const getMoviesByGenre = async (genre: string, page: number = 1): Promise<Movie[]> => {
  try {
    console.log(`📡 Fetching ${genre} movies (Page ${page})...`);

    // The API supports pagination via ?page=X
    const response = await slowClient.get(`/movie/byGen/${genre}/`, {
      params: { page }
    });

    const results = response.data.results;

    if (!results || results.length === 0) {
      console.log(`⚠️ No results found for ${genre} page ${page}`);
      return [];
    }

    console.log(`✅ Found ${results.length} items for ${genre} (Page ${page}). Fetching details...`);

    // Limit to 24 items per page to support 2 rows x 12 columns
    const limitedResults = results.slice(0, 24);

    // Fetch details for each movie in parallel to get images
    const moviesWithDetails = await Promise.all(
      limitedResults.map(async (item: any) => {
        try {
          // false = skip cast fetch, we just want the movie details/images
          const details = await getMovieByImdbId(item.imdb_id, false);
          return details || mapSlowApiToMovie(item);
        } catch (e) {
          console.warn(`  ⚠️ Failed detail fetch for ${item.title}`);
          return mapSlowApiToMovie(item);
        }
      })
    );

    const validMovies = moviesWithDetails.filter(Boolean);
    console.log(`🎉 Successfully loaded ${validMovies.length} movies for ${genre} (Page ${page})`);
    return validMovies;
  } catch (error) {
    console.error(`❌ Error fetching movies by genre ${genre} page ${page}:`, error);
    return [];
  }
};

export const getMoviesByKeywords = async (keyword: string): Promise<Movie[]> => {
  try {
    const response = await slowClient.get(`/movie/byKeywords/${keyword}/`);
    return response.data.results?.map(mapSlowApiToMovie) || [];
  } catch (error) {
    console.error(`❌ Error fetching movies by keyword ${keyword}:`, error);
    return [];
  }
};

// Alias for searchMovies to maintain backward compatibility if needed, or replace
export const searchMovies = getMoviesByKeywords;

export const getMoviesOrderByRating = async (): Promise<Movie[]> => {
  try {
    const response = await slowClient.get('/movie/order/byRating/');
    return response.data.results?.map(mapSlowApiToMovie) || [];
  } catch (error) {
    console.error('❌ Error fetching movies ordered by rating:', error);
    return [];
  }
};

export const getMoviesOrderByPopularity = async (): Promise<Movie[]> => {
  try {
    const response = await slowClient.get('/movie/order/byPopularity/');
    return response.data.results?.map(mapSlowApiToMovie) || [];
  } catch (error) {
    console.error('❌ Error fetching movies ordered by popularity:', error);
    return [];
  }
};

export const getMoviesByYear = async (year: string): Promise<Movie[]> => {
  try {
    const response = await slowClient.get(`/movie/byYear/${year}/`);
    return response.data.results?.map(mapSlowApiToMovie) || [];
  } catch (error) {
    console.error(`❌ Error fetching movies by year ${year}:`, error);
    return [];
  }
};

export const getMoviesByContentRating = async (rating: string): Promise<Movie[]> => {
  try {
    const response = await slowClient.get(`/movie/byContentRating/${rating}/`);
    return response.data.results?.map(mapSlowApiToMovie) || [];
  } catch (error) {
    console.error(`❌ Error fetching movies by content rating ${rating}:`, error);
    return [];
  }
};

// Extended Movie Details
export const getMovieByImdbId = async (imdbId: string, includeCast: boolean = true): Promise<MovieDetails | null> => {
  try {
    const res = await slowClient.get(`/movie/id/${imdbId}/`);
    let details = res.data;
    if (res.data.results) {
      details = Array.isArray(res.data.results) ? res.data.results[0] : res.data.results;
    }
    if (!details) return null;

    // Parallel fetch for cast (only if requested)
    let cast = [];
    if (includeCast) {
      try {
        const castRes = await slowClient.get(`/movie/id/${imdbId}/cast/`);
        cast = Array.isArray(castRes.data.results) ? castRes.data.results : [];
      } catch (e) { console.warn('Failed to fetch cast'); }
    }

    const movieBase = mapSlowApiToMovie(details);
    return {
      ...movieBase,
      cast: cast.map((c: any) => c.actor || c.name).slice(0, 10),
      directors: details.directors?.map((d: any) => d.name) || [],
      imageSet: {
        verticalPoster: {
          w720: movieBase.imageSet?.verticalPoster?.w720 || movieBase.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/300x450',
          w480: movieBase.imageSet?.verticalPoster?.w480
        },
        horizontalPoster: {
          w1080: movieBase.imageSet?.horizontalPoster?.w1080 || 'https://via.placeholder.com/1080x600'
        }
      }
    };
  } catch (error) {
    console.error(`❌ Error fetching movie details for ${imdbId}:`, error);
    return null;
  }
};
// Alias for getMovieDetails
export const getMovieDetails = getMovieByImdbId;


export const getKeywordsByMovieId = async (id: string): Promise<string[]> => {
  try {
    const response = await slowClient.get(`/movie/id/${id}/keywords/`);
    return response.data.results?.map((k: any) => k.keyword) || [];
  } catch (error) {
    console.error(`❌ Error fetching keywords for movie ${id}:`, error);
    return [];
  }
};

export const getCastByMovieId = async (id: string): Promise<any[]> => {
  try {
    const response = await slowClient.get(`/movie/id/${id}/cast/`);
    return response.data.results || [];
  } catch (error) {
    console.error(`❌ Error fetching cast for movie ${id}:`, error);
    return [];
  }
};


// Series
export const getSeriesByImdbId = async (id: string): Promise<Series | null> => {
  try {
    const response = await slowClient.get(`/series/id/${id}/`);
    const item = response.data.results || response.data;
    return mapSlowApiToSeries(item);
  } catch (error) {
    console.error(`❌ Error fetching series ${id}:`, error);
    return null;
  }
};

export const getSeriesByTitle = async (title: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/idbyTitle/${title}/`);
    // The API returns a list of results for title search
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching series by title ${title}:`, error);
    return [];
  }
};

export const getSeriesByKeywords = async (keyword: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/byKeywords/${keyword}/`);
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching series by keyword ${keyword}:`, error);
    return [];
  }
};

export const getSeriesByGenre = async (genre: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/byGen/${genre}/`);
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching series by genre ${genre}:`, error);
    return [];
  }
};

export const getSeriesByYear = async (year: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/byYear/${year}/`);
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching series by year ${year}:`, error);
    return [];
  }
};

export const getSeriesByActorId = async (actorId: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/byActor/${actorId}/`);
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching series by actor ${actorId}:`, error);
    return [];
  }
};

export const getSeriesOrderByRating = async (): Promise<Series[]> => {
  try {
    const response = await slowClient.get('/series/order/byRating/');
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error('❌ Error fetching series ordered by rating:', error);
    return [];
  }
};

export const getSeriesOrderByPopularity = async (): Promise<Series[]> => {
  try {
    const response = await slowClient.get('/series/order/byPopularity/');
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error('❌ Error fetching series ordered by popularity:', error);
    return [];
  }
};

export const getKeywordsBySeriesId = async (id: string): Promise<string[]> => {
  try {
    const response = await slowClient.get(`/series/id/${id}/keywords/`);
    return response.data.results?.map((k: any) => k.keyword) || [];
  } catch (error) {
    console.error(`❌ Error fetching keywords for series ${id}:`, error);
    return [];
  }
};

export const getMoreLikeThisBySeriesId = async (id: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/series/id/${id}/more_like_this/`);
    return response.data.results?.map(mapSlowApiToSeries) || [];
  } catch (error) {
    console.error(`❌ Error fetching more like this for series ${id}:`, error);
    return [];
  }
};

export const getEpisodeById = async (id: string): Promise<Episode | null> => {
  try {
    const response = await slowClient.get(`/episode/${id}/`);
    const data = response.data.results || response.data;
    return {
      imdbId: data.imdb_id,
      title: data.title,
      rating: data.rating,
      releaseDate: data.release_date,
      seasonNumber: data.season_number,
      episodeNumber: data.episode_number,
      plot: data.plot,
      poster: data.poster || data.image_url
    };
  } catch (error) {
    console.error(`❌ Error fetching episode ${id}:`, error);
    return null;
  }
};


// Actors
export const getActorDetailsById = async (id: string): Promise<Actor | null> => {
  try {
    const response = await slowClient.get(`/actor/id/${id}/`);
    const data = response.data.results || response.data;
    return {
      imdbId: data.imdb_id,
      name: data.name,
      birthDate: data.birth_date,
      birthPlace: data.birth_place,
      image: data.image_url,
      bio: data.bio
    };
  } catch (error) {
    console.error(`❌ Error fetching actor ${id}:`, error);
    return null;
  }
};

export const getActorIdByName = async (name: string): Promise<string | null> => {
  try {
    const response = await slowClient.get(`/actor/imdb_id_byName/${name}/`);
    return response.data.results ? response.data.results[0]?.imdb_id : null;
  } catch (error) {
    console.error(`❌ Error fetching actor ID for ${name}:`, error);
    return null;
  }
};

export const getActorBioById = async (id: string): Promise<string | null> => {
  try {
    const response = await slowClient.get(`/actor/id/${id}/bio/`);
    return response.data.results || null;
  } catch (error) {
    console.error(`❌ Error fetching bio for actor ${id}:`, error);
    return null;
  }
};

export const getMoviesKnownForByActorId = async (id: string): Promise<Movie[]> => {
  try {
    const response = await slowClient.get(`/actor/id/${id}/movies_knownFor/`);
    return response.data.results?.map((item: any) => mapSlowApiToMovie(item[0] || item)) || [];
  } catch (error) {
    console.error(`❌ Error fetching movies known for actor ${id}:`, error);
    return [];
  }
};

export const getSeriesKnownForByActorId = async (id: string): Promise<Series[]> => {
  try {
    const response = await slowClient.get(`/actor/id/${id}/series_knownFor/`);
    return response.data.results?.map((item: any) => mapSlowApiToSeries(item[0] || item)) || [];
  } catch (error) {
    console.error(`❌ Error fetching series known for actor ${id}:`, error);
    return [];
  }
};

export const getAllRolesByActorId = async (id: string): Promise<any[]> => {
  try {
    const response = await slowClient.get(`/actor/id/${id}/all_roles/`);
    return response.data.results || [];
  } catch (error) {
    console.error(`❌ Error fetching all roles for actor ${id}:`, error);
    return [];
  }
};

// Utils
export const getGenres = async (): Promise<string[]> => {
  try {
    const response = await slowClient.get('/genres/');
    return response.data.results?.map((g: any) => g.genre) || [];
  } catch (error) {
    console.error('❌ Error fetching genres:', error);
    return [];
  }
};
