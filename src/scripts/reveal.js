// Revela os elementos com a classe .rv quando entram na tela.
// Sem a classe .in, o .rv fica invisível — por isso este script precisa
// existir em toda página que usar animação de entrada.

const alvos = document.querySelectorAll('.rv:not(.in)');

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (semMovimento || !('IntersectionObserver' in window)) {
  // Mostra tudo de uma vez, sem animar
  alvos.forEach((el) => el.classList.add('in'));
} else {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('in');
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  alvos.forEach((el) => observador.observe(el));
}