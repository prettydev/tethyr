import React from 'react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  fetchYoutubeVideoInfo,
  fetchYoutubeUserInfo,
  fetchFacebookVideoInfo,
  fetchFacebookUserInfo,
  getVimeoVideoInfo, 
  getTwitchVideoInfo, 
  getTwitchUserInfo,
  getTwitchStreamInfo,
  getTwitchGameInfo,
  fetchTwitterVideoInfo
} from '../../../../actions/index';

import './styles.scss';

class ImportVideo extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       url : this.props.url,
       video : [],
       updatedVideo : [],
       validUrl : true,
    }
  }
  
  componentDidMount() {
    this.getVideoInfo();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.state.url !== nextProps.url) {
      this.setState({
        url : nextProps.url,
      }, () => {
        this.getVideoInfo();
      })
    }
  }
  
  //get the video type
  getVideoInfo = () => {
    const { url, video } = this.state;
    var facebook_video = url.search("facebook");            //check if the url contains facebook
    var youtube_video = url.search("youtu");                //check if the url contains youtube
    var twitter_video = url.search("twitter");              //check if the url contains twitter
    var twitch_video = url.search("twitch");                //check if the url contains facebook
    var dailymotion_video = url.search("dailymotion");      //check if the url contains youtube
    var vimeo_video = url.search("vimeo");                  //check if the url contains twitter
    var ibmcloudvideo = url.search("ibmcloudvideo");        //check if the url contains twitter

    if(facebook_video >  0) {
      console.log("=== facebook");
      this.getFacebookInfo(url);
    }
    else if(youtube_video >  0) {
      console.log("=== youtube_video");
      this.getYoutubeInfo(url);
    }
    else if(twitter_video >  0) {
      console.log("=== twitter_video");
      this.getTwitterInfo(url);
    }
    else if(twitch_video >  0) {
      console.log("=== twitch_video");
      this.getTwitchInfo(url);
    }
    else if(dailymotion_video >  0) {
      console.log("=== dailymotion_video");
      this.getDailymotionInfo(url);
    }
    else if(vimeo_video >  0) {
      console.log("=== vimeo_video");
      this.getVimeoInfo(url);
    }
    else if(ibmcloudvideo >  0) {
      console.log("=== ibmcloudvideo");
      this.getIbmcloudInfo(url);
    }
    else {
      console.log("==== no video file!")
      this.setState({
        validUrl : false,
        video : [],
        updatedVideo : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    }
    
  }

  // get Facebook video info
  getFacebookInfo = (url) => {
    const { fetchFacebookVideoInfo} = this.props;
    const regExp = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/([A-z0-9\.]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gm;
    var video_id = regExp.exec(url)[2]
    console.log(video_id)
    fetchFacebookVideoInfo(video_id)
    .then((data) => {
      console.log(data);
      const video = [];
      video['video_type'] = 'facebook';
      video['video_id'] = video_id;
      video['video_length'] = data.length;
      video['datePublish'] = this.convertDate(data.created_time);
      video['thumbnail'] = data.picture;
      video['video_title'] = data.title;
      video['description'] = data.description;
      video['video_author'] = data.from.name;
      video['interface_link'] = url;
      video['author_link'] = 'https://www.youtube.com/channel/' + data.from.name;
      //const author_id = data.from.id;
      var disabledBtn = video['video_title']  && video['video_author'] ? false : true;
      this.props.getVideoInfo(video, disabledBtn);
        this.setState({
          video,
          validUrl : true
        })
      // fetchFacebookUserInfo(author_id)
      // .then(data=>{
      //   console.log(data);
      // })
      // .catch(err=>{console.log(err);})
    })
    .catch(err => {
      console.log(err);
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    })
  }

  // get Youtube video info
  getYoutubeInfo = (url) => {
    var parse = require('url-parse');
    var parsed_url = parse(url);
    var pathName = parsed_url.pathname;

    var video_id;

    const { fetchYoutubeVideoInfo, fetchYoutubeUserInfo } = this.props;

    if(pathName === '/watch')
    {
      let query = parsed_url.query;
      let vPosition = query.search("v=");
      let ePosition = query.search("&");

      if (ePosition > 0 )
      {
        query = query.slice( vPosition + 2, ePosition );
      }
      else {
        query = query.slice( vPosition + 2 );
      }
      
      video_id = query;
      
    }
    else
    { 
      pathName = pathName.substr(1);
      video_id = pathName;
    }

    fetchYoutubeVideoInfo(video_id)
    .then(data => {
      const video = [];
      video['video_type'] = 'youtube';
      video['video_id'] = video_id;
      var res = data.items[0];
      var video_length = res.contentDetails.duration;
      video['video_length'] = this.convert_time(video_length);
      res = res.snippet;
      video['datePublish'] = this.convertDate(res.publishedAt);
      var channelId = res.channelId;
      video['author_link'] = 'https://www.youtube.com/channel/' + channelId;
      video['thumbnail'] = res.thumbnails.default.url;
      video['video_title'] = res.title;
      video['description'] = res.description;
      video['video_author'] = res.channelTitle;
      video['interface_link'] = "https://www.youtube.com/watch?v=" + video_id;
      var disabledBtn = video['video_title']  && video['video_author'] ? false : true;
      fetchYoutubeUserInfo(channelId)
      .then(data=>{
        video['author_img'] = data.items[0].snippet.thumbnails.default.url;
        this.props.getVideoInfo(video, disabledBtn);
        this.setState({
          video,
          validUrl : true
        })
      })
      .catch(err=>{console.log(err);})
    })
    .catch(err => {
      console.log(err);
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    })
  }

  // get Vimeo video info
  getVimeoInfo = (url) => {
    var parse = require('url-parse');
    var parsed_url = parse(url);
    var pathname = parsed_url.pathname;
    var video_id = pathname.substr(1);
    const { getVimeoVideoInfo } = this.props;

    getVimeoVideoInfo(video_id)
    .then(res=>{
      this.getVimeoVideoInfo(res, url, video_id, (video, disabledBtn) => {
        this.props.getVideoInfo(video, disabledBtn);
        this.setState({
          video,
          validUrl : true
        })
      })
      
    })
    .catch(err=>{
      console.log(err);
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    })
  }

  getVimeoVideoInfo = (res, url, video_id, callback) => {
    const video = [];
    video['video_type'] = 'vimeo';
    video['video_id'] = video_id;
    video['interface_link'] = url;
    video['video_length'] = res.duration;
    video['video_title'] = res.name;
    video['description'] = res.description;
    video['video_author'] = res.user.name;
    video['datePublish'] = this.convertDate(res.created_time);
    video['author_link'] = res.user.link;
    video['thumbnail'] = res.pictures.sizes[3].link;
    video['author_img'] = res.user.pictures.sizes[3].link;
    const disabledBtn = video['video_title'] && video['video_author'] ? false : true;
    callback(video, disabledBtn);
  }

  // get Twitch video info
  getTwitchInfo = (url) => {
    var parse = require('url-parse');
    var parsed_url = parse(url);
    var pathname = parsed_url.pathname;
    const twitch_type = url.search("videos") > 0  ? "twitch" : "twitch_live";
    const video = [];

    const { getTwitchVideoInfo, getTwitchUserInfo } = this.props;

    if(twitch_type === "twitch") {
      var video_id = pathname.substring(8);
      video['video_type'] = 'twitch';
      video['video_id'] = video_id;
      video['interface_link'] = url;
      getTwitchVideoInfo(video_id)
      .then(res=>{
        console.log(res);
        video['video_length'] = this.convert_time(res.data[0].duration);
        video['datePublish'] = this.convertDate(res.data[0].published_at);
        let user_name = res.data[0].user_name;
        let language = res.data[0].language;
        video['video_title'] = `${user_name} replay from ${video['datePublish']} :  playing [gamename] in ${language}`;
        video['description'] = res.data[0].title;
        let thumbnail_url = res.data[0].thumbnail_url;
        if(thumbnail_url.length !== 0) {
          thumbnail_url = thumbnail_url.replace("%{width}","300");
          thumbnail_url = thumbnail_url.replace("%{height}","300");
          video['thumbnail'] = thumbnail_url;
        }
        else {
          video['thumbnail'] = thumbnail_url;
        }
        
        const user_id = res.data[0].user_id;
        getTwitchUserInfo(user_id, "user_id")
        .then(res=>{
          console.log(res);
          video['author_img'] = res.data[0].profile_image_url;
          video['video_author'] = res.data[0].login;
          const disabledBtn = video['video_title'] && video['video_author'] ? false : true;
          this.props.getVideoInfo(video, disabledBtn);
          this.setState({
            video,
            validUrl : true
          })
        })
        .catch(err=>{console.log(err);})
      })
      .catch(err=>{
        console.log(err);
        const { video } = this.state;
        this.setState({
          validUrl : false,
          video : []
        }, () => {
          this.props.getVideoInfo(video, true);
        })
      })
    }
    else {
      var video_id = pathname.substring(1);
      video['video_type'] = 'twitch_live';
      video['video_id'] = video_id;
      console.log(video_id)
      video['interface_link'] = url;
      video['video_length'] = 0;
      video['author_link'] = url;
      getTwitchUserInfo(video_id, "login")
      .then(res=>{
        console.log(res);
        const user_id = res.data[0].id;
        video['video_title'] = res.data[0].display_name;
        video['description'] = res.data[0].display_name;
        video['video_author'] = res.data[0].login;
        video['author_img'] = res.data[0].profile_image_url;
        video['thumbnail'] = res.data[0].offline_image_url;
        const { getTwitchStreamInfo } = this.props;
        getTwitchStreamInfo(user_id)
        .then(res=> {
          console.log(res);
          if(res.data.length === 0) {
            console.log("not live!");
            video['live_now'] = 0;
            const disabledBtn = video['video_title'] && video['video_author'] ? false : true;
            this.props.getVideoInfo(video, disabledBtn);
            this.setState({
              video,
              validUrl : true
            })
          }
          else {
            console.log("live!")
            video['live_now'] = 1;
            video['description'] = res.data[0].title;
            let thumbnail_url = res.data[0].thumbnail_url;
            thumbnail_url = thumbnail_url.replace("{width}","300");
            thumbnail_url = thumbnail_url.replace("{height}","300");
            video['thumbnail'] = thumbnail_url;
            console.log(thumbnail_url)
            const game_id = res.data[0].game_id;
            const { getTwitchGameInfo } = this.props;
            getTwitchGameInfo(game_id)
            .then(res=>{
              console.log(res);
              video['game'] = res.data[0].name;
              video['video_title'] += video['game'];
              console.log(video['video_title'], video['game'])
              var disabledBtn = video['video_title']  && video['video_author'] ? false : true;
              this.props.getVideoInfo(video, disabledBtn);
              this.setState({
                video,
                validUrl : true
              })
            })
            .catch(err=>{console.log(err);})
          }
        })
        .catch(err=>{console.log(err);})
      })
      .catch(err=>{
        console.log(err);
        const { video } = this.state;
        this.setState({
          validUrl : false,
          video : []
        }, () => {
          this.props.getVideoInfo(video, true);
        })
      })
    }

  }

  // get Twitter video info
  getTwitterInfo = (url) => {
    const { fetchTwitterVideoInfo } = this.props;
    const video = [];

    var parse = require('url-parse');
    var parsed_url = parse(url);
    var pathName = parsed_url.pathname;

    var id_index = pathName.search("status/");
    var lastChar = pathName[pathName.length -1];

    if(isNaN(lastChar)) pathName = pathName.substring(0, pathName.length - 1);

    var id = pathName.slice( id_index + 7 );

    video['video_type'] = "twitter";
    video['video_id'] = id;

    fetchTwitterVideoInfo(id)
    .then((res) => {
      var tweets = res.tweets;
      video['thumbnail'] = tweets.entities.media === undefined ? "" : tweets.entities.media[0].media_url_https;
      video['author_img'] = tweets.user.profile_image_url_https;
      video['interface_link'] = "https://twitter.com/i/status/" + id;
      video['video_title'] = tweets.text;
      video['video_author'] = tweets.user.name;
      video['author_link'] = "https://twitter.com/" +  tweets.user.screen_name;
      video['datePublish'] = this.convertDate(tweets.user.created_at);
      video['description'] = tweets.text;
      video['video_length'] = 0;
      var disabledBtn = video['video_title']  && video['video_author'] ? false : true;
      this.props.getVideoInfo(video, disabledBtn);
      this.setState({
        video,
        validUrl : true
      })
    })
    .catch(err => {
      console.log(err);
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    })
  }

  // get Dailymotion video info
  getDailymotionInfo = (url) => {
    var parse = require('url-parse');
    var parsed_url = parse(url);
    var pathname = parsed_url.pathname;
    var video_id = pathname.substring(7);
  }

  // update the video info
  updateVideoInfo = (type) => (e) => {
    const { updatedVideo, video } = this.state;
    console.log("=========", video['video_title'])
    if(video['video_title']) {
      updatedVideo['video_title'] = video['video_title'];
    }
    else if(video['video_author']) {
      updatedVideo['video_author'] = video['video_author'];
    }
    else {}
    var value = e.target.value;
    updatedVideo[type] = value;
    const disabledBtn = updatedVideo['video_title'] && updatedVideo['video_author'] ? false : true;
    this.props.updateVideoInfo(type, value, disabledBtn);
  }

  // convert the date
  convertDate = (date) => {
    var datePublish = new Date(date);
    datePublish = datePublish.getFullYear() + "-" + (datePublish.getMonth() + 1) + "-" + datePublish.getDate() ;
    return(datePublish)
  }

  // convert time to seconds i.e convert PS3M23S to 203s
  convert_time = (duration) => {
    console.log(duration)
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
    return duration
  }

  render() {

    const { video, url, validUrl } = this.state;

    return (
      <div>
        { (url && validUrl) &&
          <div>
            <div>Video Type:
            {
              video['video_type'] ? video['video_type'] : <input type="text" onChange={this.updateVideoInfo("video_type")}></input>
            }
            </div>
            <div>Video ID:
            {
              video['video_id'] ? video['video_id'] : <input type="text" onChange={this.updateVideoInfo("video_id")}></input>
            }
            </div>
            <div>Interface Link:
            {
              video['interface_link'] ? video['interface_link'] : <input type="text" onChange={this.updateVideoInfo("interface_link")}></input>
            }
            </div>
            <div>Video Length:
            {
              video['video_length']
            }
            </div>
            <div>Video Title:
            {
              video['video_title'] ? video['video_title'] : <input type="text" onChange={this.updateVideoInfo("video_title")}></input>
            }
            </div>
            <div>Video Description:
            {
              video['description'] ? video['description'] : <input type="text"  onChange={this.updateVideoInfo("description")}></input>
            }
            </div>
            <div>Video Author:
            {
              video['video_author']? video['video_author'] : <input type="text" onChange={this.updateVideoInfo("video_author")}></input>
            }
            </div>
            <div>Publish Date:
            {
              video['datePublish'] ? video['datePublish'] : <input type="date" onChange={this.updateVideoInfo("datePublish")}></input>
            }
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchYoutubeVideoInfo: bindActionCreators(fetchYoutubeVideoInfo, dispatch),
  fetchYoutubeUserInfo: bindActionCreators(fetchYoutubeUserInfo, dispatch),
  fetchFacebookVideoInfo: bindActionCreators(fetchFacebookVideoInfo, dispatch),
  fetchFacebookUserInfo: bindActionCreators(fetchFacebookUserInfo, dispatch),
  getVimeoVideoInfo: bindActionCreators(getVimeoVideoInfo, dispatch),
  getTwitchVideoInfo: bindActionCreators(getTwitchVideoInfo, dispatch),
  getTwitchUserInfo: bindActionCreators(getTwitchUserInfo, dispatch),
  getTwitchStreamInfo: bindActionCreators(getTwitchStreamInfo, dispatch),
  getTwitchGameInfo: bindActionCreators(getTwitchGameInfo, dispatch),
  fetchTwitterVideoInfo: bindActionCreators(fetchTwitterVideoInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportVideo);