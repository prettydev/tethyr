import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import images from '../../constants/images';


// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

import {
	setGridsetAsMaster,
} from '../../actions';
import { logoutUser } from '../../redux/actions/user'
import { selectLayout, selectGroup, playAction } from '../../redux/actions/viewer'

import Modal from 'react-modal';

import './styles.scss';

const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)'
	}
};

/* Layout Lists
*/
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

Modal.setAppElement('#root')

class TopHeaderBar extends React.Component {
		
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false,
			buttonDisabled : true,
			pwd : "",
			errMsg : false,
			gridsets: [],
			selectedGroup: 0,
		}
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		this.setState({
			gridsets: this.props.gridsets,
			selectedGroup: this.props.viewer.group,
		})
	}

	componentDidUpdate() {
		if(this.state.gridsets !== this.props.gridsets) {
			this.setState({
				gridsets: this.props.gridsets,
			})
		}
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	onPassword = (e) => {
		const { pwd } = this.state;
		var buttonDisabled = pwd ? false : true;
		this.setState({
			pwd : e.target.value,
			buttonDisabled
		})
	}
			
	setPlaylistGroupAsMaster = () => {
		const {gridsets, user} = this.props;
		const { setGridsetAsMaster } = this.props;
		const { pwd } = this.state;

		clearTimeout(this.timer);

		if(pwd.toString() !== '1234') {
			this.setState({
				errMsg : true
			})
			this.timer = setTimeout(() => {
				this.setState({ errMsg: false });
			}, 3000);
		}
		else {
			setGridsetAsMaster(gridsets[user].id)
			.then(res=>{
				if(res.success) {
					alert(`The gridset ${gridsets[user].id}#${gridsets[user].name} has set as Master!`)
					this.setState({
						modalIsOpen : false
					})
				}
				else {
					alert(`The gridset ${gridsets[user].id}#${gridsets[user].name} is empty!`)
					this.setState({
						modalIsOpen : false
					})
				}
			})
			.catch(err=>{console.log(err);})
		}
	}

	logout = () => {
    this.props.dispatch(logoutUser())
    this.props.history.push('/')
	}
	
	selectLayout = (layout) => {
		this.props.dispatch(selectLayout(layout))
	}

	selectPlayAction = (action) => {
		this.props.dispatch(playAction(action))
	}

	onGroupSelect = (event) => {
		this.props.dispatch(selectGroup(event.target.selectedIndex));
		this.setState({
			selectedGroup: event.target.value,
		})
	} 

	render() {
		const { viewer, user, scene, mobile } = this.props;
		const { gridsets, selectedGroup } = this.state;
		return (
			<div className="topHeaderBar" id="topHeaderBar">
				<div className="logo">
					<div className="dropdown">
						<Link to ="/"><img src={images.btnProgHeadLogoTyr} className="headerLogo" alt="Tethyr Logo" title="Tethyr Logo" /></Link>
						<Link to ="/"><img src={images.btnProgHeadLogoTyrIcon} className="mobileLogo" alt="Tethyr Logo" title="Tethyr Logo" /></Link>
						{ !mobile &&
							<div className="dropdownbuttons">
								<a href="https://andmoor.com" target="_blank" rel="noopener noreferrer">
									<img src={images.btnProgHeadLogoAnd} className="headerLogo" alt="Andmoor Logo" title="Andmoor Logo" />
									<img src={images.btnProgHeadLogoAndIcon} className="mobileLogo" alt="Andmoor Logo" title="Andmoor Logo" />
								</a>
							</div>
						}
					</div>
				</div>
				<div className="left-menu">
					<div className="login">
						<div className=" dropdown">
							<img src={images.btnProgHeadUser} alt="User" title="User" height="35px"/>
							<div className="dropdownbuttons">
								<span className="userSpan"> user {user.user.user_id} : {user.user.userName}</span>
								<button onClick={this.logout}>LOGOUT</button>
							</div>
						</div>
					</div>
					<div className="interface">
						<label>Interface:</label>
						<div className="dropdown">
							{
								(scene === "viewer") && 
								<button className='selected'>Tethyr Viewer</button>
							}
							{
								(scene === "manage") && 
								<button className='selected'>Playlist & Playlist Group Manager</button>
							}
							<div className="dropdownbuttons">
								<Link to ="/viewer"><button className={scene === "viewer" ? 'selected' : ''}>Tethyr Viewer</button></Link>
								<Link to ="/manage"><button className={scene === "manage" ? 'selected' : ''}>Playlist & Playlist Group Manager</button></Link>
								<Link to ="/settings"><button className={scene === "setting" ? 'selected' : ''}>Personal Settings</button></Link>
							</div>
						</div>
					</div>
				</div>
				{ scene === 'viewer' && 
					<div className="layout-menu">
						<div className="layouts">
							<label>Layout:</label>
							<div className="dropdown">
								<button className='selected'>{layouts[viewer.layout]}</button>
								<div className="dropdownbuttons">
									<img src={layouts[viewer.layout] === 'M1' ? images.btnM1_active : images.btnM1} onClick={() => this.selectLayout(9)} className="layoutBtn" alt="Layout M1" title="Layout M1" />
									<img src={layouts[viewer.layout] === 'M4' ? images.btnM4_active : images.btnM4} onClick={() => this.selectLayout(10)} className="layoutBtn" alt="Layout M4" title="Layout M4" />
									<img src={layouts[viewer.layout] === 'G1' ? images.btnG1_active : images.btnG1} onClick={() => this.selectLayout(0)} className="layoutBtn" alt="Layout G1" title="Layout G1" />
									<img src={layouts[viewer.layout] === 'G2' ? images.btnG2_active : images.btnG2} onClick={() => this.selectLayout(1)} className="layoutBtn" alt="Layout G2" title="Layout G2" />
									<img src={layouts[viewer.layout] === 'G2c1' ? images.btnG2c1_active : images.btnG2c1} onClick={() => this.selectLayout(2)} className="layoutBtn" alt="Layout G2c1" title="Layout G2c1" />
									<img src={layouts[viewer.layout] === 'G3c1' ? images.btnG3c1_active : images.btnG3c1} onClick={() => this.selectLayout(3)} className="layoutBtn" alt="Layout G3c1" title="Layout G3c1" />
									<img src={layouts[viewer.layout] === 'G4' ? images.btnG4_active : images.btnG4} onClick={() => this.selectLayout(4)} className="layoutBtn" alt="Layout G4" title="Layout G4" />
									<img src={layouts[viewer.layout] === 'G4pro' ? images.btnG4pro_active : images.btnG4pro} onClick={() => this.selectLayout(6)} className="layoutBtn" alt="Layout PRO" title="Layout PRO" />
									<img src={layouts[viewer.layout] === 'G4c1' ? images.btnG4c1_active : images.btnG4c1} onClick={() => this.selectLayout(5)} className="layoutBtn" alt="Layout G4c1" title="Layout G4c1" />
									<img src={layouts[viewer.layout] === 'G6' ? images.btnG6_active : images.btnG6} onClick={() => this.selectLayout(7)} className="layoutBtn" alt="Layout G6" title="Layout G6" />
									<img src={layouts[viewer.layout] === 'G8' ? images.btnG8_active : images.btnG8} onClick={() => this.selectLayout(8)} className="layoutBtn" alt="Layout G8" title="Layout G8" />
								</div>
							</div>
						</div>
					</div>
				}
				<div className="mobile-menu">
					<div className="login">
						<div className=" dropdown">
							<img src={images.btnProgHeadUser} alt="User" title="User" height="35px"/>
							<div className="dropdownbuttons">
								<span className="userSpan"> user {user.user.user_id} : {user.user.userName}</span>
								<button onClick={this.logout}>LOGOUT</button>
							</div>
						</div>
					</div>
					<div className="interface">
						<div className="dropdown">
							<img src={images.btnProgHeadModeViewer} alt="Mode" title="Mode" height="35px"/>
							<div className="dropdownbuttons">
								<Link to ="/viewer"><img src={images.btnProgHeadModeViewer} alt="Viewer" title="Viewer" width="35px" height="35px"/></Link>	
								<Link to ="/manage"><img src={images.btnProgHeadModeManager} alt="Group Manager" title="Group Manager" width="35px" height="35px"/></Link>	
								<Link to ="/settings"><img src={images.btnProgHeadModeSettings} alt="Personal Settings" title="Personal Settings" width="35px" height="35px"/></Link>
							</div>
						</div>
					</div>
					{ scene === 'viewer' &&
						<React.Fragment>
							<div className="smalllayout">
								<div className="dropdown">
									<button className='selected' style={{width: '35px', height: '35px', border: '1px solid #525050'}}>{layouts[viewer.layout]}</button>
									<div className="dropdownbuttons">
										<div style={{display:'flex'}}>
											<img src={layouts[viewer.layout] === 'M1' ? images.btnProgHeadM1_active : images.btnProgHeadM1} onClick={() => this.selectLayout(9)} className="layoutBtn" alt="Layout M1" title="Layout M1" />
											<img src={layouts[viewer.layout] === 'M4' ? images.btnProgHeadM4_active : images.btnProgHeadM4} onClick={() => this.selectLayout(10)} className="layoutBtn" alt="Layout M4" title="Layout M4" />
											<img src={layouts[viewer.layout] === 'G1' ? images.btnProgHeadG1_active : images.btnProgHeadG1} onClick={() => this.selectLayout(0)} className="layoutBtn" alt="Layout G1" title="Layout G1" />
											<img src={layouts[viewer.layout] === 'G2' ? images.btnProgHeadG2_active : images.btnProgHeadG2} onClick={() => this.selectLayout(1)} className="layoutBtn" alt="Layout G2" title="Layout G2" />
											<img src={layouts[viewer.layout] === 'G2c1' ? images.btnProgHeadG2c1_active : images.btnProgHeadG2c1} onClick={() => this.selectLayout(2)} className="layoutBtn" alt="Layout G2c1" title="Layout G2c1" />
											<img src={layouts[viewer.layout] === 'G3c1' ? images.btnProgHeadG3c1_active : images.btnProgHeadG3c1} onClick={() => this.selectLayout(3)} className="layoutBtn" alt="Layout G3c1" title="Layout G3c1" />
										</div>
										<div style={{display:'flex'}}>
											<img src={layouts[viewer.layout] === 'G4' ? images.btnProgHeadG4_active : images.btnProgHeadG4} onClick={() => this.selectLayout(4)} className="layoutBtn" alt="Layout G4" title="Layout G4" />
											<img src={layouts[viewer.layout] === 'G4pro' ? images.btnProgHeadG4pro_active : images.btnProgHeadG4pro} onClick={() => this.selectLayout(6)} className="layoutBtn" alt="Layout G4pro" title="Layout G4pro" />
											<img src={layouts[viewer.layout] === 'G4c1' ? images.btnProgHeadG4c1_active : images.btnProgHeadG4c1} onClick={() => this.selectLayout(5)} className="layoutBtn" alt="Layout G4c1" title="Layout G4c1" />
											<img src={layouts[viewer.layout] === 'G6' ? images.btnProgHeadG6_active : images.btnProgHeadG6} onClick={() => this.selectLayout(7)} className="layoutBtn" alt="Layout G6" title="Layout G6" />
											<img src={layouts[viewer.layout] === 'G8' ? images.btnProgHeadG8_active : images.btnProgHeadG8} onClick={() => this.selectLayout(8)} className="layoutBtn" alt="Layout G8" title="Layout G8" />
										</div>
									</div>
								</div>
							</div>
							<div className="layouts" >
								<div className="dropdown">
									<img src={images.btnProgHeadGridset} alt="Gridset" title="Select Playlist Group" height="35px"/>
									<div className="dropdownbuttons">
										{/* <select value={this.props.user} onChange={this.props.onUserSelect} alt='select gridset' style={{height:'30px', lineHeight: '30px'}}>
										{
											this.props.filteredUsers.map((user, idx) => (
												<option key={idx} value={idx}>{user.name}</option>
											))
										}
										</select> */}
									</div>
								</div>
							</div>
						</React.Fragment>
					}
				</div>							
				{ scene === 'viewer' &&
					<div style={{display:'flex', flexGrow: 1, justifyContent: 'flex-end'}}>
						<div className="selectGridset">
							<label>Playlist Group:</label>
							<select value={selectedGroup} onChange={this.onGroupSelect} alt='select gridset'>
							{
								gridsets.map((gridset, idx) => (
									<option key={idx} value={idx}>{gridset.name}</option>
								))
							}
							</select>
						</div>
						<div className="interface">
							<div className="dropdown">
								<img src={images.btn_playlist_group_action} className = "playlist_group_btn" />
								<div className="dropdownbuttons playlist_group">
									<button onClick = {this.openModal}>Set Playlist Group as Master</button>  
								</div>
								<Modal
									isOpen={this.state.modalIsOpen}
									onRequestClose={this.closeModal}
									style={customStyles}
									contentLabel="Set Playlist Group As Master"
								>
									<h5>Password</h5>
									<input type="password" maxLength="4" onChange = {this.onPassword} />
									<br />
									<br />
									{
										this.state.errMsg && 
											<React.Fragment>
												<p style={{color:"red"}} >Invalid Password</p>
												<br />
											</React.Fragment>
									}
									<button onClick = {this.setPlaylistGroupAsMaster} disabled = {this.state.buttonDisabled} >Set As Master</button>
								</Modal>
							</div>
						</div>
						<div className="control">
							<button className={viewer.playAction === 0 ? 'playall selected' : 'playall'} onClick={() => this.selectPlayAction(0)}>
								Play All
							</button>
							<button className={viewer.playAction === 1 ? 'pauseall selected' : 'pauseall'} onClick={() => this.selectPlayAction(1)}>
								Pause All
							</button>
						</div>
						<div className="control mobile-menu">
							<button className={viewer.playAction === 0 ? 'playall selected' : 'playall'} onClick={() => this.selectPlayAction(0)}>
								<FontAwesomeIcon icon={faPlay} />
							</button>
							<button className={viewer.playAction === 1 ? 'pauseall selected' : 'pauseall'} onClick={() => this.selectPlayAction(1)}>
								<FontAwesomeIcon icon={faPause} />
							</button>
						</div>
					</div>
				}
			</div>
		);
	}
}
// const mapDispatchToProps = (dispatch) => ({
// 	setGridsetAsMaster : bindActionCreators(setGridsetAsMaster, dispatch)
// })

const mapStateToProps = (state) => {
	return {
		viewer: state.viewer,
		user: state.user,
	}
}

export default withRouter(connect(mapStateToProps)(TopHeaderBar));