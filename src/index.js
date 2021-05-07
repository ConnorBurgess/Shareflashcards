import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import NavBar from './components/NavBar';
import ToolTip from './components/ToolTip';
import '@fontsource/roboto';

ReactDOM.render(
  <>
    <NavBar />
    {/* <ToolTip /> */}
    <App />
  </>,
  document.getElementById('root')
);

