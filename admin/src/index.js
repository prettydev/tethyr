import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import  store  from './store';
import Root from './views/root';

import "./assets/scss/material-dashboard-pro-react.css?v=1.4.0";

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root')
);
