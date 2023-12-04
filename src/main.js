import './files/a';
import './assets/1.css';

// inline style
import styles from './assets/2.css?inline';

console.log(styles);

const style = document.createElement('style');

style.innerHTML = styles;
document.head.appendChild(style);

