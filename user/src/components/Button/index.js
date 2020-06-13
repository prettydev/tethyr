import React, { Component } from 'react'
import CircleSpinner from '../CircleSpinner'
import classNames from 'classnames'

import './styles.css'

export const ButtonState = {
  normal: 0,
  loading: 1,
}

class Button extends Component {

  onClick = (e) => {
    if (this.props.state !== ButtonState.loading && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render() {
    const state = this.props.state || ButtonState.normal

    return (
      <button id={ this.props.id } className={ classNames('button', this.props.className) } style={ this.props.style } type={ this.props.type } onClick={ this.onClick }>
      {
        state === ButtonState.loading ?
        <CircleSpinner/>
        :
        this.props.children
      }
      </button>
    )
  }
}

export default Button
