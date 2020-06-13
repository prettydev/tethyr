import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import ReactTable from "react-table";
import Switch from "react-switch";

import { fetchGridsetInfo, fetchGridsetsByID, resetAllGridset, setGridsetAsMaster } from '../../actions/gridset';
import { setAutoUpdate, removeUserPlaylist } from '../../actions/playlist'

import './index.css'

const columns = [
    {
        Header: "USER ID",
        accessor: "gridset_id",
        width: 70,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "GSPN",
        accessor: "gspn",
        width: 250,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Group Name",
        accessor: "title",
        width: 400,
        headerStyle: {
            fontSize: 12,
            textAlign: 'left'
        }
    },
    {
        Header: "Auto Update",
        accessor: "auto_update",
        width: 100,
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

class UserPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists : [],
            gridsets : [],
        }
    }

    componentWillReceiveProps(nextProps) {
        
        if (window.location.pathname !== nextProps.location.pathname) {
            const user_id = sessionStorage.getItem('user_id');
            this.props.history.replace(`/users/${user_id}/user_edit`);
        }
        
    }

    componentWillMount() {
        this.getPlaylists();
    }

    getPlaylists = () => {
        const user_id = sessionStorage.getItem('user_id');
        const gridset_id = sessionStorage.getItem('gridset_id');
        const { fetchGridsetInfo, fetchGridsetsByID } =this.props;
        fetchGridsetsByID(user_id)
            .then(res=>{
                this.setState({
                    gridsets:res.gridsets,
                })
                fetchGridsetInfo(user_id, gridset_id)
                    .then(({playlists})=>{
                        this.setState({playlists});
                    })
                    .catch(err=>{console.log(err);})
            })
            .catch(err=>{console.log(err);})
     }


    setPlaylists = (gridset_id, gridset_title) => {
        const { fetchGridsetInfo } = this.props;
        const user_id = sessionStorage.getItem('user_id');
        sessionStorage.setItem('gridset_id', gridset_id);
        sessionStorage.setItem('gridset_title', gridset_title);
        fetchGridsetInfo(user_id, gridset_id)
            .then(({playlists}) => {
                this.setState({playlists});
                this.props.history.push(`/users/${user_id}/user_playlist`);
            })
    }

    onUserSelect = (e) => {
        const { gridsets } = this.state;
        const gridset_title = e.target.value;
        const idx = e.target.selectedIndex;
        const gridset_id = gridsets[idx].gridset_id
        this.setPlaylists(gridset_id, gridset_title);
    }

    onEditPlaylist = (idx) => {
        const user_id = sessionStorage.getItem('user_id');
        const { playlists } = this.state;
        const gspn = playlists[idx].gspn;
        const title = playlists[idx].title;
        sessionStorage.setItem('playlist_id', gspn);
        sessionStorage.setItem('playlist_title', title);
        this.props.history.push(`/users/${user_id}/user_video`);
    }

    onRemovePlaylist = (idx) => {
        const user_id = sessionStorage.getItem('user_id');
        const gridset_id = sessionStorage.getItem('gridset_id');
        const { playlists } = this.state;
        const { removeUserPlaylist } = this.props;
        removeUserPlaylist(user_id, gridset_id, playlists[idx].gspn)
        .then(() => {
            playlists.slice(0);
            playlists.splice(idx, 1);
            this.setState({
                playlists
            })
        })
       .catch(err=> {
           console.log(err);
       })
    }

    resetAllGridset = (gridset_id, name) => { 
        const user_id = sessionStorage.getItem('user_id');
        const { resetAllGridset, fetchGridsetInfo } = this.props;
        resetAllGridset(user_id, gridset_id)
        .then(res=>{
            alert(`The gridset ${gridset_id}#${name} has reset!`)
            fetchGridsetInfo(user_id, gridset_id)
                    .then(({playlists})=>{
                        this.setState({playlists});
                    })
                    .catch(err=>{console.log(err);})
        })
        .catch(err=>{console.log(err);})
    }

    setGridsetAsMaster = (gridset_id, name) => { 
        const user_id = sessionStorage.getItem('user_id');
        const { setGridsetAsMaster } = this.props;

        setGridsetAsMaster(user_id, gridset_id)
        .then(res=>{
            if(res.success) {
                alert(`The gridset ${gridset_id}#${name} has set as Master!`)
            }
            else {
                alert(`The gridset ${gridset_id}#${name} is empty!`)
            }
        })
        .catch(err=>{console.log(err);})

    }

    handleChange = (idx) => (checked) => {
        const { playlists } = this.state;
        playlists[idx].playlist_auto_update = checked === true ? 1 : 0;
        const user_id = sessionStorage.getItem('user_id');
        const { setAutoUpdate } = this.props;
        setAutoUpdate(user_id, playlists[idx].gspn,  playlists[idx].playlist_auto_update)
        .then(() => {
            this.setState({
                playlists
            })
        })
       .catch(err=> {
           console.log(err);
       })
    }

    render() {
        const { playlists, gridsets } = this.state;
        const gridset_id = sessionStorage.getItem('gridset_id');
        const gridset_title = sessionStorage.getItem('gridset_title');
        const user_id = sessionStorage.getItem('user_id');
        const user_name = sessionStorage.getItem('user_name');
        const tableData = playlists.map(({ gspn, title, playlist_auto_update }, idx) => ({
            gridset_id,
            gspn,
            title,
            auto_update : <Switch onChange={this.handleChange(idx)} checked={ (playlist_auto_update === 0 ) ? false : true } />,
            actions: (
                <div>
                    <button onClick={() => this.onEditPlaylist(idx)}>Edit</button>
                    <button onClick={() => this.onRemovePlaylist(idx)}>Remove</button>
                </div>
                
            ),
        }));
        return (    
            <div className="playlist-detail-page">
                <h4>Tethyr.io Admin Panel</h4>
                <h4>5-3 User Instance of Playlist Group</h4>
                <div className = "nav">
                    <p className = "navbar-title">NAVBAR:</p>
                    <Link to={`/users/${user_id}/user_edit`}><p className = "navbar-item">USER {user_id}:{user_name}/</p></Link>
                    <p className = "navbar-item">PLAYLIST GROUP {gridset_id}:{gridset_title}/</p>
                </div>
                <div className="playlist-info-panel">
                    <div className="info-item">
                        <label>Assigned Group</label>
                        <select value={gridset_title} onChange={this.onUserSelect}>
                            {
                                gridsets.map(({gridset_id, name}, index) => (
                                    <option key={index} value={name}>{gridset_id}#{name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <button style={{ height:"26px", marginLeft:"10px"}} onClick={() => this.resetAllGridset(gridset_id, gridset_title)}>Reset this Group from Master</button>
                    <button style={{ height:"26px", marginLeft:"10px"}} onClick={() => this.setGridsetAsMaster(gridset_id, gridset_title)} >Set this Group as Master</button>

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
    fetchGridsetInfo: bindActionCreators(fetchGridsetInfo, dispatch),
    fetchGridsetsByID: bindActionCreators(fetchGridsetsByID, dispatch),
    resetAllGridset : bindActionCreators(resetAllGridset, dispatch),
    setAutoUpdate : bindActionCreators(setAutoUpdate, dispatch),
    setGridsetAsMaster : bindActionCreators(setGridsetAsMaster, dispatch),
    removeUserPlaylist : bindActionCreators(removeUserPlaylist, dispatch)
})

export default connect(null, mapDispatchToProps)(UserPlaylist);
