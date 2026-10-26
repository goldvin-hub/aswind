/**
 * ASWIN — AI & Data Science Portfolio
 * Synchronized Canvas Scroll & Interactive Experience Engine
 * Grounded in port.pdf
 */

(function () {
  'use strict';

  // --- CONFIGURATION ---
  const TOTAL_FRAMES = 300;
  const FRAME_PREFIX = './qwe/ezgif-frame-';
  const FRAME_EXT = '.jpg';
  const INITIAL_BATCH_SIZE = 25;
  
  // DOM Elements
  const canvas = document.getElementById('samurai-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const preloader = document.getElementById('preloader');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderSubStatus = document.getElementById('loader-sub-status');
  const mangaBarFill = document.getElementById('manga-bar-fill');
  
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const activeFrameNum = document.getElementById('active-frame-num');
  const scrollCue = document.getElementById('scroll-cue');
  
  const hudScrubber = document.getElementById('hud-scrubber');
  const hudFrameLabel = document.getElementById('hud-frame-label');
  const hudPlayBtn = document.getElementById('hud-play-btn');
  const hudZenBtn = document.getElementById('hud-zen-btn');
  const btnZenToggle = document.getElementById('btn-zen-toggle');
  const btnAutoPlay = document.getElementById('btn-auto-play');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const hudSoundBtn = document.getElementById('hud-sound-btn');
  const toastShelf = document.getElementById('toast-shelf');

  // Animation & Rendering State
  const frames = new Array(TOTAL_FRAMES + 1); // 1-indexed
  let loadedCount = 0;
  let currentFrame = 1;
  let targetFrame = 1;
  let isAutoPlaying = false;
  let autoPlaySpeed = 1;
  let autoPlayTimer = null;
  let isSoundActive = false;
  let isZenMode = false;
  let audioCtx = null;
  let ambientOscillators = [];
  let currentActiveProject = 'attendance';

  // --- HELPER: FORMAT FRAME NUMBER ---
  function getFrameUrl(index) {
    const padIndex = String(index).padStart(3, '0');
    return `${FRAME_PREFIX}${padIndex}${FRAME_EXT}`;
  }

  // --- CANVAS SETUP & RESIZE ---
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    renderFrame(Math.round(currentFrame));
  }

  window.addEventListener('resize', resizeCanvas);

  // --- DRAW IMAGE WITH COVER ASPECT RATIO ---
  function renderFrame(frameIndex) {
    let img = frames[frameIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = frameIndex - offset;
        const right = frameIndex + offset;
        if (left >= 1 && frames[left] && frames[left].complete && frames[left].naturalWidth > 0) {
          img = frames[left];
          break;
        }
        if (right <= TOTAL_FRAMES && frames[right] && frames[right].complete && frames[right].naturalWidth > 0) {
          img = frames[right];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = cw;
      renderH = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderH = ch;
      renderW = ch * imgRatio;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = '#07070a';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    // Update HUD indicator values
    if (activeFrameNum) {
      activeFrameNum.textContent = String(frameIndex).padStart(3, '0');
    }
    if (hudFrameLabel) {
      hudFrameLabel.textContent = `${frameIndex}/300`;
    }
    if (hudScrubber && document.activeElement !== hudScrubber) {
      hudScrubber.value = frameIndex;
    }
  }

  // --- MANGA SKYSCRAPER TERMINAL DIVE 3D ENGINE (Visuals from user sketch) ---
  let preloaderDismissed = false;
  let visualPercent = 0;
  let targetPercent = 0;
  let diveCanvasAnimId = null;
  let diveMouseX = 0;
  let diveMouseY = 0;

  function initMangaDiveEngine() {
    const diveCanvas = document.getElementById('manga-dive-canvas');
    if (!diveCanvas) return;
    const dCtx = diveCanvas.getContext('2d');
    if (!dCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    function resizeDive() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      diveCanvas.width = width * dpr;
      diveCanvas.height = height * dpr;
      diveCanvas.style.width = `${width}px`;
      diveCanvas.style.height = `${height}px`;
    }
    resizeDive();
    window.addEventListener('resize', resizeDive);

    // Track mouse for interactive hero tilt & camera parallax
    window.addEventListener('mousemove', (e) => {
      diveMouseX = (e.clientX - width / 2) / (width / 2); // -1 to 1
      diveMouseY = (e.clientY - height / 2) / (height / 2); // -1 to 1

      const heroStage = document.getElementById('manga-hero-character');
      if (heroStage) {
        heroStage.style.setProperty('--hero-tilt-x', `${(diveMouseX * 18).toFixed(1)}px`);
        heroStage.style.setProperty('--hero-tilt-y', `${(diveMouseY * 14).toFixed(1)}px`);
        heroStage.style.setProperty('--hero-roll', `${(diveMouseX * 7).toFixed(1)}deg`);
      }

      const centerLogo = document.getElementById('manga-center-logo');
      if (centerLogo) {
        centerLogo.style.setProperty('--tilt-x', `${(diveMouseX * 16).toFixed(1)}px`);
        centerLogo.style.setProperty('--tilt-y', `${(diveMouseY * 12).toFixed(1)}px`);
        centerLogo.style.setProperty('--rot-y', `${(diveMouseX * 10).toFixed(1)}deg`);
        centerLogo.style.setProperty('--rot-x', `${(-diveMouseY * 10).toFixed(1)}deg`);
      }
    }, { passive: true });

    // Generate 3D Skyscraper Monoliths radiating around the dive drop zone
    const BUILDING_COUNT = 96;
    const buildings = [];
    const minRadius = 85;
    const maxRadius = 1450;

    for (let i = 0; i < BUILDING_COUNT; i++) {
      // Golden angle spiral distribution for natural, dense urban framing
      const angle = (i * 2.39996) + (Math.random() * 0.15 - 0.075);
      const radFrac = Math.pow(i / BUILDING_COUNT, 0.72);
      const dist = minRadius + radFrac * (maxRadius - minRadius) + (Math.random() * 50 - 25);

      const bx = Math.cos(angle) * dist;
      const by = Math.sin(angle) * dist;

      // Buildings get wider and taller further out to frame the fish-eye canyon
      const baseW = 65 + Math.random() * 75 + radFrac * 55;
      const baseD = 65 + Math.random() * 75 + radFrac * 55;
      const heightVal = 600 + Math.random() * 1400 + (1 - radFrac) * 750;

      // Architectural roof features
      const hasHelipad = Math.random() > 0.65;
      const hasAntenna = Math.random() > 0.55;
      const hasCrimsonBeacon = Math.random() > 0.72; // Cyber-Manga accent

      // Hatching density
      const hatchStep = 5 + Math.floor(Math.random() * 4);

      buildings.push({
        x: bx,
        y: by,
        w: baseW,
        d: baseD,
        h: heightVal,
        hasHelipad,
        hasAntenna,
        hasCrimsonBeacon,
        hatchStep,
        beaconCorner: Math.floor(Math.random() * 4)
      });
    }

    // Dynamic Manga Radial Action Speedlines (Shūchūsen 集中線)
    const SPEEDLINE_COUNT = 48;
    const speedlines = [];
    for (let i = 0; i < SPEEDLINE_COUNT; i++) {
      speedlines.push({
        angle: Math.random() * Math.PI * 2,
        rStart: 110 + Math.random() * 170,
        len: 140 + Math.random() * 380,
        width: 1.2 + Math.random() * 2.8,
        alpha: 0.25 + Math.random() * 0.65,
        speed: 16 + Math.random() * 24,
        isCrimson: Math.random() > 0.82
      });
    }

    // High velocity vertical wind wake particles
    const WIND_PARTICLE_COUNT = 60;
    const windParticles = [];
    for (let i = 0; i < WIND_PARTICLE_COUNT; i++) {
      windParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 25 + Math.random() * 80,
        speed: 22 + Math.random() * 38,
        alpha: 0.2 + Math.random() * 0.55,
        thickness: 0.8 + Math.random() * 1.6,
        isRed: Math.random() > 0.85
      });
    }

    // Camera dive parameters
    let cameraZ = 4500; // starts high in the sky
    const focalLength = 520;

    function renderDive(now) {
      if (preloaderDismissed) return;

      dCtx.save();
      dCtx.scale(dpr, dpr);

      // Deep void ink background
      dCtx.fillStyle = '#020205';
      dCtx.fillRect(0, 0, width, height);

      const elapsed = now * 0.001;

      // Target camera altitude descends rapidly with loading percentage
      const pctFrac = Math.min(1, Math.max(0, visualPercent / 100));
      const targetZ = 4400 - (pctFrac * 3600); // from 4400 down to 800
      cameraZ += (targetZ - cameraZ) * 0.08;

      // Add high-speed fall turbulence
      const turbulenceX = Math.sin(now * 0.02) * (1.5 + pctFrac * 4) + (diveMouseX * 35);
      const turbulenceY = Math.cos(now * 0.026) * (1.5 + pctFrac * 4) + (diveMouseY * 25);

      const vanishingX = width / 2;
      const vanishingY = height * 0.52; // vanishing point slightly below center (matching sketch)

      // --- FISH-EYE PROJECTION HELPER (Barrel distortion matching user sketch) ---
      function projectPoint(px, py, pz) {
        const relZ = cameraZ - pz;
        if (relZ <= 15) return null;

        const scale = focalLength / relZ;
        const rawX = vanishingX + (px - turbulenceX) * scale;
        const rawY = vanishingY + (py - turbulenceY) * scale;

        // Fish-Eye Barrel Distortion Equation (curves monoliths outwards towards screen edges)
        const dx = (rawX - vanishingX) / (width * 0.5);
        const dy = (rawY - vanishingY) / (height * 0.5);
        const distSq = dx * dx + dy * dy;
        const barrelFactor = 1.0 + 0.36 * distSq; // extreme manga wide angle

        const finalX = vanishingX + dx * (width * 0.5) * barrelFactor;
        const finalY = vanishingY + dy * (height * 0.5) * barrelFactor;

        return { x: finalX, y: finalY, scale, relZ };
      }

      // Sort buildings back-to-front (by distance from camera in radial space)
      buildings.sort((a, b) => {
        const distA = a.x * a.x + a.y * a.y;
        const distB = b.x * b.x + b.y * b.y;
        return distB - distA;
      });

      // --- DRAW 3D BUILDINGS IN MANGA INK STYLE ---
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];

        // 4 corners of roof (top face)
        const hw = b.w * 0.5;
        const hd = b.d * 0.5;

        const pTop0 = projectPoint(b.x - hw, b.y - hd, b.h);
        const pTop1 = projectPoint(b.x + hw, b.y - hd, b.h);
        const pTop2 = projectPoint(b.x + hw, b.y + hd, b.h);
        const pTop3 = projectPoint(b.x - hw, b.y + hd, b.h);

        if (!pTop0 || !pTop1 || !pTop2 || !pTop3) continue;

        // Base points projected down to ground (Z=0)
        const pBot0 = projectPoint(b.x - hw, b.y - hd, 0);
        const pBot1 = projectPoint(b.x + hw, b.y - hd, 0);
        const pBot2 = projectPoint(b.x + hw, b.y + hd, 0);
        const pBot3 = projectPoint(b.x - hw, b.y + hd, 0);

        if (!pBot0 || !pBot1 || !pBot2 || !pBot3) continue;

        // Check if building is on-screen
        const minX = Math.min(pTop0.x, pTop1.x, pTop2.x, pTop3.x);
        const maxX = Math.max(pTop0.x, pTop1.x, pTop2.x, pTop3.x);
        const minY = Math.min(pTop0.y, pTop1.y, pTop2.y, pTop3.y);
        const maxY = Math.max(pTop0.y, pTop1.y, pTop2.y, pTop3.y);
        if (maxX < -150 || minX > width + 150 || maxY < -150 || minY > height + 150) continue;

        // 1. Draw Visible Side Walls with Manga Hatching
        const faces = [
          { topA: pTop0, topB: pTop1, botB: pBot1, botA: pBot0 },
          { topA: pTop1, topB: pTop2, botB: pBot2, botA: pBot1 },
          { topA: pTop2, topB: pTop3, botB: pBot3, botA: pBot2 },
          { topA: pTop3, topB: pTop0, botB: pBot0, botA: pBot3 }
        ];

        faces.forEach((face, fIdx) => {
          // Cross-product check for winding / visibility
          const cross = (face.topB.x - face.topA.x) * (face.botA.y - face.topA.y) -
                        (face.topB.y - face.topA.y) * (face.botA.x - face.topA.x);
          if (cross > 0) return; // backface culling

          // Side wall fill: deep ink black
          dCtx.beginPath();
          dCtx.moveTo(face.topA.x, face.topA.y);
          dCtx.lineTo(face.topB.x, face.topB.y);
          dCtx.lineTo(face.botB.x, face.botB.y);
          dCtx.lineTo(face.botA.x, face.botA.y);
          dCtx.closePath();
          dCtx.fillStyle = '#06060a';
          dCtx.fill();
          dCtx.strokeStyle = '#000000';
          dCtx.lineWidth = 1.8;
          dCtx.stroke();

          // Manga Hatching Lines streaming down the wall
          const numHatches = Math.floor(Math.abs(face.topB.x - face.topA.x) / b.hatchStep);
          if (numHatches > 1 && numHatches < 40) {
            dCtx.beginPath();
            dCtx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
            dCtx.lineWidth = 1;
            for (let h = 1; h < numHatches; h++) {
              const t = h / numHatches;
              const hTopX = face.topA.x + (face.topB.x - face.topA.x) * t;
              const hTopY = face.topA.y + (face.topB.y - face.topA.y) * t;
              const hBotX = face.botA.x + (face.botB.x - face.botA.x) * t;
              const hBotY = face.botA.y + (face.botB.y - face.botA.y) * t;

              dCtx.moveTo(hTopX, hTopY);
              dCtx.lineTo(hBotX, hBotY);
            }
            dCtx.stroke();
          }

          // Cyber-Crimson Neon Edge Line (on select monoliths)
          if (b.hasCrimsonBeacon && fIdx === b.beaconCorner) {
            dCtx.beginPath();
            dCtx.moveTo(face.topA.x, face.topA.y);
            dCtx.lineTo(face.botA.x, face.botA.y);
            dCtx.strokeStyle = '#ff2036';
            dCtx.lineWidth = 2.2;
            dCtx.shadowColor = '#e50914';
            dCtx.shadowBlur = 10;
            dCtx.stroke();
            dCtx.shadowBlur = 0;
          }
        });

        // 2. Draw Top Roof Quad in High-Contrast Off-White Paper Texture
        dCtx.beginPath();
        dCtx.moveTo(pTop0.x, pTop0.y);
        dCtx.lineTo(pTop1.x, pTop1.y);
        dCtx.lineTo(pTop2.x, pTop2.y);
        dCtx.lineTo(pTop3.x, pTop3.y);
        dCtx.closePath();

        dCtx.fillStyle = '#f0f0f5'; // Bright white/grey roof illuminated by sky
        dCtx.fill();
        dCtx.strokeStyle = '#050508'; // Bold ink outline
        dCtx.lineWidth = 2.4;
        dCtx.stroke();

        // Inner roof architectural linework
        const centerRoofX = (pTop0.x + pTop1.x + pTop2.x + pTop3.x) * 0.25;
        const centerRoofY = (pTop0.y + pTop1.y + pTop2.y + pTop3.y) * 0.25;

        if (b.hasHelipad) {
          dCtx.beginPath();
          const rSize = Math.max(3, Math.abs(pTop1.x - pTop0.x) * 0.22);
          dCtx.arc(centerRoofX, centerRoofY, rSize, 0, Math.PI * 2);
          dCtx.strokeStyle = '#121218';
          dCtx.lineWidth = 1.2;
          dCtx.stroke();
        } else if (b.hasAntenna) {
          const pAntennaTop = projectPoint(b.x, b.y, b.h + 80);
          if (pAntennaTop) {
            dCtx.beginPath();
            dCtx.moveTo(centerRoofX, centerRoofY);
            dCtx.lineTo(pAntennaTop.x, pAntennaTop.y);
            dCtx.strokeStyle = b.hasCrimsonBeacon ? '#ff2036' : '#22222a';
            dCtx.lineWidth = 1.8;
            dCtx.stroke();

            if (b.hasCrimsonBeacon) {
              dCtx.fillStyle = '#ff3344';
              dCtx.fillRect(pAntennaTop.x - 2, pAntennaTop.y - 2, 4, 4);
            }
          }
        }
      }

      // --- DRAW CONVERGING MANGA RADIAL SPEEDLINES (Shūchūsen) ---
      for (let s = 0; s < speedlines.length; s++) {
        const line = speedlines[s];

        const r1 = line.rStart + Math.sin(elapsed * line.speed + s) * 20;
        const r2 = r1 + line.len * (0.8 + pctFrac * 0.5);

        const cosA = Math.cos(line.angle);
        const sinA = Math.sin(line.angle);

        const x1 = vanishingX + cosA * r1;
        const y1 = vanishingY + sinA * r1;
        const x2 = vanishingX + cosA * r2;
        const y2 = vanishingY + sinA * r2;

        dCtx.beginPath();
        dCtx.moveTo(x1, y1);
        dCtx.lineTo(x2, y2);

        if (line.isCrimson) {
          dCtx.strokeStyle = `rgba(255, 32, 54, ${line.alpha * (0.6 + pctFrac * 0.4)})`;
          dCtx.lineWidth = line.width * 1.4;
          dCtx.shadowColor = '#e50914';
          dCtx.shadowBlur = 8;
        } else {
          dCtx.strokeStyle = `rgba(255, 255, 255, ${line.alpha * (0.7 + pctFrac * 0.3)})`;
          dCtx.lineWidth = line.width;
          dCtx.shadowBlur = 0;
        }
        dCtx.stroke();
        dCtx.shadowBlur = 0;
      }

      // --- DRAW VERTICAL WIND STREAK PARTICLES ---
      for (let p = 0; p < windParticles.length; p++) {
        const wp = windParticles[p];
        wp.y -= wp.speed * (1 + pctFrac * 0.8);

        if (wp.y < -wp.len) {
          wp.y = height + wp.len;
          wp.x = Math.random() * width;
        }

        dCtx.beginPath();
        dCtx.moveTo(wp.x, wp.y);
        dCtx.lineTo(wp.x, wp.y - wp.len);
        dCtx.strokeStyle = wp.isRed
          ? `rgba(255, 32, 54, ${wp.alpha})`
          : `rgba(255, 255, 255, ${wp.alpha})`;
        dCtx.lineWidth = wp.thickness;
        dCtx.stroke();
      }

      dCtx.restore();

      diveCanvasAnimId = requestAnimationFrame(renderDive);
    }

    diveCanvasAnimId = requestAnimationFrame(renderDive);
  }

  // --- SOUND BARRIER BREAK & TERMINAL DIVE DISMISS ---
  function triggerSlashAndDismiss() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;

    // Trigger Supersonic Shockwave Sound
    try {
      playSfx('dive_boom');
    } catch (e) {
      // Audio context might be restricted before user gesture
    }

    // Trigger Supersonic Shockwave visuals & camera quake
    if (preloader) {
      preloader.classList.add('is-supersonic');

      if (loaderSubStatus) {
        loaderSubStatus.innerHTML = '<span class="kanji-status">音速突破</span> // SOUND BARRIER PIERCED!';
      }
      
      // Smoothly fade out preloader into the main canvas scene in sync with the shockwave
      setTimeout(() => {
        preloader.classList.add('is-exiting');
      }, 260);

      setTimeout(() => {
        preloader.style.display = 'none';
        if (diveCanvasAnimId) {
          cancelAnimationFrame(diveCanvasAnimId);
        }
      }, 850);
    }

    initPetals();
  }

  function initPreloader() {
    // 0. Initialize the 3D Manga Skyscraper Dive Engine immediately
    initMangaDiveEngine();

    // 1. Immediately load and render Frame 1 so artwork is ready
    loadSingleFrame(1, () => {
      renderFrame(1);
    });

    // 2. Incrementally load initial batch
    loadBatch(2, INITIAL_BATCH_SIZE, () => {
      loadRemainingFrames();
    });

    // 3. Smooth animation ticker: dynamic dive percentage & terminal readout
    const startTime = performance.now();
    const minSequenceDuration = 1800; // Snappy, exciting ~1.8s progression

    function updateTicker() {
      if (preloaderDismissed) return;

      const elapsed = performance.now() - startTime;
      const timeProgress = Math.min(100, (elapsed / minSequenceDuration) * 100);
      const assetProgress = Math.min(100, Math.floor((loadedCount / TOTAL_FRAMES) * 100));

      targetPercent = Math.min(100, Math.max(timeProgress, assetProgress));

      if (visualPercent < targetPercent) {
        const step = Math.max(1, (targetPercent - visualPercent) * 0.16);
        visualPercent += step;
        if (targetPercent - visualPercent < 0.6) {
          visualPercent = targetPercent;
        }
      }

      const displayPct = Math.min(100, Math.floor(visualPercent));

      // Update Manga Progress Bar Fill
      if (mangaBarFill) {
        mangaBarFill.style.width = `${displayPct}%`;
      }

      // Update Manga Percentage Display
      if (loaderPercent) {
        loaderPercent.textContent = `${displayPct}%`;
      }

      // Dynamic Terminal Dive Status Readouts based on Altitude
      if (loaderSubStatus) {
        if (displayPct < 35) {
          loaderSubStatus.innerHTML = '<span class="kanji-status">急降下中</span> // INITIATING DROP';
        } else if (displayPct < 70) {
          loaderSubStatus.innerHTML = '<span class="kanji-status">超速降下</span> // TERMINAL VELOCITY';
        } else if (displayPct < 99) {
          loaderSubStatus.innerHTML = '<span class="kanji-status">標的捕捉</span> // CANYON REACHED';
        }
      }

      // Once loading reaches 100%: Break Sound Barrier!
      if (displayPct >= 100) {
        if (loaderSubStatus) {
          loaderSubStatus.innerHTML = '<span class="kanji-status">音速突破</span> // SUPERSONIC ENTRY';
        }
        setTimeout(triggerSlashAndDismiss, 220);
      } else {
        requestAnimationFrame(updateTicker);
      }
    }

    requestAnimationFrame(updateTicker);

    // Fallback safety timeout (ensure splash auto-enters after 4.5s max)
    setTimeout(() => {
      triggerSlashAndDismiss();
    }, 4500);
  }

  function loadSingleFrame(index, onComplete) {
    if (frames[index] && frames[index].complete) {
      if (onComplete) onComplete();
      return;
    }
    const img = new Image();
    img.src = getFrameUrl(index);
    img.onload = () => {
      frames[index] = img;
      loadedCount++;
      if (onComplete) onComplete();
    };
    img.onerror = () => {
      loadedCount++;
      if (onComplete) onComplete();
    };
  }

  function loadBatch(start, end, callback) {
    let batchDone = 0;
    const batchTotal = end - start + 1;
    if (batchTotal <= 0) {
      if (callback) callback();
      return;
    }
    for (let i = start; i <= end; i++) {
      loadSingleFrame(i, () => {
        batchDone++;
        if (batchDone >= batchTotal && callback) {
          callback();
        }
      });
    }
  }

  function loadRemainingFrames() {
    let index = INITIAL_BATCH_SIZE + 1;
    const concurrency = 4;

    function next() {
      if (index > TOTAL_FRAMES) return;
      const cur = index++;
      loadSingleFrame(cur, () => {
        next();
      });
    }

    for (let c = 0; c < concurrency; c++) {
      next();
    }
  }

  // Allow clicking anywhere on screen or pressing Enter / Space / Esc to break sound barrier immediately
  if (preloader) {
    preloader.addEventListener('click', triggerSlashAndDismiss);
  }

  window.addEventListener('keydown', (e) => {
    if (!preloaderDismissed) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSlashAndDismiss();
      }
    }
  });

  // --- SCROLL ENGINE ---
  function getMaxScroll() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function getScrollFraction() {
    const maxScroll = getMaxScroll();
    return Math.max(0, Math.min(1, window.scrollY / maxScroll));
  }

  function updateScrollState() {
    const fraction = getScrollFraction();
    targetFrame = 1 + fraction * (TOTAL_FRAMES - 1);
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${fraction * 100}%`;
    }

    if (fraction > 0.02 && scrollCue) {
      scrollCue.style.opacity = '0';
    } else if (scrollCue) {
      scrollCue.style.opacity = '1';
    }

    // Update active nav link based on scroll position
    const sections = [
      'section-home',
      'section-about',
      'section-skills',
      'section-work',
      'section-contact'
    ];

    const currentY = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (navLink) {
          if (currentY >= top && currentY < bottom) {
            navLink.classList.add('active');
          } else {
            navLink.classList.remove('active');
          }
        }
      }
    });
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });

  // Smooth Render Loop using Lerp physics
  function animationLoop() {
    if (Math.abs(currentFrame - targetFrame) > 0.04) {
      currentFrame += (targetFrame - currentFrame) * 0.16;
      renderFrame(Math.round(currentFrame));
    }
    requestAnimationFrame(animationLoop);
  }

  // --- NAVIGATION SMOOTH SCROLL ---
  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    });
  });

  // --- ZEN VIEW / CLEAN ART TOGGLE ---
  function toggleZenMode() {
    isZenMode = !isZenMode;
    document.body.classList.toggle('zen-mode', isZenMode);

    if (isZenMode) {
      if (hudZenBtn) hudZenBtn.classList.add('active');
      if (btnZenToggle) btnZenToggle.classList.add('active');
      const icon = document.getElementById('zen-icon');
      if (icon) icon.className = 'fa-solid fa-eye-slash';
      const label = document.getElementById('zen-label');
      if (label) label.textContent = 'RESTORE UI';
      showToast('Clean Background View: Cards Hidden');
    } else {
      if (hudZenBtn) hudZenBtn.classList.remove('active');
      if (btnZenToggle) btnZenToggle.classList.remove('active');
      const icon = document.getElementById('zen-icon');
      if (icon) icon.className = 'fa-solid fa-eye';
      const label = document.getElementById('zen-label');
      if (label) label.textContent = 'VIEW ART';
      showToast('Portfolio Cards Restored');
    }
  }

  if (hudZenBtn) hudZenBtn.addEventListener('click', toggleZenMode);
  if (btnZenToggle) btnZenToggle.addEventListener('click', toggleZenMode);

  // --- HUD SCRUBBER CONTROL (If present) ---
  if (hudScrubber) {
    hudScrubber.addEventListener('input', (e) => {
      const frame = parseInt(e.target.value, 10);
      const fraction = (frame - 1) / (TOTAL_FRAMES - 1);
      const maxScroll = getMaxScroll();
      window.scrollTo({ top: fraction * maxScroll, behavior: 'auto' });
      currentFrame = frame;
      targetFrame = frame;
      renderFrame(frame);
    });
  }

  // --- AUTO-PLAY / CINEMATIC TOUR ---
  function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    
    if (isAutoPlaying) {
      if (hudPlayBtn) {
        hudPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        hudPlayBtn.classList.add('active');
      }
      if (btnAutoPlay) btnAutoPlay.classList.add('active');
      const playIcon = document.getElementById('play-icon');
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      const playLabel = document.getElementById('play-label');
      if (playLabel) playLabel.textContent = 'PAUSE TOUR';
      showToast('Portfolio Auto-Tour Activated');
      startAutoPlay();
    } else {
      if (hudPlayBtn) {
        hudPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        hudPlayBtn.classList.remove('active');
      }
      if (btnAutoPlay) btnAutoPlay.classList.remove('active');
      const playIcon = document.getElementById('play-icon');
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      const playLabel = document.getElementById('play-label');
      if (playLabel) playLabel.textContent = 'AUTO-TOUR';
      stopAutoPlay();
    }
  }

  function startAutoPlay() {
    const step = 2.5 * autoPlaySpeed;

    autoPlayTimer = setInterval(() => {
      const cur = window.scrollY;
      const maxScroll = getMaxScroll();
      if (cur >= maxScroll - 5) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollBy(0, step);
      }
    }, 16);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  if (hudPlayBtn) hudPlayBtn.addEventListener('click', toggleAutoPlay);
  if (btnAutoPlay) btnAutoPlay.addEventListener('click', toggleAutoPlay);
  window.toggleAutoPlay = toggleAutoPlay;

  // Speed selector
  document.querySelectorAll('.hud-speed-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hud-speed-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      autoPlaySpeed = parseFloat(btn.getAttribute('data-speed'));
      if (isAutoPlaying) {
        stopAutoPlay();
        startAutoPlay();
      }
    });
  });

  // --- PROCEDURAL WEB AUDIO SFX & SYNTHESIZER ---
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playSfx = function (type) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (type === 'draw') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.35);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'clash') {
        [640, 880, 1320, 2400].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.5);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        });
      } else if (type === 'bell') {
        [110, 220, 335, 442, 660].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const decay = 2.5 - i * 0.3;
          gain.gain.setValueAtTime(0.2 / (i + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + decay);
        });
      } else if (type === 'taiko') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.4);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'koto') {
        const notes = [440, 493.88, 554.37, 659.25, 739.99];
        const note = notes[Math.floor(Math.random() * notes.length)];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now);
        osc.frequency.exponentialRampToValueAtTime(note * 1.02, now + 0.05);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'dive_boom' || type === 'slash') {
        // Multi-layered Anime Katana Strike Audio Synthesizer:
        // 1. High Metallic Sheath Chimes (Multi-hit harmonic staggers for flurry)
        [0, 0.06, 0.12].forEach((offsetTime, burstIdx) => {
          [3200 + burstIdx * 400, 4800 - burstIdx * 300].forEach((freq) => {
            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chimeOsc.type = 'triangle';
            const t = now + offsetTime;
            chimeOsc.frequency.setValueAtTime(freq, t);
            chimeOsc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + 0.35);

            chimeGain.gain.setValueAtTime(0.22 / (burstIdx + 1), t);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

            chimeOsc.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chimeOsc.start(t);
            chimeOsc.stop(t + 0.35);
          });
        });

        // 2. High-Velocity Blade Air-Cleave (Noise Sweep)
        const bufferSize = ctx.sampleRate * 0.35;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 3.0;
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(4200, now + 0.12);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);

        // 3. Cinematic Sub-Bass Impact Punch
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(85, now);
        subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

        subGain.gain.setValueAtTime(0.45, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.4);

        // 4. Reality Shatter & Glass Break Resonance
        [1800, 2900, 4400, 5800, 7200].forEach((freq, idx) => {
          const shatterOsc = ctx.createOscillator();
          const shatterGain = ctx.createGain();
          shatterOsc.type = 'sine';
          const tBreak = now + 0.1 + (idx * 0.015);
          shatterOsc.frequency.setValueAtTime(freq, tBreak);
          shatterOsc.frequency.exponentialRampToValueAtTime(freq * 0.7, tBreak + 0.28);

          shatterGain.gain.setValueAtTime(0.18 / (idx + 1), tBreak);
          shatterGain.gain.exponentialRampToValueAtTime(0.0001, tBreak + 0.28);

          shatterOsc.connect(shatterGain);
          shatterGain.connect(ctx.destination);
          shatterOsc.start(tBreak);
          shatterOsc.stop(tBreak + 0.28);
        });
      }
    } catch (e) {
      console.warn('Audio not initialized yet:', e);
    }
  };

  // Ambient Drone
  function toggleAmbientSound() {
    isSoundActive = !isSoundActive;
    const ctx = getAudioContext();

    if (isSoundActive) {
      if (btnAudioToggle) btnAudioToggle.classList.add('active');
      if (hudSoundBtn) hudSoundBtn.classList.add('active');
      const audioIcon = document.getElementById('audio-icon');
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
      const audioLabel = document.getElementById('audio-label');
      if (audioLabel) audioLabel.textContent = 'SOUND: ACTIVE';
      if (hudSoundBtn) hudSoundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';

      const droneNotes = [110, 164.81, 220, 329.63];
      ambientOscillators = droneNotes.map((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        return { osc, gain };
      });

      playSfx('bell');
      showToast('Soundtrack Activated');
    } else {
      if (btnAudioToggle) btnAudioToggle.classList.remove('active');
      if (hudSoundBtn) hudSoundBtn.classList.remove('active');
      const audioIcon = document.getElementById('audio-icon');
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
      const audioLabel = document.getElementById('audio-label');
      if (audioLabel) audioLabel.textContent = 'SOUND: OFF';
      if (hudSoundBtn) hudSoundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';

      ambientOscillators.forEach(({ osc, gain }) => {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => osc.stop(), 500);
      });
      ambientOscillators = [];
      showToast('Sound Muted');
    }
  }

  if (btnAudioToggle) btnAudioToggle.addEventListener('click', toggleAmbientSound);
  if (hudSoundBtn) hudSoundBtn.addEventListener('click', toggleAmbientSound);
  const btnDrawKatana = document.getElementById('btn-draw-katana');
  if (btnDrawKatana) btnDrawKatana.addEventListener('click', () => playSfx('draw'));

  // --- FLOATING SAKURA PETALS GENERATOR ---
  function initPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;

    for (let i = 0; i < 28; i++) {
      createPetal(container);
    }
  }

  function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = Math.random() * 10 + 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 6 + 7}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(petal);
  }

  // --- INTERACTIVE INTERNSHIP TABS (Agile Infotech / Nike Sales) ---
  const internshipTabs = {
    nike: {
      title: 'Nike Sales Trend & Customer Analytics',
      desc: 'Analyzed the Nike sales dataset using Tableau to identify regional sales trends, demographic customer behavior, and product performance indicators across seasonal quarters.',
      specs: ['Dataset: Nike Global Sales', 'Tool: Tableau & SQL', 'Outcome: Trend Discovery']
    },
    tableau: {
      title: 'Interactive Dashboard Architecture',
      desc: 'Designed interactive visual dashboards and multi-dimensional reports to present key business insights with dynamic charts, parameter filters, and executive KPIs.',
      specs: ['Visuals: Interactive Dashboards', 'Filters: Region, Category, Time', 'Audience: Stakeholders']
    },
    cleaning: {
      title: 'Data Cleaning & Transformation Pipeline',
      desc: 'Performed rigorous data cleaning, schema standardization, missing-value imputation, and transformation to elevate data quality and support data-driven decision-making.',
      specs: ['Process: Data Quality Assurance', 'Tool: SQL & Python', 'Standard: Cleaned Schema']
    },
    bi: {
      title: 'Actionable Business Intelligence',
      desc: 'Generated actionable business insights by analyzing sales performance variations across different product categories and geographic zones, strengthening knowledge of modern BI.',
      specs: ['Competency: Business Intelligence', 'Impact: Actionable Strategies', 'Duration: 1 Month Intenship']
    }
  };

  document.querySelectorAll('#katana-tabs .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#katana-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tabKey = btn.getAttribute('data-tab');
      const data = internshipTabs[tabKey];
      if (data) {
        document.getElementById('tab-title').textContent = data.title;
        document.getElementById('tab-text').textContent = data.desc;
        document.getElementById('spec-1').textContent = data.specs[0];
        document.getElementById('spec-2').textContent = data.specs[1];
        document.getElementById('spec-3').textContent = data.specs[2];
        playSfx('koto');
      }
    });
  });

  // --- PROJECT SELECTOR ---
  const projectDescriptions = {
    attendance: '<b>SMART ATTENDANCE SYSTEM:</b> Developed a robust Python-based attendance management application featuring automated attendance recording, student database synchronization, and automated report generation, eliminating manual logging errors.',
    satellite: '<b>SATELLITE IMAGE ANALYSIS (HACKATHON):</b> Collaborated on an AI-based satellite image analysis solution during a high-tempo hackathon, implementing computer vision models to identify landscape variations, infrastructure, and geospatial patterns.'
  };

  const projectModalContent = {
    attendance: {
      title: 'Smart Attendance System',
      specs: [
        { name: 'Core Language', val: 'Python' },
        { name: 'Architecture', val: 'Automated Record Engine' },
        { name: 'Output', val: 'Automated Report Generation' },
        { name: 'Domain', val: 'Educational Tech & Operations' }
      ],
      desc: 'Developed a Python-based attendance management application with automated attendance recording and report generation. The system handles student log verification and produces clear institutional performance summaries.'
    },
    satellite: {
      title: 'Satellite Image Analysis (Hackathon)',
      specs: [
        { name: 'Domain', val: 'AI & Computer Vision' },
        { name: 'Event', val: 'Competitive Hackathon' },
        { name: 'Collaboration', val: 'Team Solution' },
        { name: 'Impact', val: 'Awarded Recognition' }
      ],
      desc: 'Collaborated on AI-based satellite image analysis and presented the technical solution under hackathon conditions. Implemented feature extraction to classify geospatial imagery for environmental and urban monitoring.'
    },
    techspark: {
      title: 'Tech Spark Official Website',
      specs: [
        { name: 'Role', val: 'Lead Web Developer' },
        { name: 'Platform', val: 'Responsive Web Application' },
        { name: 'Tech Stack', val: 'HTML5, CSS3, JavaScript' },
        { name: 'Organization', val: 'Tech Spark Company (College)' }
      ],
      desc: 'Engineered and launched an official web platform for Tech Spark company in college, featuring dynamic dashboards, modular layout components, and brand identity showcase.'
    },
    nike: {
      title: 'Nike Global Sales Analytics',
      specs: [
        { name: 'Internship', val: 'Agile Infotech' },
        { name: 'Domain', val: 'Business Intelligence & Tableau' },
        { name: 'Focus', val: 'Sales Trends & Demographic KPIs' },
        { name: 'Duration', val: '1 Month Internship' }
      ],
      desc: 'Conducted end-to-end data exploration, data cleaning, and developed comprehensive Tableau BI dashboards visualizing sales variations across product tiers and global markets.'
    }
  };

  window.selectProject = function (projectKey, element) {
    currentActiveProject = projectKey;
    document.querySelectorAll('.stance-item-pill').forEach((pill) => {
      pill.classList.remove('active');
      const icon = pill.querySelector('i');
      if (icon) {
        icon.className = 'fa-solid fa-circle';
        icon.style.color = 'var(--text-muted)';
      }
    });

    element.classList.add('active');
    const icon = element.querySelector('i');
    if (icon) {
      icon.className = 'fa-solid fa-circle-check';
      icon.style.color = 'var(--crimson-primary)';
    }

    const infoEl = document.getElementById('project-active-info');
    if (infoEl && projectDescriptions[projectKey]) {
      infoEl.innerHTML = projectDescriptions[projectKey];
    }

    playSfx('slash');
    showToast(`Project Selected: ${projectKey === 'attendance' ? 'Smart Attendance' : 'Satellite AI'}`);
  };

  window.openProjectModal = function (projectKey) {
    if (projectKey && projectModalContent[projectKey]) {
      currentActiveProject = projectKey;
    }
    const data = projectModalContent[currentActiveProject];
    if (!data) return;

    const modalBody = document.getElementById('project-modal-body');
    modalBody.innerHTML = `
      <h2>${data.title}</h2>
      <div class="modal-spec-grid">
        ${data.specs.map(s => `
          <div class="modal-stat-box">
            <span class="title">${s.name}</span>
            <span class="data">${s.val}</span>
          </div>
        `).join('')}
      </div>
      <p class="modal-text">${data.desc}</p>
      <div class="modal-actions">
        <a href="https://github.com/aswinD17" target="_blank" class="btn-primary">
          <span class="btn-glow"></span>
          <span class="btn-text"><i class="fa-brands fa-github"></i> GITHUB PROFILE</span>
        </a>
      </div>
    `;

    openModal('project-modal');
    playSfx('taiko');
  };

  // --- GENERAL MODALS ---
  window.openModal = function (id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('is-open');
  };

  window.closeModal = function (id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('is-open');
  };

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('is-open');
      }
    });
  });

  // --- CLICK TO COPY CONTACT DETAILS ---
  window.copyToClipboard = function (text, label) {
    if (!text) return;
    const feedbackMsg = `Copied ${label || 'info'} (${text}) to clipboard`;

    function onSuccess() {
      showToast(feedbackMsg);
      playSfx('koto');
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(onSuccess)
        .catch(() => fallbackCopy(text, onSuccess));
    } else {
      fallbackCopy(text, onSuccess);
    }
  };

  function fallbackCopy(text, callback) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (e) {
      showToast(`Copy failed. Manual copy: ${text}`);
    }
    document.body.removeChild(tempInput);
  }

  // --- MOBILE HAMBURGER MENU DRAWER ---
  function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNavLinks = document.getElementById('main-nav-links');
    if (!navToggle || !mainNavLinks) return;

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNavLinks.classList.toggle('mobile-open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
      playSfx('draw');
    });

    // Close when clicking any nav link
    mainNavLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNavLinks.classList.contains('mobile-open')) {
          mainNavLinks.classList.remove('mobile-open');
          const icon = navToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mainNavLinks.classList.contains('mobile-open') && !mainNavLinks.contains(e.target) && !navToggle.contains(e.target)) {
        mainNavLinks.classList.remove('mobile-open');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // --- SUBTLE CUSTOM CURSOR GLOW FOLLOWER (DESKTOP) ---
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 992) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursor.style.opacity = '0';
    });

    function renderCursor() {
      if (isVisible) {
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  // --- 3D INTERACTIVE CARD TILT ---
  function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 992) {
      return;
    }

    const tiltCards = document.querySelectorAll('.arsenal-card, .work-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((cardX - centerX) / centerX) * 6;  // max 6 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // --- ASYNCHRONOUS CONTACT FORM HANDLER ---
  window.handleContactSubmit = function () {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const msgEl = document.getElementById('contact-msg');

    if (!nameInput || !emailInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email) {
      showToast('Please fill in required fields');
      return;
    }

    // Visual button loading state
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    }

    // Visual feedback & submission dispatch
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      if (msgEl) {
        msgEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--crimson-primary)"></i> Thank you, <b>${name}</b>! Your dispatch is registered. Aswin will respond at <b>${email}</b>.`;
        msgEl.style.display = 'block';
      }

      nameInput.value = '';
      emailInput.value = '';
      if (messageInput) messageInput.value = '';

      playSfx('taiko');
      showToast('Transmission Dispatched Successfully');
    }, 650);
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-stamp" style="color: var(--crimson-primary)"></i> <span>${message}</span>`;
    toastShelf.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
  window.showToast = showToast;

  // --- GLOBAL SECTION SCROLL HELPER ---
  window.scrollToSection = function (sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- INITIALIZE ON DOM READY ---
  function boot() {
    resizeCanvas();
    initPreloader();
    initMobileMenu();
    initCustomCursor();
    initCardTilt();
    requestAnimationFrame(animationLoop);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 1);
  } else {
    window.addEventListener('DOMContentLoaded', boot);
  }

})();
