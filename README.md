# vite
Learning vite

## 1. vite module resolve 
- Vite serve node_modules package with esm module, so we can import package directly in browser. But it only support esm module, so we need to add `type: module` in package.json.
- Each import will create a request to dev server.
- For example, we can import lodash in browser with `import _ from 'lodash'` directly.
- Vite will create a virtual file for each package in node_modules, and it will be cached in `node_modules/.vite/deps` folder. So it will be faster when we import package next time.

## 2. vite css
- When import the css file, we are requesting the js file which contains the js code to inject the css file into html by creating a `style` tag.
- For inline style, we can use `import style from 'xxx.css?inline'` to import the css file and inject this style string into html by creating a `style` tag.

## 3. vite css module
- We can use `import style from 'xxx.module.css'` to import css module.
- We can use `style.xxx` to access the class name in css module.
- Vite will transform the css module to js module, and the js module will export a object which contains the class name as key and the class name as value. This key will be hashed by vite. So css module can avoid the conflict of class name and scope the class name in the component.
- Can config the css module in `vite.config.js` ref: https://vitejs.dev/config/shared-options.html#css-modules
```js
export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: 'local',
      localsConvention: 'camelCaseOnly'
    }
  }
});
```

## 4. vite with tailwindcss
- Install tailwindcss and postcss
```bash
npm install -D tailwindcss postcss autoprefixer
```
- Create `postcss.config.js` and `tailwind.config.js` in root folder.
- We can config postcss in `vite.config.js` ref: https://vitejs.dev/config/shared-options.html#css-postcss

```js
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});
```

-Note if an inline config is provided, Vite will not search for other PostCSS config sources.

## 5. vite with preprocessors
- Vite support preprocessors like sass, less, stylus.
- There is no need to install Vite-specific plugins for them, but the corresponding pre-processor itself must be installed.
- Can add additional data to the preprocessor by using `additionalData` option.

```js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`,
      },
    },
  },
});
```

## 6. vite static assets
Built-in support for importing common static asset types, including images, fonts, and media files. Ref: https://vitejs.dev/guide/assets.html#static-asset-handling
### 6.1. json files
Vite will transform json files to js module, and the js module will export a object which contains the json data. Add `?url` to the end of the import path to get the url of the json file.

```js
import data from './data.json';
// data is the json object
import data from './data.json?url';
// data is path of the json file
```
### 6.2. images
Importing a static asset will return the resolved public URL when it is served:

```js
import imgUrl from 'src/assets/logo.png';
```

For example, `imgUrl` will be `/src/assets/logo.png` during development, and become `/assets/logo.2d8efhg.png` in the production build.
Browser will request `http://localhost:5173/src/assets/logo.png?import` to get the script
and `http://localhost:5173/src/assets/logo.png` to get the image in development mode
and `${base}/assets/logo.2d8efhg.png` to get the image in production mode.

Raw assets can be imported as strings using the `?raw` suffix:

```js
import img from './img.png?raw';
```

## 7. vite public folder
- Vite will serve the files in public folder as static assets.
- The public folder is not part of the build output, and will be directly copied to the root of your build directory.
- The public folder is also useful for assets that need to maintain the same URL across builds, such as `robots.txt` or `favicon.ico`.
- Vite will serve the files at `/` path, so we can access the files in public folder directly.

## 8. multiple pages
- Vite support multiple pages by creating multiple entry .html files in root folder. Also can nested the .html files in sub folder. But when navigate to the sub page, the url will be `http://localhost:5173/nested/`.
- Config the build need to do is to specify multiple .html files as entry points

```js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
});
```

## 9. vite react and jsx
- Vite support react and jsx out of the box.JSX transpilation is also handled via esbuild.
- If not use react, config `jsxFactory` and `jsxFragment` in `vite.config.js` to avoid the warning.

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'your-jsx-factory',
    jsxFragment: 'Fragment',
  },
});
```

- You can inject the JSX helpers using jsxInject (which is a Vite-only option) to avoid manual imports:
```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
```
- Add `@vitejs/plugin-react` to support react refresh, use the automatic JSX runtime and custom babel plugins.

```js
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

## 10. vite typescript
- Vite support typescript out of the box. It will use esbuild to transform typescript to js.
- Vite does not type-check your code by default.
- Vite config can be a typescript file, so we can use typescript to config vite by create `tsconfig.node.json` in root folder.
  - Add `tsconfig.node.json` to `references` in `tsconfig.json`
  - Install `@types/node` to support node types in `vite.config.ts`
  - Add `esModuleInterop` to `compilerOptions` in `tsconfig.node.json` to support `import` syntax in `vite.config.ts`
- For client type add `vite.d.ts` in root folder and add `"vite.d.ts"` to `includes` in `tsconfig.json`  or add `vite/client` to `types` in `tsconfig.json`
  - Asset imports (e.g. importing an .svg file)
  - Types for the Vite-injected env variables on `import.meta.env`
  - Types for the Vite-specific `import.meta.hot` API

```ts
// vite.d.ts
/// <reference types="vite/client" />
```

## 11. vite ESLint
- Install `eslint`, `eslint-config-prettier`, `eslint-plugin-prettier` for analyzing code and formatting code.
- Install `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` for custom eslint parser and plugin.
  - Now eslint will use `@typescript-eslint/parser` to parse typescript file and use `@typescript-eslint/eslint-plugin` to analyze typescript code base on the `tsconfig.json`.
  - Include file that need to be analyzed in `includes` in `tsconfig.json`.

## 12. Path alias
- Vite does not support path alias out of the box, 
- If the project use typescript, we can use `baseUrl` and `paths` in `tsconfig.json` to support path alias.
- Config `alias` in `vite.config.js` to support path alias in js file.

```js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
```
- Alternatively, you can use the `vite-tsconfig-paths` plugin to sync the `paths` in `tsconfig.json` to Vite's alias config.

```js
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
});
```

## 13. Environment Variables
- Vite expose the environment variables to the browser by injecting the variables into the `import.meta.env` object.
- Built-in variables
  - `import.meta.env.DEV`: boolean, `true` in `dev environment` and `false` in `production environment`. (When run `vite` or `NODE_ENV=development vite`)
  - `import.meta.env.PROD`: boolean, `true` in `production environment` and `false` in `dev environment`. (When run `vite build` or `NODE_ENV=production vite`)
  - `import.meta.env.BASE_URL`: string, the value of `base` in `vite.config.js`
  - `import.meta.env.SSR`: boolean, `true` in `server side rendering` and `false` in `client side rendering`.
  - `import.meta.env.MODE`: string, the value of `mode` in `vite --mode <mode>` or `vite build --mode <mode>`, related with `.env.<mode>` file.

- When running `vite` or `vite build`, the environment variables will be loaded from `.env` file in root folder. 
- The `.env` file will be loaded in all mode. 
- The `.env` file can be a `.env.local` file, which will be ignored by git. 
- The `.env.local` file will be loaded in all mode. 
- The `.env.local` file can be a `.env.<mode>` file, which will be ignored by git. The `.env.<mode>` file will be loaded in the corresponding mode.
- For example `vite --mode staging` will load `.env.staging.local` > `.env.staging` > `.env.local` > `.env` file.
-`mode` for load the `.env` file and `NODE_ENV` for detect our is built or developing. More difference between `mode` and `NODE_ENV` can find here: https://vitejs.dev/guide/env-and-mode.html#node-env-and-modes.
- Only variables start with `VITE_` will expose to the browser. For example, `VITE_APP_TITLE=My App` will expose `import.meta.env.VITE_APP_TITLE` to the browser.