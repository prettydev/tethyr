import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import ReactTable from "react-table";
import Switch from "react-switch";

import { getVideosByUser, updateDotHidden, removeUserVideo } from '../../actions/video';
import { setAsDefaultVideos, setAutoUpdate } from '../../actions/playlist';
import { fetchGridsetInfo } from '../../actions/gridset';

import ResetVideos from "../../components/ResetVideos/index"

import './index.css'

const columns = [
    {
        Header: "USER ID",
        accessor: "user_id",
        width: 70,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "GSPN",
        accessor: "gspn",
        width: 150,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video ID",
        accessor: "video_id",
        width: 70,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "GSVN",
        accessor: "gsvn",
        width: 200,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video Title",
        accessor: "title",
        width: 200,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video Type",
        accessor: "type",
        width: 70,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video Interface",
        accessor: "interface_link",
        width: 150,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video Dotted",
        accessor: "dotted",
        width: 50,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Video Hidden",
        accessor: "hidden",
        width: 50,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Actions",
        accessor: "actions",
        width: 200,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
]

class UserVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videos : [],
            playlists : [],
            auto_update : 0
        }
    }

    componentWillReceiveProps(nextProps) { 
        if (window.location.pathname !== nextProps.location.pathname) {
            const user_id = sessionStorage.getItem('user_id');
            this.props.history.replace(`/users/${user_id}/user_playlist`);
        }
    }

    componentWillMount() {
        this.getPlaylists();
    }

    getPlaylists = () => {
        const { fetchGridsetInfo } = this.props;
        const user_id = sessionStorage.getItem('user_id');
        const gridset_id = sessionStorage.getItem('gridset_id');
        const gspn = sessionStorage.getItem('playlist_id');
        fetchGridsetInfo(user_id, gridset_id)
        .then(({playlists})=>{
            var playlist = playlists.filter(playlist => playlist.gspn === gspn);
            var auto_update = playlist[0].playlist_auto_update;
            this.setState({playlists, auto_update});
            this.getVideos();
        })
        .catch(err=>{console.log(err);})
    }

    getVideos = () => {
        const { getVideosByUser } = this.props;
        const user_id = sessionStorage.getItem('user_id');
        const gspn = sessionStorage.getItem('playlist_id');
        getVideosByUser(user_id, gspn)
        .then(({videos})=>{
            this.setState({videos});
        })
        .catch(err=>{console.log(err);})
    }

    setVideos = (gspn, playlist_title) => {
        const user_id = sessionStorage.getItem('user_id');
        const { getVideosByUser } = this.props;
        sessionStorage.setItem('playlist_id', gspn);
        sessionStorage.setItem('playlist_title', playlist_title);
        var playlist = this.state.playlists.filter(playlist => playlist.gspn === gspn);
        var auto_update = playlist[0].playlist_auto_update;
        getVideosByUser(user_id, gspn)
            .then(({videos}) => {
                this.setState({videos, auto_update});
            })
    }

    onUserSelect = (e) => {
        const { playlists } = this.state;
        const playlist_title = e.target.value;
        const idx = e.target.selectedIndex;
        const gspn = playlists[idx].gspn
        this.setVideos(gspn, playlist_title);
    }

    updateCheck = (type, user_id, gspn, id, value, idx) => (e) => {
        const mainValue = e.target.value === '0' ? 1 : 0;
        const { updateDotHidden } = this.props;
        let videos = this.state.videos;
 
        if(type === "dotted") {
            updateDotHidden(mainValue, value, user_id, gspn, id)
            .then(res=>{
                videos[idx].dotted = mainValue;
                this.setState({
                    videos
                })
            })
            .catch(err=>{ console.log(err); })
        }
        else if (type === 'hidden') {
            updateDotHidden(value, mainValue, user_id, gspn, id,)
            .then(res=>{
                videos[idx].hidden = mainValue;
                this.setState({
                    videos
                })
            })
            .catch(err=>{ console.log(err); })
        }
        else {
            return false;
        }
    }

    onRemoveVideo = (user_id, gspn, id, idx) => {
        const { removeUserVideo } = this.props;
        let videos = this.state.videos;
        removeUserVideo(user_id, gspn, id)
        .then(res=> {
            videos = videos.slice(0); // make copy
            videos.splice(idx, 1)
            this.setState({videos});
        })
        .catch(err=> { console.log(err); })
    }

    defaultVideos = (videos) => {
        this.setState({videos});
    }

    setAsDefault = () => {
        const { setAsDefaultVideos } = this.props;
        const {videos} = this.state;
        const gspn = sessionStorage.getItem('playlist_id');
        const title = sessionStorage.getItem('playlist_title');

        var Data = [];
        Data = videos.map(video=>{
            return ([video.order, video.id]);
        })
        setAsDefaultVideos(gspn, Data)
        .then(res=>{
            alert(`${gspn}#${title} is set as a default playlist!`);
        })
        .catch(err=> {
            console.log(err);
        })
    }

    handleChange = (checked) => {
        var auto_update = checked === true ? 1 : 0;
        const user_id = sessionStorage.getItem('user_id');
        const gspn = sessionStorage.getItem('playlist_id');
        const { setAutoUpdate } = this.props;
        setAutoUpdate(user_id, gspn, auto_update)
        .then(() => {
            this.setState({
                auto_update
            })
        })
       .catch(err=> {
           console.log(err);
       })
    }

    render() {
        const gridset_id = sessionStorage.getItem('gridset_id');
        const gridset_title = sessionStorage.getItem('gridset_title');
        const user_id = sessionStorage.getItem('user_id');
        const user_name = sessionStorage.getItem('user_name');
        const gspn = sessionStorage.getItem('playlist_id');
        const title = sessionStorage.getItem('playlist_title');
        const { playlists, videos, auto_update } = this.state;
        const tableData = videos.map(({ id, gsvn, title, type, interface_link, dotted, hidden }, idx) => ({
            user_id,
            gspn,
            video_id : id,
            gsvn,
            title,
            type,
            interface_link,
            dotted:(
                <div>
                    <input type="checkbox" value = {dotted} checked = {dotted === 1 ? "checked" : ""} onChange = { this.updateCheck("dotted", user_id, gspn, id, hidden, idx) }/>
                </div>
            ),
            hidden:(
                <div>
                    <input type="checkbox"  value = {hidden} checked = {hidden === 1 ? "checked" : ""} onChange = { this.updateCheck("hidden", user_id, gspn, id, dotted, idx) }/>
                </div>
            ),
            actions: (
                <div>
                    <button onClick={() => this.onRemoveVideo(user_id, gspn, id, idx)}>Remove</button>
                </div>
                
            ),
        }));
        return (    
            <div className="playlist-detail-page">
                <h4>Tethyr.io Admin Panel</h4>
                <h4>5-4 User Instance of Playlist</h4>
                <div className = "nav">
                    <p className = "navbar-title">NAVBAR:</p>
                    <Link to={`/users/${user_id}/user_edit`}><p className = "navbar-item">USER {user_id}:{user_name}/</p></Link>
                    <Link to={`/users/${user_id}/user_playlist`}><p className = "navbar-item">PLAYLIST GROUP {gridset_id}:{gridset_title}/</p></Link>
                    <p className = "navbar-item">Playlist {gspn}:{title}</p>
                </div>
                <div className="playlist-info-panel">
                    <div className="info-item">
                        <label>Playlists In Group</label>
                        <select value={title} onChange={this.onUserSelect}>
                            {
                                playlists.map(({gspn, title}, index) => (
                                    <option key={index} value={title}>{gspn}#{title}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="info-item settingBtn">
                        <ResetVideos 
                            gspn = {gspn}
                            title = {title}
                            user_id = {user_id}
                            defaultVideos = {this.defaultVideos.bind(this)}
                        />
                        <button onClick={this.setAsDefault}>Set As Master</button>
                    </div>
                    <div className="info-item settingBtn">
                        <p style = {{margin : "0 20px 0 0", lineHeight : "30px"}}>Auto Update</p>
                        <Switch onChange={this.handleChange} checked={ (auto_update === 0 ) ? false : true } />
                    </div>
                </div>
                
                <ReactTable
                    data={tableData}
                    sortable={false}
                    columns={columns}
                    defaultPageSize={25}
                    showPaginationTop={false}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    getVideosByUser: bindActionCreators(getVideosByUser, dispatch),
    updateDotHidden: bindActionCreators(updateDotHidden, dispatch),
    removeUserVideo: bindActionCreators(removeUserVideo, dispatch),
    setAsDefaultVideos : bindActionCreators(setAsDefaultVideos, dispatch),
    fetchGridsetInfo : bindActionCreators(fetchGridsetInfo, dispatch),
    setAutoUpdate : bindActionCreators(setAutoUpdate, dispatch)
})

export default connect(null, mapDispatchToProps)(UserVideo);
