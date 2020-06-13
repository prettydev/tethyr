import React from 'react'
import classNames from 'classnames'
import './styles.css'
import imgSpinner from '../../assets/images/spinner.gif'

const OverlaySpinner = ({ visible, size, color, text, absolute }) => {
  return (
    <div className={classNames('overlay', { 'overlay--hidden': !visible }, { 'overlay--absolute': absolute })}>
      <img src={imgSpinner} alt='spinner'/>
    </div>
  )
}

export default OverlaySpinner
