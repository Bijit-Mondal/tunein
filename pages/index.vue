<script setup lang="ts">
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ForwardIcon, BackwardIcon } from '@heroicons/vue/24/solid';

const currentGif = ref('');
const { 
  isPlaying, 
  isMuted, 
  isLoading,
  play, 
  pause, 
  nextTrack, 
  previousTrack,
  toggleMute, 
  getCurrentTrack 
} = useTrackManager();

const gifs = [
  'https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif',
  'https://i.giphy.com/iDvCzaRjNV61J5jtc0.webp',
  'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHg5ZHhkemJmbDMwcGZ3MmRxMm5sY29nbTNrMXVpbHVhZXlmaGUyMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XbJYBCi69nyVOffLIU/giphy.webp',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGhmanhtZzhrenRiNHJlMW5xYW9reWE5eWJtYmllYmZobGZ0M2ZtaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RMwgs5kZqkRyhF24KK/giphy.webp',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHFiaml2MG92bXhuaWR2bHVycmlnNzUyeGI0OXZrMnF3MTI4ejhreCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SrM826tgscTMzJpNFg/giphy.webp',
  'https://media.giphy.com/media/WoWm8YzFQJg5i/giphy.gif',
  'https://media.giphy.com/media/3o7aCZDlmQZLe4Q4V2/giphy.gif',
];

const changeBackground = () => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  currentGif.value = gifs[randomIndex];
};

const togglePlay = async () => {
  if (isPlaying.value) {
    pause();
  } else {
    await play();
  }
};

const handleKeyPress = async (e: KeyboardEvent) => {
  if (isLoading.value) return; // Prevent actions while loading

  switch(e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      await togglePlay();
      break;
    case 'm':
      toggleMute();
      break;
    case 'n':
      changeBackground();
      break;
    case 'arrowright':
      await nextTrack();
      break;
    case 'arrowleft':
      await previousTrack();
      break;
  }
};

onMounted(() => {
  changeBackground();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <Head>
      <Title>tune in ✨</Title>
    </Head>
    <!-- Background -->
    <div class="absolute inset-0">
      <img :src="currentGif" class="w-full h-full object-cover" alt="lofi background" />
    </div>
    
    <div class="absolute inset-0 bg-overlay">
      <!-- Title -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2">
        <h1 class="font-vt text-6xl md:text-8xl text-primary animate-pulse-slow">
          tune in ✨
        </h1>
        <p class="text-center text-lofi-light font-space mt-4">
          <template v-if="isLoading">Loading next track...</template>
          <template v-else-if="getCurrentTrack()">
            Now Playing: {{ getCurrentTrack()?.name }}
          </template>
          <template v-else>
            Press play to start the vibes
          </template>
        </p>
      </div>

      <!-- Controls - Left Side -->
      <div class="absolute bottom-10 left-10">
        <div class="flex flex-col items-center space-y-6 float-animation">
          <button @click="togglePlay" 
                  :disabled="isLoading"
                  class="p-6 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300 vibe-shadow pixel-corners disabled:opacity-50 disabled:cursor-not-allowed">
            <template v-if="isLoading">
              <div class="w-16 h-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </template>
            <template v-else>
              <PlayIcon v-if="!isPlaying" class="w-16 h-16 text-primary" />
              <PauseIcon v-else class="w-16 h-16 text-primary" />
            </template>
          </button>
          
          <div class="flex space-x-4">
            <button @click="toggleMute" 
                    :disabled="isLoading"
                    class="p-4 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <SpeakerWaveIcon v-if="!isMuted" class="w-8 h-8 text-primary" />
              <SpeakerXMarkIcon v-else class="w-8 h-8 text-primary" />
            </button>
            
            <button @click="previousTrack" 
                    :disabled="isLoading"
                    class="p-4 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <BackwardIcon class="w-8 h-8 text-primary" />
            </button>
            
            <button @click="nextTrack" 
                    :disabled="isLoading"
                    class="p-4 rounded-full bg-lofi-dark/40 hover:bg-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">←</kbd>
              <span>previous track</span>
            </div>
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">→</kbd>
              <span>next track</span>
            </div>
            <div class="flex items-center space-x-3">
              <kbd class="px-2 py-1 bg-primary/20 rounded text-primary font-vt">n</kbd>
              <span>new background</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
