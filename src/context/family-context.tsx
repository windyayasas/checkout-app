"use client";

import * as React from 'react';

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  avatarHint: string;
}

export interface Family {
  id: string;
  name: string;
  members: Member[];
}

interface FamilyContextType {
  families: Family[];
  selectedFamily: Family | null;
  hasFamilies: boolean;
  setSelectedFamily: (family: Family) => void;
  addFamily: (familyName: string) => void;
  isLoading: boolean;
  currency: string;
  setCurrency: (currency: string) => void;
}

const FamilyContext = React.createContext<FamilyContextType | undefined>(undefined);

// Mock data - set to false to see the "no family" state
const MOCK_USER_STARTS_WITH_FAMILIES = true;

const initialUserFamilies: Family[] = [
  {
    id: '1',
    name: 'The Simpsons',
    members: [
      { id: 'm1', name: 'Homer', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon man' },
      { id: 'm2', name: 'Marge', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon woman blue hair' },
      { id: 'm3', name: 'Bart', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon boy' },
      { id: 'm4', name: 'Lisa', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon girl' },
    ],
  },
  {
    id: '2',
    name: 'The Griffins',
    members: [
      { id: 'm5', name: 'Peter', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon man fat' },
      { id: 'm6', name: 'Lois', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon woman red hair' },
      { id: 'm7', name: 'Stewie', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon baby' },
    ],
  },
];


export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [families, setFamilies] = React.useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = React.useState<Family | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currency, setCurrencyState] = React.useState<string>('USD');

  React.useEffect(() => {
    // Load currency from localStorage
    const savedCurrency = localStorage.getItem('family-app-currency');
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }

    // Simulate fetching family data
    setTimeout(() => {
      const fetchedFamilies = MOCK_USER_STARTS_WITH_FAMILIES ? initialUserFamilies : [];
      setFamilies(fetchedFamilies);
      if (fetchedFamilies.length > 0) {
        setSelectedFamily(fetchedFamilies[0]);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const addFamily = (familyName: string) => {
    const newFamily: Family = { 
        id: Date.now().toString(), 
        name: familyName,
        members: [
            { id: 'user', name: 'You', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person' }
        ]
    };
    setFamilies(prev => [...prev, newFamily]);
    setSelectedFamily(newFamily);
  };
  
  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('family-app-currency', newCurrency);
  };

  const hasFamilies = families.length > 0;

  return (
    <FamilyContext.Provider value={{ families, selectedFamily, hasFamilies, setSelectedFamily, addFamily, isLoading, currency, setCurrency }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = React.useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
