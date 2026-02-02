// poem.ts
import type { Handler } from "@netlify/functions";
import { openers } from "./data/openers";
import { middles } from "./data/middles";
import { closers } from "./data/closers";
import { endings } from "./data/endings";

type ReqBody = {
  moodEmoji: string;
  moodLabel: string;
  moodHint?: string;
  foodEmoji: string;
  foodLabel: string;
  foodHint?: string;
  style?: "short" | "poem";
  // tone removed (UI no longer selects warm/funny)
};

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fillVars(template: string, vars: Record<string, string>) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${escapeRegExp(k)}\\}`, "g"), v);
  }
  return out;
}

// foodLabel -> middles category
function toFoodKey(label: string): keyof typeof middles {
  const v = (label ?? "").trim().toLowerCase();

  if (v.includes("coffee")) return "coffee";
  if (v.includes("noodle")) return "noodles";

  // fresh
  if (v.includes("sushi") || v.includes("salad") || v.includes("bento")) return "fresh";

  // comfort default
  return "comfort";
}

function generatePoemMock(b: ReqBody) {
  const mood = (b.moodLabel || "You").trim() || "You";
  const food = (b.foodLabel || "a treat").trim() || "a treat";
  const style = b.style ?? "poem";

  const opener = pick(openers);
  const middle = pick(middles[toFoodKey(food)]);
  const closer = pick(closers);
	const ending = maybeEnding();

	function maybeEnding() {
		return Math.random() < 0.5 ? pick(endings) : null;
	}

  const vars = { mood, food };

  const lines =
    style === "short"
      ? [
          fillVars(opener, vars),
          fillVars(closer, vars),
          "Not quitting. Just resting.",
        ]
      : [
          fillVars(opener, vars),
          fillVars(middle, vars),
          "Slow is a speed, too.",
          "You can pause without disappearing.",
          fillVars(closer, vars),
           ...(ending ? [ending] : []),
        ];

  return lines.join("\n");
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body: ReqBody;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const text = generatePoemMock(body);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  };
};

