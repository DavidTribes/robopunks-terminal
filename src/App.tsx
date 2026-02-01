import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  // ASCII banner (matches the style in your screenshot)
  const banner = String.raw`
┌──────────────────────────────────────────────────────────────────────────────┐
│ ██████╗  ██████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗███████╗ │
│ ██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗██║   ██║████╗  ██║██║ ██╔╝██╔════╝ │
│ ██████╔╝██║   ██║██████╔╝██║   ██║██████╔╝██║   ██║██╔██╗ ██║█████╔╝ ███████╗ │
│ ██╔══██╗██║   ██║██╔══██╗██║   ██║██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗ ╚════██║ │
│ ██║  ██║╚██████╔╝██████╔╝╚██████╔╝██║     ╚██████╔╝██║ ╚████║██║  ██╗███████║ │
│ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝ │
└──────────────────────────────────────────────────────────────────────────────┘
RETRO ROBOT COMMAND TERMINAL v1.987
`;

  const [lines, setLines] = useState<string[]>([
    "System initialised... OK",
    "Loading robot database... OK",
    "Connecting to mainframe... OK",
    "Type 'help' for available commands or 'about' for system info.",
  ]);

  const [input, setInput] = useState("");
  const outRef = useRef<HTMLDivElement>(null);

  // iPhone-safe sounds (GitHub Pages needs BASE_URL)
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const audioArmed = useRef(false);

  useEffect(() => {
    const base = import.meta.env.BASE_URL; // "/robopunks-terminal/" on Pages
    clickSound.current = new Audio(`${base}click.mp3`);
    errorSound.current = new Audio(`${base}error.mp3`);
    clickSound.current.load();
    errorSound.current.load();
  }, []);

  useEffect(() => {
    outRef.current?.scrollTo({
      top: outRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  function armAudioOnce() {
    if (audioArmed.current) return;
    audioArmed.current = true;

    // Prime audio on first user gesture (iOS)
    const a = clickSound.current;
    if (!a) return;

    try {
      a.volume = 0;
      a.currentTime = 0;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.volume = 1;
        })
        .catch(() => {
          a.volume = 1;
        });
    } catch {
      // ignore
    }
  }

  function playClick() {
    armAudioOnce();
    const a = clickSound.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      // ignore
    }
  }

  function playError() {
    armAudioOnce();
    const a = errorSound.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      // ignore
    }
  }

  function runCommand(cmd: string) {
    const raw = cmd.trim();
    const c = raw.toLowerCase();

    if (!raw) return;

    if (c === "help") {
      setLines((l) => [
        ...l,
        "> help",
        "COMMANDS",
        "help",
        "clear | cls",
        "boot",
        "whoami",
        "about",
        "SITE NAV",
        "home",
        "archives",
      ]);
      return;
    }

    if (c === "clear" || c === "cls") {
      setLines([]);
      return;
    }

    if (c === "boot") {
      setLines([
        "System initialised... OK",
        "Loading robot database... OK",
        "Connecting to mainframe... OK",
        "Type 'help' for available commands or 'about' for system info.",
      ]);
      return;
    }

    if (c === "whoami") {
      setLines((l) => [...l, "> whoami", "you are: visitor"]);
      return;
    }

    if (c === "about") {
      setLines((l) => [
        ...l,
        "> about",
        "ROPOPUNKS TERMINAL v1.987",
        "Status: ONLINE",
        "Signal: LOCKED",
      ]);
      return;
    }

    if (["home", "archives"].includes(c)) {
      setLines((l) => [...l, `> ${c}`, `navigating to ${c}...`]);
      return;
    }

    playError();
    setLines((l) => [
      ...l,
      `> ${raw}`,
      `command not recognised: ${raw}`,
      "Type 'help' for available commands or 'about' for system info.",
    ]);
  }

  function lineClass(line: string) {
    const lower = line.toLowerCase();
    if (lower.startsWith("> ")) return "cmd";
    if (lower.includes("not recognised")) return "err";
    if (lower === "commands" || lower === "site nav") return "hdr";
    if (lower.startsWith("type 'help'")) return "hint"; // BLUE line
    if (lower.includes("... ok")) return "ok"; // GREEN ok line
    return "out";
  }

  return (
    <div className="crt">
      <div className="terminal">
        <div className="bannerWrap">
          <pre className="banner">{banner}</pre>
        </div>

        <div className="outWrap" ref={outRef}>
          {lines.map((l, i) => (
            <div key={i} className={`line ${lineClass(l)}`}>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // user gesture = arm audio
              if (!audioArmed.current) armAudioOnce();

              // click on each keypress feels best
              if (e.key.length === 1 || e.key === "Backspace") playClick();

              if (e.key === "Enter") {
                playClick();
                runCommand(input);
                setInput("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}