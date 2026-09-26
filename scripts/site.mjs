import { createReadStream } from 'node:fs';
import { access, copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const routes = new Set(['/catalogue', '/about', '/privacy']);
const runtimeAssets = ['supervoid-logo-bw-2-transparent.png'];
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

async function build() {
  await rm(distRoot, { recursive: true, force: true });
  await mkdir(join(distRoot, 'src'), { recursive: true });
  await Promise.all([
    copyFile(join(projectRoot, 'index.html'), join(distRoot, 'index.html')),
    copyFile(join(projectRoot, 'src', 'main.js'), join(distRoot, 'src', 'main.js')),
    copyFile(join(projectRoot, 'src', 'style.css'), join(distRoot, 'src', 'style.css')),
  ]);

  for (const route of routes) {
    const routeDirectory = join(distRoot, route.slice(1));
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(join(projectRoot, 'index.html'), join(routeDirectory, 'index.html'));
  }

  await mkdir(join(distRoot, 'assets'));
  await Promise.all(runtimeAssets.map((name) =>
    copyFile(join(projectRoot, 'assets', name), join(distRoot, 'assets', name))
  ));

  console.log('Built static site in dist/');
}

function sourceForPath(pathname, root, preview) {
  const route = pathname.replace(/\/+$/, '') || '/';
  if (route === '/') return join(root, 'index.html');
  if (routes.has(route)) {
    return preview ? join(root, route.slice(1), 'index.html') : join(root, 'index.html');
  }

  if (pathname === '/src/main.js' || pathname === '/src/style.css') {
    return join(root, pathname.slice(1));
  }
  if (!pathname.startsWith('/assets/')) return null;
  const assetName = pathname.slice('/assets/'.length);
  return runtimeAssets.includes(assetName) ? join(root, 'assets', assetName) : null;
}

async function serve(preview) {
  const root = preview ? distRoot : projectRoot;
  if (preview) {
    try {
      await access(join(root, 'index.html'));
    } catch {
      throw new Error('dist/ is missing. Run npm run build before npm run preview.');
    }
  }

  const port = Number(process.env.PORT ?? 4173);
  const host = process.env.HOST ?? 'localhost';
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be a number between 0 and 65535.');
  }

  const server = createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    const filePath = sourceForPath(pathname, root, preview);
    if (!filePath) {
      response.writeHead(404).end('Not found');
      return;
    }

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': fileStat.size,
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(filePath).pipe(response);
    } catch (error) {
      const status = error.code === 'ENOENT' ? 404 : 500;
      response.writeHead(status).end(status === 404 ? 'Not found' : 'Server error');
    }
  });

  server.listen(port, host, () => {
    const address = server.address();
    console.log(`${preview ? 'Preview' : 'Development'} server: http://${host}:${address.port}`);
  });
}

const command = process.argv[2];
try {
  if (command === 'build') await build();
  else if (command === 'dev' || command === 'preview') await serve(command === 'preview');
  else throw new Error('Usage: node scripts/site.mjs <build|dev|preview>');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
