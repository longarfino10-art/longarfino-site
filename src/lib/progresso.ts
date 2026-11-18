// Progresso de obra em execução.
//
// A porcentagem NÃO é digitada à mão. Ela sai do peso das etapas marcadas,
// para o número ser defensável se alguém perguntar de onde veio — é a mesma
// regra do resto do projeto: nenhum dado entra sem conferência.
//
// Etapa em andamento conta metade do peso.

export type Situacao = 'a_fazer' | 'fazendo' | 'feita';

export interface Etapa {
  nome: string;
  peso: number;
  situacao: Situacao;
  data?: Date;
  fotos: any[];
}

/** Devolve 0–100, ou null quando a obra não tem etapas cadastradas. */
export function calcularProgresso(etapas?: Etapa[]): number | null {
  if (!etapas || etapas.length === 0) return null;

  const total = etapas.reduce((s, e) => s + e.peso, 0);
  if (total <= 0) return null;

  const feito = etapas.reduce((s, e) => {
    if (e.situacao === 'feita') return s + e.peso;
    if (e.situacao === 'fazendo') return s + e.peso / 2;
    return s;
  }, 0);

  return Math.round((feito / total) * 100);
}

/** Nome da etapa em andamento, para mostrar em que pé está a obra. */
export function etapaAtual(etapas?: Etapa[]): string | null {
  if (!etapas || etapas.length === 0) return null;
  const fazendo = etapas.find((e) => e.situacao === 'fazendo');
  if (fazendo) return fazendo.nome;
  const proxima = etapas.find((e) => e.situacao === 'a_fazer');
  return proxima ? proxima.nome : null;
}

/** 14/10/2026 */
export function dataCurta(d?: Date): string | null {
  if (!d) return null;
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

/** out/2026 — usado na linha do tempo, onde o dia não importa */
export function mesAno(d?: Date): string | null {
  if (!d) return null;
  return d
    .toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .replace('.', '');
}
