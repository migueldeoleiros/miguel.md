const names = ['Miguel López López', 'migueldeoleiros', 'miguel.md'];
const title = document.querySelector<HTMLButtonElement>('.title-toggle');
const text = title?.querySelector<HTMLElement>('.title-text');

if (title && text) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  let index = 0;
  let automatic = true;
  let queue = Promise.resolve();

  const advance = () => {
    queue = queue.then(async () => {
      index = (index + 1) % names.length;
      const next = names[index];
      title.classList.add('is-typing');
      if (!motion.matches) {
        while (text.textContent && !motion.matches) {
          text.textContent = text.textContent.slice(0, -1);
          await wait(35);
        }
        text.textContent = '';
        await wait(160);
        for (const character of next) {
          if (motion.matches) break;
          text.textContent += character;
          await wait(75);
        }
      }
      text.textContent = next;
      title.setAttribute('aria-label', `${next} — change title`);
      title.classList.remove('is-typing');
    });
    return queue;
  };

  title.disabled = false;
  title.addEventListener('click', () => {
    // A click takes over from the intro; each activation advances exactly once.
    automatic = false;
    void advance();
  });

  const intro = async () => {
    if (motion.matches) return;
    await wait(1200);
    if (!automatic) return;
    await advance();
    await wait(1000);
    if (automatic) await advance();
  };
  void intro();
}
