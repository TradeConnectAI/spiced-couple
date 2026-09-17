# Spiced Couple 🌶️

Free browser-only couples game for two consenting adults. A 10-round arc from **apart teasing** to **together filth**: naughty talk → photo dares → short clips → meetup gate → mini-games, Spice Coins & Act Shop.

**18+ only. Enthusiastic consent. Private home. No accounts. Peer-to-peer — nothing stored on a server once you close the session.**

## Live

https://tradeconnectai.github.io/spiced-couple/

## How to play tonight

### One-time setup
```bash
cd /workspace/spiced-couple
npm install
npm run dev
```
Open the printed URL on **both phones** (same Wi‑Fi helps; mobile data works via PeerJS cloud + STUN).

Or build a static copy:
```bash
npm run build
npm run preview
```

### Room flow
1. **Host** (Steve): Create room → pick intensity → tick 18+ consent → share the **6-character code**.
2. **Guest** (Laura): Join room → enter code → consent.
3. When both connected, Host taps **Start the night**.
4. Play the **10-round arc** (strict order):
   - **Rounds 1–3 — Apart · Naughty talk / Q&A** (text + audio). No mini-games. No Act Shop.
   - **Rounds 4–5 — Apart · Photos** (photo dares; send via your own messages — app never uploads).
   - **Rounds 6–7 — Apart · Short clips** (5–15 sec video dares; send yourselves).
   - **Meetup gate** — full-screen “Go to the same room now.” Both tap **We’re together** (PeerJS synced).
   - **Rounds 8–10 — Together · Games & filth** — mini-games, Spice Coins, Act Shop, oral/sex-act forfeits, Hard filth.

### Mini-games (filth phase only)
| Game | How to win |
|------|------------|
| Symbol Match (Dobble-style) | First to tap the shared emoji |
| Card War | Higher card wins |
| Reaction Duel | First tap after GO (early = lose) |
| Hot Potato | Don’t hold it when it explodes |

### Spice Coins & Act Shop
Both start with **50** coins. Apart challenges drip +8 each. Wins in filth pay more. Spend coins in the Act Shop (unlocked after meetup) so the other must perform. Rarity: **tease / filthy / depraved**.

### House rules (always on)
- Enthusiastic consent; free skip anytime  
- Safeword before restraint / rough / power play  
- Private home only  
- No recording unless both explicitly opt in  

### Solo preview
Lobby footer: **Preview solo on this phone** — plays the full arc as host without PeerJS (useful to demo Hard pack content).

## Privacy
Session state lives in your two browsers and travels over PeerJS data channels. No registration, no media uploads, no game server database.

## Stack
Vite · React · TypeScript · Tailwind CSS v4 · PeerJS

## Intensity
- **Romantic** — soft heat  
- **Spicy** — flirty & handsy  
- **Fire** — explicit  
- **Hard** — deep throat, anal play, spit, rough consensual, face sitting, throatpie fantasy language — adults only  

Built for Steve & Laura. Have fun. Stay kind. Safeword loud.
