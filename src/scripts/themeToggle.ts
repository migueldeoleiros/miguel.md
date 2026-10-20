// Circular reveal from migueldeoleiros.github.io, using native View Transitions.
const root = document.documentElement;
const button = document.querySelector<HTMLButtonElement>('.theme-toggle');

if (button) {
  let transitioning = false;
  const updateButton = () => {
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? 'Use light mode' : 'Use dark mode';
    button.setAttribute('aria-label', button.title);
  };
  updateButton();
  button.hidden = false;

  button.addEventListener('click', async () => {
    if (transitioning) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('theme-preference', next); } catch {}
      updateButton();
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        'content', next === 'dark' ? '#151515' : '#efeee8',
      );
    };

    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme();
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-radius', `${radius}px`);
    root.classList.add(next === 'dark' ? 'theme-transition-expand' : 'theme-transition-retract');
    transitioning = true;
    try {
      const transition = document.startViewTransition(applyTheme);
      // Observe both promises even when the browser skips the animation.
      await Promise.all([transition.ready, transition.finished]);
    } catch {
      applyTheme();
    } finally {
      root.classList.remove('theme-transition-expand', 'theme-transition-retract');
      transitioning = false;
    }
  });
}
