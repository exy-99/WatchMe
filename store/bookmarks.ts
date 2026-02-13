import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BookmarkItem {
    id: number | string;
    type: 'movie' | 'tv' | 'anime';
    title: string;
    poster: string;
    year?: string;
    timestamp: number;
}

interface BookmarkState {
    bookmarks: Record<string, BookmarkItem>; // ID -> Item map for O(1) checks
    toggleBookmark: (item: BookmarkItem) => void;
    isBookmarked: (id: number | string) => boolean;
    getBookmarksList: () => BookmarkItem[];
}

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set, get) => ({
            bookmarks: {},

            toggleBookmark: (item) => {
                set((state) => {
                    const exists = !!state.bookmarks[item.id];
                    const newBookmarks = { ...state.bookmarks };

                    if (exists) {
                        delete newBookmarks[item.id];
                    } else {
                        newBookmarks[item.id] = item;
                    }

                    return { bookmarks: newBookmarks };
                });
            },

            isBookmarked: (id) => {
                return !!get().bookmarks[id];
            },

            getBookmarksList: () => {
                return Object.values(get().bookmarks).sort((a, b) => b.timestamp - a.timestamp);
            }
        }),
        {
            name: 'bookmarks-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
