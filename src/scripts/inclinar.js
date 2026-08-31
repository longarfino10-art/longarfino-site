// Inclina a foto do hero conforme o mouse se move, como uma maquete
// sendo girada na mão. Some no mobile — não existe cursor lá.
//
// Trabalha junto com o parallax: este script escreve a rotação numa
// variável CSS, e o parallax escreve o deslocamento noutra. Assim os
// dois não brigam pelo mesmo `transform`.

const palco = document.querySelector('[data-inclinar]');

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const temCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (palco && temCursor && !semMovimento) {
  const GRAUS = 2.2; // inclinação máxima em cada eixo
  let agendado = false;
  let x = 0;
  let y = 0;

  function aplicar() {
    palco.style.setProperty('--giro-x', `${y * -GRAUS}deg`);
    palco.style.setProperty('--giro-y', `${x * GRAUS}deg`);
    agendado = false;
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      // Converte a posição do mouse para uma faixa de -1 a 1
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;

      if (agendado) return;
      agendado = true;
      requestAnimationFrame(aplicar);
    },
    { passive: true }
  );

  // Volta ao lugar quando o cursor sai da janela
  document.addEventListener('mouseleave', () => {
    palco.style.setProperty('--giro-x', '0deg');
    palco.style.setProperty('--giro-y', '0deg');
  });
}