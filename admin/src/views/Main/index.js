import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Sidebar from '../Sidebar';
import VideosComponent from '../../views/Videos/home';
import VideoDetail from '../../views/Videos/detail';
import Playlists from '../../views/Playlists/home';
import PlaylistDetail from '../../views/Playlists/detail';
import DefaultGridsets from '../../views/DefaultGridsets';
import Gridsets from '../../views/Gridsets';
import Platforms from '../../views/Platforms';
import Users from '../../views/Users/home'
import UserDetail from '../../views/Users/detail';
import UserPlaylist from '../../views/Users/playlist';
import UserVideo from '../../views/Users/video';
import Ads from '../../views/Ads';
import APIGenerator from '../../views/APIGenerator';

import './styles.css';

import OverlaySpinner from '../../components/OverlaySpinner'

class Main extends Component {
  
	render() {

		const { overlaySpinner } = this.props;

		return(
			<Router>
				<div className='main'>
					<Sidebar />
					{overlaySpinner.visible && (
						<OverlaySpinner visible={ overlaySpinner.visible } />
					)}
					<div className='app-content'>
						<Switch>
							<Route exact path='/videos' component={VideosComponent} />
							<Route path='/videos/edit' component={VideoDetail} />
							<Route exact path='/playlists' component={Playlists} />
							<Route path='/playlists/edit' component={PlaylistDetail} />
							<Route exact path='/users' component={Users} />
							<Route path='/users/:userId/user_edit' component={UserDetail} />
							<Route path='/users/:userId/user_playlist' component={UserPlaylist} />
							<Route path='/users/:userId/user_video' component={UserVideo} />
							<Route exact path='/gridset' component={Gridsets} />
							<Route exact path='/defaultGridset' component={DefaultGridsets} />
							<Route exact path='/platform' component={Platforms} />
							<Route exact path='/ads' component={Ads} />
							{/* <Route exact path='/api_generator' component={APIGenerator} /> */}
							<Route
								render={() =>
									<Redirect to={{ pathname: '/videos', state: { from: '' } }} />
								}
							/>
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
	
}

function mapStateToProps(state) {
	return {
		overlaySpinner: state.overlaySpinner,
	}
}

export default connect(mapStateToProps)(Main)
