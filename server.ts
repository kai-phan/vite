import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares. The following is valid even after restarts.
  app.use(vite.middlewares);

  // For serving static index.html file
  app.get('/', async (req, res) => {
    const url = req.originalUrl;

    const template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    );

    const html = await vite.transformIndexHtml(url, template);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  });

  // For serving static csr.html file
  app.get('/csr*', async (req, res) => {
    const url = req.originalUrl;

    const template = fs.readFileSync(
      path.resolve(__dirname, 'csr.html'),
      'utf-8',
    );

    const html = await vite.transformIndexHtml(url, template);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  });

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read html file
      const template = fs.readFileSync(
        path.resolve(__dirname, 'ssr.html'),
        'utf-8',
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      const html = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule('/src/entry.server.tsx');

      // 4. render the app HTML. This assumes entry-server.tsx exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const htmlWithApp = html.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlWithApp);
    } catch (e) {
      // If an error is caught, let vite fix the stack and then log it
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return app;
}

createServer()
  .then((app) => {
    app.listen(5173, () => {
      console.log('http://localhost:5173');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
