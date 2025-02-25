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
  'https://bijit.xyz/cockpit-master/storage/uploads/2024/12/07/lofi79_uid_6753c0587705d.gif',
  'https://bijit.xyz/cockpit-master/storage/uploads/2024/12/07/lofi81_uid_6753c03b18301.gif',
  'https://bijit.xyz/cockpit-master/storage/uploads/2024/12/07/lofi51_uid_6753bf80911ab.gif',
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
      <div class="absolute bottom-10 md:left-10 left-1/2 md:translate-x-0 -translate-x-1/2">
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
      <div class="hidden md:block absolute bottom-10 right-10">
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

<div class="room-container">
   <h2>Welcome to TuneIn Rooms</h2>
    
    <button @click="createRoom">Create Room</button>
    
    <input v-model="roomId" placeholder="Enter Room ID" />
    <button @click="joinRoom">Join Room</button>

    <p v-if="currentRoom">Connected to Room: {{ currentRoom }}</p>

    <!-- Video/Audio elements for streaming -->
    <video ref="myVideo" autoplay playsinline></video>
    <video ref="peerVideo" autoplay playsinline></video>
  </div>
</template>

<script>
import Peer from 'peerjs';

export default {
  data() {
    return {
      peer: null,
      conn: null,
      roomId: '',
      currentRoom: null,
      myStream: null,
    };
  },
  methods: {
    async createRoom() {
      // Generate a random Room ID
      const newRoomId = Math.random().toString(36).substr(2, 9);
      this.peer = new Peer(newRoomId, { host: 'your-server.com', port: 9000, path: '/myapp' });
      this.currentRoom = newRoomId;
      this.setupPeerEvents();
    },
    async joinRoom() {
      if (!this.roomId) return alert("Please enter a Room ID!");

      this.peer = new Peer({ host: 'your-server.com', port: 9000, path: '/myapp' });
      this.currentRoom = this.roomId;

      this.peer.on('open', () => {
        this.conn = this.peer.connect(this.roomId);
        this.conn.on('open', () => {
          console.log("Connected to Room: ", this.roomId);
        });
      });

      this.setupPeerEvents();
    },
    async setupPeerEvents() {
      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          console.log("Received data:", data);
        });
      });

      // Handle media stream
      this.peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          call.answer(stream);
          call.on('stream', (peerStream) => {
            this.$refs.peerVideo.srcObject = peerStream;
          });
        });
      });

      // Get user media
      this.myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.$refs.myVideo.srcObject = this.myStream;
    }
  }
};
</script>

<style>
.room-container {
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6); /* Dark overlay for readability */
    border-radius: 10px;
    width: 50%;
    margin: 50px auto;
    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
}

h2 {
    color: #ff4d4d; /* Vibrant red like your 'tune in' text */
    font-family: 'VT323', monospace;
    font-size: 2rem;
}

button {
    background: rgba(255, 77, 77, 0.8); /* Matching button style */
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    background: rgba(255, 77, 77, 1);
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.8);
}

input {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px;
    border: 2px solid #ff4d4d;
    border-radius: 5px;
    outline: none;
    font-size: 16px;
    margin: 10px;
}

video {
    width: 40%;
    border: 3px solid rgba(255, 77, 77, 0.8);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.5);
    margin: 20px;
}
</style>