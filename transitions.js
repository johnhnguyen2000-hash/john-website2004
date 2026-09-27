// Picks the slide direction for page-to-page transitions.
// Each page has a spot on a grid; moving sideways slides horizontally, up/down slides vertically.
//
//                     ┌─ Recent News
//   Home ── About ────┼─ Experiences
//                     └─ Life in My Eyes
(() => {
  const POSITIONS = {
    index: [0, 0],
    about: [1, 0],
    experiences: [2, 0],
    skills: [2, 0],
    news: [2, 0],
  };

  function pageOf(url) {
    const name = new URL(url).pathname.split('/').pop().replace(/\.html$/, '');
    return POSITIONS[name || 'index'];
  }

  window.addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    const from = navigation.activation?.from?.url;
    const to = navigation.activation?.entry?.url;
    const a = from && pageOf(from);
    const b = to && pageOf(to);
    if (!a || !b) return;

    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    if (dy > 0) e.viewTransition.types.add('down');
    else if (dy < 0) e.viewTransition.types.add('up');
    else if (dx < 0) e.viewTransition.types.add('back');
    // dx > 0 uses the default slide-left
  });

  // Nav buttons and links turn blue when clicked and stay blue while the page slides away
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.button-nav, .nav-link');
    if (button) button.classList.add('is-pressed');
  });
  // The back button restores pages as they were, so clear the pressed state
  window.addEventListener('pageshow', () => {
    for (const b of document.querySelectorAll('.is-pressed')) b.classList.remove('is-pressed');
  });
})();
