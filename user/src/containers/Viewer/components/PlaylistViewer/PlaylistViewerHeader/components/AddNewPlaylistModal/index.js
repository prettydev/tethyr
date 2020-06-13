import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from 'react-modal';

import {
  createNewPlaylist, 
  addNewToPlaylist
} from '../../../../../../../actions';

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


Modal.setAppElement('#root')

class AddNewPlaylistModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          title : "",
          description : "",
          buttonDisabled : true,
          gridset : this.props.gridset,
        };
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        gridset : nextProps.gridset
      })
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    addNewPlaylist = () => {
        const { title, description, gridset } = this.state;
        const { createNewPlaylist, addNewToPlaylist } = this.props;
        const gridset_id = gridset.id;
        createNewPlaylist(title, description)
          .then ((res) => {
            if(res.success) {
              addNewToPlaylist(res.gspn, gridset_id)
              .then((res) => {

                let playlist = res.playlists.filter(item=>{
                  return item.name === title
                })

                this.props.addLog("Created new playlist " + title + " " + playlist[0].id);
                this.props.addNewPlaylist(res.playlists);
                this.setState({modalIsOpen: false});
              })
              .catch((err) => { console.log(err); })
            }
            else {
              alert('The playlist that has got the same title already exists!!!');
              this.setState({
                title : "",
                description : ""
              })
            }
          })
          .catch ((err) => { console.log(err); })
    }

    closeModal() {
      this.setState({modalIsOpen: false});
    } 
    addTitle = (e) => {
      const value = e.target.value;
      const buttonDisabled = value ? false : true;
      this.setState({
        title : value,
        buttonDisabled : buttonDisabled
      })
    }

    addDescription = (e) => {
      const value = e.target.value;
      this.setState({
        description : value,
      })
    }

  render() {
    const { gangedGridset } = this.props;
    return (
      <React.Fragment>
        <button onClick={this.openModal} style={gangedGridset ? {background:'#CCC'} : {color:'white'}} disabled = {gangedGridset? true : false}>New Playlist</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add New Playlist"
        >
          <h5>Title</h5>
          <input onChange = {this.addTitle} />
          <br />
          <br />
          <h5>Description</h5>
          <input onChange = {this.addDescription} />
          <br />
          <br />
          <button onClick = {this.addNewPlaylist} disabled = {this.state.buttonDisabled} >Add New Playlist</button>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  createNewPlaylist: bindActionCreators(createNewPlaylist, dispatch),
  addNewToPlaylist: bindActionCreators(addNewToPlaylist,dispatch),
})
  
export default connect(null, mapDispatchToProps)(AddNewPlaylistModal);