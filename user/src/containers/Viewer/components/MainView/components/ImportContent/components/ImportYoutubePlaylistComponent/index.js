import React from 'react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReactTable from "react-table";

import {
  fetchYoutubePlaylistItems,
  fetchYoutubeVideoInfo,
  fetchYoutubeUserInfo,
} from '../../../../../../../../actions/index';

import './styles.scss';

const columns = [
  {
      Header: "Video Type",
      accessor: "video_type",
      width: 70,
      headerStyle: {
          fontSize: 12,
          textAlign: 'left'
      }
  },
  {
      Header: "Video Title",
      accessor: "video_title",
      width: 170,
      headerStyle: {
          fontSize: 12,
          textAlign: 'left'
      }
  },
  {
      Header: "Description",
      accessor: "description",
      width: 200,
      headerStyle: {
          fontSize: 12,
          textAlign: 'left'
      }
  },
  {
      Header: "Interface Link",
      accessor: "interface_link",
      width: 100,
      headerStyle: {
          fontSize: 12,
          textAlign: 'left'
      }
  }
]


class ImportYoutubePlaylist extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       url : this.props.url,
       video : [],
       updatedVideo : [],
       validUrl : true,
       videos : []
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

    var youtube_video = url.search("www.youtube.com/playlist");   //check if the url contains youtube playlist

    if(youtube_video >  0) {
      this.getYoutubeInfo(url);
    }
    else {
      this.setState({
        validUrl : false,
        video : [],
        updatedVideo : [],
        videos : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    }
    
  }

  // get Youtube video info
  getYoutubeInfo = (url) => {
    var parse = require('url-parse');
    var parsed_url = parse(url);
    var query = parsed_url.query;
    var playlist_id = query.slice(6, query.length );
    var items = [];
    var pageToken = "";
    let allVideo = [];
    let video = [];
    this.getPlaylistItems(playlist_id, pageToken, items, (items) => {
      if(items.length === 0) {
        var disabledBtn = true;
        this.props.getVideoInfo(video, disabledBtn);
      }
      else {
        this.getAllItems(items, (items)=>{
          this.getAllVideoIds(items, (items) => {
            this.getAllVideoInfo(items, (items) => {
              this.removeUnavailableVideos(items, (items) => {
                items.map(({videoInfo, author_img}) => {
                  video = {};
                  video['video_type'] = 'youtube';
                  video['video_id'] = videoInfo.items[0].id;
                  var res = videoInfo.items[0];
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
                  video['interface_link'] = "https://www.youtube.com/watch?v=" + video['video_id'];
                  video['author_img'] = author_img.items[0].snippet.thumbnails.default.url;
                  allVideo.push(video);
                  return allVideo;
                })
                this.props.getVideoInfo(allVideo, "youtube");
                this.setState({
                  videos : allVideo
                })
              })
            })
          })
        })
      }
    })
  }

  getAllVideoInfo = async (items, callback) => {
    const { fetchYoutubeUserInfo, fetchYoutubeVideoInfo } = this.props;
    let promise = await Promise.all(items.map(async video_id => {
      return { 
        videoInfo : await fetchYoutubeVideoInfo(video_id),
        video_id
      }
    }));
    let promise1 = await Promise.all(promise.map(async ({videoInfo, video_id}) => {
      if(videoInfo.items.length === 0) {
        
        return null;
      }
      else {
        return {
          videoInfo,
          author_img : await fetchYoutubeUserInfo(videoInfo.items[0].snippet.channelId)
        }
      }
    }));
    callback(promise1)
  }

  getPlaylistItems = (playlist_id, pageToken, items, callback) => {
    const { fetchYoutubePlaylistItems } = this.props;
    fetchYoutubePlaylistItems(playlist_id)
    .then(res => {
      items.push(res.items);
      callback(items);
      // if(res.nextPageToken === undefined) {
      //   items.push(res.items);
      //   callback(items);
      // }
      // else {
      //   pageToken = res.nextPageToken;
      //   items.push(res.items);
      //   this.getPlaylistItems(playlist_id, pageToken, items, callback);
      // }
    })
    .catch(err=>{console.log(err);})
  }

  getAllItems = (items, callback) => {
    var _ = require('lodash');
    items = _.flattenDeep(items);
    callback(items);
  }

  removeUnavailableVideos = (items, callback) => {

    const available_items = [];
    for(var i = 0; i < items.length; i++){
      if(items[i]) {
        available_items.push(items[i])
      }
    }
    
    callback(available_items);
  }

  getAllVideoIds = (items, callback) => {
    const videoIds = items.map(item => {
      return item.snippet.resourceId.videoId;
    })
    callback(videoIds);
  }

  // convert the date
  convertDate = (date) => {
    var datePublish = new Date(date);
    datePublish = datePublish.getFullYear() + "-" + (datePublish.getMonth() + 1) + "-" + datePublish.getDate() ;
    return(datePublish)
  }

  // convert time to seconds i.e convert PS3M23S to 203s
  convert_time = (duration) => {
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

    const { videos } = this.state;
    const tableData = videos.map(({ video_type, description, video_title, interface_link }) => ({
        video_type,
        video_title,
        description,
        interface_link
    }));

    return (
      <div>
          <ReactTable
            data={tableData}
            sortable={false}
            columns={columns}
            defaultPageSize={5}
            showPaginationTop={false}
            className="-striped -highlight"
          />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchYoutubePlaylistItems : bindActionCreators(fetchYoutubePlaylistItems, dispatch),
  fetchYoutubeVideoInfo : bindActionCreators(fetchYoutubeVideoInfo, dispatch),
  fetchYoutubeUserInfo : bindActionCreators(fetchYoutubeUserInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportYoutubePlaylist);