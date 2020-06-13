import React from 'react';

import images from '../../../../../constants/images';
import './styles.scss';

class PlaylistViewerSetting extends React.Component {
	
	render() {
		const { handleSettingsHeightChange, handleTextSizeChange, handleThumbSizeChange, handleZoomLevelChange } = this.props;
		const { settingsHeight, textSize, thumbSize, zoomLevel } = this.props;
		let showZoom = true;

		if(this.props.hideZoomButton) {
			showZoom = false
			console.log('hide Zoom')
		}

		return (
			<div name="PlaylistViewerSetting" className={'PlaylistViewerSetting ' + settingsHeight} title="PlaylistViewerSetting">
				<div>
					<div className={ 'dropdown ' + settingsHeight} >
						{
							textSize === 'small' && <img src={images.btnSettingTextSm} className="settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
						}
						{
							textSize === 'medium' && <img src={images.btnSettingTextMd} className="settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
						}
						{
							textSize === 'large' && <img src={images.btnSettingTextLg} className="settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
						}
						<div className={ 'imagedropdownbuttons ' + settingsHeight}>
							<img onClick={() => handleTextSizeChange("small")} src={textSize === "small" ? images.btnSettingTextSm_active : images.btnSettingTextSm} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
							<img onClick={() => handleTextSizeChange("medium")} src={textSize === "medium" ? images.btnSettingTextMd_active : images.btnSettingTextMd} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
							<img onClick={() => handleTextSizeChange("large")} src={textSize === "large" ? images.btnSettingTextLg_active : images.btnSettingTextLg} className = "settingsImageBtn" alt="settingsTextSize" title="Text Size"/>
						</div>
					</div>

					<div className={ 'dropdown ' + settingsHeight} style={{marginLeft: '10px'}}>
						{
							thumbSize === 'small' && <img src={images.btnSettingThumbSm} className="settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
						}
						{
							thumbSize === 'medium' && <img src={images.btnSettingThumbMd} className="settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
						}
						{
							thumbSize === 'large' && <img src={images.btnSettingThumbLg} className="settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
						}
						<div className={ 'imagedropdownbuttons ' + settingsHeight}>
							<img onClick={() => handleThumbSizeChange("small")} src={thumbSize === "small" ? images.btnSettingThumbSm_active : images.btnSettingThumbSm} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
							<img onClick={() => handleThumbSizeChange("medium")} src={thumbSize === "medium" ? images.btnSettingThumbMd_active : images.btnSettingThumbMd} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
							<img onClick={() => handleThumbSizeChange("large")} src={thumbSize === "large" ? images.btnSettingThumbLg_active : images.btnSettingThumbLg} className = "settingsImageBtn" alt="settingsThumbSize" title="Thumb Size"/>
						</div>
					</div>
				</div>

				<div className="desktop-menu medium-menu" style={{marginLeft:'40px'}}>
					<span>Playlist Height : 
						<button onClick={() => handleSettingsHeightChange("hide")} className = {settingsHeight === "hide" ? 'selected' : ''}>Hide</button>
						<button onClick={() => handleSettingsHeightChange("short")} className = {settingsHeight === "short" ? 'selected' : ''}>Short</button>
						<button onClick={() => handleSettingsHeightChange("medium")} className = {settingsHeight === "medium" ? 'selected' : ''}>Medium</button>
						{/* <button onClick={() => this.handleSettingsHeightChange("tall")} className = {settingsHeight === "tall" ? 'selected' : ''}>Tall</button> */}
						<button onClick={() => handleSettingsHeightChange("full")} className = {settingsHeight === "full" ? 'selected' : ''}>Full</button>
					</span>
				
				</div>

			
				{/* <div style={{marginLeft: '150px'}}> */}
				{ showZoom ? <div className="desktop-menu" style={{marginLeft: 'calc(50% - 600px)'}}>
					<span style={{float: 'right'}}>Zoom Level :
						<button onClick={() => handleZoomLevelChange("tiny")} className = {zoomLevel === "tiny" ? 'selected' : ''}>Tiny</button>
						<button onClick={() => handleZoomLevelChange("small")} className = {zoomLevel === "small" ? 'selected' : ''}>Small</button>
						<button onClick={() => handleZoomLevelChange("normal")} className = {zoomLevel === "normal" ? 'selected' : ''}>Normal</button>
						<button onClick={() => handleZoomLevelChange("large")} className = {zoomLevel === "large" ? 'selected' : ''}>Large</button>
						<button onClick={() => handleZoomLevelChange("xlarge")} style={{width:100}} className = {zoomLevel === "xlarge" ? 'selected' : ''}>X-Large</button>
					</span>
				</div> : '' }

				<div className="narrow-menu" style={{marginLeft: '20px'}}>
					<label>Playlist Height : </label>
					<div className={ 'dropdown ' + settingsHeight} >
						<button className='selected' style={{textTransform : 'capitalize', marginLeft:'0'}}>{settingsHeight}</button>
						<div className={ 'dropdownbuttons ' + settingsHeight}>
							<label>Playlist</label>
							<button onClick={() => handleSettingsHeightChange("hide")} className = {settingsHeight === "hide" ? 'selected' : ''}>Hide</button>
							<button onClick={() => handleSettingsHeightChange("short")} className = {settingsHeight === "short" ? 'selected' : ''}>Short</button>
							<button onClick={() => handleSettingsHeightChange("medium")} className = {settingsHeight === "medium" ? 'selected' : ''}>Medium</button>
							{/* <button onClick={() => this.handleSettingsHeightChange("tall")} className = {settingsHeight === "tall" ? 'selected' : ''}>Tall</button> */}
							<button onClick={() => handleSettingsHeightChange("full")} className = {settingsHeight === "full" ? 'selected' : ''}>Full</button>
							
						</div>
					</div>
				</div>

 
				{ showZoom ? <div className="medium-menu narrow-menu five-items" style={{marginLeft: '20px'}}>
					<label>Zoom Level : </label>
					<div className={ 'dropdown ' + settingsHeight}>
						<button className='selected' style={{textTransform : 'capitalize', marginLeft:'0'}}>{zoomLevel}</button>
						<div className={ 'dropdownbuttons ' + settingsHeight}>
							<label>Zoom</label>
							<button onClick={() => handleZoomLevelChange("tiny")} className = {zoomLevel === "tiny" ? 'selected' : ''}>Tiny</button>
							<button onClick={() => handleZoomLevelChange("small")} className = {zoomLevel === "small" ? 'selected' : ''}>Small</button>
							<button onClick={() => handleZoomLevelChange("normal")} className = {zoomLevel === "normal" ? 'selected' : ''}>Normal</button>
							<button onClick={() => handleZoomLevelChange("large")} className = {zoomLevel === "large" ? 'selected' : ''}>Large</button>
							<button onClick={() => handleZoomLevelChange("xlarge")} style={{width:100}} className = {zoomLevel === "xlarge" ? 'selected' : ''}>X-Large</button>
							
						</div>
					</div>
				</div> : '' }
			</div>
		);
	}
}
export default PlaylistViewerSetting;
