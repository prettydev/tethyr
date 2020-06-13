import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import Switch from "react-switch";

import {
  getAllAdvertisersList,
  getAllAds,
  createNewAdvertiser,
  createNewAd,
  enabledAds,
  removeAd
} from '../../actions/ads';

import './styles.css';

class Ads extends Component {
  constructor() {
    super();

    this.state = {
      ads_owners: [],
      allAds: [],
      adName: '',
      enabled: true,
      advertiserId: null,
      localURL: '',
      targetURL: '',
      duration: 30,
      adImg: '',
      newAdvertiser: '',
      newAdOwnerId: 0,
      updateAdName: '',
      updateLocalURL: '',
      updateTargetURL: '',
      updateDuration: 30,
      updateAdImg: '',
      updateAdOwnerId: 0,
    };
  }

  componentDidMount() {
    const { getAllAdvertisersList, getAllAds } = this.props;
    getAllAdvertisersList()
    .then(({data}) => {
      const ads_owners = data;
      console.log(ads_owners)
      getAllAds()
      .then(({data}) => {
        this.setState({
          ads_owners,
          allAds: data,
        })
      })
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value,
    })
  }

  updateAd = (event) => {
    this.setState({
      [event.target.name] : event.target.value,
    })
  }

  createNewAdvertiser = () => {
    if(!this.state.newAdvertiser)
      return;
    const { createNewAdvertiser } = this.props;
    createNewAdvertiser(this.state.newAdvertiser)
    .then(({success, data}) => {
      if(success) {
        alert('Success! Created a new advertiser!')
      }
      this.setState({
        ads_owners : data,
      })
    })
  }

  selectAdvertiser = (event) => {
    this.setState({
      newAdOwnerId: event.target.selectedIndex
    })
  }

  updateAdvertiser = (event) => {
    this.setState({
      updateAdOwnerId: event.target.selectedIndex
    })
  }

  createNewAd = () => {
    const { createNewAd } = this.props;
    const {
      ads_owners,
      adName,
      localURL,
      targetURL,
      duration,
      adImg,
      newAdOwnerId
    } = this.state;
    const advertiser_id = ads_owners[newAdOwnerId].id;
    createNewAd(adName, advertiser_id, localURL, targetURL, duration, adImg)
    .then(({data}) => {
      this.setState({
        allAds: data
      })
    })
  }

  handleEnabled = (idx) => {
    const { allAds } = this.state;
    const { enabledAds } = this.props;
    const ad_id = allAds[idx].id;
    const ad_enabaled = !allAds[idx].enabled;
    enabledAds(ad_id, ad_enabaled)
    .then(({data}) => {
      console.log(data)
      this.setState({
        allAds: data
      })
    })
  }

  removeAds = (idx) => {
    const { allAds } = this.state;
    const ad_id =  allAds[idx].id;
    const { removeAd } = this.props;
    removeAd(ad_id)
    .then(({data}) => {
      console.log(data)
      this.setState({
        allAds: data
      })
    })
  }

  editAds = (idx) => {
    const { allAds } = this.state;
    const ad =  allAds[idx];
    console.log(ad)
    this.setState({
      updateAdName: ad.adName,
      updateLocalURL: ad.localURL,
      updateTargetURL: ad.targetURL,
      updateDuration: ad.duration,
      updateAdImg: ad.adImg,
      updateAdOwnerId: ad.advertiserId,
    })
  }

  updateAd = () => {
    const  { updateAdName, updateLocalURL, updateTargetURL, updateDuration, updateAdImg, updateAdOwnerId } = this.state;
    if(updateAdName === '' && updateLocalURL === '' && updateTargetURL === '' && updateAdImg === '' ) 
    {
      return;
    }
  }

  render() {
    const {
      ads_owners,
      allAds,
      newAdOwnerId,
      updateAdOwnerId
    } = this.state;
    const columns = [
      {
        Header: "ID",
        accessor: "id",
        headerStyle: {
          textAlign: 'left',
        }
      },
      {
        Header: "AD Name",
        accessor: "adName",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "Advertiser",
        accessor: "advertiser",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "AdvertiserID",
        accessor: "advertiserID",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "LocalURL",
        accessor: "localURL",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "TargetURL",
        accessor: "targetURL",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "Duration",
        accessor: "duration",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "ADImg",
        accessor: "adImg",
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: "Enabled",
        accessor: "enabled",
        headerStyle: {
          textAlign: 'left'
        }
      },
      // {
      //   Header: "",
      //   accessor: "actions",
      //   headerStyle: {
      //     textAlign: 'left'
      //   }
      // }
    ];
    const tableData = allAds.map(({ id, adName, enabled, advertiserId, localURL, targetURL, duration, adImg, ad_owner_name }, idx) => ({
      id,
      adName,
      advertiser : ad_owner_name,
      advertiserID : advertiserId,
      localURL,
      targetURL,
      duration,
      adImg,
      enabled : <Switch onChange={() => this.handleEnabled(idx)} checked={ (enabled === 0 ) ? false : true} />,
      // actions : (
      //   <div>
      //     <button onClick={() => this.editAds(idx)}>Edit</button>
      //     <button onClick={() => this.removeAds(idx)}>Remove</button>
      //   </div>
      // )
    }));
    return (
      <div className="gridsets-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>7-1 Advertisement</h4>
        <div className='info-item'>
          <label>New Advertiser</label>
          <input type='text' id='newAdvertiser' name="newAdvertiser" onChange={this.handleChange} />
        </div>
        <button onClick={this.createNewAdvertiser}>Create New Advertiser</button>
        <div className="separator" />
        <div className='new-user-panel'>
          <div className='info-item'>
            <label>AD Name</label>
            <input type='text' id='adName' name='adName' onChange={this.handleChange} />
          </div>
          <div className="info-item">
            <label>Advertiser</label>
            <select value={newAdOwnerId} onChange={this.selectAdvertiser}>
              {
                ads_owners.map(({ad_owner_name}, index) => (
                  <option key={index} value={index}>{ad_owner_name}</option>
                ))
              }
            </select>
          </div>
          <div className='info-item'>
            <label>LocalURL</label>
            <input type='text' id='localURL' name='localURL' onChange={this.handleChange} />
          </div>
          <div className='info-item'>
            <label>TargetURL</label>
            <input type='text' id='targetURL' name='targetURL' onChange={this.handleChange} />
          </div>
          <div className='info-item'>
            <label>Duration</label>
            <input type='text' id='duration' name='duration' value="30" disabled />
          </div>
          <div className='info-item'>
            <label>AdImg</label>
            <input type='text' id='adImg' name='adImg' onChange={this.handleChange} />
          </div>
          <div className='info-item'>
            <button onClick={this.createNewAd}>Create New Ad</button>
          </div>
        </div>
        <div className="separator" />
        {/* <div className='new-user-panel'>
          <div className='info-item'>
            <label>AD Name</label>
            <input type='text' id='updateAdName' name='updateAdName' value={this.state.updateAdName} onChange={this.updateAd} />
          </div>
          <div className="info-item">
            <label>Advertiser</label>
            <select value={updateAdOwnerId} onChange={this.updateAdvertiser}>
              {
                ads_owners.map(({ad_owner_name, id}, index) => (
                  <option key={index} value={id}>{ad_owner_name}</option>
                ))
              }
            </select>
          </div>
          <div className='info-item'>
            <label>LocalURL</label>
            <input type='text' id='updateLocalURL' name='updateLocalURL' value={this.state.updateLocalURL} onChange={this.updateAd} />
          </div>
          <div className='info-item'>
            <label>TargetURL</label>
            <input type='text' id='updateTargetURL' name='updateTargetURL' value={this.state.updateTargetURL} onChange={this.updateAd} />
          </div>
          <div className='info-item'>
            <label>Duration</label>
            <input type='text' id='updateDuration' name='updateDuration' value="30" disabled />
          </div>
          <div className='info-item'>
            <label>AdImg</label>
            <input type='text' id='updateAdImg' name='updateAdImg' value={this.state.updateAdImg} onChange={this.updateAd} />
          </div>
          <div className='info-item'>
            <button onClick={this.updateAd}>Update the Ad</button>
          </div>
        </div> */}
        <ReactTable
          data={tableData}
          sortable={false}
          columns={columns}
          defaultPageSize={25}
          showPaginationTop={false}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getAllAdvertisersList: bindActionCreators(getAllAdvertisersList, dispatch),
  getAllAds: bindActionCreators(getAllAds, dispatch),
  createNewAdvertiser: bindActionCreators(createNewAdvertiser, dispatch),
  createNewAd: bindActionCreators(createNewAd, dispatch),
  enabledAds: bindActionCreators(enabledAds, dispatch),
  removeAd: bindActionCreators(removeAd, dispatch),
})

export default connect(null, mapDispatchToProps)(Ads);
