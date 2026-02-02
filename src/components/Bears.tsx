import { useMemo } from "react";
import "./bears.css";
import papaBear from "../assets/image/daddy_bear.png";
import mamaBear from "../assets/image/mommy_bear.png";
import babyBear from "../assets/image/baby_bear.png";

type Props = {
  show: boolean;
  className?: string;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type CSSVars = React.CSSProperties & {
  ["--actDur"]?: string;
  ["--actDelay"]?: string;
};

export default function Bears({ show, className }: Props) {
  const styles = useMemo<CSSVars[]>(() => {
    const makeOne = (): CSSVars => ({
      ["--actDur"]: `${rand(8.0, 13.0).toFixed(2)}s`,
      ["--actDelay"]: `${rand(0, 1.2).toFixed(2)}s`,
    });
    return [makeOne(), makeOne(), makeOne()];
  }, []);

  return (
    <div className={`bears ${show ? "is-show" : ""} ${className ?? ""}`} aria-hidden="true">
      <div className="bears__group">
        <div className="bears__bear bears__bear--papa" style={styles[0]}>
          <img className="bears__img" src={papaBear} alt="papaBear" />
        </div>

        <div className="bears__bear bears__bear--baby" style={styles[1]}>
          <img className="bears__img" src={babyBear} alt="babyBear" />
        </div>

        <div className="bears__bear bears__bear--mama" style={styles[2]}>
          <img className="bears__img" src={mamaBear} alt="mamaBear" />
        </div>
      </div>
    </div>
  );
}
