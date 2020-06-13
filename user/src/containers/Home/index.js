import React, { Component } from 'react'
import { connect } from 'react-redux'
import LazyImage from '../../components/LazyImage'
import imgBanner from '../../assets/images/home_banner.jpg'
import imgBannerMobile from '../../assets/images/home_banner_mobile.jpg'
import './styles.css'

class Home extends Component {

  render () {
    return (
      <div className='div-home-container'>
        <div className='div-top-container'>
          {/* Banner */}
          <div className='div-banner-container container'>
            <LazyImage className='img-banner' src={ imgBanner } disableSpinner={true} />
            <LazyImage className='img-banner-mobile' src={ imgBannerMobile } disableSpinner={true} />

            <div className='div-banner-center'>
              <div className='div-title'>
                Create playlists from different sources, share them with your friends and the world.
              </div>
              <div className='separator'/>
              <div className='div-subtitle'>
                Save time and have a better experience watching more content. Supports: Twitch, Facebook, Youtube, Vimeo, Daily Motion, TwitterVideo, Podcasts, Websites and more.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Home)
