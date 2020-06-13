import React from 'react'
import ConfirmMailForm from '../components/ConfirmMailForm'

import './styles.css'

const Signup = (props) => {
  return (
    <div className='confirm-mail-container'>
      {/* Form */}
      <div className='div-confirm-mail-form'>
        <div className='container'>
          <ConfirmMailForm />
        </div>
      </div>
    </div>
  )
}

export default Signup