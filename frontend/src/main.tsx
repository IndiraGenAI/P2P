import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { store } from './state/store';
import Interceptor from './axios/Interceptor';
import { BRAND_COLORS } from './common/constants/theme.constants';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {

}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: BRAND_COLORS.primary,
            colorSuccess: BRAND_COLORS.accent,
            colorInfo: BRAND_COLORS.primary,
          },
        }}
      >
        <BrowserRouter>
          <Interceptor />
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);

// Smoothly hide the splash screen once React has mounted the first frame.
// Minimum visible time avoids a jarring flash on fast reloads, and the
// removal happens after the CSS fade-out finishes.
const hideSplash = () => {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  const MIN_VISIBLE_MS = 2000;
  const start = (window as unknown as { __splashStart?: number }).__splashStart
    ?? performance.now();
  const elapsed = performance.now() - start;
  const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

  window.setTimeout(() => {
    splash.classList.add('is-hidden');
    splash.addEventListener(
      'transitionend',
      () => splash.parentNode?.removeChild(splash),
      { once: true },
    );
    // Safety net in case `transitionend` is missed (e.g. reduced motion).
    window.setTimeout(() => splash.parentNode?.removeChild(splash), 1500);
  }, wait);
};

if (document.readyState === 'complete') {
  requestAnimationFrame(() => requestAnimationFrame(hideSplash));
} else {
  window.addEventListener(
    'load',
    () => requestAnimationFrame(() => requestAnimationFrame(hideSplash)),
    { once: true },
  );
}
