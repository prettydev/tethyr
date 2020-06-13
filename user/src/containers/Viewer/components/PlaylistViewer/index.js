import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faFilter, faCircle } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { CSVLink } from 'react-csv';
import withSizes from 'react-sizes'
import images from '../../../../constants/images';
import AddNewPlaylistModal  from './PlaylistViewerHeader/components/AddNewPlaylistModal'
import Master from './PlaylistViewerHeader/components/MasterComponent/index'
import Import from './PlaylistViewerHeader/components/ImportComponent/index'
import {
	setPlaylistAutoUpdate,
	setGridsetGanged
} from '../../../../actions';
import {
  selectPlaylist,
  selectPlaylistViewerHeight,
  selectImportContent,
  selectSearchContent,
  selectWikiShow,
  selectItem,
} from '../../../../redux/actions/viewer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Truncate from 'react-truncate';
import { swapUserItemOrder } from '../../../../services/UserItem'
import dragHandleIcon from '../../../../assets/images/videoItemIcons/item_drag_handle.png'
import placeholderAuthorImg from '../../../../assets/images/placeholder_images/author.png'
import placeholderItemThumb from '../../../../assets/images/placeholder_images/item.png'
import item_dot_on from '../../../../assets/images/videoItemIcons/item_dot_on.png'
import item_dot_off from '../../../../assets/images/videoItemIcons/item_dot_off.png'
import item_hidden_on from '../../../../assets/images/videoItemIcons/item_hidden_on.png'
import item_hidden_off from '../../../../assets/images/videoItemIcons/item_hidden_off.png'
import item_link from '../../../../assets/images/videoItemIcons/item_link.png'
import item_report from '../../../../assets/images/videoItemIcons/item_report.png'
import item_delete from '../../../../assets/images/videoItemIcons/item_delete.png'
import './styles.css';

const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		width                 : '300px'
	}
};

const height = {
  0: 'Hide',
  1: 'Short',
  2: 'Medium',
  3: 'Full',
}

const sizes = {
  0: 'Small',
  1: 'Medium',
  2: 'Large',
}

const zoomLevels = {
  0: 'Tiny',
  1: 'Small',
  2: 'Normal',
  3: 'Large',
  4: 'X-Large',
}

const lines = 3

class PlaylistViewer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen : false,
      show_filter : false,
      textSize: 0,
      thumbSize: 0,
      zoomLevel: 2,
		};

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	toggleFilter = () => {
		const { show_filter } = this.state;

		this.setState({
			show_filter : !show_filter
		})
	}

	setAutoUpdate = (playlist) => {
		const { setPlaylistAutoUpdate, selectPlaylist } = this.props;
		setPlaylistAutoUpdate(playlist.id, playlist.playlist_auto_update)
		.then(res=>{
				this.props.updatePlaylist(selectPlaylist);
		})
		.catch(err=>{console.log(err)})
	}

	setGangedPlaylist = (playlist) => {
		const { setGridsetGanged, gridsets, user } = this.props;
		setGridsetGanged(gridsets[user].id, playlist.id, playlist.playlist_ganged)
		.then(res=>{
			if(res.success) {
				this.props.updateGangedGridset();
			}
			else {
				alert("You can't make this gridset as ganged because each playlist must have the same length of items!")
			}
		})
		.catch(err=>{console.log(err)})
	}

  onPlaylistSelect = (event) => {
    const playlist_id = event.target.selectedIndex;
    this.props.dispatch(selectPlaylist(playlist_id))
  }

  handleSizeChange = (value, size) => {
    this.setState({
      [value] : size,
    })
  }

  handlePlaylistViewerHeightChange = (height) => {
    this.props.dispatch(selectPlaylistViewerHeight(height))
  }

  handleZoomLevelChange = (val) => {
    let zoomVal = 1
    if(val === 4)
      zoomVal = 1.2
    else if(val === 2)
      zoomVal = 0.9
    else if(val === 1)
      zoomVal = 0.8
    else if(val === 0)
      zoomVal = 0.7
    else
      zoomVal = 1

    document.getElementById('topHeaderBar').style.zoom = zoomVal;
    document.getElementById('mainViewer').style.zoom = zoomVal;
    document.getElementById('playlistViewer').style.zoom = zoomVal;
    
    this.setState( {zoomLevel: val} );
  }

  toggleImport = () => {
    const { viewer } = this.props;
    this.props.dispatch(selectImportContent(!viewer.importContent))
  }

  toggleSearch = () => {
    const { viewer } = this.props;
    this.props.dispatch(selectSearchContent(!viewer.searchContent))
  }

  toggleWiki = () => {
    const { viewer } = this.props;
    this.props.dispatch(selectWikiShow(!viewer.showWiki))
  }

  onClickItem = (index) => {
    this.props.dispatch(selectItem(index));
  }

  itemInterface = (item) => {
    const interfaceUrl = item.interface_link;
    window.open(interfaceUrl, 'name');
  }

	render() {
		const { wideSize, mediumSize, narrowSize } = this.props;
		const { resetPlaylist, addNewPlaylist, addLog, updatedItems, importContent, searchContent, ImportVideos, gangedGridset} = this.props;
		const { dotFilter, hideFilter, searchFilter } = this.props;
		const { settingsHeight, dot_filter, hide_filter, showPlaylist, playlist, gridsets,  openPlaylist, previewPlaylists_id} = this.props;
		const { fileName, Data, headers } = this.props;
		const { show_filter, textSize, thumbSize, zoomLevel } = this.state;
    const { user, viewer, playlists, items } = this.props;
    console.log(viewer)
		return (
      <div id="playlistViewer" className={classNames('PlaylistViewer', height[viewer.playlistViewerHeight])}>
        <div className="settings">
          <div className="textThumbSize" >
            {
              textSize === 0 && <img src={images.btnSettingTextSm} className="settingsImageBtn" alt="smallText" />
            }
            {
              textSize === 1 && <img src={images.btnSettingTextMd} className="settingsImageBtn" alt="mediumText" />
            }
            {
              textSize === 2 && <img src={images.btnSettingTextLg} className="settingsImageBtn" alt="largeSize" />
            }
            <div className="textThumbSizeDropdownMenu">
              <img onClick={() => this.handleSizeChange("textSize", 0)} src={textSize === 0 ? images.btnSettingTextSm_active : images.btnSettingTextSm} className = "settingsImageBtn" alt="smallText" />
              <img onClick={() => this.handleSizeChange("textSize", 1)} src={textSize === 1 ? images.btnSettingTextMd_active : images.btnSettingTextMd} className = "settingsImageBtn" alt="mediumText" />
              <img onClick={() => this.handleSizeChange("textSize", 2)} src={textSize === 2 ? images.btnSettingTextLg_active : images.btnSettingTextLg} className = "settingsImageBtn" alt="largeSize" />
            </div>
          </div>

          <div className="textThumbSize">
            {
              thumbSize === 0 && <img src={images.btnSettingThumbSm} className="settingsImageBtn" alt="smallThumb" />
            }
            {
              thumbSize === 1 && <img src={images.btnSettingThumbMd} className="settingsImageBtn" alt="mediumThumb" />
            }
            {
              thumbSize === 2 && <img src={images.btnSettingThumbLg} className="settingsImageBtn" alt="largeThumb" />
            }
            <div className="textThumbSizeDropdownMenu">
              <img onClick={() => this.handleSizeChange("thumbSize", 0)} src={thumbSize === 0 ? images.btnSettingThumbSm_active : images.btnSettingThumbSm} className = "settingsImageBtn" alt="smallThumb" />
              <img onClick={() => this.handleSizeChange("thumbSize", 1)} src={thumbSize === 1 ? images.btnSettingThumbMd_active : images.btnSettingThumbMd} className = "settingsImageBtn" alt="mediumThumb" />
              <img onClick={() => this.handleSizeChange("thumbSize", 2)} src={thumbSize === 2 ? images.btnSettingThumbLg_active : images.btnSettingThumbLg} className = "settingsImageBtn" alt="largeThumb" />
            </div>
          </div>

          <div className="zoomHeightSetting">
            <label>Playlist Height :</label>
            <button onClick={() => this.handlePlaylistViewerHeightChange(0)} className = {viewer.playlistViewerHeight === 0 ? 'selected' : ''}>Hide</button>
            <button onClick={() => this.handlePlaylistViewerHeightChange(1)} className = {viewer.playlistViewerHeight === 1 ? 'selected' : ''}>Short</button>
            <button onClick={() => this.handlePlaylistViewerHeightChange(2)} className = {viewer.playlistViewerHeight === 2 ? 'selected' : ''}>Medium</button>
            <button onClick={() => this.handlePlaylistViewerHeightChange(3)} className = {viewer.playlistViewerHeight === 3 ? 'selected' : ''}>Full</button>
          </div>

          <div className="zoomHeightSetting">
            <label>Zoom Level :</label>
            <button onClick={() => this.handleZoomLevelChange(0)} className = {zoomLevel === 0 ? 'selected' : ''}>Tiny</button>
            <button onClick={() => this.handleZoomLevelChange(1)} className = {zoomLevel === 1 ? 'selected' : ''}>Small</button>
            <button onClick={() => this.handleZoomLevelChange(2)} className = {zoomLevel === 2 ? 'selected' : ''}>Normal</button>
            <button onClick={() => this.handleZoomLevelChange(3)} className = {zoomLevel === 3 ? 'selected' : ''}>Large</button>
            <button onClick={() => this.handleZoomLevelChange(4)} className = {zoomLevel === 4 ? 'selected' : ''}>X-Large</button>
          </div>

          <div className="narrow-menu zoomHeightSetting">
            <label>Playlist Height :</label>
            <div className="zoomHeightSettingDropdown">
              <button className="selected">{height[viewer.playlistViewerHeight]}</button>
              <div className="zoomHeightSettingDropdownMenu">
                <button onClick={() => this.handlePlaylistViewerHeightChange(0)} className = {viewer.playlistViewerHeight === 0 ? 'selected' : ''}>Hide</button>
                <button onClick={() => this.handlePlaylistViewerHeightChange(1)} className = {viewer.playlistViewerHeight === 1 ? 'selected' : ''}>Short</button>
                <button onClick={() => this.handlePlaylistViewerHeightChange(2)} className = {viewer.playlistViewerHeight === 2 ? 'selected' : ''}>Medium</button>
                <button onClick={() => this.handlePlaylistViewerHeightChange(3)} className = {viewer.playlistViewerHeight === 3 ? 'selected' : ''}>Full</button>
              </div>
            </div>
          </div>

          <div className="narrow-menu zoomHeightSetting">
            <label>Zoom Level :</label>
            <div className="zoomHeightSettingDropdown">
              <button className='selected'>{zoomLevels[zoomLevel]}</button>
              <div className="zoomHeightSettingDropdownMenu">
                <button onClick={() => this.handleZoomLevelChange(0)} className = {zoomLevel === 0 ? 'selected' : ''}>Tiny</button>
                <button onClick={() => this.handleZoomLevelChange(1)} className = {zoomLevel === 1 ? 'selected' : ''}>Small</button>
                <button onClick={() => this.handleZoomLevelChange(2)} className = {zoomLevel === 2 ? 'selected' : ''}>Normal</button>
                <button onClick={() => this.handleZoomLevelChange(3)} className = {zoomLevel === 3 ? 'selected' : ''}>Large</button>
                <button onClick={() => this.handleZoomLevelChange(4)} className = {zoomLevel === 4 ? 'selected' : ''}>X-Large</button>
              </div>
            </div>
          </div>
        </div>
        <div className="header">
          <div className="mainBar">
            <img src={images.btnPlaylistFeatureOff}  className="btnPlaylistFeature" alt="btnPlaylistFeature" />
            <FontAwesomeIcon className={show_filter ? `filterBtn on` : `filterBtn`} icon={faFilter} onClick={this.toggleFilter} />
            <span className="cubeName">
              {wideSize && 'Cube'} {!wideSize && 'C'} {viewer.activeCube + 1}
            </span>
            <div className="actionBar">
                { playlists.length !== 0 &&
                  <select value={playlists[viewer.playlist].id} onChange={this.onPlaylistSelect} disabled={playlists[viewer.playlist].playlist_ganged ? true : false}>
                    {
                      playlists.map((playlist, idx) => {
                        return <option key={idx} value={playlist.id} disabled={playlist.playlist_ganged ? true : false}>{playlist.title}</option>;
                      })
                    }
                  </select>
                }
                { playlists.length === 0 &&
                  <select value="empty" disabled>
                    <option value="empty" disabled>No Playlists!</option>
                  </select>
                }
                <div className="dropdown">
                  <button className='selected action'>
                    {wideSize && 'Playlist Actions'}
                    {!wideSize && 'List Actions'}
                  </button>
                  {/* <div className="dropdownbuttons action">
                    <AddNewPlaylistModal
                      addNewPlaylist = {addNewPlaylist}
                      gridset = {gridsets[user]}
                      addLog = {addLog}
                      gangedGridset = {gangedGridset}
                    />
                    <button><CSVLink filename={`${fileName}.csv`} data={Data} headers={headers} style={{color:"white"}}>Export T.csv</CSVLink></button>
                    <Import
                      items = {items}
                      playlist = {playlists[selectPlaylist]}
                      ImportVideos = {ImportVideos}
                      gangedGridset = {gangedGridset}
                    />
                    <Master
                      items = {items}
                      playlist = {playlists[selectPlaylist]}
                    />
                    { (playlist[0] !== null && playlist.length !== 0) &&
                      <React.Fragment>
                        <button onClick = {this.openModal} style={ gangedGridset ? {background : '#CCC'} : {color:"white"}} disabled = {gangedGridset ? true : false}>Update from Master</button>
                        <button className="selected" style={gangedGridset? {background : '#CCC'} : {}} onClick = {() => this.setAutoUpdate(playlists[selectPlaylist])} disabled = {gangedGridset ? true : false}>{ playlists[selectPlaylist].playlist_auto_update === 0 ? 'Auto Update : Off' :  'Auto Update : On' }</button>
                        <button className="selected" onClick={() => this.setGangedPlaylist(playlists[selectPlaylist])}>{ playlists[selectPlaylist].playlist_ganged === 0 ? 'Gang Playback : Off' :  'Gang Playback : ON' }</button>
                      </React.Fragment>
                    }
                  </div> */}
                </div>

                <button className="importBtn" style={gangedGridset ? {cursor: 'not-allowed'} : {}} onClick={this.toggleImport} disabled = {gangedGridset ? true :false}>
                  {wideSize && 'Import Content'}
                  {!wideSize && 'Import'}
                </button>
                <button className="searchBtn" style={gangedGridset ? {cursor: 'not-allowed'} : {}} onClick={this.toggleSearch} disabled = {gangedGridset ? true :false}>
                  {wideSize && 'Search Content'}
                  {!wideSize && 'Search'}
                </button>
                <button className='wikiBtn' onClick = {this.toggleWiki}>Wiki</button>
                <div className="desktop-menu dropdown">
                  <button className='selected'>Playlist View</button>
                  {/* <div className="dropdownbuttons">
                    <button>Grid</button>
                    <button>Thumbs</button>
                    <button className="selected">List</button>
                  </div> */}
                </div>
                <div className="desktop-menu dropdown">
                  <button className='selected'>Show: Content</button>
                  {/* <div className="dropdownbuttons">
                    <button>Content & Tags</button>
                    <button>Tags</button>
                    <button className="selected">Content</button>
                  </div> */}
                </div>
            </div>
            <div className="narrow-menu actionBar">
              <div className="dropdown">
                { playlists.length !== 0 &&
                  <select value={playlists[viewer.playlist].id} onChange={this.onPlaylistSelect} disabled={playlists[viewer.playlist].playlist_ganged ? true : false}>
                    {
                      playlists.map((playlist, idx) => {
                        return <option key={idx} value={playlist.id} disabled={playlist.playlist_ganged ? true : false}>{playlist.title}</option>;
                      })
                    }
                  </select>
                }
                { playlists.length === 0 &&
                  <select value="empty" disabled>
                    <option value="empty" disabled>No Playlists!</option>
                  </select>
                }
              </div>
              {/* <div className="dropdown" style={{marginLeft: '30px'}}>
                <img src={images.btnPlaylistHeadPlaylistActions}  className="imgbutdropdown" alt="Playlist Selection" title="Playlist Selection"/>
                <div className="dropdownbuttons action">
                  <AddNewPlaylistModal
                    addNewPlaylist = {addNewPlaylist}
                    gridset = {gridsets[user]}
                    addLog = {addLog}
                    gangedGridset = {gangedGridset}
                  />
                  <button>
                    <CSVLink filename={`${fileName}.csv`} data={Data} headers={headers} style={{color:"white"}}>Export T.csv</CSVLink>
                  </button>
                  <Import
                    items = {items}
                    playlist = {playlists[selectPlaylist]}
                    ImportVideos = {ImportVideos}
                    gangedGridset = {gangedGridset}
                  />
                  <Master
                    items={items}
                    playlist={playlists[selectPlaylist]}
                  />
                  { (playlist[0] !== null && playlist.length !== 0) &&
                    <React.Fragment>
                      <button onClick = {this.openModal} style={ gangedGridset ? {background : '#CCC'} : {color:"white"}} disabled = {gangedGridset ? true : false}>Update from Master</button>
                      <button className="selected" style={gangedGridset? {background : '#CCC'} : {}} onClick={() => this.setAutoUpdate(playlists[selectPlaylist])} disabled = {gangedGridset ? true : false}>{ playlists[selectPlaylist].playlist_auto_update === 0 ? 'Auto Update : Off' :  'Auto Update : On' }</button>
                      <button className="selected" onClick={() => this.setGangedPlaylist(playlists[selectPlaylist])}>{ playlists[selectPlaylist].playlist_ganged === 0 ? 'Gang Playback : Master' :  'Gang Playback : Master' }</button>
                    </React.Fragment>
                  }
                </div>
              </div> */}

              { importContent &&
                <img src={images.btnPlaylistHeadImportContentOn} style={gangedGridset ? {cursor: 'not-allowed', opacity : '0.5', marginLeft: '10px', pointerEvents : 'none'} : {marginLeft: '10px'}} onClick={this.toggleImport} className="butvideoaudioplaylist" alt="importContent" title="importContent"/>
              }
              { !importContent &&
                <img src={images.btnPlaylistHeadImportContent} style={gangedGridset ? {cursor: 'not-allowed', opacity : '0.5', marginLeft: '10px', pointerEvents : 'none'} : {marginLeft: '10px'}} onClick={this.toggleImport} className="butvideoaudioplaylist" alt="importContent" title="importContent"/>
              }
              { searchContent &&
                <img src={images.btnPlaylistHeadSearchContentOn} style={gangedGridset ? {cursor: 'not-allowed', opacity : '0.5', marginLeft: '10px', pointerEvents : 'none'} : {marginLeft: '10px'}} onClick={this.oggleSearch} className="butvideoaudioplaylist" alt="searchContent" title="searchContent"/>
              }
              { !searchContent &&
                <img src={images.btnPlaylistHeadSearchContent} style={gangedGridset ? {cursor: 'not-allowed', opacity : '0.5', marginLeft: '10px', pointerEvents : 'none'} : {marginLeft: '10px'}} onClick={this.toggleSearch} className="butvideoaudioplaylist" alt="searchContent" title="searchContent"/>
              }
              <img src={images.btnPlaylistHeadWiki} onClick = {this.toggleWiki} className="butvideoaudioplaylist" alt="wiki" title="wiki"  style={{marginLeft: '10px'}}/>
            </div>
          </div>
          {
            show_filter &&
            <div className="filterBar">
              <span>FILTERS: </span>
              <img onClick={dotFilter} src={ dot_filter ? images.playlistControlsDotOn : images.playlistControlsDotOff}  className="filterBtn" alt="ratingRadio" title="Show Dots" />
              <img onClick={hideFilter} src={ hide_filter ? images.playlistControlsHideOn : images.playlistControlsHideOff } className="filterBtn" alt="hidePlaylist" title="Show/Hide"/>
              <input onChange={searchFilter} type="text" placeholder="Search all fields" className="filterInput" />
              {/* <div>
                <div className="desktop-menu dropdown">
                  <button className='selected'>
                    <FontAwesomeIcon className={`filterBtn on`} icon={faCircle}  />Categories
                  </button>
                  <div className="dropdownbuttons">
                    <button>Populated with category and game names</button>
                    <button className="selected">Populated with category and game names</button>
                    <button>Reset Selections</button>
                  </div>
                </div>
                <div className="desktop-menu dropdown">
                  <button className='selected'>
                    <FontAwesomeIcon className={`filterBtn on`} icon={faCircle}  />Users
                  </button>
                  <div className="dropdownbuttons">
                    <button>Populated with author names</button>
                    <button>Reset Selections</button>
                  </div>
                </div>
                <div className="desktop-menu dropdown">
                  <button className='selected'>
                    <FontAwesomeIcon className={`filterBtn on`} icon={faCircle}  />Length
                  </button>
                  <div className="dropdownbuttons">
                    <button>Live Now</button>
                    <button>Less than 2 minutes</button>
                    <button>Reset Selections</button>
                  </div>
                </div>
                <div className="desktop-menu dropdown">
                  <button className='selected'>
                    <FontAwesomeIcon className={`filterBtn`} icon={faCircle}  />Location
                  </button>
                  <button className='selected'>
                    <FontAwesomeIcon className={`filterBtn`} icon={faCircle}  />Platform
                  </button>
                </div>
              </div> */}
            </div>
          }
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences"
            >
            <h5>Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences</h5>
            <div style={{display: "flex", justifyContent:"space-between"}}>
              <button style={{width:"100px"}} onClick={resetPlaylist}>Yes</button>
              <button style={{width:"100px"}} onClick={this.closeModal}>No</button>
            </div>
          </Modal>
        </div>
        <div className={classNames('playlistViewerBody', {'viewer-height': show_filter}, sizes[textSize])}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, droppableSnapshot) => {
                return (
                  <div ref={provided.innerRef} className="video_items">
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={classNames('video_item', {'playingItem': index === viewer.item})}
                            ref={provided.innerRef}
                            onClick={() => this.onClickItem(index)}
                            isDragging={snapshot.isDragging}
                            isDraggingOver={droppableSnapshot.isDraggingOver}
                            isHovered={snapshot.isDragging}
                            isFocused={
                              droppableSnapshot.isDraggingOver ? snapshot.isDragging : undefined
                            }
                            {...provided.draggableProps.style}
                            {...provided.draggableProps}
                          >
                            <div className="item_header">
                              <div className="item_platform">
                                <img src={require(`../../../../assets/images/broadcasters/${item.video_type.toLowerCase()}.png`)} alt={item.type}/>
                              </div>
                              <div className="item_title">
                                { item.video_type.toLowerCase() === 'podcast' ? item.video_title + ' : ' + item.episode_title : item.video_title }
                              </div>
                              <div className="item_author">
                                <div className="item_author_img">
                                  {
                                    item.author_img ?
                                    <img src={item.author_img} /> :
                                    <img src={placeholderAuthorImg} alt="item"/>
                                  }
                                </div>
                                <div className="item_author_name">
                                  {item.author}
                                </div>
                              </div>
                            </div>
                            <div className="item_content">
                              <div className={classNames("item_thumb", sizes[thumbSize])}>
                                {
                                  item.thumb ?
                                  <img src={item.thumb} alt="videoThumb"/>:
                                  <img src={placeholderItemThumb} alt="videoThumb"/>                                
                                }
                              </div>
                              <div className="item_description">
                                <Truncate 
                                  lines={!item.expanded && lines} 
                                  ellipsis={<span>... <button className="truncate_btn" onClick={(e) => this.toggleLines(item, e)}>Click to expand</button></span>}
                                >
                                  {item.description}
                                </Truncate>
                                {item.expanded &&
                                  <span className="less-btn-box"><button className="truncate_btn" onClick={(e) => this.toggleLines(item, e)}>Show Less</button></span>
                                }
                                <div className="item_category">CATEGORY <span style={{color: "white"}}>Trees and Shrubbery</span> TAGS <span style={{color: "white"}}> Rules, Dogs, Hats, Get Over Here, Killers</span></div>
                              </div>
                            </div>
                            <div className="item_footer">
                              <div className="item_length">{item.length} {item.sponsored === 1 && <span className="item_sponsored">SPONSORED</span>}</div>
                              <div className="item_actions">
                                <img src={item.dotted ? item_dot_on : item_dot_off} className="action_icon" alt="dot" title="Dot this" />
                                <img src={item.hidden ? item_hidden_on : item_hidden_off} className="action_icon" alt="hidePlaylist" title="Hide this" />
                                <img src={item_report} className="action_icon" alt="brokenBtn" title="Flag this"/>
                                <img src={item_delete} className="action_icon" alt="removeBtn" title="Remove this"/>
                                <img src={item_link} onClick={() =>this.itemInterface(item)} className="action_icon" alt="interfaceBtn" title="Open Source"/>
                                <img src={dragHandleIcon} className="action_icon" id={item.id} {...provided.dragHandleProps} />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		viewer: state.viewer,
	}
}

export default connect(mapStateToProps)(PlaylistViewer);