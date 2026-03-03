export const stopNarration = () => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
};

export const speak = (text: string) => {
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  stopNarration();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  synth.speak(utterance);
};
