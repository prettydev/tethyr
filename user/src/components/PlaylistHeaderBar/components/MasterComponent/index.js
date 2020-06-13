import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal';

import { setAsDefaultVideos } from '../../../../actions';

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

class Master extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          buttonDisabled : true,
          pwd : "",
          errMsg : false,
        };
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    openModalMaster=()=>{
      this.setState({modalIsOpen: true});
      
      clearTimeout(this.timer);
        //const { pwd } = this.state;
        const { playlist, items } = this.props;
        const { setAsDefaultVideos } = this.props;

            console.log("set as master!!!!!!!!!!!", playlist, items)
            this.setState({
                errMsg : false,
            })
            const videos = items.map(item=>{
                return ([item.order, item.id]);
            })
            setAsDefaultVideos(playlist.id, videos)
            .then(res=>{
                console.log(res)
                  this.timer = setTimeout(() => {
                    this.setState({  modalIsOpen : false });
                }, 3000);
                   
            })
            .catch(err=>{console.log(err);})
        
        
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

    setAsMaster = () => {
        clearTimeout(this.timer);
        const { pwd } = this.state;
        const { playlist, items } = this.props;
        const { setAsDefaultVideos } = this.props;
        if(playlist.playlist_pwd.toString() === pwd) {
            console.log("set as master!!!!!!!!!!!", playlist, items)
            this.setState({
                errMsg : false,
            })
            const videos = items.map(item=>{
                return ([item.order, item.id]);
            })
            setAsDefaultVideos(playlist.id, videos)
            .then(res=>{
                console.log(res)
                if(res.success) {
                    alert("These videos are set as Master!!!")
                    this.setState({
                        modalIsOpen : false
                    })
                }
                else {
                    alert("This is the latest updated playlist!!!")
                    this.setState({
                        modalIsOpen : false
                    })
                }
            })
            .catch(err=>{console.log(err);})
        }
        else {
            this.setState({
                errMsg : true
            })
            this.timer = setTimeout(() => {
                this.setState({ errMsg: false });
            }, 3000);
        }
    }

    render() {
      const owner=this.props.playlist.owner;
      const pl=this.props.playlist.name
      const user=this.props.user.user.user_id;
 
      if(owner === user){
        return (
          <React.Fragment>
          <button style={{position: 'relative'}} onClick = {this.openModalMaster}><FontAwesomeIcon style={{position: 'absolute',left: '10px', top: '6px'}} icon={faLock} />Set as Master</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.setAsMaster}
            style={customStyles}
            contentLabel="Set As Master"
          >
            <h5>The master version of {pl} has been updated</h5>
            <br />
           
            
          </Modal>
        </React.Fragment>
      );
      }
       else return (
                <React.Fragment>
                <button style={{position: 'relative'}} onClick = {this.openModal}><FontAwesomeIcon style={{position: 'absolute',left: '10px', top: '6px'}} icon={faLock} />Set as Master</button>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onHide={this.closeModal}
                  style={customStyles}
                  contentLabel="Set As Master"
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
                  <button onClick = {this.setAsMaster} disabled = {this.state.buttonDisabled} >Set As Master</button>
                  
                </Modal>
              </React.Fragment>
            );
    }
}

const mapDispatchToProps = (dispatch) => ({
    setAsDefaultVideos : bindActionCreators(setAsDefaultVideos, dispatch),
})

const mapStateToProps = ({user}) => {
	return {
	  user
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Master);
