import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { TwitterVideoEmbed } from 'react-twitter-embed';
import Iframe from 'react-iframe';
import ImportantContent from './components/ImportContent';
import SearchContent from './components/SearchContent';
import { getUserPreviewPlaylists } from '../../../../services/userPlaylist';
import { selectPlaylist, selectItem } from '../../../../redux/actions/viewer';
import main_logo from '../../../../assets/images/LOGO_TYR.png';
import time_banner from '../../../../assets/images/timeBanner/TIMER_GREY_TYR.png';
import videoInactive from '../../../../assets/images/cubeActions/B1_VID_0.png';
import videoActive from '../../../../assets/images/cubeActions/B1_VID_1.png';
import audioInactive from '../../../../assets/images/cubeActions/B2_AUD_0.png';
import audioActive from '../../../../assets/images/cubeActions/B2_AUD_1.png';
import playlistInactive from '../../../../assets/images/cubeActions/B3_PLA_0.png';
import playlistActive from '../../../../assets/images/cubeActions/B3_PLA_1.png';
import item_dot_on from '../../../../assets/images/videoItemIcons/item_dot_on.png';
import item_dot_off from '../../../../assets/images/videoItemIcons/item_dot_off.png';
import item_hidden_on from '../../../../assets/images/videoItemIcons/item_hidden_on.png';
import item_hidden_off from '../../../../assets/images/videoItemIcons/item_hidden_off.png';
import item_link from '../../../../assets/images/videoItemIcons/item_link.png';
import videoPlayingBackground from '../../../../assets/images/videoItemIcons/background.png';

import './styles.css'

const height = {
  0: 'Hide',
  1: 'Short',
  2: 'Medium',
  3: 'Full',
}

const cubeLayouts = {
  0: 'Mobile_view',
  1: 'Full_view',
  2: 'Side_view',
}

/* Layout Lists
const layouts = {
  0: 'G1',
  1: 'G2',
  2: 'G2c1',
  3: 'G3c1',
  4: 'G4',
  5: 'G4c1',
  6: 'G4pro',
  7: 'G6',
  8: 'G8',
  9: 'M1',
  10: 'M4',
}
*/

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubeLayout: 1,
      layout: 0,
      gridset_id: null,
      previewCubes: new Array(8).fill(1),
      adCubes: new Array(2).fill(1),
      activeVideo: 0,
      showPlaylist: 0,
      audio_cubes: [false, true, true, true, true, true, true, true],
      play_status: new Array(8).fill(true),
      cube_playlist: [0, 1, 2, 3, 4, 5, 6, 7],
      cube_video: new Array(8).fill(0),
      previewPlaylists:[],
    }
  }

  componentDidMount() {
    let cubeLayout = 1;
    let layout = 0;
    let previewCubes = new Array(8).fill(1);
    let availableCubes, nonAvailableCubes;

    switch(this.props.viewer.layout) {
      case 0:
        cubeLayout = 2;
        layout = this.props.viewer.layout;
        availableCubes = new Array(1).fill(1);
        nonAvailableCubes = new Array(7).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 1:
        cubeLayout = 1;
        layout = this.props.viewer.layout;
        availableCubes = new Array(2).fill(1);
        nonAvailableCubes = new Array(6).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 2:
        cubeLayout = 2;
        layout = this.props.viewer.layout;
        availableCubes = new Array(2).fill(1);
        nonAvailableCubes = new Array(6).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 3:
        cubeLayout = 2;
        layout = this.props.viewer.layout;
        availableCubes = new Array(3).fill(1);
        nonAvailableCubes = new Array(5).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 4:
        cubeLayout = 1;
        layout = this.props.viewer.layout;
        availableCubes = new Array(4).fill(1);
        nonAvailableCubes = new Array(4).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 5:
        cubeLayout = 2;
        layout = this.props.viewer.layout;
        availableCubes = new Array(4).fill(1);
        nonAvailableCubes = new Array(4).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 6:
        cubeLayout = 1;
        layout = this.props.viewer.layout;
        availableCubes = new Array(4).fill(1);
        nonAvailableCubes = new Array(4).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 7:
        cubeLayout = 1;
        layout = this.props.viewer.layout;
        availableCubes = new Array(6).fill(1);
        nonAvailableCubes = new Array(2).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 8:
        cubeLayout = 1;
        layout = this.props.viewer.layout;
        previewCubes = new Array(8).fill(1);
        break;
      case 9:
        cubeLayout = 0;
        layout = this.props.viewer.layout;
        availableCubes = new Array(1).fill(1);
        nonAvailableCubes = new Array(7).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      case 10:
        cubeLayout = 0;
        layout = this.props.viewer.layout;
        availableCubes = new Array(4).fill(1);
        nonAvailableCubes = new Array(4).fill(0);
        previewCubes = availableCubes.concat(nonAvailableCubes);
        break;
      default:
        cubeLayout = 1;
        layout = 0;
        previewCubes = new Array(8).fill(1);
    }

    this.setState({
      cubeLayout,
      layout,
      previewCubes
    })
  }
  
  componentDidUpdate(prewProps) {
    if(this.state.layout !== this.props.viewer.layout) {
      let cubeLayout = 1;
      let layout = 0;
      let previewCubes = new Array(8).fill(1);
      let availableCubes, nonAvailableCubes;

      switch(this.props.viewer.layout) {
        case 0:
          cubeLayout = 2;
          layout = this.props.viewer.layout;
          availableCubes = new Array(1).fill(1);
          nonAvailableCubes = new Array(7).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 1:
          cubeLayout = 1;
          layout = this.props.viewer.layout;
          availableCubes = new Array(2).fill(1);
          nonAvailableCubes = new Array(6).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 2:
          cubeLayout = 2;
          layout = this.props.viewer.layout;
          availableCubes = new Array(2).fill(1);
          nonAvailableCubes = new Array(6).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 3:
          cubeLayout = 2;
          layout = this.props.viewer.layout;
          availableCubes = new Array(3).fill(1);
          nonAvailableCubes = new Array(5).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 4:
          cubeLayout = 1;
          layout = this.props.viewer.layout;
          availableCubes = new Array(4).fill(1);
          nonAvailableCubes = new Array(4).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 5:
          cubeLayout = 2;
          layout = this.props.viewer.layout;
          availableCubes = new Array(4).fill(1);
          nonAvailableCubes = new Array(4).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 6:
          cubeLayout = 1;
          layout = this.props.viewer.layout;
          availableCubes = new Array(4).fill(1);
          nonAvailableCubes = new Array(4).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 7:
          cubeLayout = 1;
          layout = this.props.viewer.layout;
          availableCubes = new Array(6).fill(1);
          nonAvailableCubes = new Array(2).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 8:
          cubeLayout = 1;
          layout = this.props.viewer.layout;
          previewCubes = new Array(8).fill(1);
          break;
        case 9:
          cubeLayout = 0;
          layout = this.props.viewer.layout;
          availableCubes = new Array(1).fill(1);
          nonAvailableCubes = new Array(7).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        case 10:
          cubeLayout = 0;
          layout = this.props.viewer.layout;
          availableCubes = new Array(4).fill(1);
          nonAvailableCubes = new Array(4).fill(0);
          previewCubes = availableCubes.concat(nonAvailableCubes);
          break;
        default:
          cubeLayout = 1;
          layout = 0;
          previewCubes = new Array(8).fill(1);
      }
  
      this.setState({
        cubeLayout,
        layout,
        previewCubes
      })
    }

    if(this.props.gridset_id && (this.state.gridset_id !== this.props.gridset_id.id)) {
      getUserPreviewPlaylists(this.props.user.user.user_id, this.props.user.user.token, this.props.gridset_id.id)
      .then(({previewItems}) => {
        this.setState({
          gridset_id: this.props.gridset_id.id,
          previewPlaylists: previewItems,
        })
      })
      .catch(err => console.log(err))
    }

    if(prewProps.viewer.playlist !== this.props.viewer.playlist) {
      const { cube_playlist, showPlaylist } = this.state;
      cube_playlist[showPlaylist] = this.props.viewer.playlist;
      this.setState({
        cube_playlist
      })
    }

    if(prewProps.viewer.playAction !== this.props.viewer.playAction) {
      if(this.props.viewer.playAction === 0){
        this.setState({
          play_status: new Array(8).fill(true),
        })
      }
      else {
        this.setState({
          play_status: new Array(8).fill(false),
        })
      }
    }

    if(prewProps.viewer.item !== this.props.viewer.item) {
      const { cube_video, showPlaylist } = this.state;
      cube_video[showPlaylist] = this.props.viewer.item;
      this.setState({
        cube_video
      })
    }
  }
  
  renderCube = (previewCube, index) => {
    const { cubeLayout } = this.state;
    return (
      <div className={classNames('cube', cubeLayouts[cubeLayout], {'removedCube' : previewCube === 0})} id={`cube_${index}`}>
        <div className="mainCube">
          {this.renderVideoItem(index)}
          <div className="timeBanner" id={`timeBanner${index}`}><img alt='Time_banner' src={time_banner} className="time_Banner" id={`cube_${index}_time_banner`} /></div>
        </div>
        {this.renderButtons(index)}
      </div>
    );
  }

  renderAdCube = (adCube, index) => {
    const { cubeLayout } = this.state;
    return (
      <div className={classNames('cube', 'adCube', cubeLayouts[cubeLayout])} id={`adCube_${index}`}>
      </div>
    );
  }

  renderVideoItem = (index) => {
    const { cube_playlist, cube_video, previewPlaylists, audio_cubes, play_status, activeVideo, cubeLayout } = this.state;
    const playing_video_id = cube_video[index];
    const muted = audio_cubes[index];
    const playing_status = play_status[index];
    const playing_playlist_id = cube_playlist[index];
    if (!previewPlaylists[playing_playlist_id] || previewPlaylists[playing_playlist_id].videos.length === 0) {
      return (
        <div name={`iCube${index + 1}`}  className='cubeContainer'>
          <div className="cubeItem">
          </div>
        </div>
      )
    }
    const videoItem = previewPlaylists[playing_playlist_id].videos[playing_video_id];
    let videoElement = null;
    console.log(videoElement)
    switch (videoItem.type) {
      case 'youtube':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`${videoItem.interface_link}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'facebook':
        videoElement = (
          <div className={classNames("cubeItem", "facebook")} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`https://www.facebook.com/${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'dailymotion':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`https://www.dailymotion.com/embed/video/${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'twitch_live':
        if(videoItem.live_now === 0 || videoItem.live_now === null)
        {
          videoElement = (
            <div className="cubeItem" id={`iCube${index + 1}`}>
                {/* <StaticTwitch
                  url={`${videoItem.thumb ? videoItem.thumb : images.placeholderThumb}`}
                  onEnded={() => { this.onVideoEnd(index); }}
                /> */}
            </div>
          )
        }
        else{
          videoElement = (
            <div className="cubeItem" id={`iCube${index + 1}`}>
              <ReactPlayer
                playing={playing_status}
                volume={1}
                muted={muted}
                controls
                width='100%'
                height='100%'
                url={`${videoItem.interface_link}`}
                onEnded={() => { this.onVideoEnd(index); }}
              />
            </div>
          );
        }
        break;
      case 'twitch':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`${videoItem.interface}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'vimeo':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`${videoItem.interface_link }`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'wista':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='100%'
              url={`http://fast.wistia.net/embed/iframe/${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'twitter':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
           <TwitterVideoEmbed id={videoItem.url} options={{width:100}} />
           <button className="nextButton" onClick={() => this.onVideoEnd(index)}>Next</button>
          </div>
        );
        break;
      case 'html':
          videoElement = (
            <div className="cubeItem" id={`iCube${index + 1}`}>
              <div className="htmlTitle">
                <span className="cubeTitleHtml">
                  {videoItem.title}
                  <span></span>
                </span>
              </div>
              <Iframe url={`${videoItem.interface_link}`}
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

            </div>
          );
        break;
      case 'slide':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <Iframe url={`${videoItem.interface}`}
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

          </div>
        );
        break;
      case 'Podcast':
        videoElement = (
          <div className="cubeItem" id={`iCube${index + 1}`}>
            <span className="cubePodcastTitle">
                {videoItem.title + ' : ' + videoItem.episode_title}
            </span>
            <ReactPlayer
              playing={playing_status}
              volume={1}
              muted={muted}
              controls
              width='100%'
              height='30%'
              url={`${videoItem.interface}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />   
          </div>
        );
        break;
      default:
        break;
    }

    return (
        <div name={`iCube${index + 1}`}  className={classNames('cubeContainer', {'active' : index === activeVideo}, cubeLayouts[cubeLayout])}>
          <div
            className={`VideoBg VideoBg--${index === activeVideo ? 'Show' : 'Hide'}`}
            style={{ backgroundImage: `url(${videoPlayingBackground})` }}
          />
          {videoElement}
        </div>
    );
  }

  showInterface = (index) => {
    const { previewPlaylists, cube_video } = this.state;
    const interfaceUrl = previewPlaylists[index].videos[cube_video[index]].interface_link;
    window.open(interfaceUrl, 'name');
  }

  showPlaylist = (index) => {
    const selectedPlaylist = this.state.cube_playlist[index];
    this.props.dispatch(selectPlaylist(selectedPlaylist));
    this.setState({
      showPlaylist : index
    })
  }

  expandVideo = (index) => {
    const { activeVideo } = this.state;
    if(activeVideo === index) {
      index = -1;
    }
    this.setState({
      activeVideo: index,
    })
  }

  renderButtons = (index) => {
    const { audio_cubes, activeVideo, showPlaylist, previewPlaylists, cube_video} = this.state;  
    if(!previewPlaylists[index]) {
      return (
        <div className="cubeAction" id={`C${index + 1}_BUT`}>
          <img alt='button' className="imgBtn" src={videoInactive} />
          <img alt='button' className="imgBtn" src={audioInactive} />
          <img alt='button' className="imgBtn" src={playlistInactive} />
          <img src={item_dot_off} className="previewBtn" alt="ratingRadio" title="Dot this"/>
          <img src={item_hidden_off} className="previewBtn" alt="hideBtn" title="Hide this"/>
          <img src={item_link} className="previewBtn" alt="interface_link" title="Open Source"/>
        </div>
      )
    }
    else if(previewPlaylists[index] && previewPlaylists[index].videos.length === 0) {
      return (
        <div className="cubeAction" id={`C${index + 1}_BUT`}>
          <img alt='button' className="imgBtn" src={videoInactive} />
          <img alt='button' className="imgBtn" src={audioInactive} />
          <img alt='button' className="imgBtn" src={showPlaylist === index ? playlistActive : playlistInactive}  onClick={() => { this.showPlaylist(index) }} />
          <img src={item_dot_off} className="previewBtn" alt="ratingRadio" title="Dot this"/>
          <img src={item_hidden_off} className="previewBtn" alt="hideBtn" title="Hide this"/>
          <img src={item_link} className="previewBtn" alt="interface_link" title="Open Source"/>
        </div>
      )
    }
    else {
      return (
        <div className="cubeAction" id={`C${index + 1}_BUT`}>
          <img alt='button' className="imgBtn" src={activeVideo === index ? videoActive : videoInactive}  onClick={() => { this.expandVideo(index) }} />
          <img alt='button' className="imgBtn" src={audio_cubes[index] ? audioInactive : audioActive}  onClick={() => { this.activateAudio(index) }} />
          <img alt='button' className="imgBtn" src={showPlaylist === index ? playlistActive : playlistInactive}  onClick={() => { this.showPlaylist(index) }} />
          <img src={ previewPlaylists[index].videos[cube_video[index]].dotted  ? item_dot_on : item_dot_off } className="previewBtn" onClick={() => { this.dotFromPreview(index) }} alt="ratingRadio" title="Dot this"/> 
          <img src={ previewPlaylists[index].videos[cube_video[index]].hidden  ? item_hidden_on : item_hidden_off} className="previewBtn" onClick={() => { this.hideFromPreview(index) }} alt="hideBtn" title="Hide this"/>
          <img src={item_link} className="previewBtn" onClick={() => { this.showInterface(index) }} alt="interface_link" title="Open Source"/>
        </div>
      )
    }
  }

  onVideoEnd = (index) => {
    const { cube_video, showPlaylist } = this.state;
    cube_video[index] += 1;
    if(index === showPlaylist) {
      const item = cube_video[index]
      this.props.dispatch(selectItem(item))
      this.setState({
        cube_video,
      })
    }
    else {
      this.setState({
        cube_video,
      })
    }
  }

  render() {
    const { user, viewer } = this.props;
    const { cubeLayout, previewCubes, adCubes, previewPlaylists } = this.state;
    console.log(previewPlaylists)
    const cubes = previewCubes.map((previewCube, index) => {
      return this.renderCube(previewCube, index)
    })
    const ads = adCubes.map((adCube, index) => {
      return this.renderAdCube(adCube, index)
    })

    return ( 
      <div id="mainViewer" className={classNames('mainViewer', height[viewer.playlistViewerHeight])}>
        <div className={classNames('main_window', cubeLayouts[cubeLayout])}>
          <span class="helper"></span><img src={main_logo} className="main_logo" alt="Main Background Image" />
          { viewer.importContent &&
            <ImportantContent />
          }
          {
            viewer.searchContent &&
            <SearchContent />
          }
          {
            viewer.showWiki &&
            <div className='wikiContent'>
              <Iframe url={`https://wiki.tethyr.io/index.php?title=Main_Page`}
                width="100%"
                height="100%"
                className="myClassname"
                allow="fullscreen"
                display="initial"
                position="relative"
              />
            </div> 
          }
        </div>
        <div className={classNames('cubes_window', cubeLayouts[cubeLayout])}>
          <div className={classNames('cubes_container', cubeLayouts[cubeLayout])}>
            {cubes}
            {ads}
          </div>
        </div>
      </div>
     );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    viewer: state.viewer,
  }
}

export default connect(mapStateToProps)(MainView);