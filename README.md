# vite
Learning vite

## 1. vite module resolve 
- Vite serve node_modules package with esm module, so we can import package directly in browser. But it only support esm module, so we need to add `type: module` in package.json.
- Each import will create a request to dev server.
- For example, we can import lodash in browser with `import _ from 'lodash'` directly.
- Vite will create a virtual file for each package in node_modules, and it will be cached in `node_modules/.vite/deps` folder. So it will be faster when we import package next time.
