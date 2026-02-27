/* eslint-disable @typescript-eslint/no-unused-vars */
// Sound effects using Web Audio API - no external dependencies needed

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const audioContext = () => new (window.AudioContext || (window as any).webkitAudioContext)();

export const playSuccessSound = () => {
  try {
    const ctx = audioContext();
    const now = ctx.currentTime;

    // Happy ascending chime
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.4);
    });

  } catch (e) {
    // Audio not supported
  }
};

export const playErrorSound = () => {
  try {
    const ctx = audioContext();
    const now = ctx.currentTime;

    // Descending buzz
    [300, 200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.25);
    });
  } catch (e) {
    // Audio not supported
  }
};
