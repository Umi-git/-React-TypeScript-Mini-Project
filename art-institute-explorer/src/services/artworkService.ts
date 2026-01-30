import { ArtworkResponseSchema, type Artwork } from '../schemas/artworkSchema';

const BASE_URL = 'https://api.artic.edu/api/v1';

/**
 * Constructs the IIIF image URL for an artwork
 * @param imageId - The image_id from the artwork data
 * @param size - Image width (default: 843px)
 * @returns Full IIIF image URL
 */
export function getImageUrl(imageId: string | null, size: number = 843): string | null {
  if (!imageId) return null;
  return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`;
}

/**
 * Search for artworks in the Art Institute of Chicago collection
 * @param query - Search query string
 * @param page - Page number (default: 1)
 * @param limit - Number of results per page (default: 12)
 * @returns Promise resolving to validated artwork data
 * @throws Error if API request fails or data validation fails
 */
export async function searchArtworks(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<{ artworks: Artwork[]; total: number }> {
  try {
    // Construct the search URL with parameters
    const url = `${BASE_URL}/artworks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&fields=id,title,artist_title,image_id,date_display,medium_display,dimensions,credit_line,department_title,artwork_type_title,is_public_domain`;

    // Fetch data from the API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    // Parse JSON response
    const jsonData = await response.json();

    // Validate the response data with Zod
    const validationResult = ArtworkResponseSchema.safeParse(jsonData);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      throw new Error('Invalid data received from API. Data does not match expected schema.');
    }

    // Return validated data
    return {
      artworks: validationResult.data.data,
      total: validationResult.data.pagination.total,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search artworks: ${error.message}`);
    }
    throw new Error('An unknown error occurred while searching artworks');
  }
}

/**
 * Fetch a single artwork by ID
 * @param id - Artwork ID
 * @returns Promise resolving to a single validated artwork
 * @throws Error if API request fails or data validation fails
 */
export async function getArtworkById(id: number): Promise<Artwork> {
  try {
    const url = `${BASE_URL}/artworks/${id}?fields=id,title,artist_title,image_id,date_display,medium_display,dimensions,credit_line,department_title,artwork_type_title,is_public_domain`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();

    // For single artwork, we just validate the data object directly
    const validationResult = ArtworkSchema.safeParse(jsonData.data);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      throw new Error('Invalid artwork data received from API');
    }

    return validationResult.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch artwork: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching artwork');
  }
}

/**
 * Search for artworks with public domain filter
 * Convenience function for searching only public domain artworks
 */
export async function searchPublicDomainArtworks(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<{ artworks: Artwork[]; total: number }> {
  try {
    // Using Elasticsearch query for public domain filter
    const url = `${BASE_URL}/artworks/search?q=${encodeURIComponent(query)}&query[term][is_public_domain]=true&page=${page}&limit=${limit}&fields=id,title,artist_title,image_id,date_display,medium_display,dimensions,credit_line,department_title,artwork_type_title,is_public_domain`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();
    const validationResult = ArtworkResponseSchema.safeParse(jsonData);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      throw new Error('Invalid data received from API');
    }

    return {
      artworks: validationResult.data.data,
      total: validationResult.data.pagination.total,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search public domain artworks: ${error.message}`);
    }
    throw new Error('An unknown error occurred while searching public domain artworks');
  }
}