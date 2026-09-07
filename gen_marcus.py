"""Marcus's companion lines (the school's words in his character), in his voice.

Same recipe as school-of-light/gen_mentors.py: the pinned Kokoro reference
tools/mentor-refs/marcus.wav there, Chatterbox clones it, whisper checks every
clip, Rhubarb bakes the mouth. Reads content.json → marcus.spoken only. His
QUOTES are never made here; they come from the school app.

    ../CHILDREN/mo-and-pip/.venv/bin/python gen_marcus.py [--force]
"""
import os, sys, json, re, difflib, subprocess, tempfile, time
ROOT = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(ROOT, "..", "school-of-light", "tools", "mentor-refs", "marcus.wav")
OUT = os.path.join(ROOT, "audio", "marcus"); VIS = os.path.join(OUT, "visemes.json")
RHUBARB = os.environ.get("RHUBARB") or "/Volumes/2TB SSD/APP-DATA/shared-models/rhubarb/Rhubarb-Lip-Sync-1.14.0-macOS/rhubarb"
CLEAN = ("silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,"
         "silenceremove=start_periods=1:start_silence=0.12:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11")
FORCE = "--force" in sys.argv
C = json.load(open(os.path.join(ROOT, "content.json")))
lines = C["marcus"].get("spoken", [])
def norm(s): s = s.lower().replace("’", "'"); s = re.sub(r"[^a-z0-9' ]+", " ", s); return re.sub(r"\s+", " ", s).strip()
def ok(e, h): a, b = norm(e), norm(h); return bool(b) and difflib.SequenceMatcher(None, a, b).ratio() >= 0.8 and len(b) <= len(a) * 1.35 + 8
jobs = [ln for ln in lines if FORCE or not os.path.exists(os.path.join(OUT, ln["id"] + ".mp3"))]
print(f"{len(jobs)} clips to make", flush=True)
if jobs:
    import perth
    class _NoWM:
        def apply_watermark(self, wav, sample_rate=None, **kw): return wav
        def get_watermark(self, *a, **k): return None
    perth.PerthImplicitWatermarker = _NoWM
    import torch, soundfile as sf, whisper
    from chatterbox.tts import ChatterboxTTS
    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    t0 = time.time(); model = ChatterboxTTS.from_pretrained(device=dev); ear = whisper.load_model("base.en")
    print(f"models up in {time.time()-t0:.0f}s on {dev}", flush=True)
    for i, ln in enumerate(jobs, 1):
        path = os.path.join(OUT, ln["id"] + ".mp3"); tmp = path + ".wav"; good = False
        for attempt, opts in enumerate([dict(exaggeration=0.45, cfg_weight=0.5), dict(exaggeration=0.3, cfg_weight=0.6), dict(exaggeration=0.4, cfg_weight=0.6)], 1):
            wav = model.generate(ln["t"], audio_prompt_path=REF, **opts)
            sf.write(tmp, wav.squeeze(0).cpu().numpy(), model.sr)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", CLEAN, "-codec:a", "libmp3lame", "-b:a", "64k", "-ac", "1", path], check=True)
            heard = ear.transcribe(path, fp16=False)["text"]
            if ok(ln["t"], heard): good = True; break
            print(f"    retake {attempt} {ln['id']}: heard '{heard.strip()[:70]}'", flush=True)
        if os.path.exists(tmp): os.remove(tmp)
        print(f"  [{i}/{len(jobs)}] {ln['id']} {'ok' if good else 'UNVERIFIED'}", flush=True)
# mouth shapes
vis = json.load(open(VIS)) if os.path.exists(VIS) else {}
for ln in lines:
    mp3 = os.path.join(OUT, ln["id"] + ".mp3")
    if not os.path.exists(mp3) or (ln["id"] in vis and not FORCE): continue
    with tempfile.TemporaryDirectory() as td:
        wav = os.path.join(td, "a.wav"); dlg = os.path.join(td, "d.txt")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ar", "16000", "-ac", "1", wav], check=True)
        open(dlg, "w").write(ln["t"])
        r = subprocess.run([RHUBARB, "-f", "json", "--dialogFile", dlg, wav], capture_output=True, text=True, timeout=180)
        vis[ln["id"]] = [[round(c["start"], 2), c["value"]] for c in json.loads(r.stdout)["mouthCues"]]
        print("  baked", ln["id"], flush=True)
json.dump(vis, open(VIS, "w"), separators=(",", ":"))
print("visemes:", len(vis))
