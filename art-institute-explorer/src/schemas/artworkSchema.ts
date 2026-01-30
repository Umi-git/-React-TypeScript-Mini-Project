import { z } from 'zod';


export const ArtworkSchema = z.object({
  id: z.number(),
  title: z.string().default('Untitled'),
  artist_title: z.string().nullable().default('Unknown Artist'),
  image_id: z.string().nullable(),
  date_display: z.string().nullable().default('Date unknown'),
  medium_display: z.string().nullable().default('Medium unknown'),
  dimensions: z.string().nullable().default('Dimensions not available'),
  credit_line: z.string().nullable().default(''),
  department_title: z.string().nullable().default(''),
  artwork_type_title: z.string().nullable().default(''),
  is_public_domain: z.boolean().default(false),
});


export type Artwork = z.infer<typeof ArtworkSchema>;


export const ArtworkResponseSchema = z.object({
  data: z.array(ArtworkSchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
  }),
  config: z.object({
    iiif_url: z.string(),
    website_url: z.string(),
  }),
});

export type ArtworkResponse = z.infer<typeof ArtworkResponseSchema>;


export const ArtworkDetailResponseSchema = z.object({
  data: ArtworkSchema,
  config: z.object({
    iiif_url: z.string(),
    website_url: z.string(),
  }),
});

export type ArtworkDetailResponse = z.infer<typeof ArtworkDetailResponseSchema>;