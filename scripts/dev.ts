import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// import userConfig from '../vite.config.ts';
// __dirname and __filename are not available in ES modules.
// If we import config file as ES modules, we need to use fileURLToPath to convert the import.meta.url to a file path.
// This is because ES modules use file URLs instead of file paths.
// We can then use path.dirname to get the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname, process.cwd());

function createDevServer() {
  return createServer({
    root: process.cwd(),
    // configFile: we can specify the path to the config file here or leave it blank to use vite.config.js or vite.config.ts in the root directory. or set to false to disable config file.
    // ...userConfig: can be imported from vite.config.ts,
  });
}

createDevServer()
  .then(async (server) => {
    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
    server.openBrowser();
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
