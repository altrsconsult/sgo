import { db, dialect } from './index.js';

// Helpers multi-dialeto para operações de insert com conflito
// Abstraem as diferenças entre Postgres (onConflictDoNothing/onConflictDoUpdate)
// e MySQL (ignore/onDuplicateKeyUpdate)

type AnyTable = Parameters<typeof db.insert>[0];
// Objeto único para insert (evita inferência como array {}[])
type AnyValues = Record<string, unknown>;

/**
 * Insere ignorando conflito de chave única.
 * Postgres: .onConflictDoNothing()
 * MySQL: .ignore()
 */
export async function insertIgnore(table: AnyTable, values: AnyValues) {
  const query = db.insert(table).values(values as never);
  if (dialect === 'mysql') {
    return (query as never as { ignore: () => Promise<unknown> }).ignore();
  }
  return (query as never as { onConflictDoNothing: () => Promise<unknown> }).onConflictDoNothing();
}

/**
 * Upsert (insert ou atualiza em conflito).
 * Postgres: .onConflictDoUpdate({ target, set })
 * MySQL: .onDuplicateKeyUpdate({ set })
 */
export async function upsert(
  table: AnyTable,
  values: AnyValues,
  target: unknown,
  set: Record<string, unknown>
) {
  const query = db.insert(table).values(values as never);
  if (dialect === 'mysql') {
    return (query as never as { onDuplicateKeyUpdate: (opts: { set: unknown }) => Promise<unknown> })
      .onDuplicateKeyUpdate({ set });
  }
  return (query as never as { onConflictDoUpdate: (opts: { target: unknown; set: unknown }) => Promise<unknown> })
    .onConflictDoUpdate({ target, set });
}
