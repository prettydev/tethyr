import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPlayer from 'react-player'
import { withRouter} from 'react-router-dom';
import Iframe from 'react-iframe'

import {  TwitterVideoEmbed } from 'react-twitter-embed';

//import Truncate from 'react-truncate';
import images from '../../constants/images';

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import Ustream from '../../components/UstreamEmbed';
import Andmoor from '../../components/AndmoorEmbed/index';
import StaticTwitch from '../../components/StaticTwitchComponent/index';
//import { Swipeable } from 'react-swipeable'
import TopHeaderBar from '../../components/TopHeaderBar'
import { logoutUser } from '../../redux/actions/user';
import { hideNotificationMessage } from '../../redux/actions/notificationMessage';

import {
  getGridsets,
  getPreview,
  getPlaylists,
  setPlaylistForCube,
  reorderPlaylist,
  setPlaylistRating,
  removePlaylistItem,
  brokePlaylistItem,
  showOverlaySpinner,
  hideOverlaySpinner,
  saveUserInfo,
  checkUserInfo,
  search_filter,
  hidePlaylistItem,
  addNewToPlaylist,
  createNewPlaylist,
  resetDefaultPlaylist,
  getPlaylistInfo,
  getTwitchUserInfo, 
  getTwitchStreamInfo, 
  getTwitchGameInfo,
  updateTwitchInfo,
  checkPlaylistUpdate
} from '../../actions';

import '../VideoPage/styles.css';
import './styles.css';

//const user_id = sessionStorage.getItem('userId');

class M1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gridsets: [],
      user: this.props.user,
      playlist: new Array(8).fill(null),
      playlists: [],
      video: new Array(8).fill(0),
      muted: new Array(8).fill(true),
      paused: new Array(8).fill(false),
      activeVideo: -1,
      showPlaylist: -1,
      showInterface: -1,
      selectPlaylist : 0,
      items: [],
      playlist_id : 0, 
      offPostion: 0,
      searchContent : false,
      addPlaylist : true,
      hidePlaylist : false,
      hide_filter : false,
      dot_filter : false,
      search_value : '',
      openPlaylist : false,
      previewPlaylists_id : 0,
      modalIsOpen : false,
      gspn : null,
      title : "playlist title",
      settingsHeight : 'short',
      thumbSize : 'small',
      zoomLevel : 'normal',
      pauseAll : false,
      playAll : false,
      isCollapsed: false,
      logs : []
    };

    this.handleSettingsHeightChange = this.handleSettingsHeightChange.bind(this);
    this.handleThumbSizeChange = this.handleThumbSizeChange.bind(this);
    this.handleZoomLevelChange = this.handleZoomLevelChange.bind(this);
  }
  

  UNSAFE_componentWillMount() {
    
    document.body.style.zoom = 1;

    const newMuted = new Array(8).fill(true);
    newMuted[0] = false;
    this.setState({ muted: newMuted });
    
    const { showOverlaySpinner, saveUserInfo, checkUserInfo } = this.props;
    

    this.addLog('Logged in as user ' + sessionStorage.getItem('userId') + ', ' + sessionStorage.getItem('username'));
    this.addLog('Loaded Tethyr Viewer');
    
    showOverlaySpinner();
    checkUserInfo()
    .then(({success}) => {
      if(success)
      {
        saveUserInfo()
        .then(() => {
          this.getGridsets();
        })
        .catch(err => console.log(err));
      }
      else {
        this.checkUpdate();
      }
    })
    .catch(err => console.log(err));
  }

  checkUpdate = () => {
    const { checkPlaylistUpdate } = this.props;
    checkPlaylistUpdate()
    .then(res=>{
      this.getGridsets();
    })
    .catch(err => console.log(err));
  }

  getGridsets = () => {
    const { getGridsets } = this.props;
    const { user } = this.state;
    getGridsets()
    .then(({ gridsets }) => {
      this.setState({
        gridsets,
      }, () => {
        if (gridsets.length === 0) {
          alert('You don\'t have any Playlist Groups! You will be directed to Management Page!');
          this.props.history.push(`/manage`);
        }
        else {
          this.addLog("Loaded Gridset: " + gridsets[user].name);
          this.loadPlayListFromDB();
        }
      });
    })
    .catch(err => console.log(err));
  }

  loadPlayListFromDB = () => {
    
    const { gridsets, user, showPlaylist } = this.state;
    const { getPreview, getPlaylists, hideOverlaySpinner, getPlaylistInfo} = this.props;

    const gangedGridset = gridsets[user].ganged_gridset === 1 ? true : false;
    getPreview(gridsets[user].id)
      .then(({ playlist }) => {
        if(!playlist[0]) {
          this.setState({
            playlists : [],
            playlist : [],
            showPlaylist : 0,
          }, () => {
            hideOverlaySpinner();
          })
        }
        else {
          getPlaylists(gridsets[user].id)
          .then(({ playlists }) => {
            const playlist_id = playlist[0].id;
            getPlaylistInfo(playlist_id)
            .then(res=>{
              this.setState({
                gspn:res.gspn,
                title:res.title,
                gangedGridset
              })
              this.getTwitchVideo(playlist,async(twitchVideos)=>{
                if(twitchVideos.length !== 0) {
                  //let value = await this.getTwitchInfo(twitchVideos);
                  let playlist_id = playlists[0].id;
                  let previewPlaylists_id = playlist[0].id;
                  let playlistItems = [];
                  if(showPlaylist < 0 )
                  {
                    playlistItems = playlist[0].videos;
                  }
                  else {
                    playlistItems = playlist[showPlaylist].videos;
                  }
                  this.setState({ 
                    playlist,
                    playlists,
                    showPlaylist : 0,
                    selectPlaylist : 0,
                    playlist_id: playlist_id,
                    previewPlaylists_id : previewPlaylists_id,
                    items : playlistItems,
                    video : new Array(8).fill(0),
                  }, () => {
                    hideOverlaySpinner();
                  });
                }
                else {
                  let playlist_id = playlists[0].id;
                  let previewPlaylists_id = playlist[0].id;
                  let playlistItems = [];
                  if(showPlaylist < 0 )
                  {
                    playlistItems = playlist[0].videos;
                  }
                  else {
                    playlistItems = playlist[showPlaylist].videos;
                  }
                  this.setState({ 
                    playlist,
                    playlists,
                    showPlaylist : 0,
                    selectPlaylist : 0,
                    playlist_id: playlist_id,
                    previewPlaylists_id : previewPlaylists_id,
                    items : playlistItems,
                    video : new Array(8).fill(0),
                  }, () => {
                    hideOverlaySpinner();
                  });
                }
              })
            })
            .catch(err=>{console.log(err);})
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  getTwitchVideo = (playlist, callback) => {
    let twitchVideos = [];
    for(var i = 0 ; i < 4 ; i++) {
      if(playlist[i] === null || playlist[i]['videos'].length === 0) {
        continue;
      }
      if(playlist[i].videos[0]['type'] === 'twitch_live')
      {
        twitchVideos.push(playlist[i]['videos'][0].url)
      }
      
    }
    callback(twitchVideos);
  }

  getTwitchInfo = async(twitchVideos) => {
    const { getTwitchUserInfo, getTwitchStreamInfo, getTwitchGameInfo } = this.props;
    let promises = await Promise.all(twitchVideos.map(async video_id=>{
      return {
        res : await getTwitchUserInfo(video_id, "login"),
        video_id
      }
    }))
   
    let promises1 = await Promise.all(promises.map(async ({res, video_id})=>{
      if(res.data.length === 0) {
        return {
          user_id : null,
          user_name : null,
          video_id : null,
          video_title : null,
          description : null,
          thumbnail : null,
        }
      }
      else {
        return {
          user_id : res.data[0].id,
          user_name : res.data[0].display_name,
          video_id : video_id,
          video_title : res.data[0].display_name,
          description : res.data[0].display_name,
          thumbnail : res.data[0].offline_image_url,
        }
      }
    }))
    let promises2 = await Promise.all(promises1.map(async (promise)=>{
      return {
        res : await getTwitchStreamInfo(promise.user_id),
        data : promise
      }
    }))
    let promises3 = await Promise.all(promises2.map(async ({res,data})=>{
      if(res.data.length !== 0 ) {
        return {
          game : await getTwitchGameInfo(res.data[0].game_id),
          res,
          data
        }
      }
      else {
        return {
          game : null,
          res,
          data,
        }
      }
    }))
    let promises4 = await Promise.all(promises3.map(async ({res, data, game})=>{
      let user_name = data.user_name;
      if(game !== null ) {
        let language = res.data[0].language;
        let game_name = game.data.length === 0 ?  'game' : game.data[0].name;
        let video_title = `${user_name} playing ${game_name} in ${language} is live now`;
        let thumbnail_url = res.data[0].thumbnail_url;
        thumbnail_url = thumbnail_url.replace("{width}","300");
        thumbnail_url = thumbnail_url.replace("{height}","300");
        return {
          live_now : 1,
          video_id : data.video_id,
          video_title : video_title,
          description : data.description,
          thumbnail : thumbnail_url,
          tags : data.video_title,
          game : game_name
        }
      }
      else {
        let video_title = `${user_name} is offline`;
        return {
          live_now : 0,
          video_id : data.video_id,
          video_title : video_title,
          description : data.description,
          thumbnail : data.thumbnail,
          tags : null,
          game : null,
        }
      }
    }))
    // let promises5 = await Promise.all(promises4.map(async (video)=>{
    //   return {
    //     res : await updateTwitchInfo(video)
    //   }
    // }))
    return promises4;
  }

  onUserSelect = (e) => {

    this.props.selectGridset(e.target.value);

    this.setState({
      user: e.target.value,
      selectPlaylist : 0
    }, () => {
      this.loadPlayListFromDB();
    })
  }

  onLayoutSelect = (e) => {
    const { onLayoutSelect } = this.props;
    
    onLayoutSelect(e);
  }

  pauseVideos = (pause) => {
    this.setState({ 
      paused: new Array(8).fill(pause),
      playAll : !pause,
      pauseAll : pause
    });
  }

  expandVideo = (index) => {
    const { activeVideo, playlist } = this.state;

    if(playlist.length === 0) return null;

    if (activeVideo !== index) {
      const cube = document.getElementById(`iCube${index + 1}`);
      if (cube === null) return;

      this.addLog("Featured video on cube " + (index + 1));
      this.setState({ activeVideo: index });
    } else {
//      this.addLog("Unfeatured video on cube " + (index + 1));
      this.setState({ activeVideo: -1 });
    }
  }

  activateAudio = (index) => {
    
    const { muted, paused } = this.state;
    const { playlist, video, showPlaylist, activeVideo } = this.state;
  

    console.log('playlist_selected', showPlaylist);
    console.log('video_shown_in_main', activeVideo);
    console.log('video_playing_index_in_playlist', video);
    console.log('playlist', playlist);
//    console.log('playlist_id', playlist_id);
    const current_video_index = video[index];
    const current_item = playlist[index].videos[current_video_index];
    console.log(current_item);
    

    
    if(current_item.type.toLowerCase() === 'podcast') // for podcast, mute/unmute it
    {
      const newMuted = new Array(8).fill(true);
      const newPaused = paused.slice(0); // make clone array
      if(paused[index] === true)
      {
        newPaused[index] = false;
        newMuted[index] = false;
        this.addLog("Featured audio on cube " + (index + 1));
      }
      else{
        newPaused[index] = true;
        newMuted[index] = true;
      }
      
      this.setState({ muted: newMuted, paused: newPaused });
    }
    else{
      const newMuted = new Array(8).fill(true);
      const newPaused = paused.slice(0); // make clone array
      if (muted[index]) {
        newMuted[index] = false;
        this.addLog("Featured audio on cube " + (index + 1));
      }
      
      for(let i = 0;i < 4; i ++)
      {
        if( i !== index && playlist[i] !== null && playlist[i].videos.length > 0)
        {
          const video_index = video[i];

          const item = playlist[i].videos[video_index];
          if(item.type.toLowerCase() === 'podcast')
          {
            newPaused[i] = true;
          }
        } 
      }
      this.setState({ muted: newMuted, paused: newPaused });
    }
    
    
  }

  hideFromPreview = (index) => {
    const { playlist, playlists, video, hide_filter } = this.state;
    const { hidePlaylistItem } = this.props;
    const indexInList = video[index];
    const playlist_id = playlist[index].id;
    const video_id = playlist[index].videos[indexInList].id;
    const hideValue = !playlist[index].videos[indexInList].hidden;

    let video_title = playlist[index].videos[indexInList].title;
    let playlist_title = playlists[index].name;

    this.addLog("Set " + video_title + " hidden in " + playlist_title);

    hidePlaylistItem(playlist_id, video_id, hideValue, hide_filter)
    .then( res => {
      const { gridsets, user, showPlaylist, playlist} = this.state;
      const { setPlaylistForCube } = this.props;
      setPlaylistForCube(gridsets[user].id, showPlaylist + 1, playlist_id)
        .then(res => {
          playlist[index] = {
            id: playlist_id,
            videos: res.videos
          };
          const playlistItems = playlist[index].videos;
          if (showPlaylist === index)
          {
            this.setState({ playlist, items:playlistItems});
          }
          else{
            this.setState({ playlist, });
          }
        })
    })
    .catch( err => {
      console.log(err);
    })
  }

  dotFromPreview = (index) => {
    const { playlist, video, playlists } = this.state;
    const { setPlaylistRating } = this.props;
    const indexInList = video[index];
    const playlist_id = playlist[index].id;
    const video_id = playlist[index].videos[indexInList].id;
    let value = playlist[index].videos[indexInList].dotted;
    
    
    let video_title = playlist[index].videos[indexInList].title;
    let playlist_title = playlists[index].name;

    this.addLog("Dotted " + video_title + " in " + playlist_title);
    value = value === 1 ? 0 : 1;
    setPlaylistRating(value, video_id)
    .then( res => {
      const { gridsets, user, showPlaylist, playlist} = this.state;
      const { setPlaylistForCube } = this.props;
      setPlaylistForCube(gridsets[user].id, showPlaylist + 1, playlist_id)
        .then(res => {
          playlist[index] = {
            id: playlist_id,
            videos: res.videos
          };

          const playlistItems = playlist[index].videos;
          if (showPlaylist === index)
          {
            this.setState({ playlist, items:playlistItems});
          }
          else{
            this.setState({ playlist, });
          }
        })
    })
    .catch( err => {
      console.log(err);
    })
  }

  showInterface = (index) => {
    const { playlist, video } = this.state;
    const indexInList = video[index];
    const interfaceUrl = playlist[index].videos[indexInList].interface;
    window.open(interfaceUrl, 'name');
    this.setState({ showInterface: index });
    setTimeout(() => {
      this.setState({ showInterface: -1 });
    }, 5000);
  }

  showPlaylist = (index) => {

    const { playlist } = this.state;
    if(this.state.settingsHeight === "hide")
    {
      this.setState({ settingsHeight: "short"});
    }
    const { getPlaylistInfo } = this.props;
    const playlist_id = playlist[index].id;
    getPlaylistInfo(playlist_id)
    .then(res=>{
      this.setState({
        gspn:res.gspn,
        title:res.title,
      })
    })
    .catch(err=>{console.log(err);})
    const playlistAssigned = this.state.playlist[index] !== null && this.state.playlist[index] !== undefined;
    this.setState({ showPlaylist: index,
                    selectPlaylist : index,
                    items: playlistAssigned && this.state.playlist[index].videos,
                    openPlaylist : true,
                    dot_filter : false,
                    hide_filter : false,
                    search_value : '',
                  });
    this.addLog('Displayed C' + (index+1) + ' in playlist window');
  }

  onVideoEnd = async (index) => {
    const { playlist, video } = this.state;
    video[index] += 1;
    if (video[index] === playlist[index].videos.length) {
      video[index] = 0;
    }
    if(playlist[index].videos.length !==0 && playlist[index].videos[video[index]].type === "twitch_live") {
      let promises = await this.getTwitchInfo([playlist[index].videos[video[index]].url]);
      playlist[index].videos[video[index]].live_now = promises[0].live_now;
        // items[index].game = promises[0].game;
        playlist[index].videos[video[index]].description = promises[0].description;
        playlist[index].videos[video[index]].thumb = promises[0].thumbnail;
        playlist[index].videos[video[index]].title = promises[0].video_title;
        this.setState({ video })
    }
    else {
      this.setState({ video })
    }
    
  }

  onNextVideo = async (index) => {
    
    const { playlist, video } = this.state;
    video[index] += 1;
    if (video[index] === playlist[index].videos.length) {
      video[index] = 0;
    }
    if(playlist[index].videos.length !==0 && playlist[index].videos[video[index]].type === "twitch_live") {
      let promises = await this.getTwitchInfo([playlist[index].videos[video[index]].url]);
      playlist[index].videos[video[index]].live_now = promises[0].live_now;
        // items[index].game = promises[0].game;
        playlist[index].videos[video[index]].description = promises[0].description;
        playlist[index].videos[video[index]].thumb = promises[0].thumbnail;
        playlist[index].videos[video[index]].title = promises[0].video_title;
        this.setState({ video })
    }
    else {
      this.setState({ video })
    }
  }

  onPrevVideo = async (index) => {
    const { playlist, video } = this.state;
    video[index] -= 1;
    if (video[index] === -1) {
      video[index] = playlist[index].videos.length - 1;
    }
    if(playlist[index].videos.length !==0 && playlist[index].videos[video[index]].type === "twitch_live") {
      let promises = await this.getTwitchInfo([playlist[index].videos[video[index]].url]);
      playlist[index].videos[video[index]].live_now = promises[0].live_now;
        // items[index].game = promises[0].game;
        playlist[index].videos[video[index]].description = promises[0].description;
        playlist[index].videos[video[index]].thumb = promises[0].thumbnail;
        playlist[index].videos[video[index]].title = promises[0].video_title;
        this.setState({ video })
    }
    else {
      this.setState({ video })
    }
  }

  onPlaylistClick = async(index) => {
    const { showPlaylist, video, paused, items } = this.state;
    if (video[showPlaylist] !== index) {
      video[showPlaylist] = index;
      paused[showPlaylist] = false;
      if(items[index].type === "twitch_live")
      {
        let promises = await this.getTwitchInfo([items[index].url]);
        items[index].live_now = promises[0].live_now;
        // items[index].game = promises[0].game;
        items[index].description = promises[0].description;
        items[index].thumb = promises[0].thumbnail;
        items[index].title = promises[0].video_title;
        this.setState({ video, paused });
      }
      else {
        this.setState({ video, paused });
      }
    }
  }

  onPlaylistSelect = (e) => {
    
    const index = e.target.selectedIndex;
    const playlist_id = +e.target.value;
    const { gridsets, user, showPlaylist, playlist, video } = this.state;
    const { setPlaylistForCube, getPlaylistInfo } = this.props;
    setPlaylistForCube(gridsets[user].id, showPlaylist + 1, playlist_id)
      .then(async res => {
        playlist[showPlaylist] = {
          id: playlist_id,
          videos: res.videos
        };
        video[showPlaylist] = 0;
        const playlistItems = playlist[showPlaylist].videos;
        if(playlist[showPlaylist].videos.length !== 0 && playlist[showPlaylist].videos[0].type === "twitch_live")
        {
          let promises = await this.getTwitchInfo([playlist[showPlaylist].videos[0].url]);
          playlistItems[0].live_now = promises[0].live_now;
          // playlistItems[0].game = promises[0].game;
          playlistItems[0].description = promises[0].description;
          playlistItems[0].thumb = promises[0].thumbnail;
          playlistItems[0].title = promises[0].video_title;
          this.setState({ playlist, video, items:playlistItems, hide_filter : false, dot_filter : false, search_value : '' });
          getPlaylistInfo(playlist_id)
          .then(res=>{
            this.addLog("Loaded " + res.title + " in C" + (showPlaylist+1));
            this.setState({
              gspn:res.gspn,
              title:res.title,
              selectPlaylist : index,
            })
          })
          .catch(err=>{console.log(err);})
        }
        else {
          this.setState({ playlist, video, items:playlistItems, hide_filter : false, dot_filter : false, search_value : '' });
          getPlaylistInfo(playlist_id)
          .then(res=>{
            this.addLog("Loaded " + res.title + " in C" + (showPlaylist+1));
            this.setState({
              gspn:res.gspn,
              title:res.title,
              selectPlaylist : index,
            })
          })
          .catch(err=>{console.log(err);})
        }
      })
  }

  logout = () => {
    this.props.logoutUser()
    this.props.hideNotificationMessage()
    this.props.history.replace('/')
  }

  
  renderMobileVideoItem = (index) => {
    
    const { playlist, video, muted, paused, activeVideo } = this.state;
    if (playlist.length === 0 || playlist[index] === null || playlist[index].videos.length === 0) {
      return (
        <div name={`iCube${index + 1}`} className="VideoBox">
        </div>
      )
    }
    let videoClassName = "WinCube"

    if(index === activeVideo)
    {
      videoClassName = "Win1cube"
      videoClassName += " " + this.state.settingsHeight;
    }
    const videoItem = playlist[index].videos[video[index]];
    let videoElement = null;
    switch (videoItem.type) {
      case 'ustream':
        videoElement = (
          <Ustream
          className={videoClassName}
            id={`iCube${index + 1}`}
            url={videoItem.url}
            muted={muted[index]}
            paused={paused[index]}
            onEnd={() => { this.onVideoEnd(index); }}
          />
        );
        break;
      case 'Andmoor':
        videoElement = (
          <div className={videoClassName + ` facebook`} id={`iCube${index + 1}`}>
            <Andmoor
              url={videoItem.url}
              muted={muted[index]}
              paused={paused[index]}
              onEnd={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'facebook':
        videoElement = (
          <div className={videoClassName + ` facebook`} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
              controls
              width='100%'
              height='100%'
              url={videoItem.interface}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'dailymotion':
        videoElement = (
          <div className={videoClassName} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
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
            <div className={videoClassName} id={`iCube${index + 1}`}>
                <StaticTwitch
                  url={`${videoItem.thumb ? videoItem.thumb : images.placeholderThumb}`}
                  onEnded={() => { this.onVideoEnd(index); }}
                />
            </div>
          )
        }
        else{
          videoElement = (
            <div className={videoClassName} id={`iCube${index + 1}`}>
              <ReactPlayer
                playing={!paused[index]}
                volume={1}
                muted={muted[index]}
                controls
                width='100%'
                height='100%'
                url={`${videoItem.interface}`}
              />
            </div>
          );
        }
        break;
      case 'twitch':
        videoElement = (
          <div className={videoClassName} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
              controls
              width='100%'
              height='100%'
              url={`https://www.twitch.tv/videos/${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'vimeo':
        videoElement = (
          <div className={videoClassName} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
              controls
              width='100%'
              height='100%'
              url={`https://player.vimeo.com/video/${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
      case 'wista':
        videoElement = (
          <div className={videoClassName} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
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
          <div className={videoClassName} id={`iCube${index + 1}`}>
           <TwitterVideoEmbed id={videoItem.url} options={{width:100}} />
           <button className="nextButton" onClick={() => this.onVideoEnd(index)}>Next</button>
          </div>
        );
        break;
      case 'html':
          if(index !== activeVideo)
          {
              videoClassName += ` html tethyrpreviewsmall`
          }
          videoElement = (
            <div className={videoClassName} id={`iCube${index + 1}`}>
              <Iframe url={`${videoItem.interface}`}
                width="100%"
                height="100%"
                className="myClassname"
                allow="fullscreen"
                display="initial"
                position="relative"
                onLoad={
                  (e) => {
//                    console.log(e.target);
                    e.target.contentWindow.postMessage('hello', "*");
                  }
                }
                />

            </div>
          );
        break;
        case 'slide':
          if(index !== activeVideo)
          {
              videoClassName += ` html tethyrpreviewsmall`
          }
          videoElement = (
            <div className={videoClassName} id={`iCube${index + 1}`}>
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
          if(muted[index] === true && paused[index] === false)
          {
            paused[index] = true;
            this.setState({paused: paused});
          }
          videoElement = (
            <div className={videoClassName} id={`iCube${index + 1}`}>
              <span className="cubePodcastTitle">
                  {videoItem.title + ' : ' + videoItem.episode_title}
              </span>
              <ReactPlayer
                playing={!paused[index]}
                volume={1}
                muted={muted[index]}
                controls
                width='100%'
                height='30%'
                url={`${videoItem.interface}`}
                onEnded={() => { this.onVideoEnd(index); }}
              />   
            </div>
          );
        break;
      case 'Image':
          videoElement = (
            <div className={videoClassName + ` html tethyrpreviewsmall`} id={`iCube${index + 1}`}>
              <div className="ImageThumb">

                <img src={videoItem.thumb} style={{width : "100%", height : "100%"}} alt="Thumbnail"/>

              </div>
              
              <Iframe url={`${videoItem.interface}`}
                width="100%"
                height="100%"
                className="myClassname"
                allow="fullscreen"
                display="initial"
                position="relative"
                onLoad={
                  (e) => {
                    console.log(e.target);
                    e.target.contentWindow.postMessage('hello', "*");
                  }
                }
                />

            </div>
          );
        break;
      case 'youtube':
      default:
        videoElement = (
          <div className={videoClassName} id={`iCube${index + 1}`}>
            <ReactPlayer
              playing={!paused[index]}
              volume={1}
              muted={muted[index]}
              controls
              width='100%'
              height='100%'
              url={`https://www.youtube.com/watch?v=${videoItem.url}`}
              onEnded={() => { this.onVideoEnd(index); }}
            />
          </div>
        );
        break;
    }

    return (
        <div name={`iCubeMobile`}  className="MobileVideoBox">
          {videoElement}
        </div>
    );
  }

  
 
  onSortEnd = ({oldIndex, newIndex}) => {
    console.log('sortend', oldIndex, newIndex);

    
    const { reorderPlaylist } = this.props;
    const { playlist, playlists, showPlaylist, video, hide_filter} = this.state;
    const playlist_id = playlist[showPlaylist].id;
    let newOrder = playlist[showPlaylist].videos[newIndex].order;
    let oldOrder = playlist[showPlaylist].videos[oldIndex].order;
    
    let video_title = playlist[showPlaylist].videos[oldIndex].title;
    let playlist_title = playlists[showPlaylist].name;
    this.addLog("Set order id of " + video_title + " to " + newIndex + " in " + playlist_title);

    if(oldIndex === video[showPlaylist])
    {
      video[showPlaylist] = newIndex;
    }
    else if(oldIndex < video[showPlaylist] && newIndex >= video[showPlaylist])
    {
      video[showPlaylist] -= 1;
    }
    else if(oldIndex > video[showPlaylist] && newIndex <= video[showPlaylist])
    {
      video[showPlaylist] += 1;
    }
    else {
      
    }
   
    playlist[showPlaylist] = {
      id: playlist_id,
      videos: arrayMove(this.state.playlist[showPlaylist].videos, oldIndex, newIndex)
    };
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
      playlist,
      video
    });

    reorderPlaylist(playlist_id,  newOrder, oldOrder, hide_filter)
    .then(res=>{
        //nothing
    })
    .catch((err)=>{ console.log(err); })

  };

  //show the full description of the playlist item
  toggleLines = (value, index, e) => {
    e.stopPropagation();
    value.expanded = !value.expanded;
    this.setState({
    });
  }

  handleTruncate = (truncated) => {
    if (this.state.truncated !== truncated) {
      this.setState({
          truncated
      });
    }
  }
  

  //set the rating of the playlist item
  setRating = (value, id, index) => {
    const { items } = this.state;
    value = value === 1 ? 0 : 1;
    const { setPlaylistRating } = this.props;
    setPlaylistRating(value, id)
    .then( res => {
      items[index].dotted = value;
      this.setState({items});
    })
    .catch( err => {
      console.log(err);
    })
  }


  //remove the item from the playlist
  removeItem = (id, index) =>{
    const { playlist, showPlaylist, items, video } = this.state;
    const playlist_id = playlist[showPlaylist].id;
    const { removePlaylistItem } = this.props;

    removePlaylistItem(playlist_id, id)
    .then( res => {
      items.splice(index, 1);
      if(items[index] === undefined)
      {
        video[showPlaylist] = 0;
      }
      this.setState({
        items,
        video
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

   //broke the video
   brokenItem = (id, index) =>{
    const { playlist, showPlaylist, items, video } = this.state;
    const playlist_id = playlist[showPlaylist].id;
    const { brokePlaylistItem } = this.props;

    brokePlaylistItem(playlist_id, id)
    .then( res => {
      items.splice(index, 1);
      if(items[index] === undefined)
      {
        video[showPlaylist] = 0;
      }
      this.setState({
        items,
        video
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  
  search = () => {
    const { searchContent } = this.state;

    if (searchContent === true)
    {
      this.setState({
        searchContent : !searchContent
      })
    }
    else {
      this.setState({
        searchContent : !searchContent,
        addPlaylist : searchContent
      })
    }
  }


  addPlaylistStatus = (value) => {

    if (value === true)
    {
      this.setState({
        addPlaylist : !value
      })
    }
    else {
      this.setState({
        searchContent : value,
        addPlaylist : !value
      })
    }
    
  }

  playlistItems = (videos, position, id) => {
    const { playlist, showPlaylist, video } = this.state;
    const playlist_id = playlist[showPlaylist].id;
    playlist[showPlaylist] = {
      id: playlist_id,
      videos: videos
    };
    if (position === 0 )
    {
      if(videos.length > 1) {
        video[showPlaylist] += 1;
      }
      
    }
    this.setState({
      playlist,
      playlist_id : id,
      items : videos,
    })
  }

  hidePlaylist = (id, hideValue) => {
    const { playlist, showPlaylist, hide_filter } = this.state;
    const playlist_id = playlist[showPlaylist].id;
    const { hidePlaylistItem } = this.props;
    hideValue = !hideValue;
    hidePlaylistItem(playlist_id, id, hideValue, hide_filter)
    .then( res => {
      playlist[showPlaylist] = {
        id: playlist_id,
        videos: res.videos
      };
      this.setState({
        playlist,
        items : res.videos,
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  dotFilter = () => {
    const { dot_filter, hide_filter, search_value, playlist, showPlaylist, video } = this.state;
    const { search_filter } = this.props;
    const playlist_id = playlist[showPlaylist].id;
    search_filter(!dot_filter, hide_filter, search_value, playlist_id, )
    .then((res) => {
      
      playlist[showPlaylist] = {
        id: playlist_id,
        videos: res.videos
      };
      video[showPlaylist] = 0;
      this.setState({
        playlist,
        items : res.videos,
        dot_filter: !dot_filter,
        video
      })
    })
    .catch({

    })
  }

  hideFilter = () => {
    const { dot_filter, hide_filter, search_value, playlist, showPlaylist, video } = this.state;
    const { search_filter } = this.props;
    const playlist_id = playlist[showPlaylist].id;
    search_filter(dot_filter, !hide_filter, search_value, playlist_id)
    .then((res) => {
      playlist[showPlaylist] = {
        id: playlist_id,
        videos: res.videos
      };
      video[showPlaylist] = 0;
      this.setState({
        playlist,
        items : res.videos,
        hide_filter: !hide_filter,
        video
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  searchFilter = (e) => {
    let value = e.target.value;
    const { dot_filter, hide_filter, playlist, showPlaylist, video } = this.state;
    const { search_filter } = this.props;
    const playlist_id = playlist[showPlaylist].id;
    search_filter(dot_filter, hide_filter, value, playlist_id, dot_filter)
    .then((res) => {
      
      playlist[showPlaylist] = {
        id: playlist_id,
        videos: res.videos
      };
      if (playlist[showPlaylist].videos[video[showPlaylist]]=== undefined)
      {
        video[showPlaylist] = 0;
      }
      this.setState({
        playlist,
        items : res.videos,
        search_value : value,
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }
   
  itemInterface = (item) => {
    const interfaceUrl = item.interface;
    window.open(interfaceUrl, 'name');
  }

  addNewPlaylist = (playlists) => {
    const { getPreview } = this.props;
    const { gridsets, user } = this.state;
    getPreview(gridsets[user].id)
      .then(({ playlist }) => {
        if(!playlist[0]) {
          this.setState({
            playlists : [],
            playlist : [],
          })
        }
        else {
          this.setState({
            playlists,
            playlist,
          })
        }
      })
  }

  resetPlaylist = () => {
      const { resetDefaultPlaylist, setPlaylistForCube } = this.props;
      const { gridsets, user, showPlaylist, playlist, video } = this.state;
      const playlist_id = playlist[showPlaylist].id;
      resetDefaultPlaylist(playlist_id)
      .then(res=>{
          this.setState({
              modalIsOpen : false,
          })
          if(!res.gspn){
            alert("This playlist doesn't have any videos!!!");
            playlist[showPlaylist] = {
              id: playlist_id,
              videos: []
            };
            video[showPlaylist] = 0;
            this.setState({ playlist, video, items:[], hide_filter : false, dot_filter : false, search_value : '' });
          }
          else{
            const title = res.title;
            const gspn = res.gspn;
            setPlaylistForCube(gridsets[user].id, showPlaylist + 1, playlist_id)
              .then(res => {
                playlist[showPlaylist] = {
                  id: playlist_id,
                  videos: res.videos
                };
                video[showPlaylist] = 0;
                const playlistItems = playlist[showPlaylist].videos;
                this.setState({ playlist, video, items:playlistItems, hide_filter : false, dot_filter : false, search_value : '' });
                alert(`[${title}][${gspn}] successfully reset to default`);
              })
            .catch(err=>{console.log(err);})
          }
      })
      .catch(err=>{ console.log(err); })
  }

  handleSettingsHeightChange = (val) => {
    this.setState( {settingsHeight: val} );
    const node = ReactDOM.findDOMNode(this);
    // Get child nodes
    let Win1cube = null;
    let Win1 = null;
    let videoResult = null;
    if (node instanceof HTMLElement) {
      Win1cube = node.querySelector('.Win1cube');
      
      if(Win1cube != null)
      {
        Win1cube.classList.remove('hide');
        Win1cube.classList.remove('short');
        Win1cube.classList.remove('medium');
        Win1cube.classList.remove('tall');
        Win1cube.classList.remove('full');
      }
      
      Win1 = node.querySelector('.Win1');
      if(Win1 != null)
        Win1.className = 'Win1';
      videoResult = node.querySelector('.video-result');
        if(videoResult != null)
        videoResult.className = 'video-result';

      this.addLog("Set playlist height as " + val);

      if(Win1cube != null)
      {
        Win1cube.classList.add(val);
      }
      if(Win1 != null)
      {
        Win1.classList.add(val);
      }
      if(videoResult != null)
      {
        videoResult.classList.add(val);
      }

    }

  }

  handleThumbSizeChange = (val) => {
//    alert(val);
//    document.getElementsByClassName(".pl_content_part .pl_titleThumb img").style.width="130px";
//    document.getElementsByClassName(".pl_content_part .pl_titleThumb img").style.height="73px";
    this.addLog("Set thumbnail size as " + val);
    this.setState( {thumbSize: val} );
  }

  handleZoomLevelChange = (val) => {
    let zoomVal = 1
    if(val === 'large')
      zoomVal = 1
    else if(val === 'xlarge')
      zoomVal = 1.2
    else if(val === 'normal')
      zoomVal = 0.9
    else if(val === 'small')
      zoomVal = 0.8
    else if(val === 'tiny')
      zoomVal = 0.7

    document.body.style.zoom = zoomVal;
    document.body.style['-moz-transform'] = 'scale(' + zoomVal + ')';
    
    this.setState( {zoomLevel: val} );
  }

  updatedItems = (items) => {
    console.log("items==", items);
    this.setState({
      items,
    })
  }

  updatePlaylist = (selectPlaylist) => {
    const { playlists } = this.state;
    playlists[selectPlaylist].playlist_auto_update = playlists[selectPlaylist].playlist_auto_update === 0 ? 1 : 0;
    this.setState({
      playlists
    })
  }

  addvideoToPlaylist = (items) => {
    this.setState({
      items
    })
  }

  addLog = (message) => {
    this.state.logs.unshift(message);
    
  }

  // onSwipedRight(item) {
  //   item.swiping = false;
  //   this.hidePlaylist(item.id, item.hidden)
  
  // }

  // onSwiped(item) {
  //   item.swiping = false;
  //   this.setState({});
  // }

  // onSwiping(item) {
  //   if(item.swiping)
  //     return;
  //   item.swiping = true;
  //   this.setState({});
  // }

  collapse = (val) => {
    const {isCollapsed} = this.state; 
    if (val !== isCollapsed)
      this.setState({isCollapsed: val})
  }

  render() {
    const {  showPlaylist, playlist, playlists, video, gridsets, items,   isCollapsed} = this.state;  
    
    const DragHandle = sortableHandle(() => <img className="swapOrder" src={images.playlistControlsDrag} alt="swapOrderImage" title="drag to reorder"    />);
   
    //const lines = 3;

    // let config = {
    //   delta: 1,                             // min distance(px) before a swipe starts
    //   preventDefaultTouchmoveEvent: true,   // preventDefault on touchmove, *See Details*
    //   trackTouch: true,                      // track touch input
    //   trackMouse: true,                     // track mouse input
    //   rotationAngle: 0,                      // set a rotation angle
    // }

    const SortableItem = sortableElement(({item, idx, className1, description , length, authorImage, thumbnailBox}) => (
      // <Swipeable
      //   onSwiped={() => this.onSwiped(item)}
      //   onSwipedRight={() => this.onSwipedRight(item)}
      //   onSwiping={() => this.onSwiping(item)}
      //   {...config}
      // >
      
        <div key={idx} onClick={() => this.onPlaylistClick(idx)} className={item.swiping ? className1 + ' swiping' : className1}>
        
            <div className="pl_top_part" >
              <div className="pl_platform">
                <img src={require(`../../resources/images/broadcasters/` + item.type.toLowerCase() + `.png`)} alt={item.type}/>
              </div>
              
              <div className="pl_title" >
              { item.type.toLowerCase() === 'podcast' ? item.title + ' : ' + item.episode_title : item.title}
              </div>
              <div className="pl_author pull-right">
                <div className="pl_authorImg">
                  {authorImage}
                </div>
                <div className="pl_authorName">{item.author}</div>
              </div>
            </div>
            
 

            {/* <div className="pl_content_part">
              {thumbnailBox}
              <div className="pl_description">
                <Truncate 
                  lines={!item.expanded && lines} 
                  ellipsis={<span>... <button className="pl_expand_btn" onClick={(e) => this.toggleLines(item, idx, e)}>Click to expand</button></span>}
                  >
                  <div dangerouslySetInnerHTML={{ __html: item.description }}>
                  </div>

                  {item.expanded && (
                    <span className="less-btn-box"> <button className="pl_expand_btn" onClick={(e) => this.toggleLines(item, idx, e)}>Show Less</button></span>
                )}
                </Truncate>

                { item.expanded && <div className="pl_category">CATEGORY <span className="white">Trees and Shrubbery</span> TAGS <span className="white"> Rules, Dogs, Hats, Get Over Here, Killers</span></div> }
                

              </div>
              
            </div> */}
            
            <div className="pl_bottom_part">
                <div className="pl_length pull-left">{length} {item.sponsored === 1 && <span className="sponsoredText">SPONSORED</span>}</div>
              <div className="pl_icons pull-right">
                <img onClick={(value, id, index) => this.setRating(item.dotted, item.id, idx)}  src={item.dotted ? images.playlistControlsDotOn : images.playlistControlsDotOff} className="rating" alt="ratingRadio" title="Dot this" />
                <img onClick={ (id, hideValue) => this.hidePlaylist(item.id, item.hidden)}  src={item.hidden ? images.playlistControlsHideOn : images.playlistControlsHideOff} className="hidePlaylist" alt="hidePlaylist" title="Hide this" />
                <img onClick={(id, index) => this.brokenItem(item.id, idx)} src={images.broken} className="broken" alt="brokenBtn" title="Flag this"/>
                <img onClick={(id, index) => this.removeItem(item.id, idx)} src={images.playlistControlsTrash} className="remove" alt="removeBtn" title="Remove this"/>
                <img src={images.interface_link} onClick={() =>this.itemInterface(item)} className="interface_link" alt="interfaceBtn" title="Open Source"/>
                
                
                <DragHandle />
                
              </div>

            </div>
            
        </div>

      // </Swipeable>
    ));
    const SortableContainer = sortableContainer(({children}) => {
      return <div>{children}</div>;
    });
    const filteredUsers = gridsets.filter(usr => usr.active === 1);

  
    const list = items.map((item, idx) => {
      let className1 = idx < video[showPlaylist] ? 'play_past' : (idx === video[showPlaylist]  ? 'play' : 'play_itemondeck');
     
      if(item.sponsored === 1)
      {
        className1 += " sponsored";
      }
      let description = item.description;
      let hour = 0;
      let min = Math.floor(item.length / 60);
      const sec = item.length - min * 60;
      if (min > 60) {
        hour = Math.floor(min / 60);
        min = min % 60;
      }
      const length = item.length !== -1 ? `${hour !== 0 ? `${hour}h` : ''}${min}m${sec}s` : 'na';
//      console.log(item);

      
      let authorImage;

      if (item.author_img === '' || item.author_img === null) {
        authorImage = <img src={images.placeholderAuthorImg} alt="authorImage"/>;
      } else {
        authorImage = <img src={item.author_img} alt="authorImage"/>;
      }

      let thumbnailImage;

      if (item.thumb === '' || item.thumb === null) {
        thumbnailImage = <img src={images.placeholderThumb} alt="videoThumb"/>;
      } else {
        thumbnailImage = <img src={item.thumb} alt="videoThumb"/>;
      }

      let thumbnailBox;
      if (this.state.thumbSize === 'small') {
        thumbnailBox = <div className="pl_titleThumb">
          {thumbnailImage}
        </div>
      } else if (this.state.thumbSize === 'medium') {
        thumbnailBox = <div className="pl_titleThumb medium">
          {thumbnailImage}
        </div>
      } else if (this.state.thumbSize === 'large') {
        thumbnailBox = <div className="pl_titleThumb large">
          {thumbnailImage}
        </div>
      }
      
      return (
        <SortableItem key={idx} index={idx}  item={item} idx={idx} className1={className1} description={description} length={length} authorImage={authorImage} thumbnailBox={thumbnailBox}/>
      )
    })
    // const Data = items.map((item, idx) => ({
    //     gspn,
    //     order : idx,
    //     gsvn : item.gsvn,
    //     title : item.title,
    //     type : item.type,
    //     interface : item.interface
    // }));
    // const headers = [
    //     { label: "GSPN", key: "gspn" },
    //     { label: "Order", key: "order" },
    //     { label: "GSVN", key: "gsvn" },
    //     { label: "Video Title", key: "title" },
    //     { label: "Broadcaster", key: "type" },
    //     { label: "Interface Link", key: "interface" }
    //   ];
    //var today = new Date();
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //var dateTime = date+' '+time;
    //var csv_title = title.substring(0, 9);
    //const fileName = `${gspn}_u${user_id}_${dateTime}_${csv_title}`;

   
    return (
      <div className="M1">

        <TopHeaderBar 
          filteredUsers={filteredUsers}
          user={this.props.user}
          playAll={this.state.playAll}
          pauseAll={this.state.pauseAll}
          pauseVideos={this.pauseVideos}
          onLayoutSelect={this.onLayoutSelect}
          onUserSelect={this.onUserSelect}
          logout={this.logout}
          active="M1"
          scene = 'viewer'
          />
        <div className="selectGridsetMobile">
            <label>Playlist Group :</label>
            <select value={this.props.user} onChange={this.onUserSelect} alt='select gridset'>
            {
                filteredUsers.map((user, idx) => (
                <option key={idx} value={idx}>{user.name}</option>
                ))
            }
            </select>
        </div>
        {
          (showPlaylist !== -1 && playlist[0] !== null && playlist.length !== 0) &&
          <div className="selectPlaylist">
            <label>Playlist :</label>
            <select value={playlist[showPlaylist].id} onChange={this.onPlaylistSelect}>
              {
                playlists.map((list, idx) => {
                  return <option key={idx} value={list.id}>{list.name}</option>;
                })
              }
            </select>
          </div>
        }
        

        <div name="Player" className={isCollapsed ? 'MobilePlayer Collapsed' : 'MobilePlayer'}>
          {this.renderMobileVideoItem(0)}
        </div>

        <div className={isCollapsed ? 'playButton nextPlayButton Collapsed' : 'playButton nextPlayButton '}>
          
          { isCollapsed && 
            <img src={images.btnMobileCollapseUp} onClick={() => this.collapse(false) } className="collapseBtn" alt="collapse Up Button"/>
          }
          { !isCollapsed && 
            <img src={images.btnMobileCollapseDown} onClick={() => this.collapse(true)} className="collapseBtn" alt="collapse Down Button"/>
          }
          
          <img src={images.btnMobilePlaylistPrev} onClick={() => this.onPrevVideo(0) } className="prevnextBtn" alt="Prev Playlist Button"/>
          <img src={images.btnMobilePlaylistNext} onClick={() => this.onNextVideo(0) } className="prevnextBtn" alt="Next Playlist Button" style={{paddingLeft: '40px'}}/>

        </div>

      
        <div name="Playlist" className={isCollapsed ? 'MobilePlaylist Collapsed' : 'MobilePlaylist'} title="Playlist">
          
          {
            (showPlaylist !== -1 && playlist[0] !== null && playlist.length !== 0) &&
            
            <SortableContainer onSortEnd={this.onSortEnd}  useDragHandle>
              {list}
            </SortableContainer>
          
          }
        </div>
      
        
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getGridsets: bindActionCreators(getGridsets, dispatch),
  getPreview: bindActionCreators(getPreview, dispatch),
  getPlaylists: bindActionCreators(getPlaylists, dispatch),
  setPlaylistForCube: bindActionCreators(setPlaylistForCube, dispatch),
  reorderPlaylist: bindActionCreators(reorderPlaylist, dispatch),
  setPlaylistRating: bindActionCreators(setPlaylistRating, dispatch),
  removePlaylistItem: bindActionCreators(removePlaylistItem, dispatch),
  showOverlaySpinner: bindActionCreators(showOverlaySpinner, dispatch),
  hideOverlaySpinner: bindActionCreators(hideOverlaySpinner, dispatch),
  saveUserInfo: bindActionCreators(saveUserInfo, dispatch),
  checkUserInfo: bindActionCreators(checkUserInfo, dispatch),
  search_filter: bindActionCreators(search_filter, dispatch),
  hidePlaylistItem: bindActionCreators(hidePlaylistItem , dispatch),
  addNewToPlaylist: bindActionCreators(addNewToPlaylist, dispatch),
  createNewPlaylist: bindActionCreators(createNewPlaylist, dispatch),
  brokePlaylistItem: bindActionCreators(brokePlaylistItem, dispatch),
  resetDefaultPlaylist: bindActionCreators(resetDefaultPlaylist, dispatch),
  getPlaylistInfo: bindActionCreators(getPlaylistInfo, dispatch),
  getTwitchUserInfo: bindActionCreators(getTwitchUserInfo, dispatch), 
  getTwitchStreamInfo: bindActionCreators(getTwitchStreamInfo, dispatch), 
  getTwitchGameInfo: bindActionCreators(getTwitchGameInfo, dispatch),
  updateTwitchInfo: bindActionCreators(updateTwitchInfo, dispatch),
  checkPlaylistUpdate: bindActionCreators(checkPlaylistUpdate, dispatch),
  logoutUser: bindActionCreators(logoutUser, dispatch),
  hideNotificationMessage: bindActionCreators(hideNotificationMessage, dispatch),
})

export default withRouter(connect(null, mapDispatchToProps)(M1));
