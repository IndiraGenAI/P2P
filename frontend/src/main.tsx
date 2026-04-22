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
