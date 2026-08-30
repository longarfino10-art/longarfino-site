// Comportamento do cabeçalho: fundo ao rolar e abertura do menu mobile.
// Carregado pelo Base.astro, roda em todas as páginas.

const hd = document.getElementById('hd');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

// ─── Fundo do header ao rolar ───────────────────────────────────────
if (hd) {
  const aoRolar = () => hd.classList.toggle('is-stuck', window.scrollY > 40);
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });
}

// ─── Menu mobile ────────────────────────────────────────────────────
if (burger && menu) {
  const barras = burger.querySelectorAll('i');

  function definirMenu(aberto) {
    menu.classList.toggle('is-open', aberto);
    menu.setAttribute('aria-hidden', String(!aberto));
    burger.setAttribute('aria-expanded', String(aberto));
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');

    // Trava o scroll do fundo enquanto o menu está aberto
    document.body.style.overflow = aberto ? 'hidden' : '';

    // As duas barras viram um X
    barras[0].style.transform = aberto ? 'translateY(3.5px) rotate(45deg)' : '';
    barras[1].style.transform = aberto ? 'translateY(-3.5px) rotate(-45deg)' : '';
    barras[1].style.width = aberto ? '24px' : '';
  }

  burger.addEventListener('click', () => {
    definirMenu(!menu.classList.contains('is-open'));
  });

  // Clicar num link fecha o menu
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) definirMenu(false);
  });

  // Esc fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') definirMenu(false);
  });
}