import type { Artwork } from '../schemas/artworkSchema';
import { getImageUrl } from '../services/artworkService';
import './ArtworkCard.css';

interface ArtworkCardProps {
  artwork: Artwork;
  onAddToGallery?: (artwork: Artwork) => void;
  showAddButton?: boolean;
  actionButton?: React.ReactNode;
}

export default function ArtworkCard({ 
  artwork, 
  onAddToGallery,
  showAddButton = true,
  actionButton
}: ArtworkCardProps) {
  const imageUrl = getImageUrl(artwork.image_id);

  const handleAddToGallery = () => {
    if (onAddToGallery) {
      onAddToGallery(artwork);
    }
  };

  return (
    <div className="artwork-card">
      <div className="artwork-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={artwork.title}
            className="artwork-image"
            loading="lazy"
          />
        ) : (
          <div className="artwork-no-image">
            <span className="no-image-icon">🖼️</span>
            <p>No image available</p>
          </div>
        )}
      </div>

      <div className="artwork-info">
        <h3 className="artwork-title">{artwork.title}</h3>
        <p className="artwork-artist">
          {artwork.artist_title || 'Unknown Artist'}
        </p>
        
        {artwork.date_display && (
          <p className="artwork-date">{artwork.date_display}</p>
        )}

        {artwork.medium_display && (
          <p className="artwork-medium">{artwork.medium_display}</p>
        )}

        {artwork.is_public_domain && (
          <span className="public-domain-badge">Public Domain</span>
        )}

        <div className="artwork-actions">
          {actionButton ? (
            actionButton
          ) : (
            showAddButton && onAddToGallery && (
              <button 
                onClick={handleAddToGallery}
                className="add-to-gallery-button"
                aria-label={`Add ${artwork.title} to gallery`}
              >
                <span className="button-icon">➕</span>
                Add to Gallery
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
