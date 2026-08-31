// Parallax discreto na foto do hero: ela sobe mais devagar que a página.
// Usa requestAnimationFrame para não travar a rolagem.

const foto = document.querySelectorAll('[data-parallax]');

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (foto.length && !semMovimento) {
  let agendado = false;

  function atualizar() {
    // Para de calcular depois que o hero saiu da tela
    const deslocamento = Math.min(window.scrollY, 900);

    foto.forEach((el) => {
      el.style.setProperty('--desloca-y', `${deslocamento * 0.3}px`);
    });

    agendado = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    },
    { passive: true }
  );

  atualizar();
}