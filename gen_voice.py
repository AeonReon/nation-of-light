"""The narrator's voice (Aurelia, keeper of the flame): Kokoro af_heart, local.
Reads every exercise tablet, tier line, story scroll and UI line in content.json
and writes audio/voice/<id>.mp3. Marcus's own clips are NOT made here — they
are Chatterbox clones made in APPS/school-of-light (gen_mentors.py) and copied.

    python3 gen_voice.py            # only what is missing / changed
    python3 gen_voice.py --force
"""
import json, sys, hashlib, subprocess, urllib.request
from pathlib import Path
HERE = Path(__file__).parent; OUT = HERE / "audio" / "voice"; OUT.mkdir(parents=True, exist_ok=True)
TTS = "http://127.0.0.1:8765/api/tts"; VOICE = "af_heart"; FORCE = "--force" in sys.argv
C = json.loads((HERE / "content.json").read_text())
lines = {}
for m in C["moves"]: lines["mv-" + m["id"]] = m["test"]
for t in C["tiers"]: lines["tier-" + t["id"]] = t["line"]
for s in C["story"]: lines["story-" + s["id"]] = s["t"]
for k, v in C["voice"].items(): lines["ui-" + k] = v
made = 0
for name, text in lines.items():
    mp3 = OUT / f"{name}.mp3"; sha = OUT / f"{name}.sha"
    stamp = hashlib.sha1((VOICE + "|" + text).encode()).hexdigest()[:10]
    if mp3.exists() and sha.exists() and sha.read_text() == stamp and not FORCE: continue
    req = urllib.request.Request(TTS, method="POST", data=json.dumps({"text": text, "voice": VOICE, "speed": 0.96}).encode(),
                                 headers={"Content-Type": "application/json"})
    wav = urllib.request.urlopen(req, timeout=180).read()
    tmp = OUT / f"{name}.wav"; tmp.write_bytes(wav)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-af",
                    "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.15:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-codec:a", "libmp3lame", "-b:a", "48k", "-ac", "1", str(mp3)], check=True)
    tmp.unlink(); sha.write_text(stamp); made += 1; print("made", name)
(HERE / "audio" / "manifest.json").write_text(json.dumps({"voice": VOICE, "clips": sorted(p.stem for p in OUT.glob("*.mp3")),
    "marcus": sorted(p.stem for p in (HERE / "audio" / "marcus").glob("*.mp3"))}, indent=1))
print("done,", made, "new of", len(lines))

# ---- her mouth, for the lines she speaks on screen (the welcome and the finish) ----
import tempfile
RHUBARB = "/Volumes/2TB SSD/APP-DATA/shared-models/rhubarb/Rhubarb-Lip-Sync-1.14.0-macOS/rhubarb"
VIS = OUT / "visemes.json"; vis = json.loads(VIS.read_text()) if VIS.exists() else {}
for name, text in lines.items():
    if not (name.startswith("ui-w") or name.startswith("ui-b") or name.startswith("ui-fin") or name.startswith("ui-t") or name.startswith("ui-d") or name == "ui-godoor" or name.startswith("ui-s") or name == "ui-deck"): continue
    if name in vis and not FORCE: continue
    mp3 = OUT / f"{name}.mp3"
    if not mp3.exists(): continue
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "a.wav"; dlg = Path(td) / "d.txt"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(wav)], check=True)
        dlg.write_text(text)
        r = subprocess.run([RHUBARB, "-f", "json", "--dialogFile", str(dlg), str(wav)], capture_output=True, text=True, timeout=180)
        vis[name] = [[round(c["start"], 2), c["value"]] for c in json.loads(r.stdout)["mouthCues"]]
        print("baked", name)
VIS.write_text(json.dumps(vis, separators=(",", ":")))
