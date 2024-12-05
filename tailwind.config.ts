import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                primary: '#D1363B',
                'lofi-dark': '#1a1a1a',
                'lofi-light': '#f5f5f5',
            },
            fontFamily: {
                vt: ['VT323', 'monospace'],
                space: ['Space Grotesk', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    }
}
