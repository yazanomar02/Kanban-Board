// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// تحميل متغيرات البيئة
if (process.env.NODE_ENV === 'development') {
  console.log('Kanban Board - Development Mode');
}

// التحقق من دعم المتصفح
const checkBrowserSupport = () => {
  const features = {
    localStorage: typeof Storage !== 'undefined',
    dragAndDrop: 'draggable' in document.createElement('div'),
    fetch: typeof fetch !== 'undefined',
  };

  const unsupportedFeatures = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupportedFeatures.length > 0) {
    console.warn('Unsupported browser features:', unsupportedFeatures);
    
    // عرض رسالة للمستخدم إذا كان في وضع الإنتاج
    if (process.env.NODE_ENV === 'production' && !features.localStorage) {
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #f59e0b;
        color: white;
        padding: 10px;
        text-align: center;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      warningDiv.textContent = 'Your browser does not support some features. Data may not be saved properly.';
      document.body.appendChild(warningDiv);
    }
  }

  return features;
};

// تهيئة التطبيق
const initializeApp = () => {
  // التحقق من دعم المتصفح
  checkBrowserSupport();

  // تهيئة localStorage إذا كان فارغاً
  try {
    const hasData = localStorage.getItem('kanban-board-data');
    if (!hasData) {
      console.log('Initializing empty storage...');
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  // إنشاء عنصر الجذر
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  // عرض التطبيق
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

};

// بدء التطبيق عندما يكون DOM جاهزاً
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}