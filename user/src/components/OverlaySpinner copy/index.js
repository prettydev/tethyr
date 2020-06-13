import React from 'react'
import { RotateSpinner } from 'react-spinners-kit'
import classNames from 'classnames'
import './styles.scss'

const OverlaySpinner = ({ visible, size, color, text, absolute }) => {
  return (
    <div className={classNames('overlay', { 'overlay--hidden': !visible }, { 'overlay--absolute': absolute })}>
      <RotateSpinner size={size} color={color} />
      <div className="overlay__text mt-1" style={{ color: color }}>{ text }</div>
    </div>
  )
}

OverlaySpinner.defaultProps = {
  size: 64,
  color: '#56B05A',
  text: '',
  absolute: false,
}

export default OverlaySpinner