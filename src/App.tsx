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

  // --- simple sound (safe everywhere incl. Wix) ---
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

  function playClick() {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play().catch(() => {});
    }
  }

  function playError() {
    if (errorSound.current) {
      errorSound.current.currentTime = 0;
      errorSound.current.play().catch(() => {});
    }
  }

  function runCommand(cmd: string) {
    const c = cmd.toLowerCase().trim();

    if (c === "help") {
      setLines(l => [
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
      setLines([
        "rebooting system...",
        "system initialised... OK",
        "neural cores online... OK",
      ]);
      return;
    }

    if (c === "whoami") {
      setLines(l => [...l, "> whoami", "you are: visitor"]);
      return;
    }

    if (["home", "about", "archives"].includes(c)) {
      setLines(l => [...l, `> ${c}`, `navigating to ${c}...`]);
      return;
    }

    // error
    playError();
    setLines(l => [
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
    <div className="crt">
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
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              playClick();
              if (e.key === "Enter" && input.trim()) {
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