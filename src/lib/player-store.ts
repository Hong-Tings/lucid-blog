/**
 * Music player store — lightweight pub/sub state management.
 * Keeps NowPlaying logic separate from the UI for extensibility.
 *
 * To update tracks: edit src/data/playlist.json
 * To add a new data source (Last.fm, Spotify, etc.): call playerStore.setTracks()
 */

import defaultPlaylist from '../data/playlist.json';

export interface Track {
  title: string;
  artist: string;
  album?: string;
  duration?: number; // seconds, optional — if omitted, estimated from audio
  src?: string;      // audio file URL, optional — if omitted, shows as "now listening" only
}

type Listener = () => void;

class PlayerStore {
  private tracks: Track[] = [];
  private index = 0;
  private playing = false;
  private currentTime = 0;
  private duration = 0;
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(initialTracks?: Track[]) {
    if (initialTracks) {
      this.tracks = initialTracks;
    }
    if (typeof window === 'undefined') return;
    this.audio = new Audio();
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio!.duration;
      this.emit();
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio!.currentTime;
      this.emit();
    });
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  setTracks(tracks: Track[]) {
    this.tracks = tracks;
    this.index = 0;
    this.emit();
  }

  getState() {
    return {
      tracks: this.tracks,
      track: this.tracks[this.index] || null,
      index: this.index,
      playing: this.playing,
      currentTime: this.currentTime,
      duration: this.duration,
      progress: this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0,
    };
  }

  play(index?: number) {
    if (this.tracks.length === 0) return;

    if (index !== undefined && index !== this.index) {
      this.index = index;
      this.currentTime = 0;
    }

    const track = this.tracks[this.index];

    // If track has audio source, use real playback
    if (track.src && this.audio) {
      if (this.audio.src !== track.src) {
        this.audio.src = track.src;
      }
      this.audio.play();
      this.playing = true;
    } else {
      // Simulated playback for tracks without audio
      this.playing = true;
      this.startSimulation();
    }

    this.emit();
  }

  pause() {
    this.playing = false;
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.stopSimulation();
    this.emit();
  }

  toggle() {
    this.playing ? this.pause() : this.play();
  }

  next() {
    this.pause();
    this.index = (this.index + 1) % this.tracks.length;
    this.currentTime = 0;
    this.duration = this.tracks[this.index]?.duration || 0;
    this.emit();
    // Auto-play next
    setTimeout(() => this.play(), 200);
  }

  prev() {
    this.pause();
    this.index = (this.index - 1 + this.tracks.length) % this.tracks.length;
    this.currentTime = 0;
    this.duration = this.tracks[this.index]?.duration || 0;
    this.emit();
    setTimeout(() => this.play(), 200);
  }

  seek(percent: number) {
    if (this.audio && this.duration > 0) {
      this.audio.currentTime = (percent / 100) * this.duration;
    }
    this.currentTime = (percent / 100) * this.duration;
    this.emit();
  }

  // Simulated progress for tracks without audio files
  private startSimulation() {
    this.stopSimulation();
    const track = this.tracks[this.index];
    const dur = track?.duration || 240; // default 4 min
    this.duration = dur;

    this.timer = setInterval(() => {
      if (!this.playing) return;
      this.currentTime += 0.25;
      if (this.currentTime >= dur) {
        this.next();
      }
      this.emit();
    }, 250);
  }

  private stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const playerStore = new PlayerStore(defaultPlaylist as Track[]);
