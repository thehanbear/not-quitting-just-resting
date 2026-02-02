import { useEffect, useState } from "react";
import logoBear from "../../assets/image/logo_bear_mini.png";
import "./DesktopHeader.css";

type Props = {
  title?: string;
};

export default function DesktopHeader({ title = "Not quitting, Just resting." }: Props) {
	const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="deskHeader" aria-label="desktop header">
      <div className="deskHeader__inner">
        <a className="deskHeader__brand" href="#" aria-label="home">
          <img className="deskHeader__logo" src={logoBear} alt="" />
          <span className="deskHeader__title">{title}</span>
        </a>

        <div className="deskHeader__right">
          <button
            type="button"
            className="deskHeader__btn"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Train of thoughts
          </button>

          {open && (
            <div className="deskHeader__modal" role="dialog" aria-label="message">
              <div className="deskHeader__modalHeader">
                <span className="deskHeader__modalTitle">Hi</span>
                <button
                  type="button"
                  className="deskHeader__close"
                  onClick={() => setOpen(false)}
                  aria-label="close"
                >
                  ×
                </button>
              </div>

              <p className="deskHeader__modalBody">
                I need a minute.. ☕️
                <br />
                Hm.. 🤳🏻🦖🪿🍔🍺🍣🥋🎮
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="deskHeader__rule" aria-hidden="true" />
    </header>
  );
}
