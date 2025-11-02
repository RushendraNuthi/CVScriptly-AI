import { useState, useCallback, useMemo } from 'react';

// A simple deep equality check. For complex objects, a library like fast-deep-equal might be better,
// but for this resume data structure, JSON.stringify is sufficient and avoids extra dependencies.
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const useHistoryState = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = useMemo(() => history[currentIndex], [history, currentIndex]);

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    const newState = typeof action === 'function' ? (action as (prevState: T) => T)(state) : action;
    
    // Do nothing if the state hasn't changed to avoid polluting the history.
    if (isEqual(newState, state)) {
      return;
    }

    // When a new state is set, we discard any "redo" history.
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history, state]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

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
