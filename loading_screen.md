# 🏙️ Manga Skyscraper Terminal Dive Loading Screen

> **Project:** Aswin — AI & Data Science Portfolio  
> **Inspiration:** Hand-drawn manga ink sketch with extreme downward fish-eye skyscraper dive & jagged comic shout banner  
> **Aesthetic Mode:** Cyber-Manga Hybrid (High-contrast black & white pen-and-ink hatching with subtle crimson neon highlights)  
> **Source Files:** [`index.html`](./index.html), [`style.css`](./style.css), [`script.js`](./script.js)  

---

## 📑 Table of Contents
1. [Overview & Manga Design Philosophy](#1-overview--manga-design-philosophy)
2. [Procedural 3D Skyscraper City Engine (Canvas 2D)](#2-procedural-3d-skyscraper-city-engine-canvas-2d)
   * [2.1 Radial Golden-Ratio Distribution](#21-radial-golden-ratio-distribution)
   * [2.2 Fish-Eye Barrel Distortion Math](#22-fish-eye-barrel-distortion-math)
   * [2.3 High-Contrast Ink Hatching & Crimson Accents](#23-high-contrast-ink-hatching--crimson-accents)
3. [The Freefalling Manga Hero Silhouette](#3-the-freefalling-manga-hero-silhouette)
   * [3.1 Headfirst Aerodynamic Aero-Pose](#31-headfirst-aerodynamic-aero-pose)
   * [3.2 Interactive Mouse Tilt & Parallax Physics](#32-interactive-mouse-tilt--parallax-physics)
4. [The Stylized Jagged Manga Dialogue Frame](#4-the-stylized-jagged-manga-dialogue-frame)
   * [4.1 Direct Reproduction from User Sketch](#41-direct-reproduction-from-user-sketch)
   * [4.2 Monospace Ticker & Live Altitude Readouts](#42-monospace-ticker--live-altitude-readouts)
5. [Converging Action Speedlines (Shūchūsen 集中線)](#5-converging-action-speedlines-shūchūsen-集中線)
6. [Supersonic Sound Barrier Piercing Transition](#6-supersonic-sound-barrier-piercing-transition)
7. [Multi-Layer Web Audio Synthesis](#7-multi-layer-web-audio-synthesis)
8. [Configuration & Customization Guide](#8-configuration--customization-guide)

---

## 1. Overview & Manga Design Philosophy

The loading screen faithfully brings to life the user's hand-drawn sketch: an **extreme downward fish-eye perspective dive** through a sprawling forest of towering monolithic skyscrapers at terminal velocity.

### Core Visual Tenets:
* **Cyber-Manga Hybrid Aesthetic:** Crisp, high-contrast black & white pen-and-ink linework, paper-white illuminated rooftops, dense diagonal cross-hatching, accented by selective cyber-crimson (`#ff2036` / `#e50914`) vertical laser corner beacons.
* **Fish-Eye Perspective Curvature:** Monolithic skyscrapers bend and arc radially towards the outer screen boundaries through procedural polynomial barrel distortion.
* **Terminal Velocity Descent:** Camera altitude plunges from high in the stratosphere ($Z = 4500$) down to the roof tops ($Z = 800$), accelerating as loading approaches 100%.
* **Live Interactive Parallax:** Moving the cursor or tilting the device applies micro-aero roll to the diving hero and creates genuine 3D parallax through the building canyons.
* **Stylized Jagged Comic Shout Bubble:** Directly replicates the user's angular sketch banner, rendering real-time loading percentages, an energy meter, and Japanese Kanji status tags (`超速降下`, `音速突破`).
* **Supersonic Atmospheric Shockwave Finale:** Upon 100% completion (or click), the hero breaks the sound barrier with an expanding shockwave, inverted Sakuga impact flash, and camera screen-quake.

---

## 2. Procedural 3D Skyscraper City Engine (Canvas 2D)

All 3D geometry is procedurally synthesized at 60fps on `#manga-dive-canvas` without heavy WebGL dependencies.

### 2.1 Radial Golden-Ratio Distribution
96 building monoliths are arranged in expanding concentric rings around the dive drop zone:
```javascript
const angle = (i * 2.39996) + (Math.random() * 0.15 - 0.075);
const radFrac = Math.pow(i / BUILDING_COUNT, 0.72);
const dist = minRadius + radFrac * (maxRadius - minRadius);
const x = Math.cos(angle) * dist;
const y = Math.sin(angle) * dist;
```

### 2.2 Fish-Eye Barrel Distortion Math
To achieve the distinct bowed building curvature from the sketch, every 3D vertex undergoes perspective projection followed by polynomial barrel distortion:
```javascript
const dx = (rawX - vanishingX) / (width * 0.5);
const dy = (rawY - vanishingY) / (height * 0.5);
const distSq = dx * dx + dy * dy;
const barrelFactor = 1.0 + 0.36 * distSq; // Manga wide-angle warp

const finalX = vanishingX + dx * (width * 0.5) * barrelFactor;
const finalY = vanishingY + dy * (height * 0.5) * barrelFactor;
```

### 2.3 High-Contrast Ink Hatching & Crimson Accents
* **Roofs:** Solid polygon filled with `#f0f0f5` (sunlit off-white) framed by a bold `2.4px` jet-black ink outline. Key roofs include helipads and antenna masts.
* **Side Walls:** Shaded in deep ink black with procedural parallel hatch lines spaced `5–8px` apart.
* **Cyber Beacons:** Select outer corners trace a glowing `#ff2036` vertical edge line with real-time canvas neon bloom.

---

## 3. The Freefalling Manga Hero Silhouette

Centered directly at the dive focus `(50%, 50%)`:

### 3.1 Headfirst Aerodynamic Aero-Pose
* Outstretched eagle-spread arms and curved cape flaps flapping in upward wind streams.
* Drawn via clean scalable SVG with manga hatching folds and a glowing crimson cyber visor eye flare.
* Dynamic air turbine shockwave ring pulsing outward beneath the hero.

### 3.2 Interactive Mouse Tilt & Parallax Physics
```javascript
heroStage.style.setProperty('--hero-tilt-x', `${diveMouseX * 18}px`);
heroStage.style.setProperty('--hero-tilt-y', `${diveMouseY * 14}px`);
heroStage.style.setProperty('--hero-roll', `${diveMouseX * 7}deg`);
```

---

## 4. Central Standalone Kanji Symbol (勝)

The middle of the loading dive features exclusively the standalone Japanese Kanji symbol from the top-left menu near ASWIN (`勝` - Victory / Win) with no surrounding box or border:
- **Boxless Standalone Symbol:** The enclosing box and borders have been completely removed, presenting only the bold Japanese calligraphic character `勝`.
- **High-Contrast Manga Visibility:** Scaled generously (`clamp(5.5rem, 12vw, 8.5rem)`) with dual-layer dark ink outlines (`-2px -2px 0 #020205`), intense crimson neon aura (`0 0 35px #e50914, 0 0 70px rgba(229,9,20,0.85)`), and a subtle diffused radial drop shadow aura for clear legibility over moving rooftops and speedlines.
- **Butter-Smooth Continuous Zoom-Out:** From the very first millisecond, the symbol renders at `scale(2.4)` and glides with a single continuous ease curve (`cubic-bezier(0.16, 1, 0.3, 1)`) down to `scale(0.85)` directly on the GPU compositor, eliminating filter recalculation jank.
- **Pure Chromatic Glow Pulse:** The breathing animation pulses exclusively through multi-tier neon crimson text-shadows, ensuring zero harmonic scale vibration during the zoom-out.
- **Interactive 3D Parallax Tilt:** Mouse movement dynamically rolls and pitches the center symbol in 3D perspective, matching the dive physics of the skyscraper canyon.
- **Supersonic Seamless Zoom-Out Finale:** When breaking the sound barrier at 100% (or on user click), the symbol smoothly continues from its exact current scale all the way down to `scale(0)` without any snap or hitch.

---

## 5. Converging Action Speedlines (Shūchūsen 集中線)

48 radial speedline streaks radiate from the dive vanishing point, dynamically oscillating in length and opacity with fall velocity. Additional vertical air streaks rush upwards past the camera to create visceral speed.

---

## 6. Supersonic Sound Barrier Piercing Transition

When loading hits 100% (or on user click):
1. `#preloader` receives `.is-supersonic`.
2. Camera executes `supersonicQuake` (micro-shakes simulating sound barrier rupture).
3. 240ms inverted Sakuga impact frame (`mix-blend-mode: difference`).
4. **Immediate Line Dissolution:** The 3D canvas dive lines, speedline flurry, and screentone overlay fade out immediately (`opacity: 0` in 220ms) under the shockwave flash, guaranteeing no residual lines linger.
5. **Synchronized Page Fade-Out:** At 260ms, `#preloader` seamlessly begins fading out into the main portfolio (`is-exiting`) as the shockwave flash clears, revealing the interactive 300-frame canvas background cleanly.
6. At 850ms, the preloader unmounts completely and cancels background animation loops.

---

## 7. Multi-Layer Web Audio Synthesis

Synthesized on-the-fly using Web Audio API:
* **Air Turbulence Whistle:** Dynamic bandpass sweep ramping from 400Hz to 5200Hz.
* **Sub-Bass Kinetic Shockwave:** Sine drop from 110Hz to 26Hz.
* **Harmonic Chime Stagger:** High frequency metallic chimes (1600Hz–4800Hz) on impact.
