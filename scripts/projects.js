document.querySelectorAll('.glitch-line').forEach(line => {
  if (line.querySelector('span')) return; // skip already processed
  const txt = line.textContent.trim();
  line.textContent = '';
  txt.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'glitch-char';
    span.style.setProperty('--char-index', i);
    span.textContent = ch;
    line.append(span);
  });
});

  // observer that watches each card
  const cards = document.querySelectorAll('.project-item');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card = e.target;
      card.classList.add('animate');
      o.unobserve(card);

      // glitch timing block removed — handled by CSS
      setTimeout(() => {
      }, 1000);
    });
  }, { threshold: 0.3 });

  cards.forEach(c => obs.observe(c));