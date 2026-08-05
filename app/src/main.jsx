import ReactDOM from 'react-dom/client';
// Bringing in the required imports from 'react-router-dom' to set up application routing behavior
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Bringing in the pages the router will use to conditionally show the appropriate views
import App from './App';
import ErrorPage from './pages/ErrorPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage'; // Lowercase pages folder path rule [1]

// Define the accessible routes, and which components respond to which URL
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // This makes the brand-new landing page your home view!
        element: <LandingPage />,
      },
      {
        path: '/about', // Repositioned your original About Me page cleanly here
        element: <AboutPage />,
      },
     
      {
        path: '/contact',
        element: <ContactPage />,
      },
      
    ],
  },
]);

// Render the RouterProvider component
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
