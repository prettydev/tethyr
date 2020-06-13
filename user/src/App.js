import React, { Component } from 'react'
import {
  BrowserRouter,
  Route,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import ScrollToTop from './components/ScrollToTop'
import Root from './containers/Root'

import './styles/respo.min.scss'


class App extends Component {
  render () {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <ScrollToTop>
           <Route path='/' component={Root} /> 
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
