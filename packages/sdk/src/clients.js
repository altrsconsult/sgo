/**
 * Clientes de API do Chassi para uso nos módulos.
 * Compatível com módulos que importam createModuleDataClient, createModuleConfigClient, createStorageClient.
 */
function getBaseUrl(options) {
    return options?.apiBaseUrl?.replace(/\/$/, '') ?? '';
}
async function fetchApi(path, init = {}, options) {
    const base = getBaseUrl(options);
    const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(init.headers);
    if (!headers.has('Authorization')) {
        const token = options?.getAuthHeader?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('sgo-token') : null);
        if (token)
            headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(url, { ...init, headers });
}
async function json(path, init, options) {
    const res = await fetchApi(path, { ...init, headers: { ...init?.headers, 'Content-Type': 'application/json' } }, options);
    if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
    return res.json();
}
/**
 * Cria cliente para /api/module-data/:slug/:entityType (CRUD + search).
 */
export function createModuleDataClient(slug, entityType, options) {
    const base = `/api/module-data/${slug}/${entityType}`;
    return {
        async list() {
            return json(base, {}, options);
        },
        async get(entityId) {
            return json(`${base}/${entityId}`, {}, options);
        },
        async create(data) {
            return json(base, { method: 'POST', body: JSON.stringify(data) }, options);
        },
        async update(entityId, data) {
            return json(`${base}/${entityId}`, { method: 'PUT', body: JSON.stringify(data) }, options);
        },
        async patch(entityId, data) {
            return json(`${base}/${entityId}`, { method: 'PATCH', body: JSON.stringify(data) }, options);
        },
        async delete(entityId) {
            return json(`${base}/${entityId}`, { method: 'DELETE' }, options);
        },
        async search(query) {
            return json(`${base}/search`, { method: 'POST', body: JSON.stringify({ query }) }, options);
        },
    };
}
/**
 * Cria cliente para /api/module-config/:slug.
 */
export function createModuleConfigClient(slug, options) {
    const base = `/api/module-config/${slug}`;
    return {
        async getAll() {
            return json(base, {}, options);
        },
        async get(key) {
            return json(`${base}/${key}`, {}, options);
        },
        async set(key, value) {
            return json(base, {
                method: 'POST',
                body: JSON.stringify({ key, value: String(value) }),
            }, options);
        },
    };
}
/**
 * Cria cliente para /api/storage (upload e download de arquivos).
 */
export function createStorageClient(options) {
    const base = '/api/storage';
    return {
        async upload(file, opts) {
            const form = new FormData();
            form.set('file', file);
            if (opts?.ownerType)
                form.set('ownerType', opts.ownerType);
            if (opts?.ownerId)
                form.set('ownerId', opts.ownerId);
            if (opts?.expiresAt)
                form.set('expiresAt', opts.expiresAt);
            const url = getBaseUrl(options) + `${base}/files`;
            const headers = {};
            const token = options?.getAuthHeader?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('sgo-token') : null);
            if (token)
                headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, { method: 'POST', body: form, headers });
            if (!res.ok)
                throw new Error(await res.text().catch(() => res.statusText));
            return res.json();
        },
        async get(id) {
            return json(`${base}/files/${id}`, {}, options);
        },
        getDownloadUrl(id) {
            const b = getBaseUrl(options);
            return `${b}${base}/files/${id}/download`;
        },
    };
}
