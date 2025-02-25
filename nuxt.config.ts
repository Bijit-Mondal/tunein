// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  typescript: {
    typeCheck: false
  },

  css: ['~/assets/css/style.css'],
  modules: ['@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
        }
      ],
      script: [
        {
          src: 'https://cdn.splitbee.io/sb.js',
          async: true
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.3.1/peerjs.min.js', // ✅ Added PeerJS client
          defer: true
        }
      ],
    }
  },

  runtimeConfig: {
    public: {
      peerServerHost: process.env.PEER_SERVER_HOST || 'your-server.com', // ✅ Define PeerJS host
      peerServerPort: process.env.PEER_SERVER_PORT || 9000, // ✅ Define PeerJS port
      peerServerPath: process.env.PEER_SERVER_PATH || '/myapp', // ✅ Define PeerJS path
    }
  }
});
