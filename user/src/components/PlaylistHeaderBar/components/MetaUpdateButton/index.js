import React from 'react';

import Modal from 'react-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from '@fortawesome/free-solid-svg-icons'

import './styles.scss';

import {
  metaLogin,
  showOverlaySpinner,
  hideOverlaySpinner,
  fetchYoutubeVideoInfo,
  fetchYoutubeUserInfo,
  fetchTwitterVideoInfo,
  fetchPodCastInfo,
  detectXFrameOption,
  saveVideo,
  setPlaylistForCube
} from '../../../../actions';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


Modal.setAppElement('#root')

class MetaUpdateButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          buttonDisabled : true,
          userName : "",
          pwd : "",
          errMsg : false,
          errorMsg : "",
          items : this.props.itemList,
          playingPlaylists : this.props.playingPlaylists,
        };
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        items : nextProps.itemList,
        playingPlaylists : nextProps.playingPlaylists,
      })
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
      this.setState({modalIsOpen: false});
    } 

    onUsername = (e) => {
      const { userName, pwd } = this.state;
      var buttonDisabled = userName && pwd ? false : true;
      this.setState({
        userName : e.target.value,
        buttonDisabled
      })
    }

    onPassword = (e) => {
      const { userName, pwd } = this.state;
      var buttonDisabled = userName && pwd ? false : true;
      this.setState({
        pwd : e.target.value,
        buttonDisabled
      })
    }

    onUpdate = () => {
      clearTimeout(this.timer);
      const { showOverlaySpinner } = this.props;
      const { userName, pwd } = this.state;
      const { metaLogin } = this.props;
      metaLogin(userName, pwd)
      .then(res=>{
        if(res.success)
        {
          this.setState(({
            modalIsOpen : false
          }), ()=>{
            showOverlaySpinner();
            this.updateMetaInfo();
          })
          
        }
        else{
          this.setState({
            errorMsg : res.msg,
            errMsg : true
          })
          this.timer = setTimeout(() => {
            this.setState({ errMsg: false });
          }, 3000);
        }
      })
      .catch(err=>{console.log(err);})
    }

    checkVideoType = (item, callback) => {
      let type = item.type;
      let url = item.interface;
      if(!url) return;
      let facebook_video = url.search("facebook");  
      let youtube_video = url.search("youtu");      
      let twitter_video = url.search("twitter");
      let twitch_video = url.search("twitch");  
      let dailymotion_video = url.search("dailymotion");      
      let vimeo_video = url.search("vimeo");
      let ustream_video = url.search("ustream");
      let ibmcloudvideo_video = url.search("ibmcloudvideo");      
      let Podcast = url.search("podcast"); 

      if(facebook_video > 0 ) type = 'facebook';
      else if(youtube_video > 0 ) type = 'youtube'; 
      else if(twitter_video > 0 ) type = 'twitter'; 
      else if(twitch_video > 0 ) type = 'twitch'; 
      else if(dailymotion_video > 0 ) type = 'dailymotion'; 
      else if(vimeo_video > 0 ) type = 'vimeo'; 
      else if(ustream_video > 0 ) type = 'ustream'; 
      else if(ibmcloudvideo_video > 0 ) type = 'ibmcloudvideo'; 
      else if(Podcast > 0 ) type = 'Podcast'; 
      else type = 'html'

      switch (type) {
        case 'youtube':
          callback(type);
          break;
        case 'facebook':
          callback(type);
          break; 
        case 'twitch':
          callback(type);
          break;
        case 'html':
          callback(type);
          break; 
        case 'dailymotion':
          callback(type);
          break;
        case 'vimeo':
          callback(type);
          break; 
        case 'ustream':
          callback(type);
          break;
        case 'ibmcloudvideo':
          callback(type);
          break; 
        case 'twitter':
          callback(type);
          break;
        case 'Podcast':
          callback(type);
          break; 
        default:
          break;
      }
    }
    getInfo = (item) => {
      const { fetchYoutubeVideoInfo, fetchTwitterVideoInfo, fetchPodCastInfo, detectXFrameOption } = this.props;
      
      let video_type;
      this.checkVideoType(item, (type) => {
        video_type = type;
      })

      switch (video_type) {
        case 'youtube':
          return fetchYoutubeVideoInfo(item.url);
        case 'facebook':
          return true;
        case 'twitch':
          return true;
        case 'html':
          return detectXFrameOption(item.url)
        case 'dailymotion':
          return true;
        case 'vimeo':
          return true;
        case 'ustream':
          return true;
        case 'ibmcloudvideo':
          return true;
        case 'twitter':       
          return fetchTwitterVideoInfo(item.url)
        case 'Podcast':
          return fetchPodCastInfo(item.interface)
        default:
          return true;
      }
    }
    
    getYoutubeinfo = (item, info, video_type, callback) => {

      const { saveVideo, fetchYoutubeUserInfo } = this.props;

      var res = info.items[0];  console.log("res==", res);
      if(res === undefined) callback();
      else {
        var video_id = res.id;
        var duration = res.contentDetails.duration;

        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
            a = [0, a[0], 0];
        }
    
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
            a = [a[0], 0, 0];
        }
    
        duration = 0;
    
        if (a.length === 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }
    
        if (a.length === 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }
    
        if (a.length === 1) {
            duration = duration + parseInt(a[0]);
        }


        res = res.snippet;
        var datePublish = new Date(res.publishedAt);
        datePublish = datePublish.getFullYear() + "-" + (datePublish.getMonth() + 1) + "-" + datePublish.getDate() ;
        var channelId = res.channelId;
        var authorLink = 'https://www.youtube.com/channel/' + channelId;
        var thumb = res.thumbnails.default.url;
        var video_title = res.title;
        var description = res.description;
        var video_author = res.channelTitle;
        fetchYoutubeUserInfo(channelId)
        .then(res =>{
          var author_img = res.items[0].snippet.thumbnails.default.url;
          var video = {
            "id" : item.id,
            "gsvn" : item.gsvn,
            "video_type":video_type,
            "video_id":video_id,
            "video_title":video_title,
            "description":description,
            "video_author":video_author,
            "datePublish":datePublish,
            "video_length":duration,
            "episode_title":"",
            "authorLink" : authorLink,
            "author_img" : author_img,
            "thumb" : thumb,
          };
          saveVideo(video)
          .then(res=>{
            callback();
          })
          .catch(err=>{console.log(err);}) 
        })
        .catch(err=>{console.log(err);})
      }
    }

    saveVideoInfo = (info, idx, items)=> {
      let video_type = {};
      console.log("1===")
      this.checkVideoType(items[idx], (type) => {
        console.log("2===")
        video_type = type;
        let item = items[idx];
        if(video_type === 'youtube') {
          this.getYoutubeinfo(item, info, video_type, ()=>{
            return
          })
        }
        else
          return items[idx];
      })
      console.log("3===")
    }

    updateMetaInfo = () => {
      const { items, playingPlaylists } = this.state;
      const { hideOverlaySpinner, setPlaylistForCube } = this.props;
       Promise.all(items.map(item=>this.getInfo(item))).then(infos => {
         Promise.all(infos.map((info, idx) => this.saveVideoInfo(info, idx, items))).then(response => {
          setPlaylistForCube(null, null, playingPlaylists)
          .then(({videos}) => {
            this.props.updatedItems(videos);
            hideOverlaySpinner();
          })
         })
       })
    }

  render() {
    return (
      <React.Fragment>
        <button className = "metaUpdate_btn" onClick={this.openModal}><FontAwesomeIcon style={{position: 'absolute', left: '10px', top: '6px'}} icon={faLock} />Meta</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Updata video meta info"
        >
          <h5>Username</h5>
          <input onChange = {this.onUsername} />
          <br />
          <br />
          <h5>Password</h5>
          <input type="password" onChange = {this.onPassword} />
          <br />
          <br />
          {
            this.state.errMsg && 
              <p class={{color:"red"}} >{this.state.errorMsg}</p>
          }
          <button onClick = {this.onUpdate} disabled = {this.state.buttonDisabled} >Update</button>
          
        </Modal>
      </React.Fragment>
    );
  }
}
  
const mapDispatchToProps = (dispatch) => ({
  metaLogin: bindActionCreators(metaLogin, dispatch),
  showOverlaySpinner: bindActionCreators(showOverlaySpinner, dispatch),
  hideOverlaySpinner: bindActionCreators(hideOverlaySpinner, dispatch),
  fetchYoutubeVideoInfo: bindActionCreators(fetchYoutubeVideoInfo, dispatch),
  fetchYoutubeUserInfo: bindActionCreators(fetchYoutubeUserInfo, dispatch),
  fetchTwitterVideoInfo: bindActionCreators(fetchTwitterVideoInfo, dispatch),
  saveVideo: bindActionCreators(saveVideo, dispatch),
  fetchPodCastInfo: bindActionCreators(fetchPodCastInfo, dispatch),
  detectXFrameOption: bindActionCreators(detectXFrameOption, dispatch),
  setPlaylistForCube: bindActionCreators(setPlaylistForCube, dispatch),
})

export default connect(null, mapDispatchToProps)(MetaUpdateButton);