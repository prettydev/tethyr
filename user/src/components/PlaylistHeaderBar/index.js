import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faFilter, faCircle } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from 'react-csv';
import withSizes from 'react-sizes'

import './styles.scss';
import images from '../../constants/images';
import AddNewPlaylistModal  from './components/AddNewPlaylistModal/index'
//import MetaUpdateButton  from './components/MetaUpdateButton/index'
import Master from './components/MasterComponent/index'
//import Import from './components/ImportComponent/index'



import {
    setPlaylistAutoUpdate,
    setGridsetGanged
} from '../../actions';


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

  
class PlaylistHeaderBar extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          playlist_feature_btn:false,
          modalIsOpen : false,
          show_filter : false,

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
    // playlist_control = () => {
    //     const { playlist_feature_btn } = this.state;
    //     this.setState({ playlist_feature_btn: !playlist_feature_btn});
    // }

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
            }
            else {
                alert("You can't make this gridset as ganged because each playlist must have the same length of items!")
            }
        })
        .catch(err=>{console.log(err)})
    }

     playlist_lock=()=>{
        const{playlist_lock_icon,showPlaylist}=this.props;
        if(showPlaylist===0){
            if(!playlist_lock_icon){
                return  <img src={images.pListHeader_lock_OFF}  className="butvideoaudioplaylist" alt="lockplaylistoff" title="Lock Playlist off" onClick={this.props.playlist_lock_control}/>
            }else{
               return <img src={images.pListHeader_lock_ON}  className="butvideoaudioplaylist" alt="lockplaylistoff" title="Lock Playlist on" onClick={this.props.playlist_lock_control} />
            }  
        }
        else{
            return <img src={images.pListHeader_lock_NA}  className="butvideoaudioplaylist" alt="lockplaylistNA" title="Lock Playlist not available"  />
        }
     }
    render() {
        const { wideSize, narrowSize } = this.props;
        const { onPlaylistSelect, toggleImport, toggleSearch, toggleWiki, resetPlaylist, addNewPlaylist, addLog,  importContent, searchContent,  gangedGridset} = this.props;
        const { dotFilter, hideFilter, searchFilter } = this.props;

        const { settingsHeight, dot_filter, hide_filter, showPlaylist, playlist, playlists, gridsets, user,  items,  selectPlaylist } = this.props;
        const { fileName, Data, headers } = this.props;
        const { show_filter, } = this.state;
        const{playlist_feature_btn}=this.props;
      


        return (
            (showPlaylist !== -1) &&
            <div name="playlistHeaderBar" className={'playlistHeaderBar ' + settingsHeight} title="playlistHeaderBar">
                <div className="mainBar">
                    {
                        !playlist_feature_btn && <img src={images.btnPlaylistFeatureOff}  className="butvideoaudioplaylist" alt="butvideoaudioplaylist" title="Feature Playlist" onClick={this.props.playlist_control} />   
                    }
                     {
                        playlist_feature_btn && <img src={images.btnPlaylistFeatureOn}  className="butvideoaudioplaylist" alt="butvideoaudioplaylist" title="Feature Playlist" onClick={this.props.playlist_control} />   
                    }
                    
                   
                    <FontAwesomeIcon className={show_filter ? `filterBtn on` : `filterBtn`} icon={faFilter} onClick={this.toggleFilter} />
                  
                    <span className="cubeName">
                        {wideSize && 'Cube'} {!wideSize && 'C'} {showPlaylist + 1}
                    </span>
                
                   {
                       this.playlist_lock()
                   }
                    <React.Fragment>
                        { (playlist[0] !== null && playlist.length !== 0) &&
                            <select value={playlist[showPlaylist].id} onChange={onPlaylistSelect} disabled={playlist[selectPlaylist].playlist_ganged ? true : false}>
                                {
                                    playlists.map((list, idx) => {
                                        return <option key={idx} value={list.id} disabled={list.playlist_ganged ? true : false}>{list.name}</option>;
                                    })
                                }
                            </select>
                        }
                    <div className="dropdown">
                        <button className='selected action'>
                            
                            {wideSize && 'Playlist Actions'}
                            {!wideSize && 'List Actions'}
                        </button>
                        <div className="dropdownbuttons action">
                            <AddNewPlaylistModal 
                              addNewPlaylist = {addNewPlaylist}
                              gridset = {gridsets[user]}
                              addLog = {addLog}
                              gangedGridset = {gangedGridset}
                            />
                            
                            {/* <Import
                              items = {items}
                              playlist = {playlists[selectPlaylist]}
                              gangedGridset = {gangedGridset}
                              ImportVideos = {ImportVideos}
                             
                            /> */}
                           
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
                            <button><CSVLink filename={`${fileName}.csv`} data={Data} headers={headers} style={{color:"white"}}>Export T.csv</CSVLink></button>
                        </div>
                    </div>
                    
                    
                    <button className="importBtn" onClick={toggleImport}>
                        {wideSize && 'Import Content'}
                        {!wideSize && 'Import'}
                        </button>
                    {/* <button className="searchBtn" onClick={toggleSearch}>
                        {wideSize && 'Search Content'}
                        {!wideSize && 'Search'}
                        </button> */}

                    <button className='wikiBtn' onClick = {toggleWiki}>Wiki</button>

                    <div className="desktop-menu dropdown">
                        <button className='selected'>Playlist View</button>
                        <div className="dropdownbuttons">
                            <button onClick={()=>{this.props.playlist_view(false)}}>Title</button>
                            <button onClick={()=>{this.props.playlist_view(true)}}>Title & Description</button>
                            
                        </div>
                    </div>

                    {/* <div className="desktop-menu dropdown">
                        <button className='selected'>Show: Content</button>
                        <div className="dropdownbuttons">
                            <button>Content & Tags</button>
                            <button>Tags</button>
                            <button className="selected">Content</button>
                        </div>
                    </div> */}
                    </React.Fragment>
                    
                    { narrowSize && 
                        <React.Fragment>
                        
                        <div className="dropdown">
                            <img src={images.btnPlaylistHeadPlaylist}  className="imgbutdropdown" alt="Playlist Selection" title="Playlist Selection" />
                            <div className="dropdownbuttons" style={{width: '200px'}}>
                            { (playlist[0] !== null && playlist.length !== 0) &&
                                <select value={playlist[showPlaylist].id} onChange={onPlaylistSelect} disabled={playlist[selectPlaylist].playlist_ganged ? true : false}>
                                    {
                                        playlists.map((list, idx) => {
                                            return <option key={idx} value={list.id}>{list.name}</option>;
                                        })
                                    }
                                </select>
                            }
                            </div>
                        </div>
                        <div className="dropdown" style={{marginLeft: '30px'}}>
                            <img src={images.btnPlaylistHeadPlaylistActions}  className="imgbutdropdown" alt="Playlist Selection" title="Playlist Selection"/>
                            <div className="dropdownbuttons action">
                                <AddNewPlaylistModal 
                                  addNewPlaylist = {addNewPlaylist}
                                  gridset = {gridsets[user]}
                                  addLog = {addLog}
                                  gangedGridset = {gangedGridset}
                                />
                                    <Master
                                  items={items}
                                  playlist={playlists[selectPlaylist]}
                                />
                                {/* <Import
                                  items = {items}
                                  playlist = {playlists[selectPlaylist]}
                                  ImportVideos = {ImportVideos}
                                  gangedGridset = {gangedGridset}
                                /> */}
                                {/* <MetaUpdateButton 
                                  itemList={items} 
                                  playingPlaylists = {openPlaylist ? playlist[showPlaylist].id : previewPlaylists_id} 
                                  gridset_id = {gridsets[user].id}
                                  showPlaylist = {showPlaylist}
                                  updatedItems = { updatedItems }
                                /> */}
                            
                                { (playlist[0] !== null && playlist.length !== 0) &&
                                    <React.Fragment>
                                        <button onClick = {this.openModal} style={ gangedGridset ? {background : '#CCC'} : {color:"white"}} disabled = {gangedGridset ? true : false}>Update from Master</button>
                                        <button className="selected" style={gangedGridset? {background : '#CCC'} : {}} onClick={() => this.setAutoUpdate(playlists[selectPlaylist])} disabled = {gangedGridset ? true : false}>{ playlists[selectPlaylist].playlist_auto_update === 0 ? 'Auto Update : Off' :  'Auto Update : On' }</button>
                                        <button className="selected" onClick={() => this.setGangedPlaylist(playlists[selectPlaylist])}>{ playlists[selectPlaylist].playlist_ganged === 0 ? 'Gang Playback : Master' :  'Gang Playback : Master' }</button>
                                        
                                    </React.Fragment>
                                }
                                <button><CSVLink filename={`${fileName}.csv`} data={Data} headers={headers} style={{color:"white"}}>Export T.csv</CSVLink></button>
                            </div>
                        </div>
                        
                        { importContent && 
                            <img src={images.btnPlaylistHeadImportContentOn} onClick={toggleImport} className="butvideoaudioplaylist" alt="importContent" title="importContent"  style={{marginLeft: '10px'}}/>
                        }
                        { !importContent && 
                            <img src={images.btnPlaylistHeadImportContent} onClick={toggleImport} className="butvideoaudioplaylist" alt="importContent" title="importContent"  style={{marginLeft: '10px'}}/>
                        }
                        { searchContent && 
                            <img src={images.btnPlaylistHeadSearchContentOn} onClick={toggleSearch} className="butvideoaudioplaylist" alt="searchContent" title="searchContent"  style={{marginLeft: '10px'}}/>
                        }
                        { !searchContent && 
                            <img src={images.btnPlaylistHeadSearchContent} onClick={toggleSearch} className="butvideoaudioplaylist" alt="searchContent" title="searchContent"  style={{marginLeft: '10px'}}/>
                        } 
                        <img src={images.btnPlaylistHeadWiki} onClick = {toggleWiki} className="butvideoaudioplaylist" alt="wiki" title="wiki"  style={{marginLeft: '10px'}}/>
                        </React.Fragment>
                    }
                </div>
                {
                    show_filter && 
                    <div className="filterBar">
                        <span>FILTERS: </span>
                        <img onClick={dotFilter} src={ dot_filter ? images.playlistControlsDotOn : images.playlistControlsDotOff}  className="filterBtn" alt="ratingRadio" title="Show Dots" />
                        <img onClick={hideFilter} src={ hide_filter ? images.playlistControlsHideOn : images.playlistControlsHideOff } className="filterBtn" alt="hidePlaylist" title="Show/Hide"/>
                        <input onChange={searchFilter} type="text" placeholder="Search all fields" className="filterInput" />
                        <div>
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
                                <FontAwesomeIcon className={`filterBtn on`} icon={faCircle}  />Users</button>
                            <div className="dropdownbuttons">
                                <button>Populated with author names</button>
                                <button>Reset Selections</button>
                            </div>
                        </div>
                        <div className="desktop-menu dropdown">
                            <button className='selected'>
                                <FontAwesomeIcon className={`filterBtn on`} icon={faCircle}  />Length</button>
                            <div className="dropdownbuttons">
                                <button>Live Now</button>
                                <button>Less than 2 minutes</button>
                                <button>Reset Selections</button>
                            </div>
                        </div>
                        <div className="desktop-menu dropdown">
                            <button className='selected'>
                                <FontAwesomeIcon className={`filterBtn`} icon={faCircle}  />Location</button>
                            <button className='selected'>
                                <FontAwesomeIcon className={`filterBtn`} icon={faCircle}  />Platform</button>
                        </div>
                        </div>
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
        );
    }
}


const mapSizesToProps = ({ width }) => ({
    wideSize: width >= 1260,
    mediumSize: width < 1260 && width >= 750,
    narrowSize: width < 750
  })
  
  const mapDispatchToProps = (dispatch) => ({
    setPlaylistAutoUpdate: bindActionCreators(setPlaylistAutoUpdate, dispatch),
    setGridsetGanged : bindActionCreators(setGridsetGanged, dispatch)
  })
export default withSizes(mapSizesToProps)(connect(null, mapDispatchToProps)(PlaylistHeaderBar));
  
