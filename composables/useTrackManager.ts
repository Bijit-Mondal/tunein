import { ref } from 'vue';
import { Howl } from 'howler';

export interface Track {
  name: string;
  url: string;
}

export function useTrackManager() {
  const currentTrackIndex = ref(0);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const volume = ref(0.5);
  const tracks = ref<Track[]>([]);
  const isLoading = ref(false);

  let sound: Howl;

  const fetchNextTrack = async () => {
    try {
      isLoading.value = true;
      const response = await fetch('/api/songs');
      const track = await response.json();
      if (track) {
        tracks.value.push(track);
      }
    } catch (error) {
      console.error('Error fetching next track:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const initializeSound = () => {
    if (tracks.value.length === 0) return;
    
    sound = new Howl({
      src: [tracks.value[currentTrackIndex.value].url],
      loop: false,
      volume: volume.value,
      onend: () => {
        nextTrack();
      }
    });
  };

  const play = async () => {
    if (tracks.value.length === 0) {
      await fetchNextTrack();
    }

    if (!sound) {
      initializeSound();
    }

    if (sound) {
      sound.play();
      isPlaying.value = true;
    }
  };

  const pause = () => {
    if (sound) {
      sound.pause();
      isPlaying.value = false;
    }
  };

  const nextTrack = async () => {
    if (sound) {
      sound.stop();
    }

    // Fetch next track if we're running low
    if (currentTrackIndex.value >= tracks.value.length - 2) {
      await fetchNextTrack();
    }

    if (currentTrackIndex.value < tracks.value.length - 1) {
      currentTrackIndex.value++;
    } else {
      currentTrackIndex.value = 0;
    }

    sound = new Howl({
      src: [tracks.value[currentTrackIndex.value].url],
      loop: false,
      volume: volume.value,
      onend: () => {
        nextTrack();
      }
    });

    if (isPlaying.value) {
      sound.play();
    }
  };

  const previousTrack = () => {
    if (sound) {
      sound.stop();
    }

    if (currentTrackIndex.value > 0) {
      currentTrackIndex.value--;
    } else {
      currentTrackIndex.value = tracks.value.length - 1;
    }

    sound = new Howl({
      src: [tracks.value[currentTrackIndex.value].url],
      loop: false,
      volume: volume.value,
      onend: () => {
        nextTrack();
      }
    });

    if (isPlaying.value) {
      sound.play();
    }
  };

  const toggleMute = () => {
    if (sound) {
      isMuted.value = !isMuted.value;
      sound.mute(isMuted.value);
    }
  };

  const setVolume = (value: number) => {
    volume.value = value;
    if (sound) {
      sound.volume(value);
    }
  };

  const getCurrentTrack = () => {
    if (tracks.value.length === 0) return null;
    return tracks.value[currentTrackIndex.value];
  };

  return {
    isPlaying,
    isMuted,
    volume,
    isLoading,
    play,
    pause,
    nextTrack,
    previousTrack,
    toggleMute,
    setVolume,
    getCurrentTrack
  };
}
