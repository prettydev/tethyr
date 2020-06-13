import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getImageInfo } from '../../../../../../../../actions/index';

import './styles.scss';

class ImportImages extends React.Component {

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
    const { getImageInfo } = this.props;
    if(url.search("www.use.com") > 0) {
      var parse = require('url-parse');
      var parsed_url = parse(url);
      const pathName = parsed_url.pathname;
      const link_url = 'https://www.image-story.com' + pathName;
      getImageInfo(link_url)
      .then(res=>{
        const video = [];
        video['video_type'] = 'image';
        video['video_id'] = "";
        video['interface_link'] = link_url;
        video['video_length'] = 0;
        video['video_title'] = res.title;
        video['description'] = "";
        video['video_author'] = "";
        video['datePublish'] = "";
        video['author_link'] = "";
        video['thumbnail'] = res.img;
        video['author_img'] = "";
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
          video : [],
        }, () => {
          this.props.getVideoInfo(video, true);
        })
      })
    }
    else if(url.search("www.image-story.com") > 0) {
      const link_url = url;
      getImageInfo(link_url)
      .then(res=>{
        const video = [];
        video['video_type'] = 'image';
        video['video_id'] = "";
        video['interface_link'] = link_url;
        video['video_length'] = 0;
        video['video_title'] = res.title;
        video['description'] = "";
        video['video_author'] = "";
        video['datePublish'] = "";
        video['author_link'] = "";
        video['thumbnail'] = res.img;
        video['author_img'] = "";
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
          video : [],
        }, () => {
          this.props.getVideoInfo(video, true);
        })
      })
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
    updatedVideo['video_title'] = video['video_title']
    var value = e.target.value;
    updatedVideo[type] = value;
    const disabledBtn = updatedVideo['video_title'] ? false : true;
    this.props.updateVideoInfo(type, value, disabledBtn);
    this.setState({
      updatedVideo
    })
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
  getImageInfo: bindActionCreators(getImageInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportImages);