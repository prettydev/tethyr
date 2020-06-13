import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from 'react-modal';
import CSVReader from 'react-csv-reader';
import ReactTable from "react-table";
import 'react-table/react-table.css';

import { importExternalVideo } from '../../../../actions';

import './styles.scss'

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

const columns = [
    {
        Header: "GSVN",
        accessor: "gsvn",
        width: 90,
        headerStyle: {
            textAlign: 'left'
        }
    },
    {
        Header: "Video Title",
        accessor: "video_title",
        width: 400,
        headerStyle: {
            textAlign: 'left'
        }
    },
    {
        Header: "Video Type",
        accessor: "video_type",
        width: 100,
        headerStyle: {
            textAlign: 'left'
        }
    },
    {
        Header: "Interface Link",
        accessor: "interface_link",
        width: 300,
        headerStyle: {
            textAlign: 'left'
        }
    },
];
  
  
Modal.setAppElement('#root')

class Import extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          buttonDisabled : true,
          pwd : "",
          errMsg : false,
          videos : [],
          _diff : []
        };
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
      this.setState({modalIsOpen: false});
    } 

    handleForce = data => {
        //const playlist_gspn = this.props.playlist.gspn;
        const items = this.props.videos;
        if(!data[1]) {
            alert("The csv file you have selected is empty!");
            return false;
        }
        else {
            data = data.slice(0);
            data.splice(0, 1);
            this.checkDuplicatedVideo(data, items, (videos) => {
                // const length = videos.length;
                // const video_data = data.map(video => {
                //     for (var i = 0 ; i < length ; i++) {
                //         if(video[2] === videos[i]) {
                //             return [...video, true];
                //         }
                //         else if( i === (length - 1)) {
                //             return [...video, false];
                //         }
                //         else continue;
                //     }
                // })
                this.setState({
                    videos : data,
                    _diff : videos
                })
            })
        }
    };

    checkDuplicatedVideo = (data, items, callback) => {
        var _ = require('lodash');
        const data_gsvn = data.map(video => {
            return video[7];
        })
        const itmes_gsvn = items.map(({gsvn}) => {
            return gsvn;
        })
        const videos =  _.differenceWith(data_gsvn, itmes_gsvn, _.isEqual);
        callback(videos)
    }

    importCSVFile = () =>{
        const {_diff} = this.state;
        const {playlist} = this.props;
        const {importExternalVideo} = this.props;
        console.log(_diff);
        console.log(playlist)
        importExternalVideo(_diff, playlist)
        .then(res=>{
            if(res.success) {
                this.props.ImportVideos();
                this.setState({
                    videos : [],
                    _diff : []
                })
            }
            else {
                alert('The videos in the csv file already exist in the current playlist!')
                this.setState({
                    videos : [],
                    _diff : []
                })
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render() {
        //const { gangedGridset } = this.props;
        const { videos } = this.props;
        const tableData = videos.map((video, idx) => {
            return ({
                gspn : video[6], 
                order : video[0], 
                gsvn : video[7], 
                video_title : video[1],
                video_type : video[4], 
                interface_link : video[5]
            });
        });
        
        return (
            <React.Fragment>
                {/* <img className ='image' src={require(`../../../../resources/images/broadcasters/tethyr_tcsv.png`)} alt='youtube_playlist'  onClick = {this.openModal} disabled={gangedGridset ? true :false}/> */}
                {/* <button style={ gangedGridset? {background: '#CCC',position: 'relative'} : {position: 'relative'}} onClick = {this.openModal} disabled={gangedGridset ? true :false}>Import T.csv</button> */}
                {/* <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal}
                  style={customStyles}
                  contentLabel="Set As Master"
                >
                    <div className = 'import'>
                        <CSVReader
                            cssClass="-reactcsv-input"
                            label="Select CSV with playlist"
                            onFileLoaded={this.handleForce}
                        />
                        <button onClick={this.importCSVFile}>Import</button>
                    </div>
                    <br />
                    <hr />
                    <br /> */}
                    <ReactTable
                        data={tableData}
                        sortable={true}
                        columns={columns}
                        //defaultPageSize={5}
                        //showPaginationTop={false}
                        showPagination={false}
                        className="-striped -highlight"
                        style={{fontSize: 12}}
                    />
                {/* { </Modal> */}
            </React.Fragment>
        );
                }
    
}

const mapDispatchToProps = (dispatch) => ({
    importExternalVideo : bindActionCreators(importExternalVideo, dispatch)
})

export default connect(null, mapDispatchToProps)(Import);
