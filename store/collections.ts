import { Collection, MediaItem } from '@/types/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CollectionsState {
    collections: Collection[];
    savedItemIds: Record<string, boolean>; // O(1) lookups: `mergedId` -> true. Tracks if item is in ANY collection.
    createCollection: (title: string) => void;
    deleteCollection: (id: string) => void;
    addItem: (collectionId: string, item: MediaItem) => void;
    removeItem: (collectionId: string, itemId: number) => void;
    renameCollection: (id: string, newTitle: string) => void;
    isItemInAnyCollection: (itemId: number) => boolean;
    isItemInCollection: (collectionId: string, itemId: number) => boolean;
}

export const useCollectionsStore = create<CollectionsState>()(
    persist(
        (set, get) => ({
            collections: [
                {
                    id: 'default-watchlist',
                    title: 'Watchlist',
                    isDefault: true,
                    items: [],
                    createdAt: Date.now(),
                },
            ],
            savedItemIds: {},

            createCollection: (title) => {
                const newCollection: Collection = {
                    id: Crypto.randomUUID(),
                    title,
                    items: [],
                    createdAt: Date.now(),
                };
                set((state) => ({
                    collections: [...state.collections, newCollection],
                }));
            },

            deleteCollection: (id) => {
                set((state) => {
                    const collectionToDelete = state.collections.find((c) => c.id === id);
                    if (!collectionToDelete || collectionToDelete.isDefault) return state;

                    const newCollections = state.collections.filter((c) => c.id !== id);

                    // Rebuild savedItemIds
                    const newSavedItemIds: Record<string, boolean> = {};
                    newCollections.forEach(col => {
                        col.items.forEach(item => {
                            newSavedItemIds[item.id] = true;
                        });
                    });

                    return {
                        collections: newCollections,
                        savedItemIds: newSavedItemIds
                    };
                });
            },

            addItem: (collectionId, item) => {
                set((state) => {
                    const collectionIndex = state.collections.findIndex((c) => c.id === collectionId);
                    if (collectionIndex === -1) return state;

                    const collection = state.collections[collectionIndex];
                    if (collection.items.some((i) => i.id === item.id)) return state; // Prevent duplicates in SAME list

                    const newItems = [item, ...collection.items];
                    const newCollections = [...state.collections];
                    newCollections[collectionIndex] = { ...collection, items: newItems };

                    return {
                        collections: newCollections,
                        savedItemIds: { ...state.savedItemIds, [item.id]: true },
                    };
                });
            },

            removeItem: (collectionId, itemId) => {
                set((state) => {
                    const collectionIndex = state.collections.findIndex((c) => c.id === collectionId);
                    if (collectionIndex === -1) return state;

                    const collection = state.collections[collectionIndex];
                    const newItems = collection.items.filter((i) => i.id !== itemId);

                    const newCollections = [...state.collections];
                    newCollections[collectionIndex] = { ...collection, items: newItems };

                    // Check if item exists in ANY other collection
                    let stillExists = false;
                    for (const col of newCollections) {
                        if (col.items.some(i => i.id === itemId)) {
                            stillExists = true;
                            break;
                        }
                    }

                    const newSavedItemIds = { ...state.savedItemIds };
                    if (!stillExists) {
                        delete newSavedItemIds[itemId];
                    }

                    return {
                        collections: newCollections,
                        savedItemIds: newSavedItemIds
                    };
                });
            },

            renameCollection: (id, newTitle) => {
                set((state) => ({
                    collections: state.collections.map((c) =>
                        c.id === id ? { ...c, title: newTitle } : c
                    ),
                }));
            },

            isItemInAnyCollection: (itemId) => {
                return !!get().savedItemIds[itemId];
            },

            isItemInCollection: (collectionId, itemId) => {
                const collection = get().collections.find(c => c.id === collectionId);
                return collection ? collection.items.some(i => i.id === itemId) : false;
            }
        }),
        {
            name: 'collections-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
