import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from "react-table";

import {
  getDefaultGridsets,
  fetchAllGridsets,
  addNewDefaultGridset,
  removeDefaultGridset,
  swapDefaultGrdisetOrder
} from '../../actions/gridset';

import './styles.css';

const columns = [
  {
    Header: "Playlist Group ID",
    accessor: "id",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "Group Name",
    accessor: "name",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Group Description",
    accessor: "description",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Group Thumbnail",
    accessor: "thumb",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Visibility",
    accessor: "visibility",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "",
    accessor: "reorderAction",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "",
    accessor: "removeAction",
    headerStyle: {
      textAlign: 'left',
    }
  }
];

class DefaultGridsets extends Component {
  constructor() {
    super();

    this.state = {
      gridsets: [],
      allGridsets: [],
      gridset_id: 0,
      showMsg: false,
    };
  }

  componentDidMount () {
    this.fetchAllDefaultGridsets();
  }

  fetchAllDefaultGridsets = () => {
    const { getDefaultGridsets, fetchAllGridsets } = this.props;
    fetchAllGridsets()
      .then(res=>{
        const allGridsets = res.gridsets;
        const gridset_id = res.gridsets[0].id;
        getDefaultGridsets()
        .then(({ gridsets }) => {
          this.setState({ 
            gridsets,
            allGridsets,
            gridset_id,
          });
        })
        .catch();
      })
      .catch(err=>{console.log(err);})
  }

  onGridsetSelect = (e) => {
    this.setState({
      gridset_id : e.target.value,
    })
  }

  onAddNewDefaultGridset = () => {
    clearTimeout(this.timer);
    const { gridset_id } = this.state;
    const { addNewDefaultGridset } = this.props;
    addNewDefaultGridset(gridset_id)
    .then(({success, gridsets})=>{
      if(!success)
      {
        this.setState({showMsg : true});
        this.timer = setTimeout(() => {
          this.setState({ showMsg: false });
          }, 3000);
      }
      else {
        this.setState({ gridsets });
      }
    })
    .catch(err=>{console.log(err);})
  }

  onRemoveGridset = (idx) => {
    const { removeDefaultGridset } = this.props;
    const { gridsets } = this.state;
    const gridset_id = gridsets[idx].id;
    removeDefaultGridset(gridset_id)
    .then(({gridsets})=>{
      this.setState({
        gridsets
      })
    })
    .catch(err=>{console.log(err);})
  }

  onMoveGridset = (idx, up) => {
    const { gridsets } = this.state;
    const id = gridsets[idx].id;
    const order = gridsets[idx].gridset_order;
    const swap_order = gridsets[idx + up].gridset_order;
    const swap_id = gridsets[idx + up].id;
    const { swapDefaultGrdisetOrder } = this.props;
    swapDefaultGrdisetOrder(id, order, swap_id, swap_order)
    .then(({gridsets}) => {
      this.setState({
        gridsets
      })
    })
  }

  render() {
    const {
      gridsets,
      allGridsets,
      gridset_id,
      showMsg
    } = this.state;
    const tableData = gridsets.map(({ id, name, description, thumb, visibility }, idx) => ({
      id,
      name,
      description,
      thumb,
      visibility:
        visibility === 0 ? 'public' : 'private',
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveGridset(idx, -1)}>Move Up</button>}
          {idx < gridsets.length - 1 && <button onClick={() => this.onMoveGridset(idx, 1)}>Move Down</button>}
        </div>
      ),
      removeAction: (
        <button onClick={() => this.onRemoveGridset(idx)}>Remove</button>
      ),
    }));

    return (
      <div className="gridsets-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>6-1 Default Playlist Groups</h4>
        <div className="info-item">
          <label>All Groups</label>
          <select value={gridset_id} onChange={this.onGridsetSelect} >
            {
              allGridsets.map((gridset, index) => (
                <option key={index} value={gridset.id}>gridset{gridset.id} {gridset.name}</option>
              ))
            }
          </select>
        </div>
        <button onClick={this.onAddNewDefaultGridset}>Add New Default Playlist Group</button>
        { showMsg && <h4 className="warning">This group already exists!</h4>}
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
  getDefaultGridsets: bindActionCreators(getDefaultGridsets, dispatch),
  fetchAllGridsets: bindActionCreators(fetchAllGridsets, dispatch),
  addNewDefaultGridset: bindActionCreators(addNewDefaultGridset, dispatch),
  removeDefaultGridset: bindActionCreators(removeDefaultGridset, dispatch),
  swapDefaultGrdisetOrder: bindActionCreators(swapDefaultGrdisetOrder, dispatch),
})

export default connect(null, mapDispatchToProps)(DefaultGridsets);
