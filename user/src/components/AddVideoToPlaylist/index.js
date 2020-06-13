import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RadioGroup, Radio } from 'react-radio-group';

import ImportHtml from './components/ImportHtmlComponent/index'
import ImportVideo from './components/ImportVideoComponent/index'
import ImportPodcast from './components/ImportPodcastComponent/index'
import ImportImages from './components/ImportImageComponent/index'
import ImportAndmoor from './components/ImportAndmoorComponent/index'
import ImportYoutubePlaylist from './components/ImportYoutubePlaylistComponent/index'
import Import from '../../components/PlaylistHeaderBar/components/ImportComponent'
import { importExternalVideo } from '../../actions';
import CSVReader from 'react-csv-reader';

import './styles.scss';

import {
    addPlaylist, // add new to playlist
    saveVideo, // save the video in the video database
    saveYoutubePlaylist,
    addYoutubePlaylist
} from '../../actions';


class AddVideoToPlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      importValue : "",                     // the value of the input field to drag/copy the video url
      positionValue : "0",                    // playlist position 
      typeValue : "0",
      playlist_id : this.props.playlist_id, //set the number of the gridset what you want to add
      playlists : this.props.playlists,
      playlist : this.props.playlist, 
      playingPlaylist : this.props.playingPlaylist,
      playingPlaylists : this.props.playingPlaylists,
      hideMode : false,
      disabledBtn : true,
      video : [],
      updatedVideo : [],
      youtubePlaylist : 0,
      
      
      tsv:false,
      videos : [],
      _diff : [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      playlist : nextProps.playlist,
      playlists : nextProps.playlists,
      playingPlaylists : nextProps.playingPlaylists,
      playingPlaylist : nextProps.playingPlaylist,
      hideMode : nextProps.hide_filter,
      playlist_id : nextProps.playlist_id
    })
  }

  // clear the input field value to drag/copy the video url
  clear = () => {
    this.setState({
      importValue : "",
      disabledBtn : true,
      video : [],
      updatedVideo : []
    })
  }

  //set the position of adding new playlist
  handleChange = (value) => {
    this.setState({
      positionValue : value,
    })
  }

  selectType = (value) => {
    this.setState({
      typeValue : value,
      video : [],
    })
  }

  // add new playlist to gridset
  addPlaylist = () => {
    const { addPlaylist, saveVideo,  saveYoutubePlaylist, addYoutubePlaylist } = this.props;
    var position = parseInt(this.state.positionValue);
    const { hideMode, video, updatedVideo, youtubePlaylist, playlist_id, playlist, playingPlaylists,typeValue } = this.state;
    var playingPlaylist = playlist[playingPlaylists].id;
    if(typeValue==='6'){
      this.importCSVFile();
    }
    
    else if(youtubePlaylist === 1) {
      saveYoutubePlaylist(video)
      .then(res=>{
        addYoutubePlaylist(res.ids, playlist_id, position, playingPlaylist, hideMode)
        .then(res=>{
          if(res.videos === undefined)
            {
              if(!res.success) {
                alert('The video already exists in that playlist!!!')
              }
              else {
                alert('The video imported successfully!')
              }
              this.setState({ 
                importValue : "",
                disabledBtn : true,
                video : [],
                updatedVideo : []
              });
            }
          else {
            alert('The videos imported successfully!');
            this.props.playlistItems(res.videos, position, playlist_id);
            this.setState({ 
              importValue : "",
              disabledBtn : true,
              video : [],
              updatedVideo : []
            });
          }
          
        })
        .catch(err=>{console.log(err);})
      })
      .catch(err=>{console.log(err);})
    }
    else {
      this.getUpdatedVideo(video, updatedVideo, (video) => {

        // var selected_playlist = playlists.find(item => {
        //   return item.id === playlist_id;
        // });
        // save the video in the video database
        saveVideo(video)
        .then(data => {
          var video_id = 0;
          if(data.success) {
            video_id = data.video.id;
          }
          else {
            video_id = data.video_id;
          }
          
          // addLog("Added " + video['video_type'] + " " + video['video_title'] + " to " + selected_playlist.name);
          // add new playlist to gridset
          addPlaylist(video_id, playlist_id, position, playingPlaylist, hideMode)
          .then(res => {
            if(res.videos === undefined)
            {
              if(!res.success) {
                alert('The video already exists in that playlist!!!')
              }
              else {
                alert('The video imported successfully!')
              }
            }
            else {
              alert('The videos imported successfully!');
              this.props.playlistItems(res.videos, position, playlist_id);
            }
            this.setState({ 
              importValue : "",
              disabledBtn : true,
              video : [],
              updatedVideo : []
            });
          })
            //set the gridsets including new playlist and clear input field and video meta info
          .catch(err => {
            console.log(err)
          })
        })
        .catch(err => {
          console.log(err);
        })
      })
    }
    
  }

  getUpdatedVideo = (video, updatedVideo, callback) => {
    const fields = [
      'video_type',
      'video_id',
      'interface_link',
      'video_title',
      'video_author',
      'description',
      'episode_title',
      'thumbnail',
      'video_length',
      'live_now',
      'author_link',
      'author_img',
      'datePublish',
      'game'
    ];
    const values = {};
    fields.map(field => {values[field] = (video[field] || updatedVideo[field] || "")});
    callback(values)
  }

  getPositionPlaylistAdded = (e) => {
    console.log(e.target.value)
    let playlist_id = e.target.value;
    playlist_id = parseInt(playlist_id);
    this.setState({
      playlist_id : playlist_id,
    })
  }


  onChangeUrl = (e) => {
    this.setState({
        importValue : e.target.value,
    })
  }

  getVideoInfo = (video, disabledBtn) => {
    if(disabledBtn === "youtube") {
      this.setState({
        video,
        disabledBtn : false,
        youtubePlaylist : 1
      })
    }
    else {
      this.setState({
        video,
        disabledBtn,
        youtubePlaylist : 0
      })
    }
  }

  updateVideoInfo = (type, value, disabledBtn) => {
    const { updatedVideo } = this.state;
    updatedVideo[type] = value;
    this.setState({
      updatedVideo,
      disabledBtn
    })
  }

  checkDuplicatedVideo = (data, items, callback) => {

    var _ = require('lodash');
    const data_gsvn = data.map(video => {
        return video[7];
    })
    const itmes_gsvn = items.map(({gsvn}) => {
        return gsvn;
    })
    const videos =  _.differenceWith(data_gsvn, itmes_gsvn, _.isEqual);
    callback(videos)
}

  handleForce = data => {
    //const playlist_gspn = this.props.playlist.gspn;
    const items = this.props.items;
    if(!data[1]) {
        alert("The csv file you have selected is empty!");
        return false;
    }
    else {
        data = data.slice(0);
        data.splice(0, 1);
        this.checkDuplicatedVideo(data, items, (videos) => {
           
            this.setState({
                videos : data,
                _diff : videos,
                typeValue:"6",
                disabledBtn:false
            })
        })
    }
   


};

importCSVFile = () =>{
  const {_diff} = this.state;
  const {playlists} = this.props;
  const {importExternalVideo} = this.props;
  let playlist=playlists.find(pl=>{
    if(pl.id==this.state.playlist_id)
    return pl;
  })

  importExternalVideo(_diff, playlist)
  .then(res=>{
      if(res.success) {
          this.props.ImportVideos();
          this.setState({
              videos : [],
              _diff : [],
              typeValue:""
          })
      }
      else {
          alert('The videos in the csv file already exist in the current playlist!')
          this.setState({
              videos : [],
              _diff : []
          })
      }
  })
  .catch(err=>{
      console.log(err);
  })
}
  render() {

    const { importValue, positionValue, typeValue, disabledBtn, playlist_id,tsv,videos } = this.state;
    const{items, playlists,selectPlaylist,gangedGridset,ImportVideos}=this.props;
    return (
      
        <div className='videoImport'>
          <div className = 'import_header'>
            <div className = 'import_title'>
              <h1>Import Content</h1>
              <p>add videos and more to Tethyr</p>
            </div>
            <div className = 'import_wiki'>
              <a href='https://wiki.tethyr.io/index.php?title=Importing_Content' target='_blank' rel="noopener noreferrer">Help Wiki</a>
            </div>
          </div>
          <h3>Steps:</h3>
          <p>1. Paste a link or drag a thumbnail into this text box:</p>
          <input onChange={this.onChangeUrl} type="text" value = {importValue} />
         
          <button onClick={this.clear}>Clear</button>
          <CSVReader
                            cssClass="-reactcsv-input"
                            
                            onFileLoaded={this.handleForce}
                        />
        
          <br />
          <p>2.Specify which type of content it is:</p>
          <RadioGroup name="addWebsiteType" className='addWebsiteType' selectedValue={typeValue} onChange={this.selectType}>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/video.png`)} alt='video'/>
              </div>
              <div className='radio_btn'>
                <Radio value="0" />
              </div>
            </div>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/html.png`)} alt='html'/>
              </div>
              <div className='radio_btn'>
                <Radio value="1" />
              </div>
            </div>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/podcast.png`)} alt='podcast'/>
              </div>
              <div className='radio_btn'>
                <Radio value="2" />
              </div>
            </div>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/image.png`)} alt='broadcaster'/>
              </div>
              <div className='radio_btn'>
                <Radio value="3" />
                </div>
            </div>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/andmoor.png`)} alt='andmoor'/>
              </div>
              <div className='radio_btn'>
                <Radio value="4" />
              </div>
            </div>
            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/youtube_playlist.png`)} alt='youtube_playlist'/>
              </div>
              <div className='radio_btn'>
                <Radio value="5" />
              </div>
            </div>

            <div>
              <div>
                <img className ='image' src={require(`../../resources/images/broadcasters/tethyr_tcsv.png`)} alt='Tsv Upload' />
              </div>
              <div className='radio_btn'>
                <Radio value="6" />
              </div>
               
              </div>
            
          </RadioGroup>
          <p>3.Specify where you would like to add it to the playlist</p>
          <RadioGroup name="playlistPosition" selectedValue={positionValue} onChange={this.handleChange}>
            <Radio value="0" />Top
            <Radio value="1" />Bottom
            <Radio value="2" disabled />Current Position
            <Radio value="3" disabled />Next Up
          </RadioGroup>
          <p>4.Select which Playlist you want to add it to and click Add:</p>
            <select value={playlist_id} onChange={this.getPositionPlaylistAdded}>
                {
                    this.props.playlists.map((list, idx) => {
                        return <option key={idx} value={list.id} >{list.name}</option>;
                    })
                }
            </select>
            <button onClick={this.addPlaylist} disabled={disabledBtn}>Add to playlist</button>
           <hr />
            {
                typeValue === "0" && 
                <ImportVideo 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                    updateVideoInfo = {this.updateVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "1" && 
                <ImportHtml 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                    updateVideoInfo = {this.updateVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "2" && 
                <ImportPodcast 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                    updateVideoInfo = {this.updateVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "3" && 
                <ImportImages 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                    updateVideoInfo = {this.updateVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "4" && 
                <ImportAndmoor 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                    updateVideoInfo = {this.updateVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "5" && 
                <ImportYoutubePlaylist 
                    url = {importValue}
                    getVideoInfo = {this.getVideoInfo.bind(this)}
                />
            }
            {
                typeValue === "6" && 
               
                <Import
                             videos={videos}
                            />
            }
        </div>

 
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    addPlaylist: bindActionCreators(addPlaylist, dispatch),
    saveVideo: bindActionCreators(saveVideo, dispatch),
    saveYoutubePlaylist: bindActionCreators(saveYoutubePlaylist, dispatch),
    addYoutubePlaylist: bindActionCreators(addYoutubePlaylist, dispatch),
    importExternalVideo : bindActionCreators(importExternalVideo, dispatch)
})
  
export default connect(null, mapDispatchToProps)(AddVideoToPlaylist);