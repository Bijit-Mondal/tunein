<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ForwardIcon } from '@heroicons/vue/24/solid';

const currentGif = ref('');
const { isPlaying, isMuted, togglePlay, toggleMute, nextTrack, getCurrentTrack, cleanup } = useTrackManager();

const gifs = [
  'https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif',
  'https://i.giphy.com/iDvCzaRjNV61J5jtc0.webp',
  'https://media.giphy.com/media/WoWm8YzFQJg5i/giphy.gif',
  'https://media.giphy.com/media/3o7aCZDlmQZLe4Q4V2/giphy.gif',
  'https://media.giphy.com/media/f73urdknsWaIg/giphy.gif',
];

const changeBackground = () => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  currentGif.value = gifs[randomIndex];
};

const handleKeyPress = (e: KeyboardEvent) => {
  switch(e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      togglePlay();
      break;
    case 'm':
      toggleMute();
      break;
    case 'n':
      changeBackground();
      break;
    case 'arrowright':
      nextTrack();
      break;
  }
};

onMounted(() => {
  changeBackground();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  cleanup();
});
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0">
      <img :src="currentGif" class="w-full h-full object-cover" alt="lofi background" />
    </div>
    
    <div class="absolute inset-0 bg-overlay">
      <!-- Title -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2">
        <h1 class="font-vt text-6xl md:text-8xl text-primary animate-pulse-slow">
          lofi vibes ✨
        </h1>
        <p class="text-center text-lofi-light font-space mt-4">
          Now Playing: {{ getCurrentTrack().name }}
        </p>
      </div>

      <!-- Controls - Left Side -->
      <div class="absolute bottom-10 left-10">
        <div class="flex flex-col items-center space-y-6 float-animation">
          <button @click="togglePlay" 
                  class="p-6 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300 vibe-shadow pixel-corners">
            <PlayIcon v-if="!isPlaying" class="w-16 h-16 text-primary" />
            <PauseIcon v-else class="w-16 h-16 text-primary" />
          </button>
          
          <div class="flex space-x-4">
            <button @click="toggleMute" 
                    class="p-4 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300">
              <SpeakerWaveIcon v-if="!isMuted" class="w-8 h-8 text-primary" />
              <SpeakerXMarkIcon v-else class="w-8 h-8 text-primary" />
            </button>
            
            <button @click="nextTrack" 
                    class="p-4 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300">
              <ForwardIcon class="w-8 h-8 text-primary" />
            </button>
          </div>
        </div>
      </div>

      <!-- Keybindings - Right Side -->
      <div class="absolute bottom-10 right-10">
        <div class="bg-lofi-dark/40 p-6 rounded-lg pixel-corners backdrop-blur-sm">
          <div class="font-space text-lofi-light space-y-3">
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">space</kbd>
              <span>play/pause</span>
            </div>
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">m</kbd>
              <span>mute/unmute</span>
            </div>
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">n</kbd>
              <span>new background</span>
            </div>
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">→</kbd>
              <span>next track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>