
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add mobile-specific meta tags
const viewport = document.querySelector('meta[name="viewport"]');
if (viewport) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

createRoot(document.getElementById("root")!).render(<App />);
