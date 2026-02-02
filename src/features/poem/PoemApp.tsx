import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./poem.css";

type Mood = { emoji: string; label: string; hint: string };
type Food = { emoji: string; label: string; hint: string };

type Tone = "warm" | "funny";
type Style = "short" | "poem";

export function PoemApp({ onBack }: { onBack: () => void }) {
  const moods: Mood[] = useMemo(
    () => [
      { emoji: "😑", label: "Flat", hint: "numb, low reaction mode" },
      { emoji: "😮‍💨", label: "Tired", hint: "exhausted, low battery" },
			{ emoji: "🥶", label: "Cold", hint: "emotionally frozen, needs warmth" },
      { emoji: "🥱", label: "Sleepy", hint: "needs rest, cozy energy" },
      { emoji: "🥰", label: "Loved", hint: "safe, held, emotionally warm" },
      { emoji: "😊", label: "Okay", hint: "soft smile, balanced mood" },
			{ emoji: "😡", label: "Angry", hint: "frustrated energy, needs release" },
      { emoji: "😢", label: "Sad", hint: "heavy heart, needs comfort" },
			{ emoji: "🤢", label: "Unwell", hint: "feels off, needs gentle care" },
      { emoji: "🤪", label: "Silly", hint: "chaotic joy, playful mood" },
    ],
    []
  );

  const foods: Food[] = useMemo(
    () => [
      { emoji: "🍙", label: "Rice Ball", hint: "simple comfort, steady bite" },
			{ emoji: "☕️", label: "Coffee", hint: "warm focus, gentle boost" },
      { emoji: "🍣", label: "Sushi", hint: "clean taste, calm focus" },
      { emoji: "🌮", label: "Taco", hint: "fun mess, bold flavor" },
      { emoji: "🍱", label: "Bento", hint: "balanced meal, thoughtful care" },
      { emoji: "🥗", label: "Salad", hint: "fresh reset, light energy" },
      { emoji: "🍔", label: "Burger", hint: "solid comfort, grounding bite" },
      { emoji: "🥘", label: "Stew", hint: "warm pot, slow healing" },
      { emoji: "🍕", label: "Pizza", hint: "easy joy, shared happiness" },
      { emoji: "🍜", label: "Noodles", hint: "warm bowl, quiet relief" },
    ],
    []
  );

  const moodTrackRef = useRef<HTMLDivElement | null>(null);
  const foodTrackRef = useRef<HTMLDivElement | null>(null);

  const [mood, setMood] = useState<Mood | null>(null);
  const [food, setFood] = useState<Food | null>(null);
  const [result, setResult] = useState("");

  const [tone, setTone] = useState<Tone>("warm");
  const [style, setStyle] = useState<Style>("poem");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function pop(el: HTMLElement) {
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  }

  function centerItem(track: HTMLDivElement | null, item: HTMLElement | null) {
    if (!track || !item) return;

    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const current = track.scrollLeft;
    const itemCenterInTrack = (itemRect.left - trackRect.left) + itemRect.width / 2;
    const trackCenter = trackRect.width / 2;
    const delta = itemCenterInTrack - trackCenter;

    const target = current + delta;

    gsap.killTweensOf(track);
    gsap.to(track, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function scrollByCard(track: HTMLDivElement | null, dir: -1 | 1) {
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".carousel__item");
    const step = card ? card.offsetWidth + 10 : 120;
    track.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }

  async function generate() {
    if (!mood || !food) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/.netlify/functions/poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodEmoji: mood.emoji,
          moodLabel: mood.label,
          moodHint: mood.hint,
          foodEmoji: food.emoji,
          foodLabel: food.label,
          foodHint: food.hint,
          tone,
          style,
        }),
      });

      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};

      if (!res.ok) throw new Error(data?.error || "request failed");

      setResult(String(data.text || ""));
    } catch (e: any) {
      setError(e?.message ?? "request failed");
      if (mood && food) setResult(buildFallback(mood, food));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMood(null);
    setFood(null);
    setResult("");
    setError("");
    setTone("warm");
    setStyle("poem");
  }

  return (
    <div className="poem">
      <div className="poem__top">
        <button className="poem__back" onClick={onBack} aria-label="Back">←</button>
        <div className="poem__title">WORDS</div>
        <button className="poem__ghost" onClick={reset}>Reset</button>
      </div>

      <div className="poem__pickArea">
        <div className="poem__section">
          <div className="poem__q">How do you feel?</div>
          <div className="carousel">
            <button className="carousel__nav" onClick={() => scrollByCard(moodTrackRef.current, -1)} aria-label="Prev mood">‹</button>
            <div className="carousel__track" ref={moodTrackRef}>
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`carousel__item ${mood?.label === m.label ? "carousel__item--active" : ""}`}
                  onClick={(e) => {
                    setMood(m);
                    pop(e.currentTarget);
                    centerItem(moodTrackRef.current, e.currentTarget);
                  }}
                  aria-label={m.label}
                >
                  <div className="carousel__emoji">{m.emoji}</div>
                  <div className="carousel__text">{m.label}</div>
                </button>
              ))}
            </div>
            <button className="carousel__nav" onClick={() => scrollByCard(moodTrackRef.current, 1)} aria-label="Next mood">›</button>
          </div>
        </div>

        <div className="poem__section">
          <div className="poem__q">What are you craving?</div>
          <div className="carousel">
            <button className="carousel__nav" onClick={() => scrollByCard(foodTrackRef.current, -1)} aria-label="Prev food">‹</button>
            <div className="carousel__track" ref={foodTrackRef}>
              {foods.map((f) => (
                <button
                  key={f.label}
                  className={`carousel__item ${food?.label === f.label ? "carousel__item--active" : ""}`}
                  onClick={(e) => {
                    setFood(f);
                    pop(e.currentTarget);
                    centerItem(foodTrackRef.current, e.currentTarget);
                  }}
                  aria-label={f.label}
                >
                  <div className="carousel__emoji">{f.emoji}</div>
                  <div className="carousel__text">{f.label}</div>
                </button>
              ))}
            </div>
            <button className="carousel__nav" onClick={() => scrollByCard(foodTrackRef.current, 1)} aria-label="Next food">›</button>
          </div>
        </div>
      </div>

      <div className="poem__actions">
        <button className="poem__btn" disabled={!mood || !food || loading} onClick={generate}>
          {loading ? "Generating..." : "Generate words"}
        </button>
      </div>

      <div className="poem__result">
        {error && <div className="poem__error">⚠️ {error}</div>}
        {result ? (
          <pre className="poem__pre">{result}</pre>
        ) : (
          <div className="poem__hint">Pick one mood and one food.</div>
        )}
      </div>
    </div>
  );
}

function buildFallback(mood: Mood, food: Food) {
  return [
    `Hey ${mood.label}, today doesn’t need fixing.`,
    `${mood.emoji} ${mood.label}.`,
    `${food.emoji} ${food.label}.`,
    "Not quitting. Just resting.",
  ].join("\n");
}
