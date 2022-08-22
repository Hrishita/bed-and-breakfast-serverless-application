import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import App from './App';
import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';

const root = ReactDOM.createRoot(document.getElementById('root'));
Kommunicate.init("303f94dbb5cf7272b3ca7cf04105a077d" ,{"popupWidget":true,"automaticChatOpenOnNavigation":true});
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


