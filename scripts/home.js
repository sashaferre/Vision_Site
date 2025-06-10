document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded and DOMContentLoaded fired");
/* ===========================================================================
     1) TYPED TEXT LINES (FIRST SCREEN)
     =========================================================================== */
  const lineEls = [
    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3")
  ];
  let scrollThresholds = [];

  function computeScrollThresholds() {
    const scrubHeight = document.querySelector(".scrub-spacer").offsetHeight;
    // These thresholds correspond to percentages of scrubHeight at which each line appears
    scrollThresholds = [0.10, 0.25, 0.40];
    console.log("🔧 scrubHeight =", scrubHeight, "thresholds =", scrollThresholds);
  }
   /* ===========================================================================
     4) PRELOAD CANVAS FRAMES (SCROLL‐TRIGGERED)
     =========================================================================== */
  const totalFrames = 160;
  const frameImages = new Array(totalFrames);
  let loadedCount   = 0;

  const canvas = document.getElementById("scrollCanvas");
  if (!canvas) {
    console.error("❌ <canvas id='scrollCanvas'> not found!");
    return;
  }
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const wrapper = document.querySelector(".canvas-wrapper");
    if (!wrapper) {
      console.error("❌ .canvas-wrapper not found!");
      return;
    }
    canvas.width  = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const num = String(i).padStart(3, "0");
    img.src = `frames/frame_${num}.jpg`;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        console.log("🎞️ All frames preloaded");
        computeScrollThresholds();
        window.addEventListener("scroll", onScrollDraw);
      }
    };
    img.onerror = () => {
      console.warn(`⚠️ Could not load frames/frame_${num}.jpg`);
      loadedCount++;
      if (loadedCount === totalFrames) {
        computeScrollThresholds();s
        window.addEventListener("scroll", onScrollDraw);
      }
    };
    frameImages[i - 1] = img;
  }

  /* ===========================================================================
     5) DRAW A SINGLE FRAME TO THE CANVAS AT INDEX idx
     =========================================================================== */
  function drawFrame(idx) {
    const img = frameImages[idx];
    if (!img || !img.complete) return;

    const cw          = canvas.width;
    const ch          = canvas.height;
    const canvasRatio = cw / ch;
    const imgRatio    = img.width / img.height;
    let dw, dh, dx, dy;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas – fit by height
      dh = ch;
      dw = dh * imgRatio;
    } else {
      // Image is taller than canvas – fit by width
      dw = cw;
      dh = dw / imgRatio;
    }
    dx = (cw - dw) / 2;
    dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /* ===========================================================================
     6) MAIN SCROLL HANDLER: SCRUB CANVAS → REVEAL TEXT → PINNING → PARALLAX → FADE
     =========================================================================== */
  function onScrollDraw() {
    const scrollTop   = window.scrollY;
    const scrubHeight = document.querySelector(".scrub-spacer").offsetHeight;
    const maxScroll   = scrubHeight - window.innerHeight;
    let progress      = scrollTop / maxScroll;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // (A) SCRUB CANVAS FRAME
    const rawIdx   = progress * (totalFrames - 1);
    const frameIdx = Math.floor(rawIdx);
    drawFrame(frameIdx);

    // (B) REVEAL TYPED TEXT LINES
    lineEls.forEach((el, i) => {
      if (progress >= scrollThresholds[i] && !el.classList.contains("visible")) {
        el.classList.add("visible");
      }
    });

    // (C) SCROLL‐MAGIC BAR FILL (if present)
    const magicBar = document.querySelector(".scroll-magic-bar");
    if (magicBar) {
      magicBar.style.height = `${progress * 100}%`;
    }

    // (D) PIN / UNPIN CANVAS, TEXT CONTAINER, MAGIC BAR
    const wrapper        = document.querySelector(".canvas-wrapper");
    const textContainer  = document.querySelector(".animated-text-container");
    const magicContainer = document.querySelector(".scroll-magic-container");

    if (progress < 1) {
      // Still scrubbing → keep everything pinned
      if (wrapper) {
        wrapper.style.position  = "fixed";
        wrapper.style.top       = "25vh";
        wrapper.style.left      = "50%";
        wrapper.style.transform = "translateX(-50%)";
      }
      if (textContainer) {
        textContainer.style.position  = "fixed";
        textContainer.style.top       = "14vh";
        textContainer.style.left      = "50%";
        textContainer.style.transform = "translateX(-50%)";
      }
      if (magicContainer) {
        magicContainer.style.position = "fixed";
        magicContainer.style.top      = "45vh";
        magicContainer.style.right    = "40px";
      }
      wrapper?.classList.remove("unpinned");
      textContainer?.classList.remove("unpinned");
      magicContainer?.classList.remove("unpinned");
    } else {
      // Once progress ≥ 1 → “unpin” each element so it scrolls with page
      if (wrapper && !wrapper.classList.contains("unpinned")) {
        const rectW   = wrapper.getBoundingClientRect();
        const absTopW = rectW.top + window.scrollY;
        wrapper.style.position  = "absolute";
        wrapper.style.top       = `${absTopW}px`;
        wrapper.style.left      = "50%";
        wrapper.style.transform = "translateX(-50%)";
        wrapper.classList.add("unpinned");
      }
      if (textContainer && !textContainer.classList.contains("unpinned")) {
        const rectT   = textContainer.getBoundingClientRect();
        const absTopT = rectT.top + window.scrollY;
        textContainer.style.position  = "absolute";
        textContainer.style.top       = `${absTopT}px`;
        textContainer.style.left      = "50%";
        textContainer.style.transform = "translateX(-50%)";
        textContainer.classList.add("unpinned");
      }
      if (magicContainer && !magicContainer.classList.contains("unpinned")) {
        const rectM   = magicContainer.getBoundingClientRect();
        const absTopM = rectM.top + window.scrollY;
        magicContainer.style.position = "absolute";
        magicContainer.style.top      = `${absTopM}px`;
        magicContainer.style.right    = "40px";
        magicContainer.classList.add("unpinned");
      }
    }

    // (E) LOGO PARALLAX (once progress ≥ 1)
    const logos = document.querySelectorAll(".logo-item");
    if (progress >= 1) {
      const extraScroll = scrollTop - maxScroll;
      logos.forEach((img) => {
        // Each logo’s existing data-speed × 2 for faster upward float
        const baseSpeed = parseFloat(img.dataset.speed) || 0.2;
        const speed     = baseSpeed * 2;;
        const baseX     = getXOffset(img);
        img.style.transform = `translateX(${baseX}px) translateY(-${extraScroll * speed}px)`;
      });
    } else {
      // Reset logos to no vertical offset
      logos.forEach((img) => {
        const baseX = getXOffset(img);
        img.style.transform = `translateX(${baseX}px)`;
      });
    }

    // (F) BACKGROUND FADE • CANVAS/TEXT INVERSION • TAGLINE COLOR
    const body = document.body;

    function invertAll(amount) {
      const clamped = Math.max(0, Math.min(1, amount));
      canvas.style.filter       = `invert(${clamped})`;
      textContainer.style.filter = `invert(${clamped})`;
    }
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // (F.1) FADE‐IN based on “SabioTrade” logo’s position
    const sabioElem = document.querySelector('img[alt="SabioTrade"]');
    let inMapped = 0;
    if (sabioElem) {
      const sabRect = sabioElem.getBoundingClientRect();
      const top     = sabRect.top;
      const vh      = window.innerHeight;
      let inRaw = (vh - top) / ((vh / 2) * 2);
      inRaw = Math.max(0, Math.min(1, inRaw));

      const rampIn = 0.45; // 45% ramp, 10% plateau, 45% ramp
      if (inRaw <= 0) {
        inMapped = 0;
      } else if (inRaw < rampIn) {
        inMapped = inRaw / rampIn;
      } else {
        inMapped = 1;
      }
      inMapped = Math.max(0, Math.min(1, inMapped));
    }

    // (F.2) FADE‐OUT based on “Hey there” tagline crossing mid‐screen
    const logoTextElem = document.querySelector(".logo-text");
    let outMapped = 0;
    if (logoTextElem) {
      const textRect   = logoTextElem.getBoundingClientRect();
      const textTop    = textRect.top;
      const textHeight = textRect.height;
      const vh         = window.innerHeight;

      // Fade span so it happens long after halfway
      const fadeSpanOut = ((vh / 2) + textHeight)/2;
      let outRaw = ((vh / 2) - textTop) / fadeSpanOut;
      outRaw = Math.max(0, Math.min(1, outRaw));

      const rampOut = 0.45;
      if (outRaw <= 0) {
        outMapped = 0;
      } else if (outRaw < rampOut) {
        outMapped = outRaw / rampOut;
      } else {
        outMapped = 1;
      }
      outMapped = Math.max(0, Math.min(1, outMapped));
    }

    // (F.3) Combine: v = easeIn(inMapped) * (1 – easeOut(outMapped))
    const inEased  = easeInOutQuad(inMapped);
    const outEased = easeInOutQuad(outMapped);
    const v = inEased * (1 - outEased);

    // (F.4) Apply v: body background goes from black → gray(255)
    const gray = Math.floor(255 * v);
    body.style.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`;
    invertAll(v);

    // (F.5) Ensure tagline “Hey there…” remains visible (invert to black)
    if (logoTextElem) {
      const invColor = 255 - gray;
      logoTextElem.style.color   = `rgb(${invColor}, ${invColor}, ${invColor})`;
      logoTextElem.style.opacity = "1";
    }
  }

  /* ===========================================================================
     7) INITIAL DRAW OF FRAME #0 (wait for first image to load)
     =========================================================================== */
  function initialDraw() {
    if (frameImages[0] && frameImages[0].complete) {
      drawFrame(0);
    } else {
      setTimeout(initialDraw, 100);
    }
  }
  initialDraw();

  /* ===========================================================================
     8) HELPER: extract X‐offset from element’s transform string
     =========================================================================== */
  function getXOffset(el) {
    const transformStr = el.style.transform || "";
    const match = transformStr.match(/translateX\((-?\d+)px\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /* ===========================================================================
     9) LOGO DEPTH: assign a random opacity to each logo for 3D‐depth effect
     =========================================================================== */
  const allLogos = document.querySelectorAll(".logo-item");
  allLogos.forEach((logo) => {
    const randOp = 0.4 + Math.random() * 0.6; // 0.4–1.0
    logo.style.opacity = randOp.toFixed(2);
  });

  /* ===========================================================================
     10) CASE‐BLOCK FADE+SLIDE ON SCROLL (IntersectionObserver)
     =========================================================================== */
  const caseBlocks = document.querySelectorAll(".case-block.fade-slide");
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -30% 0px", // fire when ~30% of block in view
    threshold: 0
  };
  const onIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(onIntersection, observerOptions);
  caseBlocks.forEach(block => observer.observe(block));
  const stats = document.getElementById('stats-block');
  if (!stats) return;

  // ① wrap every letter of each line in a <span>
  stats.querySelectorAll('.stats-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'glitch-char';
      span.textContent = ch;
      line.append(span);
    });
  });

  // ② typing + one-time observe
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      stats.classList.add('animate');
      obs.unobserve(stats);

      // ③ start random glitches once typing is done
      //    give enough time for the longest line to finish typing
      setTimeout(startGlitching, 1500);
    }
  }, { threshold: 0.5 }).observe(stats);

  function startGlitching() {
    const chars = stats.querySelectorAll('.glitch-char');
    setInterval(()=>{
      // pick a random letter and glitch it
      const i = Math.floor(Math.random()*chars.length);
      const c = chars[i];
      c.classList.add('glitch');
      // remove the glitch class after it’s played
      setTimeout(()=> c.classList.remove('glitch'), 200);
    }, 300);
  }

});