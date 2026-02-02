import type { ReactNode } from "react";
import DesktopHeader from "./DesktopHeader";
import "./desktop.css";

export function DesktopFrame({
  children,
  overlay,
}: {
  children?: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div className="desktop">
			<DesktopHeader />
      <div className="desktop__bg" />
			<p className="copyright">@ All Rights Reserved | Hangaram LS</p>
      	<div className="desktop__blanket-footer" aria-hidden="true" />
      <main className="desktop__content">{children}</main>
      {overlay}
    </div>
  );
}
