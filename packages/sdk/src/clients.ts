/**
 * Clientes de API do Chassi para uso nos módulos.
 * Compatível com módulos que importam createModuleDataClient, createModuleConfigClient, createStorageClient.
 */

export interface SdkClientOptions {
  /** Base URL do Chassi (ex.: http://localhost:3000) quando o módulo roda em outra origem (standalone). */
  apiBaseUrl?: string;
  /** Retorna o token JWT para Authorization (ex.: localStorage.getItem('sgo-token')). */
  getAuthHeader?: () => string | null;
}

function getBaseUrl(options?: SdkClientOptions): string {
  return options?.apiBaseUrl?.replace(/\/$/, '') ?? '';
}

async function fetchApi(
  path: string,
  init: RequestInit = {},
  options?: SdkClientOptions
): Promise<Response> {
  const base = getBaseUrl(options);
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (!headers.has('Authorization')) {
    const token = options?.getAuthHeader?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('sgo-token') : null);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
}

async function json<T>(path: string, init?: RequestInit, options?: SdkClientOptions): Promise<T> {
  const res = await fetchApi(path, { ...init, headers: { ...init?.headers, 'Content-Type': 'application/json' } }, options);
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

/** Registro de module-data retornado pela API */
export interface ModuleDataRecord<T = unknown> {
  id: number;
  moduleId: number;
  entityType: string;
  entityId: string | null;
  data: T;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cria cliente para /api/module-data/:slug/:entityType (CRUD + search).
 */
export function createModuleDataClient<T = unknown>(
  slug: string,
  entityType: string,
  options?: SdkClientOptions
) {
  const base = `/api/module-data/${slug}/${entityType}`;
  return {
    async list(): Promise<ModuleDataRecord<T>[]> {
      return json<ModuleDataRecord<T>[]>(base, {}, options);
    },
    async get(entityId: string): Promise<ModuleDataRecord<T>> {
      return json<ModuleDataRecord<T>>(`${base}/${entityId}`, {}, options);
    },
    async create(data: Partial<T> & { entityId?: string }): Promise<ModuleDataRecord<T>> {
      return json<ModuleDataRecord<T>>(base, { method: 'POST', body: JSON.stringify(data) }, options);
    },
    async update(entityId: string, data: T): Promise<ModuleDataRecord<T>> {
      return json<ModuleDataRecord<T>>(`${base}/${entityId}`, { method: 'PUT', body: JSON.stringify(data) }, options);
    },
    async patch(entityId: string, data: Partial<T>): Promise<ModuleDataRecord<T>> {
      return json<ModuleDataRecord<T>>(`${base}/${entityId}`, { method: 'PATCH', body: JSON.stringify(data) }, options);
    },
    async delete(entityId: string): Promise<{ message: string }> {
      return json(`${base}/${entityId}`, { method: 'DELETE' }, options);
    },
    async search(query: string): Promise<ModuleDataRecord<T>[]> {
      return json<ModuleDataRecord<T>[]>(`${base}/search`, { method: 'POST', body: JSON.stringify({ query }) }, options);
    },
  };
}

/** Item de config retornado pela API */
export interface ModuleConfigRecord {
  id: number;
  moduleId: number;
  key: string;
  value: string | null;
  type: string;
  updatedAt: string;
}

/**
 * Cria cliente para /api/module-config/:slug.
 */
export function createModuleConfigClient(slug: string, options?: SdkClientOptions) {
  const base = `/api/module-config/${slug}`;
  return {
    async getAll(): Promise<ModuleConfigRecord[]> {
      return json<ModuleConfigRecord[]>(base, {}, options);
    },
    async get(key: string): Promise<ModuleConfigRecord | null> {
      return json<ModuleConfigRecord | null>(`${base}/${key}`, {}, options);
    },
    async set(key: string, value: string | number | boolean): Promise<ModuleConfigRecord> {
      return json<ModuleConfigRecord>(base, {
        method: 'POST',
        body: JSON.stringify({ key, value: String(value) }),
      }, options);
    },
  };
}

/** Metadados de arquivo no storage */
export interface StorageFileRecord {
  id: string;
  ownerType: string | null;
  ownerId: string | null;
  originalName: string;
  storedName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  storagePath: string;
  createdAt: string;
  expiresAt: string | null;
}

/**
 * Cria cliente para /api/storage (upload e download de arquivos).
 */
export function createStorageClient(options?: SdkClientOptions) {
  const base = '/api/storage';
  return {
    async upload(
      file: File,
      opts?: { ownerType?: string; ownerId?: string; expiresAt?: string }
    ): Promise<StorageFileRecord> {
      const form = new FormData();
      form.set('file', file);
      if (opts?.ownerType) form.set('ownerType', opts.ownerType);
      if (opts?.ownerId) form.set('ownerId', opts.ownerId);
      if (opts?.expiresAt) form.set('expiresAt', opts.expiresAt);
      const url = getBaseUrl(options) + `${base}/files`;
      const headers: HeadersInit = {};
      const token = options?.getAuthHeader?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('sgo-token') : null);
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(url, { method: 'POST', body: form, headers });
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
      return res.json();
    },
    async get(id: string): Promise<StorageFileRecord> {
      return json<StorageFileRecord>(`${base}/files/${id}`, {}, options);
    },
    getDownloadUrl(id: string): string {
      const b = getBaseUrl(options);
      return `${b}${base}/files/${id}/download`;
    },
  };
}
