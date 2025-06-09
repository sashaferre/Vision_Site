// ======================================
// bgParticles.js
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // 1) Get the canvas element by ID
  const canvas = document.getElementById("bgParticles");
  if (!canvas) {
    console.warn("bgParticles.js: No <canvas id='bgParticles'> found.");
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("bgParticles.js: Your browser does not support 2D context.");
    return;
  }

  // 2) Declare particle‐array variable(s) UP FRONT so 'initParticles' can read/write it immediately
  let particles = [];
  const maxParticles = 80;     // how many dots
  const maxSpeed     = 0.5;    // how fast they drift
  const minRadius    = 0.8;    // smallest dot size
  const maxRadius    = 2.5;    // largest dot size

  // 3) A function to size the canvas to the viewport and re‐initialize particles
  function resizeCanvas() {
    // Make sure CSS size (100vw×100vh) matches the drawn size
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // 4) Build (or rebuild) all of the particles in a fresh array
  function initParticles() {
    particles = []; 
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * maxSpeed,
        vy: (Math.random() - 0.5) * maxSpeed,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        alpha: 0.2 + Math.random() * 0.3,
      });
    }
  }

  // 5) The animation loop: clear → move each dot → draw each dot → loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap around left ↔ right
      if (p.x < 0)               p.x = canvas.width;
      else if (p.x > canvas.width)  p.x = 0;

      // wrap around top ↔ bottom
      if (p.y < 0)               p.y = canvas.height;
      else if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(animateParticles);
  }

  // 6) Wire up the resize handler and immediately call it once
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();  // this also calls initParticles()

  // 7) Finally start animating
  requestAnimationFrame(animateParticles);
});