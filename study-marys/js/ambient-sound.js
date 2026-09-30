// Gerador de Som Ambiente para Concentração usando Web Audio API
class AmbientSoundGenerator {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentPreset = "rain"; // rain, brown, alpha
    this.volume = 0.25;
    this.nodes = [];
    this.masterGain = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  createNoiseBuffer() {
    if (!this.audioCtx) return null;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (this.currentPreset === "brown") {
        // Brown noise
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else {
        // Pink/soft rain base
        output[i] = white * 0.5;
      }
    }
    return noiseBuffer;
  }

  start(preset = this.currentPreset) {
    this.init();
    if (!this.audioCtx) return;
    this.stop();

    this.currentPreset = preset;
    this.isPlaying = true;

    if (preset === "rain") {
      this.playRain();
    } else if (preset === "brown") {
      this.playBrownNoise();
    } else if (preset === "alpha") {
      this.playAlphaBinaural();
    }
  }

  playRain() {
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    const filter2 = this.audioCtx.createBiquadFilter();
    filter2.type = "peaking";
    filter2.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    filter2.gain.setValueAtTime(4, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(filter2);
    filter2.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter, filter2);
  }

  playBrownNoise() {
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter);
  }

  playAlphaBinaural() {
    // Frequência harmônica relaxante com oscilador duplo estéreo
    const oscL = this.audioCtx.createOscillator();
    const oscR = this.audioCtx.createOscillator();
    const merger = this.audioCtx.createChannelMerger(2);

    oscL.type = "sine";
    oscR.type = "sine";

    // Frequência base 136.1 Hz (Om/relaxamento) + diferença de 8 Hz (Alpha)
    oscL.frequency.setValueAtTime(136.1, this.audioCtx.currentTime);
    oscR.frequency.setValueAtTime(144.1, this.audioCtx.currentTime);

    const gainL = this.audioCtx.createGain();
    const gainR = this.audioCtx.createGain();
    gainL.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gainR.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    merger.connect(this.masterGain);

    oscL.start();
    oscR.start();
    this.nodes.push(oscL, oscR, gainL, gainR, merger);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    });
    this.nodes = [];
    this.isPlaying = false;
  }

  toggle(preset) {
    if (this.isPlaying && (!preset || preset === this.currentPreset)) {
      this.stop();
      return false;
    } else {
      this.start(preset || this.currentPreset);
      return true;
    }
  }
}

window.AmbientSoundGenerator = AmbientSoundGenerator;
