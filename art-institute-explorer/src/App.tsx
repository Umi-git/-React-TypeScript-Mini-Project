import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ArtworkCard from './components/ArtworkCard';
import { searchArtworks } from './services/artworkService';
import type { Artwork } from './schemas/artworkSchema';
import './App.css';

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setHasSearched(true);

    try {
      const result = await searchArtworks(query, 1, 12);
      setArtworks(result.artworks);
      
      if (result.artworks.length === 0) {
        setError(`No artworks found for "${query}". Try a different search term.`);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? `Search failed: ${err.message}` 
          : 'An unexpected error occurred. Please try again.'
      );
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGallery = (artwork: Artwork) => {
    console.log('Adding to gallery:', artwork);
    alert(`"${artwork.title}" will be added to gallery! (Feature coming in Day 2)`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎨 Art Institute Explorer</h1>
        <p className="app-subtitle">
          Discover and explore masterpieces from the Art Institute of Chicago
        </p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for artworks...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h2>Start Your Art Journey</h2>
            <p>Search for artworks by artist, style, or subject</p>
            <div className="search-suggestions">
              <p className="suggestions-label">Try searching for:</p>
              <div className="suggestion-chips">
                <button onClick={() => handleSearch('monet')} className="suggestion-chip">
                  Monet
                </button>
                <button onClick={() => handleSearch('impressionism')} className="suggestion-chip">
                  Impressionism
                </button>
                <button onClick={() => handleSearch('van gogh')} className="suggestion-chip">
                  Van Gogh
                </button>
                <button onClick={() => handleSearch('sculpture')} className="suggestion-chip">
                  Sculpture
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && artworks.length > 0 && (
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">
                Search Results for "{currentQuery}"
              </h2>
              <p className="results-count">
                {artworks.length} artwork{artworks.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="artworks-grid">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onAddToGallery={handleAddToGallery}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Data provided by the{' '}
          <a
            href="https://www.artic.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Art Institute of Chicago
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
