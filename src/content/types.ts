/** A string in both supported languages. */
export interface L {
  id: string;
  en: string;
}

export type Lang = 'id' | 'en';
export type Mood = 'neutral' | 'happy' | 'surprised';

export interface FaceSpec {
  bg: string;
  skin: string;
  shape: 'round' | 'long' | 'wide';
  eyes: 'narrow' | 'round';
  brows: 'calm' | 'fierce' | 'arched';
  mouth: 'smile' | 'flat' | 'fangs';
  head: 'blangkon' | 'tuft' | 'caping' | 'horns' | 'veil' | 'helm' | 'bun' | 'tiara' | 'crown' | 'rays';
  headColor: string;
  accent: string;
  hair?: 'mustache' | 'beard';
}
