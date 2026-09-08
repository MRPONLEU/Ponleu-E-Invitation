/**
 * Ambient Wedding Music Synthesizer
 * Uses Web Audio API to create gentle, romantic background melodies (chimes, harp, piano arpeggios)
 * Works 100% reliably in all browsers without external CORS issues.
 */

export function formatAudioUrl(url?: string): string {
  if (!url) return '';
  let formatted = url.trim();

  // Convert Dropbox share links to raw direct audio stream
  // e.g. https://www.dropbox.com/scl/fi/3oalpe6pzgdv6b06wsdkp/Nevermind_.mp3?rlkey=kq8y5ost2drgdedwb1wu00sbm&st=cmuq3ccb&dl=0 -> raw=1
  if (formatted.includes('dropbox.com')) {
    if (formatted.includes('dl=0')) {
      formatted = formatted.replace('dl=0', 'raw=1');
    } else if (!formatted.includes('raw=1') && !formatted.includes('dl=1')) {
      formatted += (formatted.includes('?') ? '&' : '?') + 'raw=1';
    }
  }

  // Convert Google Drive share links
  // e.g. https://drive.google.com/file/d/123456789/view?usp=sharing
  if (formatted.includes('drive.google.com/file/d/')) {
    const match = formatted.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      formatted = `https://docs.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  return formatted;
}

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private audioElement: HTMLAudioElement | null = null;
  private activeUrl: string | null = null;

  // Romantic Pentatonic/Khmer scale melody notes (frequencies in Hz)
  private melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99,
    659.25, 587.33, 523.25, 440.00, 392.00, 329.63, 293.66,
    329.63, 392.00, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25,
    523.25, 440.00, 392.00, 329.63, 261.63
  ];

  private chords = [
    [261.63, 329.63, 392.00, 523.25], // C major
    [220.00, 261.63, 329.63, 440.00], // A minor
    [174.61, 220.00, 261.63, 349.23], // F major
    [196.00, 246.94, 293.66, 392.00], // G major
  ];

  private chordIndex: number = 0;

  private init() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (err) {
        console.warn('AudioContext failed to initialize:', err);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch {}
    }
  }

  public playNote(freq: number, duration: number = 2.5, type: OscillatorType = 'sine', gainVal: number = 0.08) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context may be restricted before user interaction
    }
  }

  public start(url?: string) {
    if (url) {
      const formatted = formatAudioUrl(url);
      if (formatted) {
        // If already playing this exact URL, do not stop or restart!
        if (this.isPlaying && this.activeUrl === formatted && this.audioElement && !this.audioElement.paused) {
          return;
        }

        // If audio element already exists and has same URL but was paused, resume it
        if (this.audioElement && this.activeUrl === formatted) {
          this.isPlaying = true;
          this.audioElement.play().catch(err => {
            console.warn("HTML5 audio resume failed, falling back to WebAudio synth:", err);
            this.startSynth();
          });
          return;
        }

        // Otherwise stop previous audio/synth and start new URL
        this.stop();
        this.isPlaying = true;
        this.activeUrl = formatted;
        if (!this.audioElement) {
          this.audioElement = new Audio();
          this.audioElement.loop = true;
        }
        this.audioElement.src = formatted;
        this.audioElement.play().catch(err => {
          console.warn("HTML5 audio playback failed, falling back to WebAudio synth:", err);
          this.startSynth();
        });
        return;
      }
    }
    this.startSynth();
  }

  public startSynth() {
    if (this.isPlaying && !this.activeUrl) return;
    this.stop();
    this.init();
    this.isPlaying = true;
    this.activeUrl = null;
    this.noteIndex = 0;
    this.chordIndex = 0;

    // Play initial gentle chord
    this.playCurrentChord();

    // Schedule melody sequence
    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const note = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
      this.playNote(note, 2.2, 'sine', 0.06);

      // Play soft shimmer overtone
      if (this.noteIndex % 2 === 0) {
        this.playNote(note * 1.5, 1.8, 'triangle', 0.02);
      }

      // Progress chord every 4 notes
      if (this.noteIndex % 4 === 0) {
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;
        this.playCurrentChord();
      }

      this.noteIndex++;
    }, 600);
  }

  private playCurrentChord() {
    if (!this.ctx) return;
    const currentChord = this.chords[this.chordIndex];
    currentChord.forEach((f, i) => {
      setTimeout(() => {
        if (this.isPlaying && !this.activeUrl) {
          this.playNote(f, 3.8, 'sine', 0.025);
        }
      }, i * 120);
    });
  }

  public stop() {
    this.isPlaying = false;
    this.activeUrl = null;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  public toggle(url?: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(url);
      return true;
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudioPlayer = new AudioSynthesizer();
export const audioSynthesizer = weddingAudioPlayer;

