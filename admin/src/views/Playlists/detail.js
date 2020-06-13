import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from 'react-select';
import ReactTable from "react-table";
import { CSVLink } from 'react-csv/lib';
import CSVReader from 'react-csv-reader';
import Modal from 'react-modal/lib';

import { fetchAllGridsets } from '../../actions/gridset';

import {
  fetchAllPlaylists,
  savePlaylist,
  fetchAllVideos,
  removeVideoFromPlaylist,
  swapVideoOrder,
  getNewGSPN,
  saveDataFromCSV,
  resetDefaultPlaylist,
  updateSponsored,
} from '../../actions/playlist';

import './index.css'

// const customStyles = {
//   content : {
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     transform             : 'translate(-50%, -50%)',
//     width                 : '300px'
//   }
// };

Modal.setAppElement('#root')

const headers = [
  { label: "GSPN", key: "gspn" },
  { label: "Order", key: "order" },
  { label: "GSVN", key: "gsvn" },
  { label: "Video Title", key: "video_title" },
  { label: "Broadcaster", key: "video_type" },
  { label: "Sponsored", key: "sponsored" },
  { label: "Interface Link", key: "interface_link" },
];

const columns = [
  {
    Header: "Sponsored",
    accessor: "sponsored",
    width: 70,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "GSPN",
    accessor: "gspn",
    width: 170,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Button to Reorder",
    accessor: "reorderAction",
    width: 200,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "",
    accessor: "order",
    width: 30,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Button to Remove",
    accessor: "removeAction",
    width: 100,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "GSVN",
    accessor: "gsvn",
    width: 320,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Video Title",
    accessor: "video_title",
    width: 400,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Broadcaster",
    accessor: "video_type",
    width: 150,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  }
]

class PlaylistDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      allGridsets: [],
      title: '',
      password : '',
      description: '',
      thumb: '',
      users: [],
      videos: [],
      newGspn: '',
      csvData : null,
      importData : null,
      modalIsOpen : false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.assignNewGspn();
  }

  componentWillReceiveProps(nextProps) {
    if (window.location.pathname !== nextProps.location.pathname) {
      this.props.history.replace('/playlists');
    }
  }

  componentWillMount() {
    const { fetchAllGridsets } = this.props;
    fetchAllGridsets()
      .then(({ gridsets }) => {
        this.setState({ allGridsets: gridsets });
      })
      .catch();
    this.fetchAllPlaylists();
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  } 

  assignNewGspn = () => {
    const { newGSPN } = this.props;
    newGSPN()
      .then(({ gspn }) => {
        this.setState({ newGspn: gspn });
      });
  }

  fetchAllPlaylists = () => {
    const { gspn } = this.props.location.state;
    const { fetchAllPlaylists } = this.props;
    fetchAllPlaylists()
      .then(({ playlists }) => {
        this.setState({
          playlists,
        }, () => this.setGSPN(gspn));
      })
      .catch();
  }

  setGSPN = (gspn) => {
    const { fetchAllVideos } = this.props;
    fetchAllVideos(gspn)
      .then(({ videos }) => {
        const { playlists } = this.state;
        const index = playlists.findIndex(playlist => playlist.gspn === gspn);
        this.setState({
          videos,
          title: index === -1 ? '' : playlists[index].title,
          password: index === -1 ? '' : playlists[index].password,
          description: index === -1 ? '' : playlists[index].description,
          thumb: index === -1 ? '' : playlists[index].thumb,
          users: index === -1 ? [] : playlists[index].users,
        });
        const { history, location } = this.props;
        history.replace(location.pathname, { gspn });
      })
  }

  onGSPNSelect = (e) => {
    this.setGSPN(e.target.value);
  }

  onChangeValue = (field, value) => {
    const state = {};
    state[field] = value;
    this.setState(state);
  }

  handleChange(evt) {
    const password = (evt.target.validity.valid) ? evt.target.value : this.state.password;
    this.setState({ password });
  }

  handleSelectChange = (selected) => {
    // const users = selected.map(val => val.value);
    // this.setState({ users });
  }

  onSavePlaylist = () => {
    const {
      title,
      users,
      description,
      password,
      thumb,
      importData
    } = this.state;
    const { gspn } = this.props.location.state;
    const { savePlaylist, saveDataFromCSV, fetchAllGridsets } = this.props;
    savePlaylist(gspn, title, users, description, thumb, password)
      .then(() => {
        if(importData) {
          saveDataFromCSV(importData)
          .then(res=>{
            fetchAllGridsets()
              .then(({ gridsets }) => {
                this.setState({ allGridsets: gridsets });
                alert('Playlist Saved!');
              })
              .catch();
            this.fetchAllPlaylists();
            this.assignNewGspn();
          })
          .catch(err=>{console.log(err);})
        }
        else {
          fetchAllGridsets()
            .then(({ gridsets }) => {
              this.setState({ allGridsets: gridsets });
              alert('Playlist Saved!');
            })
            .catch();
          this.fetchAllPlaylists();
          this.assignNewGspn();
        }
      })
  }

  onMoveVideo = (idx, up) => {
    const { gspn } = this.props.location.state;
    let order = idx - up;
    if(!up) {
      order += 1;
    }
    const { videos } = this.state;
    const video_id = videos[idx].id;
    const swap_video_id = videos[order].id;
    const { swapVideoOrder } = this.props;
    swapVideoOrder(gspn, video_id, swap_video_id)
      .then(({videos}) => {
        this.setState({ videos });
      })
  }

  onMoveItem = (idx, up) => {
    const { gspn } = this.props.location.state;
    const { importData } = this.state;
    const order = idx - up;
    if(order === idx) idx = idx + 1;
    var temp = importData[idx];
    importData[idx] = importData[order];
    importData[order] = temp;
    importData[idx][1] = `${idx}`;
    importData[order][1] = `${order}`;
    const Data = importData.map((item, idx) => ({
      sponsored:(
        <div style={{textAlign:'center'}}>
          <input type = "checkbox" value={item[5]} checked = {item[5] === '1' ? 'checked' : ''} onChange={(e) => this.onChangeItemSponsored(idx, e)}/>
        </div>
      ),
      gspn,
      reorderAction: (
        <div>
            {idx > 0 && <button onClick={() => this.onMoveItem(idx, true)}>Move Up</button>}
            {idx < importData.length - 1 && <button onClick={() => this.onMoveItem(idx, false)}>Move Down</button>}
        </div>
      ),
      order: item[1],
      removeAction: (
        <button onClick={() => this.onRemoveItem(idx)}>Remove</button>
      ),
      gsvn: item[2],
      video_title:item[3],
      video_type:item[4]
    }));
    this.setState({
      csvData:Data,
      importData
    })
  }

  onRemoveItem = (idx) => {
    const { gspn } = this.props.location.state;
    const { importData } = this.state;
    var data = importData;
    data = data.slice(0); // make copy
    data.splice(idx, 1)
    for( var i = idx ; i < data.length ; i++)
    {
      data[i][1] = `${i}`;
    }
    const Data = data.map((item, idx) => ({
      sponsored:(
        <div style={{textAlign:'center'}}>
          <input type = "checkbox" value={item[5]} checked = {item[5] === '1' ? 'checked' : ''} onChange={(e) => this.onChangeItemSponsored(idx, e)}/>
        </div>
      ),
      gspn,
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveItem(idx, true)}>Move Up</button>}
          {idx < data.length - 1 && <button onClick={() => this.onMoveItem(idx, false)}>Move Down</button>}
        </div>
      ),
      order: item[1],
      removeAction: (
        <button onClick={() => this.onRemoveItem(idx)}>Remove</button>
      ),
      gsvn: item[2],
      video_title:item[3],
      video_type:item[4]
    }));
    this.setState({
      csvData:Data,
      importData : data,
    })
  }

  onChangeItemSponsored = (idx, e) => {
    const { gspn } = this.props.location.state;
    const { importData } = this.state;
    var data = importData;
    e.target.value === '1' ? data[idx][5] = '0' : data[idx][5] = '1';
    console.log(data[idx])
    const Data = data.map((item, idx) => ({
      sponsored:(
        <div style={{textAlign:'center'}}>
          <input type = "checkbox" value={item[5]} checked = {item[5] === '1' ? 'checked' : ''} onChange={(e) => this.onChangeItemSponsored(idx, e)}/>
        </div>
      ),
      gspn,
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveItem(idx, true)}>Move Up</button>}
          {idx < data.length - 1 && <button onClick={() => this.onMoveItem(idx, false)}>Move Down</button>}
        </div>
      ),
      order: item[1],
      removeAction: (
        <button onClick={() => this.onRemoveItem(idx)}>Remove</button>
      ),
      gsvn: item[2],
      video_title:item[3],
      video_type:item[4]
    }));
    this.setState({
      csvData:Data,
      importData : data,
    })
  }

  onRemoveVideo = (idx) => {
    const { videos } = this.state;
    const { gspn } = this.props.location.state;
    const { id } = videos[idx];
    const { removeVideoFromPlaylist } = this.props;
    removeVideoFromPlaylist(gspn, id)
      .then(({videos}) => {
        this.setState({ videos });
      })
  }

  handleForce = data => {
    const { gspn } = this.props.location.state;
    if(!data[1]) {
      alert("The csv file you have selected is empty!");
      return false;
    }
    else if(gspn !== data[1][0]) {
      alert("Select the csv with the same gspn");
      return false;
    }
    else
      alert("Import preview: to save these changes, press the save playlist button!")
    data = data.slice(0); // make copy
    data.splice(0, 1);
    const Data = data.map((item, idx) => ({
      sponsored:(
        <div style={{textAlign:'center'}}>
          <input type = "checkbox" value={item[5]} checked = {item[5] === '1' ? 'checked' : ''} onChange={(e) => this.onChangeItemSponsored(idx, e)}/>
        </div>
      ),
      gspn,
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveItem(idx, true)}>Move Up</button>}
          {idx < data.length - 1 && <button onClick={() => this.onMoveItem(idx, false)}>Move Down</button>}
        </div>
      ),
      order: item[1],
      removeAction: (
        <button onClick={() => this.onRemoveItem(idx)}>Remove</button>
      ),
      gsvn: item[2],
      video_title:item[3],
      video_type:item[4]
    }));
    this.setState({
      csvData:Data,
      importData: data
    })
  };

  onUndoPlaylist = () => {
    this.setState({
      csvData : null,
      importData : null,
    })
  }

  resetPlaylist = () => {
    const { resetDefaultPlaylist } = this.props;
    const { videos, title } = this.state;
    const { gspn } = this.props.location.state;
    resetDefaultPlaylist(gspn, videos)
    .then(res=>{
      this.setState({
        modalIsOpen : false,
      })
      alert(`[${title}][${gspn}] successfully reset to default`);
    })
    .catch(err=>{ console.log(err); })
  }

  onChange = (idx, e) => {
    const { updateSponsored } = this.props;
    let videos = this.state.videos;
    const { id } = videos[idx];
    e.target.value === '1' ? videos[idx].sponsored = 0 : videos[idx].sponsored = 1;
    updateSponsored(id, videos[idx].sponsored)
    .then(res=>{
      this.setState({
          videos
      })
    })
    .catch(err=>{console.log(err);})      
  }
    
  render() {
    const {
      playlists,
      allGridsets,
      title,
      description,
      password,
      thumb,
      users,
      videos,
      newGspn,
      csvData
    } = this.state;
    const { gspn } = this.props.location.state;
    const options = allGridsets.map(user => ({value:user.id, label:user.id}));
    const gspns = playlists.map(pl => ({ gspn: pl.gspn, label: pl.title }));
    const isNew = gspns.findIndex(a => a.gspn === newGspn) === -1;
    if (isNew) gspns.push({
      gspn: newGspn,
      label: `NEW PLAYLIST(${newGspn})`
    });
    console.log('====', videos)
    const tableData = videos.map(({gsvn, video_title, video_type, order, sponsored}, idx) => ({
      sponsored:(
        <div style={{textAlign:'center'}}>
          <input type = "checkbox" value={sponsored} checked = {sponsored === 1 ? 'checked' : ''} onChange={this.onChange.bind(null, idx)}/>
        </div>
      ),
      gspn,
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveVideo(idx, true)}>Move Up</button>}
          {idx < videos.length - 1 && <button onClick={() => this.onMoveVideo(idx, false)}>Move Down</button>}
        </div>
      ),
      order,
      removeAction: (
        <button onClick={() => this.onRemoveVideo(idx)}>Remove</button>
      ),
      gsvn,
      video_title,
      video_type
    }));

    const exportData = videos.map(({gsvn, video_title, video_type, order, sponsored, interface_link}, idx) => ({
      sponsored,
      gspn,
      order,
      gsvn,
      video_title,
      video_type,
      interface_link
    }));
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var csv_title = title.substring(0, 9);
    const fileName = `${gspn}_${dateTime}_${csv_title}`;
    return (
      <div className="playlist-detail-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>2-2 Playlist Editor</h4>
        <div className="playlist-info-panel">
          <div className="info-item">
            <label>GSPN</label>
            <select value={gspn} onChange={this.onGSPNSelect}>
              {
                gspns.map((gspn, index) => (
                  <option key={index} value={gspn.gspn}>{gspn.gspn} {gspn.label}</option>
                ))
              }
            </select>
          </div>
          <div className="info-item">
            <label>Playlist Title</label>
            <input type="text" style={{ width: 250 }} value={title} onChange={(e) => this.onChangeValue('title', e.target.value)} />
          </div>
          <div className="info-item">
            <label>Available to Gridsets</label>
            <Select
              value={users.map(val => ({ value: val, label: val }))}
              onChange={(selectedOption) => this.handleSelectChange(selectedOption)}
              options={options}
              isMulti
            />
          </div>
          <div className="info-item">
            <label>Playlist Description</label>
            <input type="text" style={{ width: 350 }} value={description} onChange={(e) => this.onChangeValue('description', e.target.value)} />
          </div>
          <div className="info-item">
            <label>Playlist Thumbnail</label>
            <input type="text" style={{ width: 350 }} value={thumb} onChange={(e) => this.onChangeValue('thumb', e.target.value)} />
          </div>
          <div className="info-item">
            <label>Playlist Password</label>
            <input type="text" pattern="[0-9]*" maxLength = "4" style={{ width: 250 }} value={password} onChange={this.handleChange.bind(this)} />
          </div>
      </div>
        <button onClick={this.onSavePlaylist}>Save Playlist</button>
        <button style={{ height:"26px", marginLeft:"10px"}}><CSVLink filename={`${fileName}.csv`} data={exportData} headers={headers} style={{color:"black"}}>Export Playlist</CSVLink></button>
        <button style={{ height:"26px", marginLeft:"10px"}} onClick={this.onUndoPlaylist}>Undo</button>
        <div className="container">
          <CSVReader
            cssClass="-reactcsv-input"
            label="Select CSV with playlist"
            onFileLoaded={this.handleForce}
          />
        </div>
        {/* <div style={{ textAlign:"right"}}>
          <button onClick={this.openModal}>Reset Playlist to Default</button>
        </div> */}
        <ReactTable
          data={ csvData || tableData }
          sortable={false}
          columns={columns}
          defaultPageSize={25}
          showPaginationTop={false}
          className="-striped -highlight"
        />
        {/* <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences"
        >
          <h5>Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences</h5>
          <div style={{display: "flex", justifyContent:"space-between"}}>
            <button style={{width:"100px"}} onClick={this.resetPlaylist}>Yes</button>
            <button style={{width:"100px"}} onClick={this.closeModal}>No</button>
          </div>
        </Modal> */}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllPlaylists: bindActionCreators(fetchAllPlaylists, dispatch),
  fetchAllGridsets: bindActionCreators(fetchAllGridsets, dispatch),
  savePlaylist: bindActionCreators(savePlaylist, dispatch),
  fetchAllVideos: bindActionCreators(fetchAllVideos, dispatch),
  removeVideoFromPlaylist: bindActionCreators(removeVideoFromPlaylist, dispatch),
  swapVideoOrder: bindActionCreators(swapVideoOrder, dispatch),
  newGSPN: bindActionCreators(getNewGSPN, dispatch),
  saveDataFromCSV: bindActionCreators(saveDataFromCSV, dispatch),
  resetDefaultPlaylist: bindActionCreators(resetDefaultPlaylist, dispatch),
  updateSponsored: bindActionCreators(updateSponsored, dispatch),
})

export default connect(null, mapDispatchToProps)(PlaylistDetail);
