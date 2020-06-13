import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './styles/index.scss'
import './styles/styles.css'

import {checkExternalAccountCallback, handleExternalAccountCallback} from 'actions/externalAccounts'
import 'antd/dist/antd.css';


if (checkExternalAccountCallback())
  handleExternalAccountCallback()
else
  ReactDOM.render(<App />, document.getElementById('root'));
