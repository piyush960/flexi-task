import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize MSW for API mocking
async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
