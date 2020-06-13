import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import ReactPlayer from 'react-player'
import Iframe from 'react-iframe'
import { TwitterVideoEmbed } from 'react-twitter-embed';

import images from '../../../constants/images';

import Ustream from '../../../components/UstreamEmbed';
import Andmoor from '../../../components/AndmoorEmbed';
import StaticTwitch from '../../../components/StaticTwitchComponent';
import LogComponent from '../../../components/LogComponent'

import { checkUserPlaylistUpdate } from '../../../services/userPlaylist'

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

class MainView extends Component {
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
      importContent : false,
      searchContent : false,
      wikiContent : false,
      searchBg : false,
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
      gangedGridset : false,
      thumbSize : 'small',
      zoomLevel : 'normal',
      pauseAll : false,
      playAll : false,
      logs : []
    };

    this.handleSettingsHeightChange = this.handleSettingsHeightChange.bind(this);
    this.handleThumbSizeChange = this.handleThumbSizeChange.bind(this);
    this.handleZoomLevelChange = this.handleZoomLevelChange.bind(this);
  }
  
  componentDidMount() {
    document.body.style.zoom = 0.9;
    const layout = this.props.match.params.layout
    const playlist_group_id = this.props.match.params.playlist_group_id
    const playlist_id = this.props.match.params.playlist_id
    const video_id = this.props.match.params.video_id
    this.checkUpdate()
  }

  checkUpdate = () => {
    const { user } = this.props;
    const user_id = user.user.user_id;
    const token = user.user.token;
    checkUserPlaylistUpdate(user_id, token)
    .then(({success}) => {
      console.log(success)
    })
    .catch(err => console.log(err))
  }

  getGridsets = () => {
    const { getGridsets } = this.props;
    const { user } = this.state;
    getGridsets()
    .then(({ gridsets }) => {
      this.setState({
        gridsets
      }, () => {
        this.addLog("Loaded Gridset: " + gridsets[user].name);
        this.loadPlayListFromDB();
      });
    })
    .catch(err => console.log(err));
  }

  loadPlayListFromDB = () => {
    
    const { gridsets, user, showPlaylist } = this.state;
    const { getPreview, getPlaylists, hideOverlaySpinner, getPlaylistInfo} = this.props;
    
    if (gridsets.length === 0) {
      return;
    }

    const gangedGridset = gridsets[user].ganged_gridset === 1 ? true : false;
    getPreview(gridsets[user].id)
      .then(({ playlist }) => {
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
            if(playlists.length === 0) {
              this.setState({
                playlists : [],
                playlist : [],
              })
              return null;
            }
            else {
              this.getTwitchVideo(playlist,async(twitchVideos)=>{
                if(twitchVideos.length !== 0) {
                  let value = await this.getTwitchInfo(twitchVideos);
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
                    activeVideo : 0,
                    muted : [false, true, true, true, true, true, true, true],
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
                    activeVideo : 0,
                    muted : [false, true, true, true, true, true, true, true],
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
            }
          })
          .catch(err=>{console.log(err);})
        })
      .catch(err => console.log(err));
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
    const { getTwitchUserInfo, getTwitchStreamInfo, getTwitchGameInfo, updateTwitchInfo } = this.props;
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
    let promises5 = await Promise.all(promises4.map(async (video)=>{
      return {
        res : await updateTwitchInfo(video)
      }
    }))
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
      this.setState({ 
        activeVideo: index,
        searchContent : false,
        importContent : false,
        wikiContent : false
      });
    } else {
      this.setState({ activeVideo: -1 });
    }
  }

  activateAudio = (index) => {
    
    const { muted, paused } = this.state;
    const { playlist, video } = this.state;
  
    const current_video_index = video[index];
    const current_item = playlist[index].videos[current_video_index];

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
    const { playlist, video, gangedGridset } = this.state;
    if(gangedGridset) {
      if(index === 0) {
        const playing_id = video[index];
        let playing_video = [];
        if((video[index] + 1) === playlist[index].videos.length) {
          playing_video = new Array(8).fill(0);
          
          if(playlist[index].videos.length !==0 && playlist[index].videos[video[index]].type === "twitch_live") {
            let promises = await this.getTwitchInfo([playlist[index].videos[video[index]].url]);
            playlist[index].videos[video[index]].live_now = promises[0].live_now;
              // items[index].game = promises[0].game;
              playlist[index].videos[video[index]].description = promises[0].description;
              playlist[index].videos[video[index]].thumb = promises[0].thumbnail;
              playlist[index].videos[video[index]].title = promises[0].video_title;
              this.setState({ video : playing_video })
          }
          else {
            this.setState({ video : playing_video })
          }
        }
        else {
          playing_video = new Array(8).fill(playing_id + 1);
          if(playlist[index].videos.length !==0 && playlist[index].videos[video[index]].type === "twitch_live") {
            let promises = await this.getTwitchInfo([playlist[index].videos[video[index]].url]);
            playlist[index].videos[video[index]].live_now = promises[0].live_now;
              // items[index].game = promises[0].game;
              playlist[index].videos[video[index]].description = promises[0].description;
              playlist[index].videos[video[index]].thumb = promises[0].thumbnail;
              playlist[index].videos[video[index]].title = promises[0].video_title;
              this.setState({ video : playing_video })
          }
          else {
            this.setState({ video : playing_video })
          }
        }
      }
      else {
        return;
      }
    }
    else {
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
  }

  onPlaylistClick = async(index) => {
    const { showPlaylist, video, paused, items, gangedGridset } = this.state;
    if(gangedGridset) {
      const ganged_video = new Array(8).fill(index);
      const ganged_paused = new Array(8).fill(false);
      if(items[index].type === "twitch_live")
        {
          let promises = await this.getTwitchInfo([items[index].url]);
          items[index].live_now = promises[0].live_now;
          // items[index].game = promises[0].game;
          items[index].description = promises[0].description;
          items[index].thumb = promises[0].thumbnail;
          items[index].title = promises[0].video_title;
          this.setState({video : ganged_video, paused : ganged_paused})
        }
        else {
          this.setState({video : ganged_video, paused : ganged_paused});
        }
    }
    else {
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
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('username', '');
    const { history } = this.props;
    history.push('/login');
  }

  renderCube = (index) => {
    return (
      <div className="Cube" id={`CubeBox_${index+1}`}>
        <div className="MainBar">
          {this.renderVideoItem(index)}
          <div className="Tim" id={`Tim${index + 3}`}><img alt='button' src={images.timer} width="6" height="144" id={`C1${index+1}_TIM`} /></div>
        </div>
        {this.renderButtons(index)}
      </div>
    );
  }

  renderAudioCube = () => {
    return (
      <div className="AdCube Cube" id={`CubeBox_4`}>
        <img alt='button' className="imgBtn" width="256px" height="164px" src={images.audioCubeMockup} onClick={() => { }} />
      </div>
    );
  }

  renderAdCube = (index) => {
    return (
      <div className="AdCube Cube" id={`CubeBox_5`}>
        <img alt='button' className="imgBtn" width="256px" height="164px" src={images.adCubeMockup} onClick={() => { }} />
      </div>
    );
  }

  renderVideoItem = (index) => {
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
              url={`https://www.facebook.com/${videoItem.url}`}
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
                onEnded={() => { this.onVideoEnd(index); }}
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
              url={`${videoItem.interface}`}
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
              <div className="htmlTitle">

                {videoItem.title}

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
        <div name={`iCube${index + 1}`}  className="VideoBox">
          <div
            className={`VideoBg VideoBg--${index === activeVideo ? 'Show' : 'Hide'}`}
            style={{ backgroundImage: `url(${images.videoBg})` }}
          />
          {videoElement}
        </div>
    );
  }

  renderButtons = (index) => {
    const { muted, activeVideo, showPlaylist, playlist, video} = this.state;  
    
    return (
      <div className="ButtonBar" id={`C${index + 1}_BUT`}>
        {
          (playlist[index] !== null && playlist[index].videos.length !== 0) &&
          <React.Fragment>
            <img alt='button' className="imgBtn" src={activeVideo === index ? images.btnVideoActive : images.btnVideoInactive} width="65.5" height="20" onClick={() => { this.expandVideo(index) }} />
            <img alt='button' className="imgBtn" src={muted[index] ? images.btnAudioInactive : images.btnAudioActive} width="65.5" height="20" onClick={() => { this.activateAudio(index) }} />
            <img alt='button' className="imgBtn" src={showPlaylist === index ? images.btnPlaylistActive : images.btnPlaylistInactive} width="65.5" height="20" onClick={() => { this.showPlaylist(index) }} />
            <img src={ playlist[index].videos[video[index]].dotted  ? images.playlistControlsDotOn : images.playlistControlsDotOff } className="previewBtn" onClick={() => { this.dotFromPreview(index) }} alt="ratingRadio" title="Dot this"/> 
            <img src={ playlist[index].videos[video[index]].hidden  ? images.playlistControlsHideOn : images.playlistControlsHideOff} className="previewBtn" onClick={() => { this.hideFromPreview(index) }} alt="hideBtn" title="Hide this"/>
            <img src={images.interface_link} className="previewBtn" onClick={() => { this.showInterface(index) }} alt="interface_link" title="Open Source"/>
          </React.Fragment>
        }
        {
          (playlist[index] !== null && playlist[index].videos.length === 0) &&
          <React.Fragment>
            <img alt='button' className="imgBtn" src={images.btnVideoInactive} width="65.5" height="20" />
            <img alt='button' className="imgBtn" src={images.btnAudioInactive} width="65.5" height="20" />
            <img alt='button' className="imgBtn" src={showPlaylist === index ? images.btnPlaylistActive : images.btnPlaylistInactive} width="65.5" height="20" onClick={() => { this.showPlaylist(index) }} />
            <img src={ images.playlistControlsDotOff } className="previewBtn" alt="ratingRadio" title="Dot this"/>
            <img src={ images.playlistControlsHideOff} className="previewBtn" alt="hideBtn" title="Hide this"/>
            <img src={images.interface_link} className="previewBtn" alt="interface_link" title="Open Source"/>
          </React.Fragment>
        }
        {
          (playlist[index] === null) &&
          <React.Fragment>
            <img alt='button' className="imgBtn" src={images.btnVideoInactive} width="65.5" height="20" />
            <img alt='button' className="imgBtn" src={images.btnAudioInactive} width="65.5" height="20" />
            <img alt='button' className="imgBtn" src={images.btnPlaylistInactive} width="65.5" height="20"/>
            <img src={ images.playlistControlsDotOff } className="previewBtn" alt="ratingRadio" title="Dot this"/>
            <img src={ images.playlistControlsHideOff} className="previewBtn" alt="hideBtn" title="Hide this"/>
            <img src={images.interface_link} className="previewBtn" alt="interface_link" title="Open Source"/>
          </React.Fragment>
        }
      </div>
    );
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
      else {
        video[showPlaylist] = 0;
      }
    }
    this.setState({
      playlist,
      playlist_id : id,
      items : videos,
      video
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
    this.setState({
      playlists,
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
    this.setState({
      items,
    })
  }

  ImportVideos = () => {
    const { getPlaylistInfo, setPlaylistForCube } = this.props;
      const { gridsets, user, showPlaylist, playlists, playlist, video, selectPlaylist } = this.state;
      const playlist_id = playlist[showPlaylist].id;
      getPlaylistInfo(playlist_id)
      .then(res=>{
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
                playlists[selectPlaylist].playlist_auto_update = 0;
                this.setState({ playlists, playlist, video, items:playlistItems, hide_filter : false, dot_filter : false, search_value : '' });
                alert(`The videos from csv file imported to [${title}][${gspn}] successfully`);
              })
              .catch(err=>{console.log(err);})
        })
        .catch(err=>{console.log(err);})
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

  updateGangedGridset = () => {
    const { showOverlaySpinner, getGridsets } = this.props;
    const { user } = this.state;

    showOverlaySpinner();
    getGridsets()
    .then(({ gridsets }) => {
      this.setState({
        gridsets,
        selectPlaylist : 0,
        showPlaylist : 0
      }, () => {
        this.addLog("Loaded Gridset: " + gridsets[user].name);
        this.loadPlayListFromDB();
      });
    })
    .catch(err => console.log(err));
  }

  render() {
    const { activeVideo, showPlaylist, playlist, playlists, video, gridsets, items, playlist_id, importContent, searchContent, wikiContent, dot_filter, hide_filter, openPlaylist, previewPlaylists_id, gspn, title, user, selectPlaylist, gangedGridset} = this.state;  
    console.log('render===')
    var SysOverFlowClass = 'SysOverFlow';

    if(!importContent && !searchContent)
      SysOverFlowClass += ' remove';
    return (
      <div className="Main">
        
        <div name="iWin1" className={'Win1 ' + this.state.settingsHeight}>
          <div
            className={`VideoBg VideoBg--${activeVideo === -1 ? 'Show' : 'Hide'}`}
            style={{ backgroundImage: `url(${images.logo})` }}
          />  
        </div>

      <div className="RightSideArea">
          <div className="CubeRow">
            {this.renderCube(0)}
            {this.renderCube(1)}
          </div>
          <div className="CubeRow">
            {this.renderCube(2)}
            {this.renderCube(3)}
          </div>
          <div className="CubeRow">
            {this.renderAudioCube()}
            {this.renderAdCube()}
          </div>
          
          
          <LogComponent logs={this.state.logs}/>
      </div>
      
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.layout,
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(MainView));