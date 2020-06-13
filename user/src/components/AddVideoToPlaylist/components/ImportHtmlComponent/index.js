import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { detectXFrameOption } from '../../../../actions/index';

import './styles.scss';

class ImportHtml extends React.Component {

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

    if(url.length === 0 || url.search("www.use.com") > 0 || url.search("wfmu.org") > 0) {
      const { video } = this.state;
      this.setState({
        validUrl : false,
        video : [],
        updatedVideo : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    }
    else {
      const { detectXFrameOption } = this.props;

      var parse = require('url-parse');
      var parsed_url = parse(url);
      const link_url = parsed_url.href;
  
      detectXFrameOption(link_url)
      .then(res => {
        console.log(res);
        if(res.isBlocked === false)
        {
          const video = [];
          video['video_type'] = res.slide ? 'slide' : 'html';
          video['video_id'] = "";
          video['interface_link'] = link_url;
          video['video_length'] = 0;
          video['video_title'] = res.webpageTitle;
          video['description'] = res.description;
          video['video_author'] = "";
          video['datePublish'] = "";
          video['author_link'] = "";
          video['thumbnail'] = "";
          video['author_img'] = "";
          const disabledBtn = video['video_title'] ? false : true;
          this.props.getVideoInfo(video, disabledBtn);
          this.setState({
            video,
            validUrl : true
          })
        }
        else {
          console.log("!blocked");
          const { video } = this.state;
          this.setState({
            validUrl : false,
            video : []
          }, () => {
            this.props.getVideoInfo(video, true);
          })
        }
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
  detectXFrameOption: bindActionCreators(detectXFrameOption, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportHtml);