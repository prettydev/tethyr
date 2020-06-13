import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Iframe from 'react-iframe'
import images from '../../constants/images';
import Timer from '../Timer';
import './style.scss';

import {
    getAllAds
} from '../../actions';

class AdCube extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            ads: [],
            activeIndex: 0,
            loading: true
        }
    }

    componentDidMount() {
        this.props.getAllAds().then(res => {
            this.setState({
                ads: res.data.filter(item => item.enabled).map(item => ({
                    ...item,
                    id: `ad-${item.id}`
                })),
                loading: false
            })
        })
    }

    nextAd = () => {
        const { ads, activeIndex } = this.state
        if (ads.length === 1) {
            return
        }
        while (true) {
            let newId = parseInt(Math.random() * ads.length)
            if (newId !== activeIndex) {
                this.setState({
                    activeIndex: newId
                })
                break
            }
        }
    }

    handleClick = () => {
        const { ads, activeIndex } = this.state
        const activeAd = ads[activeIndex]
        if (!activeAd) {
            return;
        }
        window.open(activeAd.targetURL || activeAd.adImg, '_blank')
    }

    render() {
        const { loading } = this.state
        if (loading) {
            return (
                <div className="AdCube Cube">
                    loading...
                </div>
            );
        }
        const { ads, activeIndex } = this.state
        const { activeVideoIndex } = this.props
        const activeAd = ads[activeIndex] || {}
        const display = activeAd.id === activeVideoIndex
        const displaySource = display
            ? images.adCube.btnDisplayActive
            : images.adCube.btnDisplayInactive
        return (
            <div className="AdCube Cube" id={`Ad_CubeBox_${activeIndex+1}`}>
                <div className="MainBar">
                    <div
                        className={`VideoBg VideoBg--${display ? 'Show' : 'Hide'}`}
                        style={{
                            minWidth: "255px",
                            height: "145px",
                            backgroundImage: `url(${images.videoBg})`
                        }}
                    />
                    {!display ?
                    <img
                        alt='button'
                        src={`${activeAd.adImg}`}
                        //onClick={() => { }}
                        width="255"
                        height="145"
                        onClick={this.handleClick}
                    />:
                    <div class="Win1cube short">
                        <Iframe url={`${activeAd.localURL}`}
                            width="100%"
                            height="100%"
                            className="myClassname"
                            allow="fullscreen"
                            display="initial"
                            position="relative"
                            onLoad={
                                (e) => {
                                    e.target.contentWindow.postMessage('hello', "*");
                                }
                            }
                        />
                    </div>}
                    <Timer
                        key={activeIndex}
                        duration={activeAd.duration}
                        timerStopped={display}
                        onTimeout={this.nextAd}
                    />
                </div>
                <div className="ButtonBar" id={`Ad_C${activeIndex + 1}_BUT`}>
                    <img
                        alt='button'
                        className="imgBtn"
                        src={images.adCube.btnSopnsored}
                        width="65.5"
                        height="20"
                    />
                    <img
                        alt='button'
                        className="spacer"
                        src={images.adCube.spacer}
                        width="15.5"
                        height="20"
                    />

                    <img
                        alt='button'
                        className="imgBtn"
                        src={displaySource}
                        width="95.5"
                        height="20"
                        onClick={() => {
                            if (this.props.selectDisplay) {
                                this.props.selectDisplay(activeAd)
                            }
                        }}
                    />

                    <img
                        alt='button'
                        className="spacer"
                        src={images.adCube.spacer}
                        width="62"
                        height="20"
                    />
                    <img
                        src={images.adCube.wwwButton}
                        className="previewBtn"
                        alt="interface_link"
                        title="Open Source"
                        onClick={this.handleClick}
                    />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAllAds: bindActionCreators(getAllAds, dispatch)
})

export default connect(null, mapDispatchToProps)(AdCube);
