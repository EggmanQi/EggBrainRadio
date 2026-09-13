export const site = {
  name: 'EggBrain Radio',
  shortName: 'EggBrain',
  tagline: 'Indie apps, browser tools, and notes from building in public.',
  description:
    'EggBrain Radio is Edwin’s indie studio log — shipping iOS apps and browser extensions, writing about product and craft.',
  author: 'Edwin',
  locale: 'en',
  email: '',
  logo: '/logo-mark.png',
  logoFull: '/logo.png',
  favicon: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',
  social: {
    github: 'https://github.com/EggmanQi',
    x: '',
  },
} as const;

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/words', label: 'Words' },
] as const;
