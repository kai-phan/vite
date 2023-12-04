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
