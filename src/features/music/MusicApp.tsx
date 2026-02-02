import { useEffect, useMemo, useRef, useState } from "react";
import track1 from "../../assets/audio/So_Slow.mp3";
import track2 from "../../assets/audio/Already-Alright.mp3";
import track3 from "../../assets/audio/Simple_afternoons.mp3";
import "./music.css";

export function MusicApp({ onBack }: { onBack: () => void }) {
  const tracks = useMemo(
    () => [
      { title: "So Slow", src: track1 },
      { title: "Already Alright", src: track2 },
      { title: "Simple Afternoons", src: track3 },
    ],
    []
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => next();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) void audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function prev() {
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }
  function next() {
    setIndex((i) => (i + 1) % tracks.length);
  }

  function format(t: number) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="music">
      <div className="music__top">
        <button className="music__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="music__title">MUSIC</div>
        <div style={{ width: 34 }} />
      </div>

      <div className="music__card">
        <div className="music__trackTitle">{tracks[index].title}</div>

        <div className="music__progress">
          <div className="music__bar">
            <div className="music__barFill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="music__time">
            <span>{format(currentTime)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>

        <div className="music__controls">
          <button onClick={prev}>⏮</button>
          <button className="music__play" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={next}>⏭</button>
        </div>

        <audio ref={audioRef} src={tracks[index].src} preload="metadata" />
      </div>
    </div>
  );
}
