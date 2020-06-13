import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from "react-table";

import {
    getVideos,
    uploadCSV,
    removeVideo,
} from '../../actions/video';
import { fetchAllPlaylists } from '../../actions/playlist';

import './styles.css';

class VideosComponent extends Component {
    _isMounted = false;

    constructor() {
        super();

        this.state = {
            videos: [],
            types: [],
            playlists: [],
            pid: -2,
            type: '',
            channel: false,
            dead: false,
            embed_restricted: false,
            ptll: false,
            live_now: false,
            showMessage: false,
            logs: [],
            filter: ''
        }
    }

    componentWillMount() {
        this._isMounted = true;
        this.loadVideos();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadVideos = () => {
        const { getVideos, fetchAllPlaylists } = this.props;
        fetchAllPlaylists()
            .then(({ playlists }) => {
                getVideos()
                    .then(({ videos }) => {
                        let types = videos.map(video => video.video_type);
                        types = types.filter((type, i) => types.indexOf(type) === i)
                        if (this._isMounted) {
                            this.setState({
                                videos,
                                types,
                                playlists,
                            });
                        }
                    })
            });
    }

    newVideo = () => {
        this.props.history.push('/videos/edit', { new: true, video: null });
    }

    uploadCSV = () => {
        const file = document.getElementById('video-csv').files[0];
        if (file === undefined) {
            return alert('Please select CSV file to upload!');
        }
        this.setState({ showMessage: false });
        const { uploadCSV } = this.props;
        uploadCSV(file)
            .then((res) => {
                this.loadVideos();
                this.setState({ showMessage: true, logs: res.logs, filename: file.name });
            })
            .catch(() => {
                alert('Video uploading failed!');
            })
    }

    onVideoEdit = (video) => {
        this.props.history.push('/videos/edit', { new: false, video });
    }

    onDeleteVideo = (video) => {
        const { removeVideo } = this.props;
        removeVideo(video.id)
            .then(() => {
                this.loadVideos();
                alert('video removed successfully!');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onOpenVideo = (video) => {
        const url = `/videos/edit`;
        window.open(url);
    }

    onPlaylistSelect = (e) => {
        this.setState({ pid: +e.target.value });
    }

    onBroadcasterSelect = (e) => {
        this.setState({ type: e.target.value });
    }

    updateChecked = (field, checked) => {
        const state = {};
        state[field] = checked;
        this.setState(state);
    }

    onFilterChange = (e) => {
        this.setState({ filter: e.target.value });
    }

    render() {
        const {
            videos,
            types,
            playlists,
            pid,
            type,
            channel,
            dead,
            embed_restricted,
            ptll,
            live_now,
            showMessage,
            logs,
            filename,
            filter,
        } = this.state;

        const headerStyle = {
            fontSize: 15,
            textAlign: 'left'
        };
        const columns = [
            {
                Header: "Click to edit",
                accessor: "edit",
                width: 100,
                headerStyle
            },
            {
                Header: "Delete record",
                accessor: "remove",
                width: 120,
                headerStyle
            },
            {
                Header: "",
                accessor: "open",
                width: 150,
                headerStyle
            },
            {
                Header: "GSVN",
                accessor: "gsvn",
                width: 260,
                headerStyle
            },
            {
                Header: "Video Type",
                accessor: "video_type",
                width: 90,
                headerStyle
            },
            {
                Header: "Video ID",
                accessor: "video_id",
                width: 130,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Interface Link",
                accessor: "interface_link",
                width: 300,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Video Title",
                accessor: "video_title",
                width: 400,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Video Description",
                accessor: "description",
                width: 400,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Video Author",
                accessor: "video_author",
                width: 150,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Thumb",
                accessor: "thumb",
                width: 150,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Tags",
                accessor: "tags",
                width: 150,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Gotags",
                accessor: "gotags",
                width: 150,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Note",
                accessor: "note",
                width: 150,
                sortable: true,
                filterable: true,
                headerStyle
            },
            {
                Header: "Video Length",
                accessor: "video_length",
                width: 100,
                headerStyle
            }
        ];
        const filterMethod = (filter, row) => {
            const { id, value } = filter;
            return row[id].toLowerCase().includes(value.toLowerCase());
        }
        let filteredVideos = videos;
        if (channel) {
            filteredVideos = filteredVideos.filter(video => video.channel === 1)
        }
        if (dead) {
            filteredVideos = filteredVideos.filter(video => video.dead === 1)
        }
        if (live_now) {
            filteredVideos = filteredVideos.filter(video => video.live_now === 1)
        }
        if (ptll) {
            filteredVideos = filteredVideos.filter(video => video.ptll === 1)
        }
        if (embed_restricted) {
            filteredVideos = filteredVideos.filter(video => video.embed_restricted === 1)
        }
        if (pid !== -2) {
            filteredVideos = videos.filter(pid !== -1 ? (video => video.playlists.includes(pid)) : (video => video.playlists.length === 0));
        }
        if (type !== '') {
            filteredVideos = filteredVideos.filter(video => video.video_type === type);
        }
        filteredVideos = filteredVideos.filter(video => {
            const fields = ['gsvn', 'video_type', 'video_id', 'interface_link', 'video_author', 'video_title', 'description', 'thumb', 'tags', 'gotags', 'category', 'note'];
            const match = fields.reduce((currMatch, field) => currMatch || (video[field] && video[field].toLowerCase().indexOf(filter.toLowerCase()) !== -1), false);
            return match;

        });
        const tableData = filteredVideos.map((video, idx) => {
            const { gsvn, video_type, video_id, interface_link, video_title, video_author, video_length, description, thumb, tags, gotags, category, note } = video;
            return ({
                edit: (
                    <button onClick={() => this.onVideoEdit(video)}>Click to edit</button>
                ),
                remove: (
                    <button onClick={() => this.onDeleteVideo(video)}>Delete record</button>
                ),
                open: (
                    <button onClick={() => this.onOpenVideo(video)}>Open in new button</button>
                ),
                gsvn,
                video_type,
                video_id,
                interface_link,
                video_title,
                description,
                video_author,
                video_length: video_length === -1 ? '' : `${Math.floor(video_length / 60)}:${video_length % 60}`,
                thumb,
                tags,
                gotags,
                category,
                note
            });
        });

        return (
            <div className='videos-page'>
                <h4>Tethyr.io Admin Panel</h4>
                <h4>1-1 Stream Browser</h4>
                <button onClick={this.newVideo}>Add New Video</button>
                <div className='bulk-upload-panel'>
                    <p>Bulk Upload</p>
                    <input type='file' id='video-csv' accept='.csv' />
                    <button onClick={this.uploadCSV}>Upload CSV file</button>
                </div>
                {showMessage && (<span className='text-success'>
                    Videos uploaded successfully!
                    Click <u className='cursor-pointer' data-toggle="modal" data-target="#logModal" onClick={() => this.setState({ showMessage: false })}>here</u> to see logs.
                </span>)}

                <div className="modal fade" id="logModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Logs - {filename}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {logs.map((log, idx) => (
                                    <div key={idx}>{log}</div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='filter-box'>
                    <div className='filter-item'>
                        <span>Filter By Broadcaster</span>
                        <select onChange={this.onBroadcasterSelect}>
                            <option value={''}>ALL</option>
                            {
                                types.map((type, idx) => (
                                    <option key={idx} value={type}>{type}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='filter-item'>
                        <span>Filter By Playlist</span>
                        <select onChange={this.onPlaylistSelect}>
                            <option value={-2}>ALL Playlists</option>
                            <option value={-1}>No Playlists</option>
                            {
                                playlists.map(playlist => (
                                    <option key={playlist.id} value={playlist.id}>{playlist.title}</option>
                                ))
                            }
                        </select>
                    </div>
                    {/* <div className='filter-item'>
                        <span>Filter By Other Option</span>
                        <select>
                            <option>Ascending</option>
                            <option>Descending</option>
                        </select>
                    </div> */}
                    <div className='filter-item'>
                        <label>
                            <input type='checkbox' checked={channel} onChange={(e) => this.updateChecked('channel', e.target.checked)} /> Channel Stream?
                        </label>
                    </div>
                    <div className='filter-item'>
                        <label>
                            <input type='checkbox' checked={dead} onChange={(e) => this.updateChecked('dead', e.target.checked)} /> Dead?
                        </label>
                    </div>
                    <div className='filter-item'>
                        <label>
                            <input type='checkbox' checked={embed_restricted} onChange={(e) => this.updateChecked('embed_restricted', e.target.checked)} /> Embed Restricted?
                        </label>
                    </div>
                    <div className='filter-item'>
                        <label>
                            <input type='checkbox' checked={ptll} onChange={(e) => this.updateChecked('ptll', e.target.checked)} /> PTLL?
                        </label>
                    </div>
                    <div className='filter-item'>
                        <label>
                            <input type='checkbox' checked={live_now} onChange={(e) => this.updateChecked('live_now', e.target.checked)} /> Live now?
                        </label>
                    </div>
                </div>
                <input
                    type='text'
                    id='filterAll'
                    className='filter-all-input'
                    onChange={this.onFilterChange}
                    value={filter}
                    placeholder='Filter All Fields'
                />
                <div className='videos-table'>
                    <ReactTable
                        data={tableData}
                        sortable={false}
                        columns={columns}
                        defaultPageSize={100}
                        showPaginationTop={false}
                        className="-striped -highlight"
                        style={{fontSize: 12}}
                        defaultFilterMethod={filterMethod}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    getVideos: bindActionCreators(getVideos, dispatch),
    uploadCSV: bindActionCreators(uploadCSV, dispatch),
    removeVideo: bindActionCreators(removeVideo, dispatch),
    fetchAllPlaylists: bindActionCreators(fetchAllPlaylists, dispatch),
})

export default connect(null, mapDispatchToProps)(VideosComponent);
