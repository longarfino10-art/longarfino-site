// Filtro do portfólio. Sem framework: esconde e mostra os cards pelo
// atributo data-tipo, que o ObraCard já monta com tipos + status.

const grade = document.getElementById('obras-grade');
const vazio = document.getElementById('obras-vazio');
const botoes = document.querySelectorAll('.filtro');

if (grade && botoes.length) {
  const cards = Array.from(grade.querySelectorAll('.obra-card'));

  function filtrar(alvo) {
    let visiveis = 0;

    cards.forEach((card) => {
      const marcadores = (card.dataset.tipo || '').split(' ');
      const mostra = alvo === 'todas' || marcadores.includes(alvo);
      card.hidden = !mostra;
      if (mostra) visiveis++;
    });

    if (vazio) vazio.hidden = visiveis > 0;

    botoes.forEach((b) => {
      const ativo = b.dataset.filtro === alvo;
      b.classList.toggle('is-on', ativo);
      b.setAttribute('aria-pressed', String(ativo));
    });
  }

  botoes.forEach((b) => {
    b.addEventListener('click', () => filtrar(b.dataset.filtro));
  });
}