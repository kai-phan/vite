import './files/a';
import './assets/1.css';

// inline style
import styles from './assets/2.css?inline';

// module style
import styleObj from './assets/3.module.css';

// tailwindcss
import './assets/tw.css';

// preprocessors (sass, less, stylus)
import './assets/4.scss';

// json object
import data from './assets/data.json';

// json file url
import dataUrl from './assets/url.json?url';

// image url
import viteLogo from './assets/vite.svg';

// image raw
import viteLogoRaw from './assets/vite.svg?raw';

console.log({ styles });

const style = document.createElement('style');

style.innerHTML = styles;
document.head.appendChild(style);

const h2Module = document.getElementById('module');

h2Module.className = styleObj.heading;

console.log({ data });

console.log({ dataUrl });

console.log({ viteLogo });
const img = document.createElement('img');
img.src = viteLogo;

document.body.appendChild(img);

console.log({ viteLogoRaw });
const div = document.createElement('div');
div.innerHTML = viteLogoRaw;

document.body.appendChild(div);
