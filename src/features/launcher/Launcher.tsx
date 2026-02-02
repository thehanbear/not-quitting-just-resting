import { Music, Sparkles, Pencil } from "lucide-react";
import "./launcher.css";

export type AppId = "launcher" | "music" | "poem" | "paint";

export function Launcher({ onOpen }: { onOpen: (id: AppId) => void }) {
  const apps = [
    { id: "music" as const, label: "Music", Icon: Music },
    { id: "poem" as const, label: "Words", Icon: Sparkles },
    { id: "paint" as const, label: "Draw", Icon: Pencil },
  ];

  return (
    <div className="launcher">
      <div className="launcher__top">
      </div>

      <div className="launcher__grid">
        {apps.map(({ id, label, Icon }) => (
          <button
            key={id}
            className="appIcon"
            onClick={() => onOpen(id)}
            aria-label={`Open ${label}`}
          >
            <span className="appIcon__bg" />
            <Icon size={26} />
            <span className="appIcon__label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
