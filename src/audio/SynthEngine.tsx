import { useCallback, useEffect, useRef } from "react";
import { sleep } from "../utils/sleep";
import { useVolume } from "../redux/hooks";

export const SynthEngine = () => {
  const audioContext = useRef<AudioContext | null>(new AudioContext());
  const volume = useVolume();

  const dealCard = useCallback(() => {
    const audioCtx = audioContext.current;
    if (!audioCtx || volume === 0) return;
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);

    const bufferSize = 4096;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate
    );
    const noise = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      noise[i] = Math.random() * 2 - 1;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.connect(audioCtx.destination);
    gain.gain.setTargetAtTime(volume * 0.2, audioCtx.currentTime, 0.01);
    gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);

    source.start();
    source.stop(audioCtx.currentTime + 0.03);
  }, [volume]);

  const winOnTheDeal = useCallback(() => {
    const audioCtx = audioContext.current;
    if (!audioCtx || volume === 0) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = 1000;
    gain.gain.setTargetAtTime(volume * 0.2, audioCtx.currentTime, 0.01);
    gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.02);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }, [volume]);

  const payOut = useCallback(
    async (e: Event) => {
      const n = (e as CustomEvent).detail;
      const audioCtx = audioContext.current;
      if (!audioCtx || volume === 0) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.5, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      for (let i = 0; i < n; i++) {
        const noteNumber = i % 24;
        osc.frequency.value = 200 * Math.pow(2, noteNumber / 12);
        await sleep(100);
      }

      osc.stop();
    },
    [volume]
  );

  useEffect(() => {
    window.addEventListener("deal-card", dealCard);
    window.addEventListener("win-on-the-deal", winOnTheDeal);
    window.addEventListener("pay-out", payOut);

    return () => {
      window.removeEventListener("deal-card", dealCard);
      window.removeEventListener("win-on-the-deal", winOnTheDeal);
      window.removeEventListener("pay-out", payOut);
    };
  }, [dealCard, payOut, winOnTheDeal]);

  return null;
};
