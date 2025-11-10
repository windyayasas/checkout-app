"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

interface DataBootstrapProps {
  userId: string;
}

// Mount this high in the tree (e.g., dashboard layout) once userId is known.
export function DataBootstrap({ userId }: DataBootstrapProps) {
  useEffect(() => {
    if (userId) {
      useAppStore.getState().init(userId);
      return () => useAppStore.getState().cleanup();
    }
  }, [userId]);
  return null;
}
