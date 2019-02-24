import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

/**
 * Index is the root of the whole application.
 * This is where the App is wrapped in BrowserRouter,
 * which allows React Router to toggle between different views.
 */

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
