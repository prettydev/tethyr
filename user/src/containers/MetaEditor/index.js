import React, { Component } from 'react'
import { connect } from 'react-redux'
import './styles.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  // videoItem = () => {
  //   const videoItem = playlist[index].videos[video[index]];
  //   let videoElement = null;
  //   switch (videoItem.type) {
  //     case 'ustream':
  //       videoElement = (
  //         <Ustream
  //           className={videoClassName}
  //           id={`iCube${index + 1}`}
  //           url={videoItem.url}
  //           muted={muted[index]}
  //           paused={paused[index]}
  //           onEnd={() => { this.onVideoEnd(index); }}
  //         />
  //       );
  //       break;
  //     case 'Andmoor':
  //       videoElement = (
  //         <div className={videoClassName + ` facebook`} id={`iCube${index + 1}`}>
  //           <Andmoor
  //             url={videoItem.url}
  //             muted={muted[index]}
  //             paused={paused[index]}
  //             onEnd={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'facebook':
  //       videoElement = (
  //         <div className={videoClassName + ` facebook`} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`https://www.facebook.com/${videoItem.url}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'dailymotion':
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`https://www.dailymotion.com/embed/video/${videoItem.url}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'twitch_live':
  //       if(videoItem.live_now === 0 || videoItem.live_now === null)
  //       {
  //         videoElement = (
  //           <div className={videoClassName} id={`iCube${index + 1}`}>
  //               <StaticTwitch
  //                 url={`${videoItem.thumb ? videoItem.thumb : images.placeholderThumb}`}
  //                 onEnded={() => { this.onVideoEnd(index); }}
  //               />
  //           </div>
  //         )
  //       }
  //       else{
  //         videoElement = (
  //           <div className={videoClassName} id={`iCube${index + 1}`}>
  //             <ReactPlayer
  //               playing={!paused[index]}
  //               volume={1}
  //               muted={muted[index]}
  //               controls
  //               width='100%'
  //               height='100%'
  //               url={`${videoItem.interface}`}
  //               onEnded={() => { this.onVideoEnd(index); }}
  //             />
  //           </div>
  //         );
  //       }
  //       break;
  //     case 'twitch':
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`${videoItem.interface}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'vimeo':
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`https://player.vimeo.com/video/${videoItem.url}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'wista':
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`http://fast.wistia.net/embed/iframe/${videoItem.url}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //     case 'twitter':
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //          <TwitterVideoEmbed id={videoItem.url} options={{width:100}} />
  //          <button className="nextButton" onClick={() => this.onVideoEnd(index)}>Next</button>
  //         </div>
  //       );
  //       break;
  //     case 'html':
  //         if(index !== activeVideo)
  //         {
  //             videoClassName += ` html tethyrpreviewsmall`
  //         }
  //         videoElement = (
  //           <div className={videoClassName} id={`iCube${index + 1}`}>
  //             <div className="htmlTitle">
  //               <span className="cubeTitleHtml">
  //                 {videoItem.title}
  //                 <span></span>
  //               </span>
  //             </div>
  //             <Iframe url={`${videoItem.interface}`}
  //               width="100%"
  //               height="100%"
  //               className="myClassname"
  //               allow="fullscreen"
  //               display="initial"
  //               position="relative"
  //               onLoad={
  //                 (e) => {
  //                   e.target.contentWindow.postMessage('hello', "*");
  //                 }
  //               }
  //               />
    
  //           </div>
  //         );
  //       break;
  //     case 'slide':
  //       if(index !== activeVideo)
  //       {
  //           videoClassName += ` html tethyrpreviewsmall`
  //       }
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <Iframe url={`${videoItem.interface}`}
  //             width="100%"
  //             height="100%"
  //             className="myClassname"
  //             allow="fullscreen"
  //             display="initial"
  //             position="relative"
  //             onLoad={
  //               (e) => {
  //                 e.target.contentWindow.postMessage('hello', "*");
  //               }
  //             }
  //             />
    
  //         </div>
  //       );
  //       break;
  //     case 'Podcast':
  //       if(muted[index] === true && paused[index] === false)
  //       {
  //         paused[index] = true;
  //         this.setState({paused: paused});
  //       }
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <span className="cubePodcastTitle">
  //               {videoItem.title + ' : ' + videoItem.episode_title}
  //           </span>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='30%'
  //             url={`${videoItem.interface}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />   
  //         </div>
  //       );
  //       break;
  //     case 'Image':
  //         videoElement = (
  //           <div className={videoClassName + ` html tethyrpreviewsmall`} id={`iCube${index + 1}`}>
  //             <div className="ImageThumb">
    
  //               <img src={videoItem.thumb} style={{width : "100%", height : "100%"}} alt="Thumbnail"/>
    
  //             </div>
              
  //             <Iframe url={`${videoItem.interface}`}
  //               width="100%"
  //               height="100%"
  //               className="myClassname"
  //               allow="fullscreen"
  //               display="initial"
  //               position="relative"
  //               onLoad={
  //                 (e) => {
  //                   e.target.contentWindow.postMessage('hello', "*");
  //                 }
  //               }
  //               />
    
  //           </div>
  //         );
  //       break;
  //     case 'youtube':
  //     default:
  //       videoElement = (
  //         <div className={videoClassName} id={`iCube${index + 1}`}>
  //           <ReactPlayer
  //             playing={!paused[index]}
  //             volume={1}
  //             muted={muted[index]}
  //             controls
  //             width='100%'
  //             height='100%'
  //             url={`https://www.youtube.com/watch?v=${videoItem.url}`}
  //             onEnded={() => { this.onVideoEnd(index); }}
  //           />
  //         </div>
  //       );
  //       break;
  //   }
  // }

  render () {
    return (
      <div className='div-meta-editor-container'>
        <div className='div-top-container'>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6">
                <div className="preview">
                  {/* {this.videoItem} */}
                  This is the meta editor page
                </div>
              </div>
              <div className="col-12 col-lg-6">
                One of three columns
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Home)
