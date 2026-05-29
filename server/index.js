const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 8080);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD must be set before starting the server.');
    process.exit(1);
}

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    console.error('SESSION_SECRET must be set to a random value with at least 32 characters.');
    process.exit(1);
}
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const SITE_CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DEFAULTS_DIR = path.join(__dirname, 'defaults');
const DEFAULT_POSTS_FILE = path.join(DEFAULTS_DIR, 'posts.json');
const DEFAULT_PROJECTS_FILE = path.join(DEFAULTS_DIR, 'projects.json');
const DEFAULT_SITE_CONFIG_FILE = path.join(DEFAULTS_DIR, 'site-config.json');
const STATIC_DIR = path.join(__dirname, '..', 'build');
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
};

const readDefaultJsonFile = (filePath, fallback) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Failed to read default data ${filePath}:`, error);
        return fallback;
    }
};

const seedDataFile = (filePath, defaultFilePath, fallback) => {
    if (fs.existsSync(filePath)) return;
    const defaultData = readDefaultJsonFile(defaultFilePath, fallback);
    fs.writeFileSync(filePath, `${JSON.stringify(defaultData, null, 2)}\n`, 'utf8');
};

const isEmptyData = (data) => {
    if (Array.isArray(data)) return data.length === 0;
    if (data && typeof data === 'object') return Object.keys(data).length === 0;
    return data === null || data === undefined;
};

const ensureDataFile = () => {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    seedDataFile(POSTS_FILE, DEFAULT_POSTS_FILE, []);
    seedDataFile(PROJECTS_FILE, DEFAULT_PROJECTS_FILE, []);
    seedDataFile(SITE_CONFIG_FILE, DEFAULT_SITE_CONFIG_FILE, {});
};

const readJsonFile = (filePath, fallback = [], defaultFilePath = '') => {
    ensureDataFile();
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return defaultFilePath && isEmptyData(data) ? readDefaultJsonFile(defaultFilePath, fallback) : data;
    } catch (error) {
        console.error(`Failed to read ${filePath}:`, error);
        return defaultFilePath ? readDefaultJsonFile(defaultFilePath, fallback) : fallback;
    }
};

const writeJsonFile = (filePath, items) => {
    ensureDataFile();
    fs.writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
};

const readPosts = () => readJsonFile(POSTS_FILE, [], DEFAULT_POSTS_FILE);
const writePosts = (posts) => writeJsonFile(POSTS_FILE, posts);
const readProjects = () => readJsonFile(PROJECTS_FILE, [], DEFAULT_PROJECTS_FILE);
const writeProjects = (projects) => writeJsonFile(PROJECTS_FILE, projects);
const readSiteConfig = () => readJsonFile(SITE_CONFIG_FILE, {}, DEFAULT_SITE_CONFIG_FILE);
const writeSiteConfig = (config) => writeJsonFile(SITE_CONFIG_FILE, config);

const sendJson = (res, status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
};

const sendText = (res, status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
};

const parseBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 2_000_000) {
            reject(new Error('Request body too large'));
            req.destroy();
        }
    });
    req.on('end', () => {
        if (!body) {
            resolve({});
            return;
        }

        try {
            resolve(JSON.parse(body));
        } catch (error) {
            reject(new Error('Invalid JSON'));
        }
    });
});

const createToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(token).digest('hex');
    return `${token}.${signature}`;
};

const isValidTokenShape = (token) => {
    const [raw, signature] = token.split('.');
    if (!raw || !signature) return false;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(raw).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

const requireAuth = (req, res) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token || !isValidTokenShape(token)) {
        sendText(res, 401, 'Unauthorized');
        return false;
    }

    return true;
};

const toNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const toBoolean = (value, fallback = true) => {
    if (typeof value === 'boolean') return value;
    if (value === undefined || value === null || value === '') return fallback;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
};

const withProjectDefaults = (project = {}) => ({
    ...project,
    order: toNumber(project.order, 0),
    images: project.images || '/project1.webp',
    language: project.language || '',
    demoUrl: project.demoUrl || '',
    githubUrl: project.githubUrl || '',
    blogSlug: project.blogSlug || '',
    showOnHomepage: toBoolean(project.showOnHomepage, true),
    showInHeroMenu: toBoolean(project.showInHeroMenu, true),
    homepageOrder: toNumber(project.homepageOrder ?? project.order, 0),
    heroOrder: toNumber(project.heroOrder ?? project.order, 0),
    locales: project.locales || {}
});

const sortProjects = (projects) => projects
    .map(withProjectDefaults)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

const normalizeSiteConfig = (config = {}) => ({ ...config, updatedAt: new Date().toISOString() });
const normalizePost = (post) => {
    const now = new Date().toISOString();
    return {
        id: post.id || `post-${Date.now()}`,
        slug: post.slug,
        status: post.status || 'published',
        locales: post.locales || {},
        createdAt: post.createdAt || now,
        updatedAt: now
    };
};

const normalizeProject = (project) => {
    const now = new Date().toISOString();
    return {
        ...withProjectDefaults(project),
        id: project.id || `project-${Date.now()}`,
        createdAt: project.createdAt || now,
        updatedAt: now
    };
};
const parseMultipartUpload = (req) => new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

    if (!boundaryMatch) {
        reject(new Error('Missing multipart boundary'));
        return;
    }

    const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
    const chunks = [];
    let size = 0;

    req.on('data', (chunk) => {
        size += chunk.length;
        if (size > MAX_UPLOAD_BYTES) {
            reject(new Error('Upload exceeds 5MB limit'));
            req.destroy();
            return;
        }
        chunks.push(chunk);
    });

    req.on('end', () => {
        const body = Buffer.concat(chunks);
        let cursor = body.indexOf(boundary);

        while (cursor >= 0) {
            cursor += boundary.length;
            if (body[cursor] === 45 && body[cursor + 1] === 45) break;
            if (body[cursor] === 13 && body[cursor + 1] === 10) cursor += 2;

            const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), cursor);
            if (headerEnd < 0) break;

            const rawHeaders = body.slice(cursor, headerEnd).toString('utf8');
            let partEnd = body.indexOf(boundary, headerEnd + 4);
            if (partEnd < 0) partEnd = body.length;

            let fileContent = body.slice(headerEnd + 4, partEnd);
            if (fileContent.length >= 2 && fileContent[fileContent.length - 2] === 13 && fileContent[fileContent.length - 1] === 10) {
                fileContent = fileContent.slice(0, -2);
            }

            const disposition = rawHeaders.match(/content-disposition:[^\n]+/i)?.[0] || '';
            const filename = disposition.match(/filename="([^"]+)"/i)?.[1];
            if (filename && fileContent.length > 0) {
                const contentTypeMatch = rawHeaders.match(/content-type:\s*([^\r\n]+)/i);
                resolve({ filename, contentType: contentTypeMatch?.[1]?.trim() || '', buffer: fileContent });
                return;
            }

            cursor = body.indexOf(boundary, partEnd);
        }

        reject(new Error('No file field found'));
    });

    req.on('error', reject);
});

const saveUpload = async (req) => {
    const upload = await parseMultipartUpload(req);
    const originalName = path.basename(upload.filename).replace(/[^a-zA-Z0-9._-]/g, '-');
    const ext = path.extname(originalName).toLowerCase();
    const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);
    const allowedMime = upload.contentType.startsWith('image/');

    if (!allowedExtensions.has(ext) || !allowedMime) {
        throw new Error('Only image uploads are supported');
    }

    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${originalName || `upload${ext}`}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, upload.buffer);
    return { url: `/uploads/${filename}`, filename };
};

const handleApi = async (req, res, url) => {
    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
        const body = await parseBody(req);
        if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
            sendText(res, 401, 'Invalid credentials');
            return;
        }

        const token = createToken();
        sendJson(res, 200, { token });
        return;
    }
    if (req.method === 'GET' && url.pathname === '/api/site-config') {
        sendJson(res, 200, readSiteConfig());
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/site-config') {
        if (!requireAuth(req, res)) return;
        const body = normalizeSiteConfig(await parseBody(req));
        writeSiteConfig(body);
        sendJson(res, 200, body);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/uploads') {
        if (!requireAuth(req, res)) return;
        try {
            const upload = await saveUpload(req);
            sendJson(res, 200, upload);
        } catch (error) {
            sendText(res, 400, error.message || 'Upload failed');
        }
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/posts') {
        sendJson(res, 200, readPosts());
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/projects') {
        sendJson(res, 200, sortProjects(readProjects()));
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/projects') {
        if (!requireAuth(req, res)) return;
        const body = normalizeProject(await parseBody(req));

        if (!body.locales?.en?.name) {
            sendText(res, 400, 'Project English name is required');
            return;
        }

        const projects = readProjects();
        const existingIndex = projects.findIndex((item) => item.id === body.id);
        if (existingIndex >= 0) {
            projects[existingIndex] = { ...projects[existingIndex], ...body, createdAt: projects[existingIndex].createdAt };
        } else {
            projects.push(body);
        }

        writeProjects(projects);
        sendJson(res, 200, sortProjects(readProjects()));
        return;
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/projects/')) {
        if (!requireAuth(req, res)) return;
        const id = decodeURIComponent(url.pathname.replace('/api/projects/', ''));
        const projects = readProjects().filter((project) => project.id !== id);
        writeProjects(projects);
        sendJson(res, 200, sortProjects(readProjects()));
        return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/posts/')) {
        const slug = decodeURIComponent(url.pathname.replace('/api/posts/', ''));
        const post = readPosts().find((item) => item.slug === slug || item.id === slug);
        if (!post) {
            sendText(res, 404, 'Post not found');
            return;
        }
        sendJson(res, 200, post);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/posts') {
        if (!requireAuth(req, res)) return;
        const body = normalizePost(await parseBody(req));

        if (!body.slug || !body.locales?.en?.title) {
            sendText(res, 400, 'Post slug and English title are required');
            return;
        }

        const posts = readPosts();
        const existingIndex = posts.findIndex((item) => item.id === body.id);
        if (existingIndex >= 0) {
            posts[existingIndex] = { ...posts[existingIndex], ...body, createdAt: posts[existingIndex].createdAt };
        } else {
            posts.unshift(body);
        }

        writePosts(posts);
        sendJson(res, 200, posts);
        return;
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/posts/')) {
        if (!requireAuth(req, res)) return;
        const id = decodeURIComponent(url.pathname.replace('/api/posts/', ''));
        const posts = readPosts().filter((post) => post.id !== id);
        writePosts(posts);
        sendJson(res, 200, posts);
        return;
    }

    sendText(res, 404, 'API route not found');
};

const serveUpload = (res, url) => {
    const filename = path.basename(decodeURIComponent(url.pathname.replace('/uploads/', '')));
    const filePath = path.resolve(UPLOADS_DIR, filename);
    const uploadsRoot = path.resolve(UPLOADS_DIR);

    if (!filePath.startsWith(uploadsRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        sendText(res, 404, 'Upload not found');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable'
    });
    fs.createReadStream(filePath).pipe(res);
};

const serveStatic = (req, res, url) => {
    const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(STATIC_DIR, safePath === '/' ? 'index.html' : safePath);

    if (!filePath.startsWith(STATIC_DIR)) {
        sendText(res, 403, 'Forbidden');
        return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(STATIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
};

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    try {
        if (url.pathname.startsWith('/api/')) {
            await handleApi(req, res, url);
            return;
        }
        if (url.pathname.startsWith('/uploads/')) {
            serveUpload(res, url);
            return;
        }

        serveStatic(req, res, url);
    } catch (error) {
        console.error(error);
        sendText(res, 500, error.message || 'Internal server error');
    }
});

ensureDataFile();
server.listen(PORT, () => {
    console.log(`Portfolio blog server listening on :${PORT}`);
});
