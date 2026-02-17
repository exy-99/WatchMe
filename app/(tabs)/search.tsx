import GenreGrid from "@/components/GenreGrid";
import RecentSearches from "@/components/RecentSearches";
import FilterSheet from "@/components/search/FilterSheet";
import SearchHeader from "@/components/SearchHeader";
import SearchResults from "@/components/SearchResults";
import TrendingNow from "@/components/TrendingNow";
import { Movie, searchMovies } from "@/services/api";
import { INITIAL_FILTERS, SearchFilters } from "@/types/filters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RECENT_SEARCHES_KEY = "RECENT_SEARCHES_KEY";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Filter State
  const [activeFilters, setActiveFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  };

  const saveRecentSearch = async (term: string) => {
    if (!term.trim()) return;
    try {
      const newSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
      setRecentSearches(newSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error("Failed to save recent search", e);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error("Failed to clear recent searches", e);
    }
  };

  // Search Logic
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Derived Results based on Filters
  const displayedResults = useMemo(() => {
    let filtered = [...results];

    // 1. Filter by Type
    if (activeFilters.type !== "all") {
      filtered = filtered.filter((item) => (item.type || 'movie') === activeFilters.type);
    }

    // 2. Filter by Genre (checking if item has ANY of the selected genres)
    if (activeFilters.genre.length > 0) {
      filtered = filtered.filter((item) =>
        item.genres?.some((g) => {
          if (!g.name) return false;
          // Robust comparison: normalize case and remove non-alphanumeric chars
          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
          return activeFilters.genre.some(filterGenre => normalize(filterGenre) === normalize(g.name));
        })
      );
    }

    // 3. Sort
    switch (activeFilters.sort) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
        break;
      case "relevance":
      default:
        // Already sorted by relevance from API usually
        break;
    }

    return filtered;
  }, [results, activeFilters]);

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
  };

  const handleRecentSearchPress = (term: string) => {
    setQuery(term);
    saveRecentSearch(term); // Move to top
  };

  const handleGenrePress = (genre: string) => {
    setQuery(genre);
    saveRecentSearch(genre);
  };

  const hasActiveFilters = useMemo(() => {
    return JSON.stringify(activeFilters) !== JSON.stringify(INITIAL_FILTERS);
  }, [activeFilters]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <SearchHeader
        query={query}
        setQuery={setQuery}
        onSubmitEditing={handleSearchSubmit}
        onFilterPress={() => setFilterSheetVisible(true)}
        hasActiveFilters={hasActiveFilters}
      />

      <View className="flex-1">
        {query.trim().length === 0 ? (
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          >
            <RecentSearches
              searches={recentSearches}
              onSearchPress={handleRecentSearchPress}
              onClearAll={clearRecentSearches}
            />
            <GenreGrid onGenrePress={handleGenrePress} />
            <TrendingNow />
          </ScrollView>
        ) : (
          <SearchResults
            results={displayedResults}
            loading={loading}
            onMoviePress={() => saveRecentSearch(query)}
          />
        )}
      </View>

      <FilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        currentFilters={activeFilters}
        onApply={setActiveFilters}
      />
    </SafeAreaView>
  );
}