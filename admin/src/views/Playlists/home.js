import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from "react-table";

import {
  fetchAllPlaylists,
  getNewGSPN
} from '../../actions/playlist';

class PlaylistsComponent extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      playlists: [],
    }
  }

  componentWillMount() {
    this.fetchAllPlaylists();
  }

  fetchAllPlaylists = () => {
    const { fetchAllPlaylists } = this.props;
    fetchAllPlaylists()
      .then(({ playlists }) => {
        this.setState({ 
          playlists,
        });
      })
      .catch();
  }

  newPlaylist = () => {
    const { newGSPN } = this.props;
    newGSPN()
      .then(({ gspn }) => {
        this.props.history.push('/playlists/edit', { gspn });
      });
  }

  onEditPlaylist = (idx) => {
    const { playlists } = this.state;
    const { gspn } = playlists[idx];
    this.props.history.push('/playlists/edit', { gspn });
  }

  onGSPNSelect = (e) => {
    const index = e.target.selectedIndex;
    if(index !== 0 ){
      const { playlists } = this.state;
      const { gspn } = playlists[index - 1];
      this.props.history.push('/playlists/edit', { gspn });
    }
  }

  render() {
    const {
      playlists,
    } = this.state;
    const columns = [
      {
        Header: "Playlist ID(GSPN)",
        accessor: "gspn"
      },
      {
        Header: "Edit button",
        accessor: "action"
      },
      {
        Header: "Playlist Title",
        accessor: "title"
      },
      {
        Header: "Available to Gridsets",
        accessor: "users",
        style: {
          overflow: 'unset',
        }
      },
      {
        Header: "Playlist Description",
        accessor: "description"
      }
    ];
    const tableData = playlists.map(({ gspn, title, description, users }, idx) => ({
      gspn,
      action: <button onClick={() => this.onEditPlaylist(idx)}>Edit</button>,
      title,
      description,
      users: users.join(',')
    }));
    return (
      <div className="playlists-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>2-1 Playlist Browser</h4>
        <button onClick={this.newPlaylist}>Add New Playlist</button>
        <div className="info-item">
            <label>GSPN</label>
            <select onChange={this.onGSPNSelect}>
                <option>Please select the playlist</option>
                {
                    playlists.map((gspn, index) => (
                        <option key={index} value={gspn.gspn}>{gspn.gspn} {gspn.title}</option>
                    ))
                }
            </select>
        </div>
        <ReactTable
          data={tableData}
          sortable={false}
          columns={columns}
          defaultPageSize={100}
          showPaginationTop={false}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllPlaylists: bindActionCreators(fetchAllPlaylists, dispatch),
  newGSPN: bindActionCreators(getNewGSPN, dispatch)
})

export default connect(null, mapDispatchToProps)(PlaylistsComponent);
