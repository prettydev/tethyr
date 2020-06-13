import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import { RadioGroup, Radio } from 'react-radio-group';

import {
	searchVideos,
	addVideoToPlaylist,
	getVideosTypes,
	showOverlaySpinner,
	hideOverlaySpinner,
} from '../../../../../../actions';

import './styles.scss';

const headerStyle = {
	fontSize: 12,
	textAlign: 'left'
};

const columns = [
	{
		Header: "",
		accessor: "action",
		width: 20,
		headerStyle
	},
	{
		Header: "Video Type",
		accessor: "video_type",
		width: 90,
		headerStyle
	},
	{
		Header: "Video Title",
		accessor: "video_title",
		width: 200,
		headerStyle
	},
	{
		Header: "Video Author",
		accessor: "video_author",
		width: 150,
		headerStyle
	},
	{
		Header: "Video Description",
		accessor: "description",
		width: 200,
		headerStyle
	},
	{
		Header: "Thumb",
		accessor: "thumb",
		width: 150,
		headerStyle
	},
	{
		Header: "Tags",
		accessor: "tags",
		width: 150,
		headerStyle
	},
	{
		Header: "Gotags",
		accessor: "gotags",
		width: 150,
		headerStyle
	},
	{
		Header: "Note",
		accessor: "note",
		width: 150,
		headerStyle
	},
	{
		Header: "Video Length",
		accessor: "video_length",
		width: 100,
		headerStyle
	},
	{
		Header: "Interface Link",
		accessor: "interface_link",
		width: 300,
		headerStyle
	},
	{
		Header: "GSVN",
		accessor: "gsvn",
		width: 300,
		headerStyle
	},
	{
		Header: "Video ID",
		accessor: "id",
		width: 150,
		headerStyle
	}
];

const selectColumns = [
	{
		Header: "Type",
		accessor: "video_type",
		width: 90,
		headerStyle
	},
	{
		Header: "Title",
		accessor: "video_title",
		width: 400,
		headerStyle
	},
];

class SearchContent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			videos: [],
			video: [],
			searchTypes: [],
			searchContents : [],
			searchPosition : [],
			searchDate : [],
			searchLength : [],
			playlists: this.props.playlists,
			pid: 0,
			playlist_id : 0,
			filter : "",
			selectVideos : [],
			selectIdx : [],
			positionValue : "0",
			btnDisabled : "disabled",
			currentPlaylist : this.props.playlist_id,
		}
	}

	UNSAFE_componentWillMount() {
		this._isMounted = true;
		setTimeout(() => {
			this.loadVideos();
		  }, 0);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	loadVideos = () => {
		if (this._isMounted) {
			// const searchPosition = [ {id : 0, label : "All", checked : 1}, {id : 1, label : "Title", checked : 0}, {id : 2, label : "Description", checked : 0}, {id : 3, label : "Author", checked : 0}, {id : 4, label : "Tags", checked : 0}, {id : 5, label : "Series Title / Game", che cked : 0}];
			const searchPosition = [ {id : 0, label : "All", checked : 1}, {id : 1, label : "Title", checked : 0}, {id : 2, label : "Description", checked : 0}, {id : 3, label : "Author", checked : 0}, {id : 4, label : "Tags", checked : 0}];
			this.setState({
				searchPosition,
			});
		}
	}

	selectTypes = (type, idx) => (e) => {
		const { filter } = this.state;
		const { searchVideos } = this.props;
		const items = this.state[type];
		let uTypes = [];
		const checked = e.target.checked === true ? 1 : 0;
		if(idx === 0) {
			if(checked === 0)
			 return;
			else {
				for(var i = 1 ; i < items.length ; i++) {
					uTypes.push({ id : i, label : items[i].label , checked : 0})
				}
				uTypes.unshift({id : 0, label : "All", checked : 1});
				this.setState({
					[type] : uTypes,
				}, () => {
					searchVideos(filter, this.state.searchPosition)
						.then(res=>{
							this.setState({
								videos : res.videos,
							})
						})
						.catch(err=>{console.log(err);})
				})
			 }
		}
		else {
			items[idx].checked = checked;
			items[0].checked = 0;
			uTypes = items.slice(1, items.length);
			this.checkAllTypes(uTypes, (all)=> {
				if (all) {
					uTypes = [];
					for(var i = 1 ; i < items.length ; i++) {
						uTypes.push({ id : i, label : items[i].label , checked : 0})
					}
					uTypes.unshift({id : 0, label : "All", checked : 1});
					this.setState({
						[type] : uTypes,
					}, () => {
						searchVideos(filter, this.state.searchPosition)
						.then(res=>{
							this.setState({
								videos : res.videos,
							})
						})
						.catch(err=>{console.log(err);})
					})
				}
				else {
					this.setState({
						[type] : items,
					}, () => {
						searchVideos(filter, this.state.searchPosition)
						.then(res=>{
							this.setState({
								videos : res.videos,
							})
						})
						.catch(err=>{console.log(err);})
					})
				}
			})
		}
	}

	checkAllTypes = (uTypes, callback) => {
		let all = true;
		for(var i = 0 ; i < uTypes.length - 1 ; i++) {
			for(var j = i + 1 ; j < uTypes.length ; j++ ) {
				if(uTypes[i].checked !== uTypes[j].checked) {
					all &= false;
				}
				else {
					all &= true;
				}
			}
		}
		callback(all);
	}

	onPlaylistSelect = (e) => {
		this.setState({ pid: +e.target.selectedIndex });
	}

	onFilterChange = (e) => {
		const filter = e.target.value;
		this.setState({
			filter,
		})
	}

	filterSearch = () => {
		const { searchVideos } = this.props;
		const { filter, searchPosition } = this.state;
		searchVideos(filter, searchPosition)
		.then(res=>{
			this.setState({
				videos : res.videos,
			})
		})
		.catch(err=>{console.log(err);})
	}

	selectVideo = (video, idx) => (e) => {
		const selected = e.target.checked;
		const selectVideos = this.state.selectVideos;
		const selectIdx = this.state.selectIdx;
		let btnDisabled = "";
		const { videos } = this.state;
		if(selected) {
			selectVideos.push(video);
			selectIdx.push(idx);
			videos[idx].checked = 1;
			this.setState({
				videos,
				selectVideos,
				selectIdx,
				btnDisabled
			})
		}
		else {
			this.removeFromList(selectVideos, video, (video_idx) => {
				selectVideos.splice(video_idx, 1);
				selectIdx.splice(video_idx, 1);
				videos[idx].checked = 0;
				if(selectVideos.length === 0) btnDisabled = 'disabled';
				this.setState({
					videos,
					selectVideos,
					selectIdx,
					btnDisabled
				})
			})
		}
	}

	removeFromList = (selectVideos, video, callback) => {
		let video_idx = 0;
		selectVideos.map((selectVideo, idx) => {
			if(selectVideo.id === video.id)
			{
				video_idx = idx;
			}
		})
		callback(video_idx);
	}

	resetFilter = () => {
		let searchPosition = this.state.searchPosition;
		for(var i = 0 ; i < searchPosition.length ; i ++ ) {
			if(i === 0) {
				searchPosition[i].checked = 1;
			}
			else {
				searchPosition[i].checked = 0;
			}
		}

		 this.setState({
			searchPosition,
		 })
		
	}

	filterClear = () => {
		const filter = "";
		const { searchVideos } = this.props;
		const { searchPosition } = this.state;
	   
		searchVideos(filter, searchPosition)
		.then(res=>{
			this.setState({
				videos : res.videos,
				filter : "",
			})
		})
		.catch(err=>{console.log(err);})
	}

	selectClear = () => {
		const { videos, selectIdx } = this.state;
		let btnDisabled = "disabled"
		selectIdx.map(idx => {
			videos[idx].checked = 0;
		})
		this.setState({
			selectVideos : [],
			videos,
			selectIdx : [],
			btnDisabled
		})
	}

	handleChange = (value) => {
		this.setState({
		  positionValue : value,
		})
	}

	submit = () => {
		const { selectVideos, playlists, pid, positionValue, currentPlaylist } = this.state;
		const playlist_id = playlists[pid].id;

		const { addVideoToPlaylist } = this.props;
		this.getVideoIds(selectVideos, (video_ids) => {
			addVideoToPlaylist(video_ids, playlist_id, positionValue)
			.then(res=>{
				console.log(res);
				if(!res.success) {
					alert("All video lists exist in the current playlist!")
					const { videos, selectIdx } = this.state;
					let btnDisabled = "disabled"
					selectIdx.map(idx => {
						videos[idx].checked = 0;
					})
					this.setState({
						selectVideos : [],
						videos,
						selectIdx : [],
						btnDisabled
					})
				}
				else {
					if(playlist_id === currentPlaylist) {
						var position = parseInt(this.state.positionValue);
						this.props.playlistItems(res.videos, position, playlist_id);
					}
					alert(`The new video  is added to the playlist#! If you have the playlist loaded in a cube you will have to reload it by switching to a different playlist and back to it, then you will see the updates!`)
					const { videos, selectIdx } = this.state;
					let btnDisabled = "disabled"
					selectIdx.map(idx => {
						videos[idx].checked = 0;
					})
					this.setState({
						selectVideos : [],
						videos,
						selectIdx : [],
						btnDisabled
					})
				}
			})
			.catch(err=>{console.log(err);})
		})
	}

	getVideoIds = (selectVideos, callback) => {
		const video_ids = [];
		selectVideos.map(({id}) => {
			video_ids.push(id);
		})
		callback(video_ids);
	}

	selectAll = (e) => {
		const { videos } = this.state;
		if(e.target.checked) {
			videos.map(video => {
				video.checked = 1;
			})
			this.setState({
				selectVideos : videos
			})
		}
		else {
			videos.map(video => {
				video.checked = 0;
			})
			this.setState({
				selectVideos : []
			})
		}
	}

	render() {
		const {
			videos,
			selectVideos,
			positionValue,
			btnDisabled,
			playlists,
			searchPosition,
			filter
		} = this.state;

		const tableData = videos.map((video, idx) => {
			const { checked, video_type, interface_link, video_title, video_author, video_length, description, thumb, tags, gotags, category, note, gsvn, id } = video;
			return ({
				action: (
					<div>
						<input type="checkbox" value={idx} name={idx} checked = {checked === 1 ? 'checked' : ''} onChange = {this.selectVideo(video, idx)} />
					</div>
				),
				video_type,
				interface_link,
				video_title,
				video_author,
				description,
				video_length: video_length === -1 ? '' : video_length,
				thumb,
				tags,
				gotags,
				category,
				note,
				gsvn,
				id
			});
		});

		const selectData = selectVideos.map((video) => {
			const { video_type, video_title } = video;
			return ({
				video_type,
				video_title,
			});
		});

		const positionItem = searchPosition.map((type, idx) => {
			return (
				<div key = {idx} className = { idx === 0 ? 'filter-item-1' : 'filter-item'}>
					<input type='checkbox' value={idx} name={idx} checked={type.checked === 1 ? "checked" : ""} onChange = {this.selectTypes("searchPosition", idx)} />
					<p>{type.label}</p>
				</div>
			)
		})
		return (
			<div className='videoSearch'>
				<div className='video-result' >
					<div className = 'search-head'>
						<div className = 'search-content'>
							<div className = 'filter-title'>
								<h2>Search Tethyr</h2>
							</div>
							<div className = 'filter-items'>
								<div className = 'filter-item'>
									<input type = 'text' onChange = {this.onFilterChange} value={filter} placeholder='Enter Search Term' />
									<button onClick = {this.filterSearch}>Search</button>
									<button onClick = {this.filterClear}>Clear</button>
								</div>
							</div>
							<div className = 'filter-items'>
								<p>Search:</p>
								{ positionItem }
							</div>
						</div>
						<div className = 'search-filter'>
							<button className='reset_filter' onClick = {this.resetFilter}>Reset Filters</button>
							<div className = 'search-filters'>
								<p>Search Filters:</p>
								<div>
									<input type = 'checkbox' />Platform
									<input type = 'checkbox' />When From?
									<input type = 'checkbox' />Length
								</div>
								<div>
									<input type = 'checkbox' />Content Type
									<input type = 'checkbox' />Category
									<input type = 'checkbox' />Location
								</div>
							</div>
						</div>
					</div>
					<div className = 'search-result'>
						<div className = 'result-table'>
							<div>
								<h2>Search Results</h2>
								<h3>Select items and add them to your watchlist:::::></h3>
							</div>
							<div className = 'video-table'>
								<input type="checkbox" onChange = {this.selectAll} />Check All
								<ReactTable
									data={tableData}
									sortable={false}
									columns={columns}
									defaultPageSize={100}
									showPaginationTop={false}
									className="-striped -highlight"
									style={{fontSize: 12}}
								/>
							</div>
						</div>
						<div className = 'video-add'>
							<h2>Your List</h2>
							<h3>Pick which playlist they go to and shoot!</h3>
							{/* <button className="close-btn" style={{float:'right'}} onClick={this.props.toggleSearch}>Close</button> */}
							
							<div className = 'video-position'>
								<p>Insert position</p>
								<div className = 'add_position'>
									<RadioGroup name="playlistPosition" selectedValue={positionValue} onChange={this.handleChange}>
										<Radio value="0" />Top
										<Radio value="1" />Bottom
									</RadioGroup>
								</div>
							</div>
							{/* <select onChange={this.onPlaylistSelect}>
								{
									playlists.map(({name}, idx) => (
										<option key={idx} value={name}>{name}</option>
									))
								}
							</select> */}
							<div className = 'actionBtn'>
								<button onClick = { this.submit } disabled = { btnDisabled }>Submit</button>
								<button onClick = {this.selectClear} disabled = { btnDisabled }>Clear</button>
							</div>
							<div className = 'video-table'>
								<ReactTable
									data={selectData}
									sortable={false}
									columns={selectColumns}
									defaultPageSize={100}
									showPaginationTop={false}
									className="-striped -highlight"
									style={{fontSize: 12}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	searchVideos : bindActionCreators(searchVideos, dispatch),
	addVideoToPlaylist : bindActionCreators(addVideoToPlaylist, dispatch),
	getVideosTypes : bindActionCreators(getVideosTypes, dispatch),
	showOverlaySpinner: bindActionCreators(showOverlaySpinner, dispatch),
	hideOverlaySpinner: bindActionCreators(hideOverlaySpinner, dispatch),
})

export default connect(null, mapDispatchToProps)(SearchContent);