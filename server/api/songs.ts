import type { SearchResponse } from './track'

interface QueuedSong {
  name: string;
  url: string;
}

// Queue to store songs
let songQueue: QueuedSong[] = [];

// Function to get highest quality download URL
const getHighestQualityUrl = (downloadUrls: { quality: string; url: string; }[]): string => {
  const qualityPriority = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
  
  for (const quality of qualityPriority) {
    const url = downloadUrls.find(d => d.quality === quality)?.url;
    if (url) return url;
  }
  
  return downloadUrls[0]?.url || '';
};

// Function to fetch and add more songs to queue
const replenishQueue = async () => {
  try {
    const response = await $fetch<SearchResponse>('/api/track');
    if (response.success && response.data.results) {
      const newSongs = response.data.results.map(song => ({
        name: song.name,
        url: getHighestQualityUrl(song.downloadUrl)
      }));
      songQueue.push(...newSongs);
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
};

export default defineEventHandler(async (event) => {
  try {
    // If queue is running low, replenish it
    if (songQueue.length < 5) {
      await replenishQueue();
    }

    // If queue is still empty after replenishment, throw error
    if (songQueue.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'No songs available'
      });
    }

    // Return and remove the first song from queue
    return songQueue.shift();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in songs endpoint:', error);
      throw createError({
        statusCode: 500, // Default to 500 if statusCode is not available
        message: error.message || 'Failed to get song'
      });
    } else {
      // Handle unexpected error types
      console.error('Unexpected error:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to get song'
      });
    }
  }
});
