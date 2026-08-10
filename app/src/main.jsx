import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1. Maintain your local style sheets and font pack nodes
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ADD THIS LINE TO RUN ACCORDION INTERACTIONS OFFLINE!
import './index.css';

import '@fontsource/quicksand/300.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';

import App from './App';
import ErrorPage from './pages/ErrorPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';


// THE CONST ROUTER DEFINITION LIVES RIGHT HERE:
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: <LandingPage /> 
      },
      { 
        path: '/about', 
        element: <AboutPage /> 
      },
      { 
        path: 'contact', 
        element: <ContactPage /> 
      },
    ],
  },
]);

const forceFontStyles = document.createElement('style');
forceFontStyles.innerHTML = `
  *, *::before, *::after, html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, button, select, input, textarea, ul, li {
    font-family: 'Quicksand', sans-serif !important;
  }
`;
document.head.appendChild(forceFontStyles);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
