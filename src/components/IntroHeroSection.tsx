import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./IntroHeroSection.css";
import logoBear from "../assets/image/logo_bear.png";

export default function IntroHeroSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const textEls = gsap.utils.toArray<HTMLElement>(".js-drop");
      const heroEl = root.querySelector<HTMLImageElement>(".js-hero");

      gsap.set(textEls, { opacity: 0, y: 18, filter: "blur(2px)" });
      if (heroEl) gsap.set(heroEl, { opacity: 0, y: 18, scale: 0.98 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(textEls, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.15,
        stagger: 0.14,
        clearProps: "transform,filter",
      });

      if (heroEl) {
        tl.to(
          heroEl,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.25,
            ease: "power3.out",
            clearProps: "transform",
          },
          0.08
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="intro__header">
      <div className="intro__header-inner">
        <div className="intro__left">
          <img className="intro__hero js-hero" src={logoBear} alt="" />
        </div>

        <div className="intro__right">
          <p className="intro__title js-drop">Not quitting</p>
          <h2 className="intro__title js-drop">Just resting.</h2>
          <p className="intro__text js-drop">
            Quiet place for hurried hearts.<br />
            Unfold slowly.<br /><br />
					</p>
					<p className="intro__text2 js-drop">
            Rest here.<br />
            World can wait.
          </p>
        </div>
      </div>
    </section>
  );
}
