import { useState, FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Don't search if query is empty or only whitespace
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks (e.g., Monet, impressionism, landscapes...)"
            className="search-input"
            disabled={isLoading}
            aria-label="Search artworks"
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !query.trim()}
            aria-label="Search"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              <>
                <span className="search-icon">🔍</span>
                Search
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
