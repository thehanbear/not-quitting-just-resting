import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./loader.css";

type Props = {
  onDone: () => void;
	onIntroStart: () => void;
  images: [string, string, string, string];
};

export default function LoaderOverlay({ onDone, onIntroStart, images }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const letters = root.querySelectorAll(".loader__letter");
      const headingStart = root.querySelector(".loader__h1-start") as HTMLElement | null;
      const headingEnd = root.querySelector(".loader__h1-end") as HTMLElement | null;

      const boxEl = root.querySelector(".loader__box") as HTMLElement | null;
      const growingEl = root.querySelector(".loader__growing-image") as HTMLElement | null;
      const extraImages = root.querySelectorAll(".loader__cover-extra");
      const baseCover = root.querySelector(".loader__cover") as HTMLElement | null;

      if (!boxEl || !growingEl || !baseCover) return;

      // 초기값 고정
      gsap.set(root, { opacity: 1 });
      gsap.set(boxEl, {
        width: "0em",
        opacity: 1,
        scale: 1,
        borderRadius: 1,
        x: 0,
        y: 0,
      });
      gsap.set(growingEl, { width: "0%" });
      gsap.set(extraImages, { opacity: 1 });
      gsap.set(baseCover, { opacity: 1 });

      const CLOSE_DUR = 1.05;
      const TEXT_FADE_DUR = 0.65;
      const ROOT_FADE_DUR = 0.85;
      const BREATH_DUR = 0.25;

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          onDone();
        },
      });

      tl.from(letters, {
        yPercent: 80,
        stagger: 0.02,
        duration: 1.05,
        ease: "expo.out",
      });

      tl.fromTo(
        boxEl,
        { width: "0em"},
        { width: "0.75em", duration: 1.05, ease: "expo.inOut" },
        "<0.9"
      );

      tl.fromTo(
        growingEl,
        { width: "0%" },
        { width: "100%", duration: 1.05, ease: "expo.inOut" },
        "<"
      );

      /* 3) 텍스트 살짝 벌어지기 */
      if (headingStart) tl.to(headingStart, { x: "0em", duration: 1.05 }, "<");
      if (headingEnd) tl.to(headingEnd, { x: "0em", duration: 1.05 }, "<");

      /* 4) 이미지 3장 순차 제거 */
      if (extraImages.length) {
        tl.to(
          extraImages,
          {
            opacity: 0,
            duration: 0.06,
            stagger: 0.5,
            ease: "none",
          },
          "-=0.1"
        );
      }

      tl.to({}, { duration: 0.2 });
      tl.to({}, { duration: BREATH_DUR });
      tl.to(baseCover, { opacity: 0.92, duration: 0.35, ease: "power2.out" }, "close");

			tl.call(() => {
				onIntroStart();
			}, [], "close");

      if (headingStart)
        tl.to(headingStart, { x: "0em", duration: CLOSE_DUR, ease: "power3.inOut" }, "close");
      if (headingEnd)
        tl.to(headingEnd, { x: "0em", duration: CLOSE_DUR, ease: "power3.inOut" }, "close");

      tl.to(growingEl, { width: "0%", duration: CLOSE_DUR, ease: "power3.inOut" }, "close+=0.10");
      tl.to(boxEl, { width: "0em", duration: CLOSE_DUR, ease: "power3.inOut" }, "close+=0.18");
      tl.to(
        [headingStart, headingEnd],
        { opacity: 0, duration: TEXT_FADE_DUR, ease: "power2.out" },
        "close+=0.60"
      );

      tl.to(root, { opacity: 0, duration: ROOT_FADE_DUR, ease: "power2.out" }, "close+=0.95");
    }, root);

    return () => {
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, [onDone]);

	return (
		<section ref={rootRef as any} className="loader is-loading" aria-label="loading">
			<div className="loader__center">
				<h1 className="loader__h1">
					<span className="loader__h1-start">
						{"Not quitting".split("").map((ch, i) => (
							<span key={i} className="loader__letter">
								{ch === " " ? "\u00A0" : ch}
							</span>
						))}
					</span>
					{/* no-space */}
					<span className="loader__box" aria-hidden="true">
						<span className="loader__box-inner">
							<span className="loader__growing-image">
								<span className="loader__growing-image-wrap">
									<img className="loader__cover-extra is-1" src={images[1]} alt="" />
									<img className="loader__cover-extra is-2" src={images[2]} alt="" />
									<img className="loader__cover-extra is-3" src={images[3]} alt="" />
									<img className="loader__cover" src={images[0]} alt="" />
								</span>
							</span>
						</span>
					</span>
					{/* no-space */}
					<span className="loader__h1-end">
						{"Just resting".split("").map((ch, i) => (
							<span key={i} className="loader__letter">
								{ch === " " ? "\u00A0" : ch}
							</span>
						))}
					</span>
				</h1>
			</div>
		</section>
	);
}	