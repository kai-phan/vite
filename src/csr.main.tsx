import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log(import.meta.env);

createRoot(document.getElementById('app')!).render(<App />);
