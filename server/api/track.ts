import { randomBytes } from 'crypto'

interface ImageQuality {
  quality: string;
  url: string;
}

interface Artist {
  id: string;
  name: string;
  role: string;
  type: string;
  image: ImageQuality[];
  url: string;
}

interface Album {
  id: string | null;
  name: string | null;
  url: string | null;
}

interface Artists {
  primary: Artist[];
  featured: Artist[];
  all: Artist[];
}

interface Lyrics {
  lyrics: string;
  copyright: string;
  snippet: string;
}

interface SongResult {
  id: string;
  name: string;
  type: string;
  year: string | null;
  releaseDate: string | null;
  duration: number | null;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  lyrics?: Lyrics;
  url: string;
  copyright: string | null;
  album: Album;
  artists: Artists;
  image: ImageQuality[];
  downloadUrl: ImageQuality[];
}

export interface SearchResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: SongResult[];
  };
}

const queries = [
  'Anupam Roy',
  'anindya chatterjee',
  'Arijit Singh Bengali',
  'Bengali Lofi',
  'Anjan Dutta',
  'Bengali Romantic',
  'Rabindranath Tagore Bengali',
  'Rabindranath Tagore Lofi',
  'baishe srabon', 
  'Taalpatar',
  'Bengali Folk',
  'Rupam Islam', 
  'Bengali', 
  'Song',
  'Bojhena Shey Bojhena',
  'baishe srabon',
  'Anupam Roy', 
  'Hasnuhana',
  'Nilanjana I',
  'Nachiketa Bengali',
  'Rabindranath Tagore',
];

export default defineEventHandler(async (event) => {
  try {
    // Get 1 or 2 random queries
    const numQueries = parseInt(randomBytes(1).toString('hex'), 16) % 2 + 1;
    const selectedQueries: string[] = [];
    
    while (selectedQueries.length < numQueries) {
      const randomIndex = Math.floor(Math.random() * queries.length);
      const query = queries[randomIndex];
      if (!selectedQueries.includes(query)) {
        selectedQueries.push(query);
      }
    }

    const query = selectedQueries.join(' ');
    const data = await $fetch<SearchResponse>(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    return data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch songs'
    });
  }
})
