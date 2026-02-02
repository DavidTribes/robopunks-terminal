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
        <div className="logo">ROBOPUNKS</div>
        <div className="subtitle">RETRO ROBOT COMMAND TERMINAL</div>
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