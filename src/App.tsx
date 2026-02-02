import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const bootLines = useMemo(
    () => [
      "retro robot command terminal v1.987",
      "system initialised... OK",
      "loading robot database... OK",
      "connecting to mainframe... OK",
      "type 'help' for available commands.",
    ],
    []
  );

  const [lines, setLines] = useState<string[]>(bootLines);
  const [input, setInput] = useState("");
  const outRef = useRef<HTMLDivElement>(null);

  // --- iOS/Wix-safe sound ---
  const isArmed = useRef(false);
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSound.current = new Audio("/click.mp3");
    errorSound.current = new Audio("/error.mp3");
    if (clickSound.current) clickSound.current.volume = 0.4;
    if (errorSound.current) errorSound.current.volume = 0.55;
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
        a.volume = oldVol;
      });
  }

  function playClick() {
    const a = clickSound.current;
    if (!a) return;
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

  function pushCmd(cmd: string) {
    setLines((l) => [...l, `> ${cmd}`]);
  }

  function pushOut(...out: string[]) {
    setLines((l) => [...l, ...out]);
  }

  function longMintStory() {
    // A long-ish fun response with multiple lines (no async needed)
    return [
      "MINT PROTOCOL INITIATED...",
      "checking vault seals... OK",
      "warming synth-press... OK",
      "calculating rarity matrix... OK",
      "etching serial: RP-" + String(Math.floor(1000 + Math.random() * 9000)),
      "forging chrome badge... OK",
      "aligning pixel rails... OK",
      "mint complete.",
      "tip: try 'arcade' or 'matrix' for more signal.",
    ];
  }

  function runCommand(cmd: string) {
    const raw = cmd.trim();
    const c = raw.toLowerCase();

    // Always show what they typed in BLUE
    pushCmd(raw);

    if (!raw) return;

    if (c === "help") {
      pushOut(
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
        "robot-archives",
        "about"
      );
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
        "signal locked.",
        "type 'help' for available commands.",
      ]);
      return;
    }

    if (c === "whoami") {
      pushOut("you are: visitor");
      return;
    }

    if (c === "arcade") {
      pushOut(
        "ARCADE MODE: ONLINE",
        "insert coin: ░░▒▒▓▓▓█",
        "controls: [WASD]  [SPACE]",
        "high score: 1987",
        "status: READY"
      );
      return;
    }

    if (c === "matrix") {
      pushOut(
        "MATRIX FEED: ENGAGED",
        "01101000 01100101 01101100 01110000",
        "green rain stabilised... OK",
        "warning: reality distortion minor",
        "type 'help' to exit confusion."
      );
      return;
    }

    if (c === "mint") {
      pushOut(...longMintStory());
      return;
    }

    if (c === "hack") {
      pushOut(
        "HACK SEQUENCE STARTED...",
        "breaching firewall... DENIED",
        "deploying charm offensive... OK",
        "negotiating with security daemon... OK",
        "result: ACCESS GRANTED (read-only)",
        "tip: try 'robot-archives' for artefacts."
      );
      return;
    }

    if (["home", "about", "robot-archives"].includes(c)) {
      pushOut(`navigating to ${c}...`);
      return;
    }

    // error
    playError();
    pushOut(
      `command not recognised: ${raw}`,
      "type 'help' for available commands."
    );
  }

  function lineClass(line: string) {
    const l = line.toLowerCase();

    if (l.startsWith("> ")) return "cmd"; // BLUE typed commands
    if (l.includes("not recognised") || l.includes("denied")) return "err";
    if (l === "commands" || l === "site nav") return "hdr";
    if (l.includes("type 'help'")) return "hint";
    if (l.includes("ok")) return "ok";

    return "out";
  }

  return (
    <div className="crt" onPointerDown={armAudio} onKeyDownCapture={armAudio}>
      {/* Mobile-friendly banner */}
      <div className="banner">
        <div className="bannerLeft">
          <span className="bannerTitle">ROBO•PUNKS</span>
          <span className="bannerMeta">terminal</span>
        </div>
        <div className="bannerRight">
          <span className="bannerChip">v1.987</span>
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
              armAudio();

              if (e.key.length === 1 || e.key === "Backspace") {
                playClick();
              }

              if (e.key === "Enter") {
                const toRun = input;
                setInput("");
                if (toRun.trim()) runCommand(toRun);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}