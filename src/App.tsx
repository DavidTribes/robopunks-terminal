import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [lines, setLines] = useState<string[]>([
    "ROBOPUNKS ROBOT COMMAND TERMINAL v1.987",
    "system initialised... OK",
    "neural cores online... OK",
    "signal locked.",
    "type 'help' for available commands.",
    "site nav: home | robot archives | about",
  ]);

  const [input, setInput] = useState("");
  const outRef = useRef<HTMLDivElement>(null);

  const clickSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSound.current = new Audio("/click.mp3");
    errorSound.current = new Audio("/error.mp3");
  }, []);

  useEffect(() => {
    outRef.current?.scrollTo({
      top: outRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  function click() {
    clickSound.current?.play().catch(() => {});
  }

  function error() {
    errorSound.current?.play().catch(() => {});
  }

  function run(cmd: string) {
    const c = cmd.toLowerCase().trim();

    const push = (l: string[]) => setLines(prev => [...prev, ...l]);

    if (c === "help") {
      push([
        "> help",
        "COMMANDS",
        "help",
        "clear | cls",
        "boot",
        "whoami",
        "arcade",
        "matrix",
        "mint",
        "hack",
        "SITE NAV",
        "home",
        "robot archives",
        "about",
      ]);
      return;
    }

    if (c === "clear" || c === "cls") {
      setLines([]);
      return;
    }

    if (c === "boot") {
      setLines([
        "rebooting system...",
        "system initialised... OK",
        "neural cores online... OK",
        "signal locked.",
      ]);
      return;
    }

    if (c === "whoami") {
      push(["> whoami", "you are: visitor"]);
      return;
    }

    if (c === "arcade") {
      push([
        "> arcade",
        "loading arcade module...",
        "insert coin",
        "coin accepted",
        "🕹️GAME OVER🕹️",
      ]);
      return;
    }

    if (c === "matrix") {
      push([
        "> matrix",
        "wake up, visitor.",
        "the terminal has you.",
      ]);
      return;
    }

    if (c === "mint") {
      push([
        "> mint",
        "initialising mint sequence...",
        "verifying chain...",
        "mint successful.",
        "robot added to archives.",
      ]);
      return;
    }

    if (c === "hack") {
      push([
        "> hack",
        "attempting breach...",
        "ACCESS DENIED",
        "nice try.",
      ]);
      return;
    }

    if (["home", "robot archives", "about"].includes(c)) {
      push([`> ${cmd}`, `navigating to ${cmd}...`]);
      return;
    }

    error();
    push([
      `> ${cmd}`,
      `command not recognised: ${cmd}`,
      "type 'help' for available commands.",
    ]);
  }

  function cls(line: string) {
    const l = line.toLowerCase();
    if (l.startsWith(">")) return "cmd";
    if (l.includes("not recognised") || l.includes("denied")) return "err";
    if (l === "commands" || l === "site nav") return "hdr";
    if (l.includes("type 'help'")) return "hint";
    return "out";
  }

  return (
    <div className="crt">
      <div className="banner">
  <div className="bannerInner">
    <svg
      className="pixelLogo"
      viewBox="0 0 1200 220"
      role="img"
      aria-label="ROBOPUNKS ROBOT COMMAND TERMINAL"
    >
      <defs>
        {/* cyan glow */}
        <filter id="arcadeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* green glow */}
        <filter id="arcadeGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* BIG ARCADE TITLE */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="pixelTitle"
        style={{ fontSize: 92, letterSpacing: 12 }}
        filter="url(#arcadeGlowGreen)"
      >
        ROBOPUNKS V2 
      </text>

      {/* SUBTITLE */}
      <text
        x="50%"
        y="88%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="pixelText"
        style={{ fontSize: 18, letterSpacing: 6 }}
        filter="url(#arcadeGlow)"
      >
        ROBOPUNKS ROBOT COMMAND TERMINAL
      </text>
    </svg>
  </div>
</div>

      <div className="terminal">
        <div className="outWrap" ref={outRef}>
          {lines.map((l, i) => (
            <div key={i} className={`line ${cls(l)}`}>
              {l}
            </div>
          ))}
        </div>

        <div className="inputRow">
          <span className="prompt">&gt;</span>
          <input
            className="cmdInput"
            value={input}
            placeholder="type a command"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              click();
              if (e.key === "Enter" && input.trim()) {
                run(input);
                setInput("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}