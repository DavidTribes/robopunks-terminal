import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [lines, setLines] = useState<string[]>([
    "ROBOPUNKS ROBOT COMMAND TERMINAL v1.987",
    "system initialised... OK",
    "neural cores online... OK",
    "signal locked.",
    "type 'help' for available commands.",
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

  const playClick = () => {
    clickSound.current?.play().catch(() => {});
  };

  const playError = () => {
    errorSound.current?.play().catch(() => {});
  };

  function runCommand(cmd: string) {
    const c = cmd.toLowerCase().trim();

    switch (c) {
      case "help":
        setLines(l => [
          ...l,
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
          "NAV",
          "home",
          "robot-archives",
          "about",
        ]);
        return;

      case "clear":
      case "cls":
        setLines([]);
        return;

      case "boot":
        setLines([
          "rebooting system...",
          "system initialised... OK",
          "neural cores online... OK",
          "signal locked.",
        ]);
        return;

      case "whoami":
        setLines(l => [...l, "> whoami", "identity: visitor"]);
        return;

      case "arcade":
        setLines(l => [
          ...l,
          "> arcade",
          "initialising arcade cabinet...",
          "loading ROMs...",
          "GALAXIAN.OK",
          "OUTRUN.OK",
          "ROBOTRON.OK",
          "insert coin to continue.",
        ]);
        return;

      case "matrix":
        setLines(l => [
          ...l,
          "> matrix",
          "entering simulation layer...",
          "green code cascade engaged",
          "there is no spoon.",
        ]);
        return;

      case "mint":
        setLines(l => [
          ...l,
          "> mint",
          "initialising mint protocol...",
          "verifying entropy...",
          "generating unique artifact...",
          "this action is permanent.",
          "mint complete. provenance locked.",
        ]);
        return;

      case "hack":
        playError();
        setLines(l => [
          ...l,
          "> hack",
          "ACCESS DENIED",
          "countermeasures active",
          "incident logged",
        ]);
        return;

      case "home":
      case "robot-archives":
      case "about":
        setLines(l => [
          ...l,
          `> ${c}`,
          `navigating to ${c}...`,
        ]);
        return;

      default:
        playError();
        setLines(l => [
          ...l,
          `> ${cmd}`,
          `command not recognised: ${cmd}`,
          "type 'help' for available commands.",
        ]);
    }
  }

  function lineClass(line: string) {
    const l = line.toLowerCase();
    if (l.startsWith(">")) return "cmd";
    if (l.includes("denied") || l.includes("error")) return "err";
    if (l === "commands" || l === "nav") return "hdr";
    if (l.includes("type 'help'")) return "hint";
    return "out";
  }

  return (
    <div className="crt">
      <div className="terminal">
        <div className="banner">
          <div className="bannerText">ROBOPUNKS</div>
          <div className="bannerSub">ROBOT COMMAND TERMINAL</div>
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