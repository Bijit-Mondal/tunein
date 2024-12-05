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

  const tracks: Track[] = [
    { name: "Boba Tunnel", url: 'https://aac.saavncdn.com/097/b6f9b99f80d3a76d96af9e469f9bf0b8_160.mp4' },
    { name: "Nilanjana I", url: 'https://aac.saavncdn.com/682/c2ce871e95e247b3349d381badcc84b4_sar_320.mp4' },
    { name: "2441139", url: 'https://aac.saavncdn.com/658/dd4f52aeb63c80cebcce8fac843cce30_320.mp4' }
  ];

  let sound: Howl;

  const initializeSound = () => {
    sound = new Howl({
      src: [tracks[currentTrackIndex.value].url],
      loop: false,
      volume: volume.value,
      onend: () => {
        nextTrack();
      }
    });
  };

  const togglePlay = () => {
    if (!sound) {
      initializeSound();
    }
    
    if (isPlaying.value) {
      sound.pause();
    } else {
      sound.play();
    }
    isPlaying.value = !isPlaying.value;
  };

  const toggleMute = () => {
    if (!sound) return;
    
    if (isMuted.value) {
      sound.volume(volume.value);
    } else {
      sound.volume(0);
    }
    isMuted.value = !isMuted.value;
  };

  const nextTrack = () => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
    initializeSound();
    
    if (isPlaying.value) {
      sound.play();
    }
  };

  const getCurrentTrack = () => tracks[currentTrackIndex.value];

  const cleanup = () => {
    if (sound) {
      sound.unload();
    }
  };

  return {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    nextTrack,
    getCurrentTrack,
    cleanup
  };
}
