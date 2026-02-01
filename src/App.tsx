import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [lines, setLines] = useState<string[]>([
    "retro robot command terminal v1.987",
    "system initialised... OK",
    "neural cores online... OK",
    "signal locked.",
    "type 'help' for available commands.",
  ]);

  const [input, setInput] = useState("");
  const outRef = useRef<HTMLDivElement>(null);

  // --- iOS/Wix-safe sound ---
  // iPhone blocks audio until a user gesture. We "arm" it on first tap/keypress.
  const isArmed = useRef(false);
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Put these files in /public/click.mp3 and /public/error.mp3
    clickSound.current = new Audio("/click.mp3");
    errorSound.current = new Audio("/error.mp3");

    // defaults
    if (clickSound.current) clickSound.current.volume = 0.4;
    if (errorSound.current) errorSound.current.volume = 0.5;
  }, []);

  useEffect(() => {
    outRef.current?.scrollTo({
      top: outRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  function armAudio() {
    if (isArmed.current) return;
    isArmed.current = true;

    // Prime audio playback on iOS: try a quick play/pause from a gesture.
    const a = clickSound.current;
    if (!a) return;

    const oldVol = a.volume;
    a.volume = 0.01;
    a.currentTime = 0;

    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.volume = oldVol;
      })
      .catch(() => {
        // If it fails here, it usually works after the next gesture.
        a.volume = oldVol;
      });
  }

  function playClick() {
    const a = clickSound.current;
    if (!a) return;

    // cloning lets rapid key clicks overlap (won't cut itself off)
    const clone = a.cloneNode(true) as HTMLAudioElement;
    clone.volume = a.volume;
    clone.currentTime = 0;
    clone.play().catch(() => {});
  }

  function playError() {
    const a = errorSound.current;
    if (!a) return;

    const clone = a.cloneNode(true) as HTMLAudioElement;
    clone.volume = a.volume;
    clone.currentTime = 0;
    clone.play().catch(() => {});
  }

  function runCommand(cmd: string) {
    const c = cmd.toLowerCase().trim();

    if (c === "help") {
      setLines((l) => [
        ...l,
        "> help",
        "COMMANDS",
        "help",
        "clear | cls",
        "boot",
        "whoami",
        "SITE NAV",
        "home",
        "about",
        "archives",
      ]);
      return;
    }

    if (c === "clear" || c === "cls") {
      setLines([]);
      return;
    }

    if (c === "boot") {
      playClick();
      setLines([
        "rebooting system...",
        "system initialised... OK",
        "neural cores online... OK",
        "type 'help' for available commands.",
      ]);
      return;
    }

    if (c === "whoami") {
      setLines((l) => [...l, "> whoami", "you are: visitor"]);
      return;
    }

    if (["home", "about", "archives"].includes(c)) {
      setLines((l) => [...l, `> ${c}`, `navigating to ${c}...`]);
      return;
    }

    // error
    playError();
    setLines((l) => [
      ...l,
      `> ${cmd}`,
      `command not recognised: ${cmd}`,
      "type 'help' for available commands.",
    ]);
  }

  function lineClass(line: string) {
    const l = line.toLowerCase();

    if (l.startsWith("> ")) return "cmd";
    if (l.includes("not recognised")) return "err";
    if (l === "commands" || l === "site nav") return "hdr";
    if (l.includes("type 'help'")) return "hint";

    return "out";
  }

  return (
    <div
      className="crt"
      onPointerDown={armAudio}
      onKeyDownCapture={armAudio}
      tabIndex={-1}
    >
      {/* Banner */}
      <div className="banner">
        <div className="bannerLeft">
          <span className="bannerTitle">ROPOPUNKS TERMINAL</span>
          <span className="bannerMeta">v1.987</span>
        </div>
        <div className="bannerRight">
          <span className="bannerChip">LIVE</span>
        </div>
      </div>

      <div className="terminal">
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
              // ensure audio is armed when typing
              armAudio();

              // click for most keys (optional – you can restrict if you want)
              if (e.key.length === 1 || e.key === "Backspace") {
                playClick();
              }

              if (e.key === "Enter" && input.trim()) {
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