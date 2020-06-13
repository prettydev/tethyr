import React from 'react';

import Modal from 'react-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetDefaultVideos } from '../../actions/video'
import './styles.css';

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

class ResetVideos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          gspn: this.props.gspn,
          title: this.props.title,
          user_id: this.props.user_id,
        };
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        gspn : nextProps.gspn,
        title : nextProps.title
      })
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
      this.setState({modalIsOpen: false});
    } 

    resetVideos = () => {
      const { gspn, user_id, title } = this.state;
      console.log(gspn);
      console.log(user_id);
      const { resetDefaultVideos } = this.props;
      resetDefaultVideos(gspn, user_id)
      .then(({videos}) =>{
          this.setState({
              modalIsOpen : false,
          })
          if(!videos){
            alert("This playlist doesn't have any videos!!!");
          }
          else{
            alert(`${gspn}#${title} playlist has reseted!`);
            this.props.defaultVideos(videos);
          }
      })
      .catch(err=>{ console.log(err); })
  }

  render() {
    return (
      <div>
        <button className = "metaUpdate_btn" onClick={this.openModal}>Reset from Master</button>
        <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences"
            >
            <h5>Reset this playlist to the global default and remove all custom order, added / removed videos and dot/ hide preferences</h5>
            <div style={{display: "flex", justifyContent:"space-between"}}>
                <button style={{width:"100px"}} onClick={this.resetVideos}>Yes</button>
                <button style={{width:"100px"}} onClick={this.closeModal}>No</button>
            </div>
        </Modal>
      </div>
    );
  }
}
  
const mapDispatchToProps = (dispatch) => ({
  resetDefaultVideos: bindActionCreators(resetDefaultVideos, dispatch)
})

export default connect(null, mapDispatchToProps)(ResetVideos);
