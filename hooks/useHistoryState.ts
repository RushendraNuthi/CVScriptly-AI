import { useState, useCallback, useMemo } from 'react';

// A simple deep equality check. For complex objects, a library like fast-deep-equal might be better,
// but for this resume data structure, JSON.stringify is sufficient and avoids extra dependencies.
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const useHistoryState = <T>(initialState: T, key: string = 'resume_data') => {
  const [history, setHistory] = useState<T[]>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Shallow merge to ensure new top-level keys in initialState are present even if missing in saved data
        return [{ ...initialState, ...parsed }];
      }
      return [initialState];
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return [initialState];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = useMemo(() => history[currentIndex], [history, currentIndex]);

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    const newState = typeof action === 'function' ? (action as (prevState: T) => T)(state) : action;

    // Do nothing if the state hasn't changed to avoid polluting the history.
    if (isEqual(newState, state)) {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // When a new state is set, we discard any "redo" history.
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history, state, key]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      try {
        localStorage.setItem(key, JSON.stringify(history[newIndex]));
      } catch (e) {
        console.error('Failed to save to localStorage on undo:', e);
      }
    }
  }, [currentIndex, history, key]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      try {
        localStorage.setItem(key, JSON.stringify(history[newIndex]));
      } catch (e) {
        console.error('Failed to save to localStorage on redo:', e);
      }
    }
  }, [currentIndex, history.length, key]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
