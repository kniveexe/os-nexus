import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {ProgressProvider} from './store';
import App from './App';
import './style.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><ProgressProvider><App/></ProgressProvider></HashRouter></React.StrictMode>);
