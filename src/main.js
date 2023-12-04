import './files/a';
import './assets/1.css';

// inline style
import styles from './assets/2.css?inline';

// module style
import styleObj from './assets/3.module.css';

console.log(styles);

const style = document.createElement('style');

style.innerHTML = styles;
document.head.appendChild(style);

const h2Module = document.getElementById('module');

h2Module.className = styleObj.heading;

