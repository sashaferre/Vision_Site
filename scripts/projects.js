window.addEventListener('DOMContentLoaded', () => {
    
  const lines = document.querySelectorAll('.glitch-line');
  console.log('Found glitch-line elements:', lines.length);

  const cards = document.querySelectorAll('.project-item');
  console.log('Found project-item cards:', cards.length);
  document.querySelectorAll('.glitch-line').forEach(line => {
    const txt = line.textContent.trim();
    line.textContent = '';
    txt.split('').forEach((ch, i) => {
      const outer = document.createElement('span');
      outer.className = 'glitch-char';

      const inner = document.createElement('span');
      inner.style.setProperty('--char-index', i);
      inner.textContent = ch;

      outer.append(inner);
      line.append(outer);
    });

    function startLineGlitch(line) {
      const chars = line.querySelectorAll('.glitch-char');
      console.log('Starting typewriter-style glitch on line with', chars.length, 'characters');
      if (chars.length > 0) {
        setInterval(() => {
          const i = Math.floor(Math.random() * chars.length);
          const outer = chars[i];
          const inner = outer.querySelector('span');
          if (!inner) return;

          inner.style.opacity = '0';

          const restoreDelay = 800 + Math.floor(Math.random() * 900); // random delay between 800–1700ms
          setTimeout(() => {
            inner.style.animation = 'none';
            inner.offsetHeight; // force reflow
            inner.style.animation = null;
            inner.style.opacity = '1';
          }, restoreDelay);
        }, 3000 + Math.floor(Math.random() * 4000)); // random glitch interval between 3000–7000ms
      }
    }

    const cards = document.querySelectorAll('.project-item');
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const card = e.target;
        card.classList.add('animate');
        const line = card.querySelector('.glitch-line');
        if (!line) return;
        line.classList.add('animate');
        setTimeout(() => startLineGlitch(line), 400);
        o.unobserve(card);
      });
    }, { threshold: 0.3 });
    cards.forEach(c => obs.observe(c));
  });
});
console.log('🔥 projects.js loaded');