import { useState } from "react";
import { DesktopFrame } from "./app/layout/DesktopFrame";
import { PhoneModal } from "./app/layout/PhoneModal";
import { Launcher, type AppId } from "./features/launcher/Launcher";
import { MusicApp } from "./features/music/MusicApp";
import { PoemApp } from "./features/poem/PoemApp";
import { PaintApp } from "./features/paint/PaintApp";
import LoaderOverlay from "./components/LoaderOverlay";
import IntroOverlay from "./components/IntroOverlay";
import Bears from "./components/Bears";

import bear1 from "./assets/image/bear1.png";
import bear2 from "./assets/image/bear2.png";
import bear3 from "./assets/image/bear3.png";
import bearIn from "./assets/image/bear_in.png";

type Phase = "loading" | "intro" | "desktop";

export default function App() {
  const [activeApp, setActiveApp] = useState<AppId>("launcher");
  const [phase, setPhase] = useState<Phase>("loading");

  const [showIntroOverlay, setShowIntroOverlay] = useState(false);

  const showDesktopBase = phase !== "loading";
  const showUI = phase === "desktop";

  return (
    <>
      {phase === "loading" && (
        <LoaderOverlay
          images={[bearIn, bear1, bear2, bear3]}
          onIntroStart={() => {
            setPhase("intro");
            setShowIntroOverlay(true);
          }}
					onDone={() => {
					}}
        />
      )}

      {showDesktopBase && (
        <DesktopFrame overlay={<Bears show={showUI} />}>
          {showUI && (
            <PhoneModal>
              {activeApp === "launcher" && <Launcher onOpen={setActiveApp} />}
              {activeApp === "music" && (
                <MusicApp onBack={() => setActiveApp("launcher")} />
              )}
              {activeApp === "poem" && (
                <PoemApp onBack={() => setActiveApp("launcher")} />
              )}
              {activeApp === "paint" && (
                <PaintApp onBack={() => setActiveApp("launcher")} />
              )}
            </PhoneModal>
          )}
        </DesktopFrame>
      )}

      {showIntroOverlay && (
        <IntroOverlay
          onDockStart={() => setPhase("desktop")}
          onFinished={() => setShowIntroOverlay(false)}
        />
      )}
    </>
  );
}
