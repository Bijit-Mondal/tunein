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
        }
      ],
    }
  }
})
