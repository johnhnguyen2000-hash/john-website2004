const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Type out the name on the home page, once per visit
const typed = document.querySelector('.typed-text');
if (typed) {
  const caret = document.querySelector('.caret');
  const name = typed.textContent;
  let seen = false;
  try { seen = sessionStorage.getItem('typed') === '1'; } catch {}

  if (reduceMotion || seen) {
    caret.classList.add('done');
  } else {
    typed.textContent = '';
    let i = 0;
    setTimeout(function step() {
      typed.textContent = name.slice(0, ++i);
      if (i < name.length) setTimeout(step, 70 + Math.random() * 60);
      else {
        caret.classList.add('done');
        try { sessionStorage.setItem('typed', '1'); } catch {}
      }
    }, 350);
  }
}

// Fade content in as it scrolls into view
const reveals = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  // Stagger siblings that enter together
  reveals.forEach((el, i) => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 70}ms`;
    io.observe(el);
  });
}

// Live date and time in the home page dateline
const clock = document.querySelector('.dateline');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
  const tick = () => { clock.textContent = `${fmt.format(new Date()).replace(' at ', ' · ')} in Boston`; };
  tick();
  setInterval(tick, 15000);
}
