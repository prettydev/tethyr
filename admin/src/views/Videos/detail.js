import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// react component for creating dynamic tables
import ReactTable from "react-table";

// core components
import Spinner from '../../components/Spinner';

// actions
import {
    validateLink,
    getNewGSVN,
    saveVideo,
    getPlaylists,
    addToPlaylist,
    removeFromPlaylist,
    removeVideo,
} from "../../actions/video";

import './detail.css';

class VideoDetail extends Component {
    constructor(props) {
        super(props);

        let { state } = props.location;
        state = state ? state : {
            new: true,
            video: null
        };

        this.state = {
            link: '',
            validating: false,
            hasError: true,
            errMsg: '',
            playlists: [],
            video: state.video,
            saved: !state.new
        }
    }

    componentWillMount() {
        const { video } = this.state;
        const { getPlaylists } = this.props;
        getPlaylists(video ? video.id : null)
            .then(({playlists}) => {
                this.setState({ playlists });
            })
    }

    componentWillReceiveProps(nextProps) {
        if (window.location.pathname !== nextProps.location.pathname) {
            this.props.history.replace('/videos');
        }
    }

    onPasteLink = (e) => {
        const link = e.target.value;
        this.setState({
            link,
            validating: true,
            hasError: false
        });
        const { validateLink } = this.props;
        validateLink(link)
            .then(({ status, gsvn, type }) => {
                if (status === 0) {
                    this.setState({
                        validating: false,
                        video: {
                            gsvn,
                            video_type: type,
                            interface_link: link
                        }
                    });
                } else {
                    this.setState({
                        validating: false,
                        hasError: true,
                        errMsg: status === 1 ? 'Pasted link is not valid!' : 'Link already exists in database!'
                    });
                }
            })
            .catch(() => {
                this.setState({
                    validating: false,
                    hasError: true,
                    errMsg: 'Server is not reachable!'
                });
            })
    }

    saveVideo = () => {
        const fields = [
            'gsvn',
            'video_type',
            'video_id',
            'interface_link',
            'video_title',
            'video_author',
            'description',
            'thumb',
            'tags',
            'gotags',
            'category',
            'note',
            'video_length',
            'author_img',
            'authorLink'
        ];
        const video = this.state.video ? this.state.video : {}
        fields.map(field => {
            return video[field] = document.getElementById(field).value;
        })
        video.video_length = video.video_length === '' ? -1 : +video.video_length;
        const checkboxes = ['channel', 'dead', 'embed_restricted', 'ptll', 'live_now'];
        checkboxes.map(id => {
            return video[id] = document.getElementById(id).checked;
        })
        const { saveVideo } = this.props;
        saveVideo(video)
            .then((video) => {
                const { location, history } = this.props;
                const state = { ...location.state };
                state.new = false;
                state.video = video;
                history.replace(location.path, state);
                this.setState({ saved: true, video });
                alert('Video Saved!');
            })
            .catch(err=>{
                console.log(err);
            })
    }

    deleteVideo = () => {
        const videoId = this.props.location.state.video.id;
        const { removeVideo } = this.props;
        removeVideo(videoId)
            .then(() => {
                alert('video removed successfully!');
                this.props.history.push('/videos');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onAddToPlaylist = () => {
        const { playlists, video } = this.state;
        const id = +document.getElementById('playlist-select').value;
        const { addToPlaylist } = this.props;

        addToPlaylist(video.id, id)
            .then(() => {
                const index = playlists.findIndex(pl => pl.id === id);
                playlists[index].include = 1;
                this.setState({ playlists });
            })
    }

    onEditPlaylist = (playlist) => {
        const { gspn } = playlist;
        this.props.history.push('/playlists/edit', { gspn });
    }

    onRemoveFromPlaylist = (playlist) => {
        const { playlists, video } = this.state;
        const { id } = playlist;
        const { removeFromPlaylist } = this.props;

        removeFromPlaylist(video.id, id)
            .then(() => {
                const index = playlists.findIndex(pl => pl.id === id);
                playlists[index].include = 0;
                this.setState({ playlists });
            })
    }

    render() {
        const {
            link,
            validating,
            hasError,
            errMsg,
            playlists,
            video,
        } = this.state;
        let { state } = this.props.location;
        state = state ? state : {
            new: true,
            video: null
        };
        console.log("videps", video);
        const columns = [
            {
                Header: "Playlist ID(GSPN)",
                accessor: "gspn",
                width: 200,
                headerStyle: {
                    textAlign: 'left'
                }
            },
            {
                Header: "Playlist Title",
                accessor: "title",
                headerStyle: {
                    textAlign: 'left'
                }
            },
            {
                Header: "Click to edit playlist",
                accessor: "edit",
                width: 150,
                headerStyle: {
                    textAlign: 'left'
                }
            },
            {
                Header: "Remove from playlist",
                accessor: "remove",
                width: 150,
                headerStyle: {
                    textAlign: 'left'
                }
            }
        ]
        const tableData = playlists.filter(item => item.include === 1).map(({gspn, title}, idx) => ({
            gspn,
            title,
            edit: <button onClick={() => this.onEditPlaylist(playlists[idx])}>Edit</button>,
            remove: <button onClick={() => this.onRemoveFromPlaylist(playlists[idx])}>Remove</button>
        }));

        return (
            <div className='new-video'>
                <h4>Tethyr.io Admin Panel</h4>
                <h4>1-2 Add Stream</h4>
                <div className='add-link-box'>
                    <span className='instruction'>Paste the video link here:</span>
                    <div className='link-box'>
                        <input
                            type='text'
                            id='link'
                            name='link'
                            value={link}
                            onChange={this.onPasteLink}
                            disabled={validating || !state.new}
                        />
                        {validating ? <Spinner /> : null}
                    </div>
                    <span className='error-message'>{hasError ? errMsg : ''}</span>
                </div>
                <div className='video-edit-box'>
                    <div className='video-info-item'>
                        <label>gsvn</label>
                        <input
                            type='text'
                            id='gsvn'
                            className='video-info-input gsvn'
                            defaultValue={video ? video.gsvn : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>video_type</label>
                        <input
                            type='text'
                            id='video_type'
                            className='video-info-input video_type'
                            defaultValue={video ? video.video_type : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>video_id</label>
                        <input
                            type='text'
                            id='video_id'
                            className='video-info-input video_id'
                            defaultValue={video ? video.video_id : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>interface_link</label>
                        <input
                            type='text'
                            id='interface_link'
                            className='video-info-input interface_link'
                            defaultValue={video ? video.interface_link : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>video_title</label>
                        <input
                            type='text'
                            id='video_title'
                            className='video-info-input video_title'
                            defaultValue={video ? video.video_title : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>video_author</label>
                        <input
                            type='text'
                            id='video_author'
                            className='video-info-input video_author'
                            defaultValue={video ? video.video_author : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>author_link</label>
                        <input
                            type='text'
                            id='authorLink'
                            className='video-info-input authorLink'
                            defaultValue={video ? video.authorLink : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>author_img</label>
                        <input
                            type='text'
                            id='author_img'
                            className='video-info-input author_img'
                            defaultValue={video ? video.author_img : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>video_length</label>
                        <input
                            type='text'
                            id='video_length'
                            className='video-info-input video_length'
                            defaultValue={video ? video.video_length : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Description</label>
                        <input
                            type='text'
                            id='description'
                            className='video-info-input description'
                            defaultValue={video ? video.description : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Thumb</label>
                        <input
                            type='text'
                            id='thumb'
                            className='video-info-input thumb'
                            defaultValue={video ? video.thumb : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Tags</label>
                        <input
                            type='text'
                            id='tags'
                            className='video-info-input tags'
                            defaultValue={video ? video.tags : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Gotags</label>
                        <input
                            type='text'
                            id='gotags'
                            className='video-info-input gotags'
                            defaultValue={video ? video.gotags : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Category</label>
                        <input
                            type='text'
                            id='category'
                            className='video-info-input category'
                            defaultValue={video ? video.category : ''}
                            disabled={video === null}
                        />
                    </div>
                    <div className='video-info-item'>
                        <label>Note</label>
                        <input
                            type='text'
                            id='note'
                            className='video-info-input note'
                            defaultValue={video ? video.note : ''}
                            disabled={video === null}
                        />
                    </div>
                </div>
                <div className='video-checkboxes'>
                    <label>
                        <input type='checkbox' id='channel' defaultChecked={video ? video.channel : false} /> Channel Stream?
                    </label>
                    <label>
                        <input type='checkbox' id='dead' defaultChecked={video ? video.dead : false} /> Dead?
                    </label>
                    <label>
                        <input type='checkbox' id='embed_restricted' defaultChecked={video ? video.embed_restricted : false} /> Embed Restricted?
                    </label>
                    <label>
                        <input type='checkbox' id='ptll' defaultChecked={video ? video.ptll : false} /> PTLL?
                    </label>
                    <label>
                        <input type='checkbox' id='live_now' defaultChecked={video ? video.live_now : false} /> Live now?
                    </label>
                </div>
                <button onClick={this.saveVideo}>Save Video</button>
                <button onClick={this.deleteVideo}>Delete Video</button>
                <div className='select-playlist-box'>
                    <select id='playlist-select'>
                        {
                            playlists.filter(item => item.include === 0).map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>{playlist.title}</option>
                            ))
                        }
                    </select>
                    <button className='add-to-playlist' onClick={this.onAddToPlaylist}>Add to playlist</button>
                </div>
                <div className='assigned-playlists'>
                    <label className='title'>List of playlists the stream is displayed in</label>
                    <ReactTable
                        data={tableData}
                        sortable={false}
                        columns={columns}
                        defaultPageSize={25}
                        showPaginationTop={false}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    validateLink: bindActionCreators(validateLink, dispatch),
    newGSVN: bindActionCreators(getNewGSVN, dispatch),
    saveVideo: bindActionCreators(saveVideo, dispatch),
    getPlaylists: bindActionCreators(getPlaylists, dispatch),
    addToPlaylist: bindActionCreators(addToPlaylist, dispatch),
    removeFromPlaylist: bindActionCreators(removeFromPlaylist, dispatch),
    removeVideo: bindActionCreators(removeVideo, dispatch),
})

export default connect(null, mapDispatchToProps)(VideoDetail);
