
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set document title programmatically
document.title = "ErasMatch";

createRoot(document.getElementById("root")!).render(<App />);
