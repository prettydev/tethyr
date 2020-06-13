import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAndmoorInfo } from '../../../../../../../../actions/index';

import './styles.scss';

class ImportAndmoor extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       url : this.props.url,
       validUrl : true,
       video : [],
       updatedVideo : [],
    }
  }
  
  componentDidMount() {
    this.getInfo();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.state.url !== nextProps.url) {
      this.setState({
        url : nextProps.url,
      }, () => {
        this.getInfo();
      })
    }
  }
  
  getInfo = () => {

    const { url } = this.state;

    if(url.search("andmoor.com") > 0) {
      const { getAndmoorInfo } = this.props;

      var parse = require('url-parse');
      var parsed_url = parse(url);
      const pathname = parsed_url.pathname;
      const video_id = pathname.substr(1);
      getAndmoorInfo(video_id)
      .then(res => {
        
          const video = [];
          const data = res.data;
          console.log(data);
          video['video_type'] = 'Andmoor';
          video['video_id'] = video_id;
          video['interface_link'] = url;
          video['video_length'] = this.convert_time(data.videoDuration);
          video['video_title'] = data.video_name;
          video['description'] = data.video_desc;
          video['video_author'] = "";
          video['datePublish'] = this.convertDate(data.created_date);
          video['author_link'] = "";
          video['thumbnail'] = data.thumbnail;
          video['author_img'] = "";
          console.log("video====", video)
          const disabledBtn = video['video_title'] ? false : true;
          this.props.getVideoInfo(video, disabledBtn);
          this.setState({
            video,
            validUrl : true
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
      });  
    }
    else {
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : [],
        updatedVideo : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    }
  }

  // update the video info
  updateVideoInfo = (type) => (e) => {
    const { updatedVideo, video } = this.state;
    updatedVideo['video_title'] = video['video_title'];
    var value = e.target.value;
    updatedVideo[type] = value;
    const disabledBtn = updatedVideo['video_title'] ? false : true;
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
            <div>Type:
            {
              video['video_type'] ? video['video_type'] : <input type="text" onChange={this.updateVideoInfo("video_type")}></input>
            }
            </div>
            <div>Interface Link:
            {
              video['interface_link'] ? video['interface_link'] : <input type="text" onChange={this.updateVideoInfo("interface_link")}></input>
            }
            </div>
            <div>Title:
            {
              video['video_title'] ? video['video_title'] : <input type="text" onChange={this.updateVideoInfo("video_title")}></input>
            }
            </div>
            <div>Description:
            {
              video['description'] ? video['description'] : <input type="text"  onChange={this.updateVideoInfo("description")}></input>
            }
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getAndmoorInfo: bindActionCreators(getAndmoorInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportAndmoor);