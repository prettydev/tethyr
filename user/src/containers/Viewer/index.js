import React, { Component } from 'react'
import { connect } from 'react-redux'
import {isMobile} from 'react-device-detect'
import TopHeaderBar from '../../components/TopHeaderBar'
import MainView from './components/MainView'
import PlaylistViewer from './components/PlaylistViewer'
import { selectLayout } from '../../redux/actions/viewer'
import { getUserAllGridset } from '../../services/userGridset'
import { getUserAllPlaylist } from '../../services/userPlaylist'
import { getUserAllItem } from '../../services/UserItem'
import './styles.css'

/* Layout Lists
const layouts = {
  0: 'G1',
  1: 'G2',
  2: 'G2c1',
  3: 'G3c1',
  4: 'G4',
  5: 'G4c1',
  6: 'G4pro',
  7: 'G6',
  8: 'G8',
  9: 'M1',
  10: 'M4',
}
*/

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: 0,
      playlist: 0,
      user_gridsets: [],
      user_playlists: [],
      user_items: [],
    }
  }

  componentDidMount() {
    const { user, viewer } = this.props;
    document.getElementById('topHeaderBar').style.zoom = 0.9;
    document.getElementById('mainViewer').style.zoom = 0.9;
    document.getElementById('playlistViewer').style.zoom = 0.9;
    if(isMobile)
    {
      const mobile_viewer = 9;
      this.props.dispatch(selectLayout(mobile_viewer));
    }
    getUserAllGridset(user.user.user_id, user.user.token, 'all', 1)
    .then(({data}) => {
      if(data.length === 0) {
        alert("You don't have any public groups. Please add some on the manager page!")
        this.props.history.push('/manage');
      }
      else {
        const gridsets = data;
        const gridset_id = gridsets[viewer.group].id;
        getUserAllPlaylist(user.user.user_id, user.user.token, gridset_id, 'all', 1)
        .then(({data}) => {
          if(data.length === 0) {
            this.setState({
              group: viewer.group,
              playlist: viewer.playlist,
              user_gridsets: gridsets,
              user_playlists: [],
              user_items: [],
            })
          }
          else {
            const playlists = data;
            const playlist_id = playlists[viewer.playlist].id;
            getUserAllItem(user.user.user_id, user.user.token, playlist_id, 'all', 1)
            .then(({data}) => {
              this.setState({
                group: viewer.group,
                playlist: viewer.playlist,
                user_gridsets: gridsets,
                user_playlists: playlists,
                user_items: data,
              })
            })
          }
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  }

  componentDidUpdate() {
    if(this.state.group !== this.props.viewer.group) {
      const { user, viewer } = this.props;
      const { user_gridsets } = this.state;
      const gridset_id = user_gridsets[viewer.group].id;
      getUserAllPlaylist(user.user.user_id, user.user.token, gridset_id, 'all', 1)
      .then(({data}) => {
        if(data.length === 0) {
          this.setState({
            group: viewer.group,
            playlist: viewer.playlist,
            user_playlists: [],
            user_items: [],
          })
        }
        else {
          const playlists = data;
          const playlist_id = playlists[viewer.playlist].id;
          getUserAllItem(user.user.user_id, user.user.token, playlist_id, 'all', 1)
          .then(({data}) => {
            this.setState({
              group: viewer.group,
              playlist: viewer.playlist,
              user_playlists: playlists,
              user_items: data,
            })
          })
        }
      })
      .catch(err => console.log(err))
    }
    if(this.state.playlist !== this.props.viewer.playlist) {
      const { user, viewer } = this.props;
      const { user_playlists } = this.state;
      const playlist_id = user_playlists[viewer.playlist].id;
      getUserAllItem(user.user.user_id, user.user.token, playlist_id, 'all', 1)
      .then(({data}) => {
        this.setState({
          playlist: viewer.playlist,
          user_items: data,
        })
      })
      .catch(err => console.log(err))
    }
  }

  render() {
    const { viewer } = this.props;
    const { user_gridsets, user_playlists, user_items } = this.state;
    return (
      <React.Fragment>
        <TopHeaderBar
          scene="viewer"
          mobile={isMobile}
          gridsets={user_gridsets}
        />
        <div className="viewerBody">
          <MainView
            gridset_id={user_gridsets[viewer.group]}
          />
          <PlaylistViewer
            playlists={user_playlists}
            items={user_items}
          />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user : state.user,
    viewer : state.viewer,
  }
}

export default connect(mapStateToProps)(Viewer);