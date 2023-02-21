import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// making it compatible for react 18
const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
    <App />,
);

