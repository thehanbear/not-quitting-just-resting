# not-quitting-just-resting

A small mood-based healing app designed to help users pause, breathe, and feel a little lighter.
This project started from a very personal place: there were days when I didn’t need advice, motivation, or solutions, I just needed something gentle that acknowledged how I felt.
Not Quitting, Just Resting is a lightweight web app that generates short, warm messages based on the user’s current mood and craving. It’s not about productivity or fixing yourself — it’s about allowing rest. This project is a work in progress and focuses on responsive design.


📸 Demo
Screenshots and a short demo video will be added here.

![not-quitting-just-resting](https://github.com/user-attachments/assets/2364fda0-3b39-4d9d-85b0-afe100875f60)


✨ Features
* Mood selection via emoji carousel
* Craving selection (food-based comfort cues)
* Generates warm or humorous short poems/messages
* Two styles: short message or poem
* Fully client-facing, with a mock backend for stability
* Graceful fallback messages when generation fails

🛠 Tech Stack
Frontend
* React
* TypeScript
* Vite
* CSS (custom UI, glass-style components)
* GSAP (micro-interactions & carousel animation)
Backend (Mock API)
* Netlify Functions
* TypeScript-based mock generator
* Modular text database (openers / middles / closers)
* Designed to be easily replaceable with a real AI API later
Deployment
* Netlify
* Environment-based configuration
* Local development with netlify dev

🧠 Design Notes
* Focused on emotional safety rather than “motivation”
* Emojis are used as emotional anchors, not decoration
* Copy avoids judgment, urgency, or toxic positivity
* UI prioritizes calm pacing, soft motion, and readability

🚧 Why a Mock Backend?
During development, external AI APIs introduced rate limits and instability. To keep the experience reliable and fully free, I built a mock backend with a structured message database.
The architecture is intentionally future-proof:
* The mock generator can be swapped with a real AI provider
* No frontend refactor needed
* Clean separation between UI, logic, and content




