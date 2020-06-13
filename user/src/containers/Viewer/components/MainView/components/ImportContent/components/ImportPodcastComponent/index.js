import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RadioGroup, Radio } from 'react-radio-group';

import { fetchPodCastInfo } from '../../../../../../../../actions/index';

import './styles.scss';

class ImportPodcast extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
       url : this.props.url,
       validUrl : true,
       video : [],
       updatedVideo : [],
       podcast_episodes : [],
       episodeValue : 0,
       episode_title : "",
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
    let type = 'podcast';
    var soundcloud = url.search("soundcloud.com");
    if(soundcloud > 0) 
    {
      type = 'soundcloud'
    }
    const { fetchPodCastInfo } = this.props;
    fetchPodCastInfo(url, type)
    .then(res => {
      if(res.success) {
        const video = [];
        video['video_type'] = 'Podcast';
        video['video_id'] = "";
        video['interface_link'] = res.items[0][3];
        video['video_length'] = 0;
        video['video_title'] = res.title;
        video['description'] = res.items[0][1];
        video['video_author'] = res.author;
        video['datePublish'] = this.convertDate(res.items[0][2]);
        video['author_link'] = "";
        video['thumbnail'] = res.img;
        video['author_img'] = "";
        video['episode_title'] = res.items[0][0];
        const disabledBtn = video['video_title'] ? false : true;
        this.props.getVideoInfo(video, disabledBtn);
        this.setState({
          video,
          validUrl : true,
          podcast_episodes : res.items
        })
      }
      else {
        const { video } = this.state;
        this.setState({
          validUrl : false,
          video : [],
          podcast_episodes : []
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
        video : [],
        podcast_episodes : []
      }, () => {
        this.props.getVideoInfo(video, true);
      })
    });
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
  
  selectEpisode = (value) => {
    const { podcast_episodes, video } = this.state;
    if(value === 0) {
      video['datePublish'] = this.convertDate(podcast_episodes[0][2]);
      video['interface_link'] = podcast_episodes[0][3];
      video['episode_title'] = podcast_episodes[0][0];
      video['description'] = podcast_episodes[0][1];
    }
    else if(value === 1){
      video['datePublish'] = this.convertDate(podcast_episodes[1][2]);
      video['interface_link'] = podcast_episodes[1][3];
      video['episode_title'] = podcast_episodes[1][0];
      video['description'] = podcast_episodes[1][1];
    }
    else {
      video['datePublish'] = this.convertDate(podcast_episodes[2][2]);
      video['interface_link'] = podcast_episodes[2][3];
      video['episode_title'] = podcast_episodes[2][0];
      video['description'] = podcast_episodes[2][1];
    }
    this.setState({
      episodeValue : value,
      video
    })
  }

  // convert the date
  convertDate = (date) => {
    var datePublish = new Date(date);
    datePublish = datePublish.getFullYear() + "-" + (datePublish.getMonth() + 1) + "-" + datePublish.getDate() ;
    return(datePublish)
  }

  render() {

    const { video, url, validUrl, podcast_episodes, episodeValue } = this.state;

    const episode = podcast_episodes.map((podcast_episode, i ) => {
      var datePublish = new Date(podcast_episode[2]);
      datePublish = datePublish.getFullYear() + "-" + (datePublish.getMonth() + 1) + "-" + datePublish.getDate() ;
      var episode = datePublish + "-" + podcast_episode[0]; 
      return (
        <div key={i}><Radio value = {i}  /> {episode}</div>
      )
    })

    return (
      <div>
        { (url && validUrl) &&
        <React.Fragment>
          <div className="podcast">
            <img src={video['thumbnail']} alt="Podcast" style={{height:"80px"}} />
            <div className="podcast_details">
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
              <div>Author:
              {
                video['video_author'] ? video['video_author'] : <input type="text" onChange={this.updateVideoInfo("video_author")}></input>
              }
              </div>
            </div>
          </div>
          <div className="episode">
            <RadioGroup name="podcast" selectedValue={episodeValue} onChange={this.selectEpisode}>
              { episode }
            </RadioGroup>
          </div>
        </React.Fragment>
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchPodCastInfo: bindActionCreators(fetchPodCastInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(ImportPodcast);