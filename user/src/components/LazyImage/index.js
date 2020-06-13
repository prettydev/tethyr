import React from 'react'
import Image from 'material-ui-image'
import { ClapSpinner } from 'react-spinners-kit'

const LazyImage = (props) => {
  return (
    <div className={ props.className } style={ props.style } onClick={ props.onClick }>
      <Image 
        style={{ paddingTop: 'unset', width: '100%', height: '100%', backgroundColor: 'transparent'}} 
        imageStyle={{objectFit: 'cover'}}
        src={ props.src } 
        loading={<ClapSpinner size={48} color='#56B05A' />}
        disableSpinner={ !props.showSpinner }
      />
    </div>
  )
}

export default LazyImage
