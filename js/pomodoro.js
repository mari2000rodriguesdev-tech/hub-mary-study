// Módulo Pomodoro & Som de Conclusão com Web Audio API
class PomodoroTimer {
  constructor(options = {}) {
    this.modes = {
      focus: { name: "Modo Foco", minutes: 25, color: "#8b5cf6" },
      shortBreak: { name: "Pausa Curta", minutes: 5, color: "#06b6d4" },
      longBreak: { name: "Pausa Longa", minutes: 15, color: "#10b981" }
    };
    
    this.currentMode = "focus";
    this.totalSeconds = this.modes.focus.minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    this.timerInterval = null;
    this.selectedSubject = "Geral";
    
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onModeChange = options.onModeChange || (() => {});
    
    this.audioCtx = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Tríade suave e melodiosa de conclusão (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.14);

        gain.gain.setValueAtTime(0, now + index * 0.14);
        gain.gain.linearRampToValueAtTime(0.2, now + index * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.9);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + index * 0.14);
        osc.stop(now + index * 0.14 + 0.95);
      });
    } catch (e) {
      console.warn("Áudio não pôde ser reproduzido:", e);
    }
  }

  setMode(modeKey) {
    if (!this.modes[modeKey]) return;
    this.pause();
    this.currentMode = modeKey;
    this.totalSeconds = this.modes[modeKey].minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.onModeChange(this.currentMode, this.modes[modeKey]);
    this.onTick(this.formatTime(), this.getProgressPercent());
  }

  setCustomMinutes(minutes) {
    if (minutes < 1 || minutes > 180) return;
    this.pause();
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.onTick(this.formatTime(), this.getProgressPercent());
  }

  start() {
    if (this.isRunning) return;
    this.initAudio();
    this.isRunning = true;
    
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.onTick(this.formatTime(), this.getProgressPercent());
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.onTick(this.formatTime(), this.getProgressPercent());
  }

  completeSession() {
    this.pause();
    this.playChime();
    const completedMode = this.currentMode;
    const completedSubject = this.selectedSubject;
    
    this.onComplete({
      mode: completedMode,
      minutes: this.modes[completedMode].minutes,
      subject: completedSubject,
      date: new Date().toISOString()
    });

    // Avançar automaticamente para o próximo modo
    if (completedMode === "focus") {
      this.setMode("shortBreak");
    } else {
      this.setMode("focus");
    }
  }

  formatTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  getProgressPercent() {
    if (this.totalSeconds === 0) return 0;
    const elapsed = this.totalSeconds - this.remainingSeconds;
    return (elapsed / this.totalSeconds) * 100;
  }
}

window.PomodoroTimer = PomodoroTimer;
