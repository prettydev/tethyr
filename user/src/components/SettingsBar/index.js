import React from 'react';

import images from '../../constants/images';
import './styles.scss';

class SettingsBar extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show1:false,
            show2:false
        }
    }
    toggleBtn1=()=>{
        const{show1}=this.state;
        this.setState({show1:!show1})
    }
    toggleBtn2=()=>{
        const{show2}=this.state;
        this.setState({show2:!show2})
    }
    render() {
        const { handleSettingsHeightChange, handleTextSizeChange, handleThumbSizeChange, handleZoomLevelChange } = this.props;
        const { settingsHeight, textSize, thumbSize, zoomLevel } = this.props;
        let showZoom = true;
        const{show1,show2}=this.state;
        if(this.props.hideZoomButton) {
            showZoom = false
            console.log('hide Zoom')
        }

        return (
            <div name="settingsBar" className={'settingsBar ' + settingsHeight}>



                <div className="desktop-menu" style={{marginLeft:'40px'}}>
                    <span>
                    <img onClick={() => handleSettingsHeightChange("hide")} src={settingsHeight==="hide"? images.settings_bar_pList_height_1_on:images.settings_bar_pList_height_1_off} alt="Set Playlist Height"/> 
                    <img onClick={() => handleSettingsHeightChange("short")} src={settingsHeight==="short"? images.settings_bar_pList_height_2_on:images.settings_bar_pList_height_2_off} alt="Set Playlist Height"/>
                    <img onClick={() => handleSettingsHeightChange("medium")} src={settingsHeight==="medium"? images.settings_bar_pList_height_3_on:images.settings_bar_pList_height_3_off} alt="Set Playlist Height"/>
                    <img onClick={() => handleSettingsHeightChange("full")} src={settingsHeight==="full"? images.settings_bar_pList_height_4_on:images.settings_bar_pList_height_4_off} alt="Set Playlist Height"/>
                    </span>
                
                </div>
                <div className="medium-menu narrow-menu" style={{marginLeft: '20px'}}>
                <span>
                    <img onClick={() => handleSettingsHeightChange("hide")} src={settingsHeight==="hide"? images.settings_bar_pList_height_1_on:images.settings_bar_pList_height_1_off} alt="Set Playlist Height"/> 
                    <img onClick={() => handleSettingsHeightChange("short")} src={settingsHeight==="short"? images.settings_bar_pList_height_2_on:images.settings_bar_pList_height_2_off} alt="Set Playlist Height"/>
                    <img onClick={() => handleSettingsHeightChange("medium")} src={settingsHeight==="medium"? images.settings_bar_pList_height_3_on:images.settings_bar_pList_height_3_off} alt="Set Playlist Height"/>
                    <img onClick={() => handleSettingsHeightChange("full")} src={settingsHeight==="full"? images.settings_bar_pList_height_4_on:images.settings_bar_pList_height_4_off} alt="Set Playlist Height"/>
                    </span>
                </div>

                <div className="thumb">
                    <div className={ 'dropdown ' + settingsHeight + (show1? ' show1' : '')} >
                        {
                            textSize === 'small' && <img src={images.btnSettingTextSm} className="settingsImageBtn dd_btn" alt="settingsTextSize" title="Text Size" onClick={this.toggleBtn1}/>
                        }
                        {
                            textSize === 'medium' && <img src={images.btnSettingTextMd} className="settingsImageBtn dd_btn" alt="settingsTextSize" title="Text Size" onClick={this.toggleBtn1}/>
                        }
                        {
                            textSize === 'large' && <img src={images.btnSettingTextLg} className="settingsImageBtn dd_btn" alt="settingsTextSize" title="Text Size" onClick={this.toggleBtn1}/>
                        }
                        <div className={ 'imagedropdownbuttons ' + settingsHeight }>
                            <img onClick={() => handleTextSizeChange("small")} src={textSize === "small" ? images.btnSettingTextSm_active : images.btnSettingTextSm} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
                            <img onClick={() => handleTextSizeChange("medium")} src={textSize === "medium" ? images.btnSettingTextMd_active : images.btnSettingTextMd} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
                            <img onClick={() => handleTextSizeChange("large")} src={textSize === "large" ? images.btnSettingTextLg_active : images.btnSettingTextLg} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
                        </div>
                    </div>

                    <div className={ 'dropdown ' + settingsHeight + (show2? ' show2' : '')} style={{marginLeft: '10px'}}>
                        {
                            thumbSize === 'small' && <img src={images.btnSettingThumbSm} onClick={this.toggleBtn2} className="settingsImageBtn dd_btn" alt="settingsThumbSize" title="Thumb Size"/>
                        }
                        {
                            thumbSize === 'medium' && <img src={images.btnSettingThumbMd} onClick={this.toggleBtn2} className="settingsImageBtn dd_btn" alt="settingsThumbSize" title="Thumb Size"/>
                        }
                        {
                            thumbSize === 'large' && <img src={images.btnSettingThumbLg} onClick={this.toggleBtn2} className="settingsImageBtn dd_btn" alt="settingsThumbSize" title="Thumb Size"/>
                        }
                        <div className={ 'imagedropdownbuttons ' + settingsHeight}>
                            <img onClick={() => handleThumbSizeChange("small")} src={thumbSize === "small" ? images.btnSettingThumbSm_active : images.btnSettingThumbSm} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size" />
                            <img onClick={() => handleThumbSizeChange("medium")} src={thumbSize === "medium" ? images.btnSettingThumbMd_active : images.btnSettingThumbMd} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size" />
                            <img onClick={() => handleThumbSizeChange("large")} src={thumbSize === "large" ? images.btnSettingThumbLg_active : images.btnSettingThumbLg} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size" />
                        </div>
                    </div>
                    <a href="https://tawk.to/chat/5d76d6e4eb1a6b0be60bce72/default" target="_blank" rel="noopener noreferrer"><button className="chat-help">Chat Help</button></a>
                </div>
            
              
                { showZoom ? <div className="desktop-menu" style={{marginLeft: 'calc(50% - 600px)'}}>
                    <span style={{float: 'right',marginRight:"-40%"}}>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("tiny")} src={zoomLevel==="tiny"? images.settings_bar_zoom_size_1_on:images.settings_bar_zoom_size_1_off}/> 
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("small")} src={zoomLevel==="small"? images.settings_bar_zoom_size_2_on:images.settings_bar_zoom_size_2_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("normal")} src={zoomLevel==="normal"? images.settings_bar_zoom_size_3_on:images.settings_bar_zoom_size_3_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("large")} src={zoomLevel==="large"? images.settings_bar_zoom_size_4_on:images.settings_bar_zoom_size_4_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("xlarge")} src={zoomLevel==="xlarge"? images.settings_bar_zoom_size_5_on:images.settings_bar_zoom_size_5_off}/> 
                    </span>
                </div> : '' }

          
 
                { showZoom ? <div className="medium-menu narrow-menu"  >
                     <span style={{float: 'right'}}>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("tiny")} src={zoomLevel==="tiny"? images.settings_bar_zoom_size_1_on:images.settings_bar_zoom_size_1_off}/> 
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("small")} src={zoomLevel==="small"? images.settings_bar_zoom_size_2_on:images.settings_bar_zoom_size_2_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("normal")} src={zoomLevel==="normal"? images.settings_bar_zoom_size_3_on:images.settings_bar_zoom_size_3_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("large")} src={zoomLevel==="large"? images.settings_bar_zoom_size_4_on:images.settings_bar_zoom_size_4_off}/>
                    <img alt="zoom level" onClick={() => handleZoomLevelChange("xlarge")} src={zoomLevel==="xlarge"? images.settings_bar_zoom_size_5_on:images.settings_bar_zoom_size_5_off}/> 
                    </span>
                </div> : '' }

                
            </div>
        );
    }
}
export default SettingsBar;
