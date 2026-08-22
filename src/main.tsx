import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { StoreProvider } from '@/store/StoreContext';
import { ProductsProvider } from '@/store/ProductsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>
);
