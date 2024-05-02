import { Result, History } from '@/types';
import React, { createContext, useState, useContext } from 'react';

type Props = {
  children: React.ReactNode
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  history: History;
  setHistory: (results: History) => void;
  results: Result;
  setResults: (results: Result) => void;
  selectedHistory?: string;
  setSelectedHistory: (history: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  loading: true,
  setLoading: () => {},
  history: {},
  setHistory: () => {},
  results: {},
  setResults: () => {},
  selectedHistory: '',
  setSelectedHistory: () => {}
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider: React.FC<Props> = ({ children }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<History>({})
  const [results, setResults] = useState<Result>({})
  const [selectedHistory, setSelectedHistory] = useState<string>('')

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, loading, setLoading, results, setResults, history, setHistory, selectedHistory, setSelectedHistory }}>
      {children}
    </SearchContext.Provider>
  );
};