import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Absolute sub-entry points to bypass Vite's caching layers safely
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';

// Core system offline styling blocks
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import '@fontsource/quicksand/300.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';

// Route targets
import App from './App';
import ErrorPage from './pages/ErrorPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import BlogFeed from './pages/BlogFeed';
import LoginPage from './pages/LoginPage'; // Added your new standalone Login page import reference

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Fixed template literal syntax error to append authorization headers correctly
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
// Dynamic full-stack JavaScript helper submit tool to run automated payload queries
export const transmitFormPayload = async (mutationTemplate, formVariables) => {
  return await client.mutate({
    mutation: mutationTemplate,
    variables: formVariables,
  });
};

// Application Router managing the uniform navigation route path mappings sitewide
// Application Router reading your unguessable entrance path dynamically out of .env
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/blog', element: <BlogFeed /> },
      
      // Zero hardcoded strings! Dynamically parsed at boot time.
      { path: import.meta.env.VITE_SECRET_PORTAL_PATH, element: <LoginPage /> }, 
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

// Mount the application wrapped in the secure Apollo Provider wrapper layer
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
