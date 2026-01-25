"use client";

import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/data/activity-types';

const FAVORITES_STORAGE_KEY = 'activitySuggesterFavorites';

interface UseActivitySuggesterReturn {
  favorites: Activity[];
  isLoaded: boolean;
  addFavorite: (activity: Activity) => void;
  removeFavorite: (activityId: string) => void;
  isFavorite: (activityId: string) => boolean;
}

export function useActivitySuggester(): UseActivitySuggesterReturn {
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((activity: Activity) => {
    setFavorites(prev => {
      // Don't add duplicates
      if (prev.some(f => f.id === activity.id)) {
        return prev;
      }
      return [...prev, activity];
    });
  }, []);

  const removeFavorite = useCallback((activityId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== activityId));
  }, []);

  const isFavorite = useCallback((activityId: string): boolean => {
    return favorites.some(f => f.id === activityId);
  }, [favorites]);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
